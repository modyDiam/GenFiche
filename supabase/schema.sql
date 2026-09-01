-- ==============================================================================
-- SCHÉMA SUPABASE — SaaS FASTEF Générateur de Fiches Pédagogiques
-- Collège Sénégal : Mathématiques & Physique-Chimie (4ème & 3ème)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE DES PROFILS ENSEIGNANTS
-- Liée directement à auth.users de Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nom_complet TEXT NOT NULL DEFAULT '',
    etablissement_defaut TEXT DEFAULT '',
    matieres TEXT[] DEFAULT ARRAY['maths']::TEXT[], -- 'maths', 'pc' ou les deux
    telephone TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABLE DU PROGRAMME OFFICIEL (IMMUABLE — JAMAIS INVENTÉ PAR LE LLM)
CREATE TABLE IF NOT EXISTS public.programme_chapitres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matiere TEXT NOT NULL CHECK (matiere IN ('maths', 'pc')),
    classe TEXT NOT NULL CHECK (classe IN ('4e', '3e')),
    titre_chapitre TEXT NOT NULL,
    duree_recommandee TEXT NOT NULL DEFAULT '4h',
    objectifs JSONB NOT NULL DEFAULT '[]'::jsonb, -- tableau d'objectifs pédagogiques officiels
    contenus JSONB NOT NULL DEFAULT '[]'::jsonb,   -- tableau des notions/contenus officiels
    activites_preparatoires_suggerees TEXT DEFAULT '',
    materiel_suggere JSONB DEFAULT '[]'::jsonb,
    ordre INT DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TABLE DES FICHES PÉDAGOGIQUES
CREATE TABLE IF NOT EXISTS public.fiches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chapitre_id UUID REFERENCES public.programme_chapitres(id) ON DELETE RESTRICT,
    parametres JSONB NOT NULL DEFAULT '{}'::jsonb, -- { "duree_reelle": "4h", "effectif": 45, "date": "2026-09-01", "etablissement": "CEM ..." }
    contenu_genere JSONB DEFAULT NULL,             -- Sortie JSON stricte conforme FASTEF
    statut TEXT NOT NULL DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'en_attente', 'genere', 'relu', 'exporte')),
    est_relue BOOLEAN NOT NULL DEFAULT FALSE,      -- Avertissement obligatoire tant que est_relue = false
    docx_url TEXT DEFAULT NULL,
    pdf_url TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TABLE DES JOBS (FILE D'ATTENTE GÉNÉRATION ASYNCHRONE)
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fiche_id UUID NOT NULL REFERENCES public.fiches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'en_cours', 'termine', 'erreur')),
    erreur_eventuelle TEXT DEFAULT NULL,
    tentatives INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. TABLE DES ABONNEMENTS (WAVE & ORANGE MONEY)
CREATE TABLE IF NOT EXISTS public.abonnements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'decouverte' CHECK (plan IN ('decouverte', 'mensuel', 'annuel', 'etablissement')),
    statut TEXT NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'expire', 'en_attente_paiement')),
    provider TEXT DEFAULT 'wave' CHECK (provider IN ('wave', 'orange_money', 'gratuit')),
    reference_paiement TEXT DEFAULT NULL,
    date_expiration TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 7. TRIGGER AUTOMATIQUE : CRÉATION DE PROFIL ET ABONNEMENT DÉCOUVERTE À L'INSCRIPTION
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Profil enseignant
    INSERT INTO public.profiles (id, nom_complet, etablissement_defaut, matieres)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nom_complet', ''),
        COALESCE(NEW.raw_user_meta_data->>'etablissement', ''),
        COALESCE(
            ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'matieres')),
            ARRAY['maths']::TEXT[]
        )
    );

    -- Abonnement découverte gratuit (3 fiches d'essai)
    INSERT INTO public.abonnements (user_id, plan, statut, provider, date_expiration)
    VALUES (
        NEW.id,
        'decouverte',
        'actif',
        'gratuit',
        timezone('utc'::text, now()) + INTERVAL '30 days'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 8. POLITIQUES DE SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programme_chapitres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abonnements ENABLE ROW LEVEL SECURITY;

-- Politiques Profiles
CREATE POLICY "Les enseignants voient leur propre profil"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Les enseignants peuvent modifier leur propre profil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Politiques Programme Chapitres (Lecture publique pour tous les utilisateurs connectés)
CREATE POLICY "Lecture des chapitres du programme pour tous les enseignants connectés"
    ON public.programme_chapitres FOR SELECT
    TO authenticated
    USING (true);

-- Politiques Fiches
CREATE POLICY "Les enseignants accèdent à leurs propres fiches"
    ON public.fiches FOR ALL
    USING (auth.uid() = user_id);

-- Politiques Jobs
CREATE POLICY "Les enseignants accèdent à leurs propres jobs"
    ON public.jobs FOR ALL
    USING (auth.uid() = user_id);

-- Politiques Abonnements
CREATE POLICY "Les enseignants voient leur propre abonnement"
    ON public.abonnements FOR SELECT
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 9. DONNÉES DE DÉMONSTRATION DU PROGRAMME OFFICIEL (EXEMPLES SÉNÉGAL FASTEF)
-- ==============================================================================

INSERT INTO public.programme_chapitres 
(matiere, classe, titre_chapitre, duree_recommandee, objectifs, contenus, activites_preparatoires_suggerees, materiel_suggere, ordre)
VALUES 
(
    'pc',
    '3e',
    'Masse volumique et densité',
    '4h',
    '["Définir la masse volumique d''un corps", "Déterminer expérimentalement la masse volumique d''un solide et d''un liquide", "Calculer la densité d''un corps par rapport à l''eau", "Prévoir la flottabilité d''un corps"]'::jsonb,
    '["Notion de masse volumique : formule p = m / V", "Unités de masse volumique (kg/m³, g/cm³)", "Définition de la densité d = p / peau", "Flottabilité et comparaison des densités"]'::jsonb,
    'Pesée de différents volumes d''eau et d''huile d''arachide locale à l''aide d''une éprouvette graduée.',
    '["Balance électronique ou de Roberval", "Éprouvettes graduées de 100 mL", "Solides réguliers et irréguliers", "Huile d''arachide locale", "Eau douce"]'::jsonb,
    1
),
(
    'maths',
    '3e',
    'Théorème de Thalès dans le triangle',
    '6h',
    '["Énoncer le théorème de Thalès dans un triangle", "Calculer des longueurs de segments en utilisant le théorème de Thalès", "Énoncer et appliquer la réciproque du théorème de Thalès pour démontrer le parallélisme"]'::jsonb,
    '["Configuration de Thalès dans un triangle", "Rapports de proportionnalité des côtés", "Réciproque du théorème de Thalès"]'::jsonb,
    'Mesure d''ombres d''un piquet et d''un arbre ou poteau dans la cour du collège pour estimer une hauteur inaccessible.',
    '["Règle graduée", "Équerre", "Compas", "Fiche d''activités quadrillée"]'::jsonb,
    1
),
(
    'pc',
    '4e',
    'Les combustions : combustion du carbone et du soufre',
    '4h',
    '["Distinguer une combustion complète d''une combustion incomplète", "Identifier les réactifs et les produits de la combustion du carbone", "Mettre en évidence le dioxyde de carbone à l''eau de chaux", "Appliquer les règles de sécurité relatives aux combustions"]'::jsonb,
    '["Combustion du charbon de bois (carbone)", "Mise en évidence du CO2 par le trouble de l''eau de chaux", "Bilan de la réaction chimique carbone + dioxygène -> dioxyde de carbone", "Dangers du monoxyde de carbone"]'::jsonb,
    'Observation de la combustion de braises de charbon de bois (fourneau traditionnel) et recueil du gaz avec un flacon.',
    '["Morceaux de fusain ou charbon de bois", "Flacons en verre", "Eau de chaux fraîchement préparée", "Briquet ou allumettes", "Pince métallique"]'::jsonb,
    1
);
