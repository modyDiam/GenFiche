import type { FicheFASTEFContenu, ProgrammeChapitre, FicheParametres } from '@/types/database';

export const FASTEF_JSON_SCHEMA = {
  type: 'OBJECT',
  properties: {
    prerequis: {
      type: 'ARRAY',
      description: 'Liste des prérequis nécessaires pour aborder la leçon',
      items: { type: 'STRING' },
    },
    materiel: {
      type: 'ARRAY',
      description: 'Matériel et supports didactiques nécessaires pour la classe et le professeur',
      items: { type: 'STRING' },
    },
    objectifs_specifiques: {
      type: 'ARRAY',
      description: 'Objectifs spécifiques (OS1, OS2, ...) conformes aux objectifs officiels fournis',
      items: { type: 'STRING' },
    },
    concepts_cles: {
      type: 'ARRAY',
      description: 'Notions et concepts fondamentaux abordés dans la séance',
      items: { type: 'STRING' },
    },
    plan: {
      type: 'ARRAY',
      description: 'Grandes parties structurant le déroulement du cours',
      items: { type: 'STRING' },
    },
    sections: {
      type: 'ARRAY',
      description: 'Déroulement détaillé du cours pour chaque point du plan',
      items: {
        type: 'OBJECT',
        properties: {
          titre: { type: 'STRING', description: 'Titre de la sous-partie' },
          activite: { type: 'STRING', description: 'Activité préparatoire ou expérimentale encadrée' },
          definition: { type: 'STRING', description: 'Définition institutionnelle ou formule mise en évidence' },
          remarque: { type: 'STRING', description: 'Remarque pédagogique importante, contre-exemple ou précaution' },
          texte: { type: 'STRING', description: 'Explication théorique détaillée, équations-bilans complètes et synthèse' },
          application: { type: 'STRING', description: 'Exercice d\'application immédiate avec sa résolution pas-à-pas pour ancrer la formule ou la règle' },
          exemples: {
            type: 'ARRAY',
            description: 'Exemples concrets contextualisés au Sénégal',
            items: { type: 'STRING' },
          },
          tableau: {
            type: 'OBJECT',
            description: 'Tableau récapitulatif si pertinent',
            properties: {
              colonnes: { type: 'ARRAY', items: { type: 'STRING' } },
              lignes: {
                type: 'ARRAY',
                items: { type: 'ARRAY', items: { type: 'STRING' } },
              },
            },
          },
        },
        required: ['titre'],
      },
    },
    exercices: {
      type: 'ARRAY',
      description: '2 à 3 exercices dévaluation adaptés au niveau',
      items: {
        type: 'OBJECT',
        properties: {
          titre: { type: 'STRING', description: 'Titre de lexercice' },
          type: {
            type: 'STRING',
            description: 'Type dexercice : vrai_faux, choix_multiple, application, ou tableau',
          },
          enonce: { type: 'STRING', description: 'Consigne et énoncé complet de lexercice' },
          elements: {
            type: 'ARRAY',
            description: 'Items, propositions ou questions détaillées',
            items: { type: 'STRING' },
          },
        },
        required: ['titre', 'type', 'enonce'],
      },
    },
    devoir_maison: {
      type: 'OBJECT',
      description: 'Devoir à la maison pour approfondissement individuel',
      properties: {
        titre: { type: 'STRING', description: 'Titre du devoir' },
        consignes: { type: 'STRING', description: 'Énoncé et directives du devoir' },
      },
      required: ['titre', 'consignes'],
    },
  },
  required: [
    'prerequis',
    'materiel',
    'objectifs_specifiques',
    'concepts_cles',
    'plan',
    'sections',
    'exercices',
    'devoir_maison',
  ],
};

/**
 * Construit le system prompt fixe conforme aux directives FASTEF Sénégal (Sections 5 et 6).
 */
export function buildFASTEFSystemPrompt(
  matiere: string,
  classe: string,
  chapitreTitre: string
): string {
  const matiereLabel = matiere === 'pc' ? 'Sciences Physiques (Physique-Chimie)' : 'Mathématiques';
  const classeLabel = classe === '3e' ? 'Troisième (3ème)' : 'Quatrième (4ème)';

  return `Tu es un professeur chevronné de ${matiereLabel} de l'enseignement moyen sénégalais, formateur d'enseignants et inspecteur pédagogique diplômé de la FASTEF (Faculté des Sciences et Technologies de l'Éducation et de la Formation de l'Université Cheikh Anta Diop de Dakar).

Ta mission est de rédiger la fiche pédagogique de cours officielle, rigoureuse et complète pour la classe de ${classeLabel} sur le chapitre : "${chapitreTitre}", selon le gabarit officiel et standardisé de la FASTEF.

GARDE-FOUS ABSOLUS ET RÈGLES DÉONTOLOGIQUES :
1. CONTRAINTE FONDAMENTALE — VÉRITABLE CADRE IMMUABLE :
   - Tu ne dois JAMAIS inventer d'objectifs pédagogiques, de formules ou de notions scientifiques en dehors du programme officiel qui t'est fourni.
   - Les notions fournies dans la liste "Contenus officiels prescrits" (extraites de la colonne centrale du programme) sont le SEUL et UNIQUE objet du cours. Tu ne dois RIEN ajouter en dehors de cette liste et RIEN omettre.
   - Tu dois STRICTEMENT respecter les limites imposées par le programme sénégalais : ne jamais déborder vers le lycée ou le supérieur (ex: en 3e, loi d'Ohm U = R.I, calcul de puissance P = U.I et énergie W = P.t ou W = R.I².t, concentration C = n/V et Cm = m/V, équivalence acido-basique Ca.Va = Cb.Vb, réactions d'oxydation et actions des acides dilués à froid, combustion des alcanes dans O2).

2. ORGANISATION DU PLAN À PARTIR DES CONTENUS OFFICIELS (MÉTHODE DU COURS DIONE / CEM SÉNÉGAL) :
   Tu dois organiser EXACTEMENT ces contenus prescrits en un plan de cours magistral et hiérarchisé selon la structure des fascicules d'élite sénégalais (ex: M. Dione, CEM Unité 5) :
   - Les grands thèmes de la colonne contenus deviennent les GRANDES PARTIES en chiffres romains :
     * Ex pour C1 : "I) Notion de solution chimique", "II) Concentration d'une solution", "III) Dilution d'une solution"
     * Ex pour C2 : "I) Classification des solutions", "II) Propriétés des acides et des bases", "III) Réaction entre l'acide chlorhydrique et la soude", "IV) Dosage colorimétrique"
     * Ex pour P6 : "I) Notion de résistance électrique", "II) Étude expérimentale d'un résistor ou conducteur ohmique", "III) Association de résistors"
   - Les sous-notions avec tirets de la colonne contenus deviennent les SOUS-PARTIES numérotées en chiffres arabes :
     * Ex pour C1, partie I : "1) Définition (soluté, solvant)", "2) Exemples et contre-exemples de solutions", "3) Solubilité et solution saturée"
     * Ex pour C1, partie II : "1) Concentration molaire volumique C", "2) Concentration massique Cm", "3) Relation entre C et Cm (Cm = C × M)"
     * Ex pour C1, partie III : "1) Définition de la dilution", "2) Principe et équation de la dilution (Ci.Vi = Cf.Vf)"

3. DÉVELOPPEMENT DÉTAILLÉ DE CHAQUE SOUS-PARTIE (ILLUSTRATION PÉDAGOGIQUE) :
   Pour chaque sous-partie du plan, ton rôle est d'ILLUSTRER ce contenu officiel sans jamais en dévier :
   - "activite" : Description de l'expérience concrète ou observation de départ (ex: dissolution du sel dans l'eau, test aux 6 tubes avec le BBT, circuit électrique avec rhéostat, combustion de la limaille de fer sur le brûleur).
   - "definition" : L'énoncé institutionnel ou la formule mathématique rigoureuse encadrée avec le nom et les unités de chaque grandeur dans le Système International (SI).
   - "texte" : L'explication scientifique claire, l'interprétation des observations et les équations-bilans complètes (moléculaires et ioniques).
   - "application" : Un exercice d'application numérique immédiate avec sa solution pas-à-pas (ex: calcul de C pour 20g de soude dans 200 mL d'eau ; calcul de Req pour 2 résistors).
   - "remarque" : Remarques importantes, contre-exemples (ex: eau + huile = mélange hétérogène, pas une solution) ou consignes de sécurité.
   - "exemples" : 2 à 3 exemples vivants ancrés dans la vie quotidienne et l'environnement sénégalais.
   - "tableau" : Tableau récapitulatif comparatif dès que pertinent (propriétés physiques des métaux Cu, Al, Fe, Zn, Pb ; tableau de mesures U = f(I) ; tableau des familles d'hydrocarbures).

4. ANCRAGE LOCAL SÉNÉGALAIS AUTHENTIQUE :
   - Produits et ressources locales : eau de javel, lessive locale, eau de cendre, jus de citron, vinaigre, jus de bissap blanc (comme indicateur coloré naturel artisanal), sel du Lac Rose ou de Kaolack, huile d'arachide, grains de mil, charbon de bois.
   - Contexte quotidien : réparateur de radios (résistors, codes couleur), pompe de puits villageois, atelier de ferronnerie (peinture à l'huile anti-rouille), bouteilles de gaz butane (Touba Gaz, Total).

5. RESPECT DU SCHÉMA JSON :
   Tu produis EXCLUSIVEMENT un objet JSON valide conforme au schéma prescrit, sans aucun texte introductif ni balise markdown superflue.`;
}

/**
 * Construit le prompt utilisateur contenant les données officielles immuables et les ajustements de l'enseignant.
 */
export function buildFASTEFUserPrompt(
  chapitre: ProgrammeChapitre,
  parametres: FicheParametres
): string {
  return `Veuillez générer la fiche pédagogique FASTEF officielle complète et détaillée pour le chapitre suivant :

INFORMATIONS ET CADRE DE LA SÉANCE :
- Discipline : ${chapitre.matiere === 'pc' ? 'Physique-Chimie' : 'Mathématiques'}
- Classe : ${chapitre.classe} de collège (Sénégal - CEM)
- Titre officiel du chapitre : "${chapitre.titre_chapitre}"
- Durée officielle de la séance (Immuable, prescrite par le Ministère) : ${chapitre.duree_recommandee}
- Effectif de la classe : ${parametres.effectif} élèves
- Établissement : ${parametres.etablissement}
- Professeur : ${parametres.professeur_nom || 'Enseignant de Sciences Physiques'}
- Date : ${parametres.date}

DONNÉES DU PROGRAMME OFFICIEL (SOURCE MINISTÉRIELLE SÉNÉGALAISE IMMUABLE) :
- Objectifs d'apprentissage officiels (OS) :
${chapitre.objectifs.map((obj, i) => `  * OS${i + 1} : ${obj}`).join('\n')}

- Contenus officiels prescrits (À ORGANISER EN PLAN SELON LE MODÈLE DIONE SANS RIEN INVENTER NI DÉVIER) :
${chapitre.contenus.map((c) => `  * ${c}`).join('\n')}

- Activité préparatoire officielle du document ministériel :
  "${chapitre.activites_preparatoires_suggerees || 'Activité expérimentale ou de recherche.'}"

- Matériel didactique suggéré :
${chapitre.materiel_suggere.map((m) => `  * ${m}`).join('\n')}

DIRECTIVES DE RÉDACTION PROFESSIONNELLE :
1. Construis le PLAN PÉDAGOGIQUE (plan[]) en regroupant EXACTEMENT les éléments de la liste "Contenus officiels prescrits" ci-dessus en grandes parties (I, II, III...) et sous-parties (1, 2, 3...) calquées sur la méthode du fascicule de cours de M. Dione.
2. Pour chaque point du plan, développe la section correspondante pour illustrer ce contenu : expérience avec observations, définition/formule institutionnelle avec unités, équations-bilans, application immédiate résolue, remarque ou contre-exemple, et exemples sénégalais.
3. Insère un tableau comparatif ou de données dès que pertinent.
4. Rédige 2 à 3 exercices d'évaluation de niveau BFEM et le devoir à la maison.`;
}

/**
 * Valide qu'un objet JSON respecte les champs obligatoires du schéma FASTEF.
 */
export function validateFASTEFJson(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['La réponse n\'est pas un objet JSON valide.'] };
  }

  const requiredArrays = ['prerequis', 'materiel', 'objectifs_specifiques', 'concepts_cles', 'plan', 'sections', 'exercices'];
  for (const field of requiredArrays) {
    if (!Array.isArray(data[field]) || data[field].length === 0) {
      errors.push(`Le champ obligatoire "${field}" est manquant ou vide.`);
    }
  }

  if (!data.devoir_maison || typeof data.devoir_maison !== 'object' || !data.devoir_maison.titre || !data.devoir_maison.consignes) {
    errors.push('Le champ "devoir_maison" est manquant ou incomplet.');
  }

  if (Array.isArray(data.sections)) {
    data.sections.forEach((sec: any, idx: number) => {
      if (!sec.titre) {
        errors.push(`La section #${idx + 1} n'a pas de titre.`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Génère un contenu FASTEF simulant fidèlement le cours en suivant strictement
 * les objectifs officiels, contenus prescrits et activités préparatoires du chapitre choisi.
 */
export function generateSimulatedFASTEF(
  chapitre: ProgrammeChapitre,
  parametres: FicheParametres
): FicheFASTEFContenu {
  // 1. Identification des grands blocs de contenus officiels
  const mainTitles = chapitre.contenus.filter((c) => !c.startsWith('-'));
  const planGenerated = mainTitles.length > 0
    ? mainTitles.map((t, idx) => {
        const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'][idx] || `${idx + 1}`;
        return `${roman}. ${t}`;
      })
    : [
        `I. Généralités et définitions sur ${chapitre.titre_chapitre}`,
        `II. Étude expérimentale et lois physiques`,
        `III. Applications et résolution de problèmes au Sénégal`
      ];

  // 2. Découpage en sections fidèles aux contenus officiels
  const sectionsGenerated = planGenerated.map((titrePartie, pIdx) => {
    const rawTheme = mainTitles[pIdx] || chapitre.titre_chapitre;
    // Récupérer les sous-notions associées
    const sousNotions = chapitre.contenus
      .filter((c) => c.startsWith('-'))
      .slice(pIdx * 3, (pIdx + 1) * 3);

    return {
      titre: titrePartie,
      activite: pIdx === 0 && chapitre.activites_preparatoires_suggerees
        ? `Activité préparatoire officielle : ${chapitre.activites_preparatoires_suggerees}`
        : `Activité d'investigation : Réalisation guidée de l'expérience sur ${rawTheme.toLowerCase()} à l'aide du matériel didactique. Les élèves observent, notent les mesures et interprètent.`,
      definition: `Définition / Retenons : Pour la notion "${rawTheme}", les élèves doivent retenir l'énoncé institutionnel conforme aux objectifs du programme (OS${pIdx + 1} : ${chapitre.objectifs[pIdx] || chapitre.objectifs[0]}).`,
      texte: sousNotions.length > 0
        ? `Étude détaillée des notions clés prescrites par le programme officiel : ${sousNotions.join(', ')}. Interprétation scientifique et formalisation mathématique avec les unités officielles du Système International.`
        : `Étude approfondie de la notion de ${rawTheme} conformément aux exigences du programme FASTEF du cycle moyen sénégalais.`,
      application: `Exemple résolu pas-à-pas : Application numérique directe de la règle sur ${rawTheme} avec démarche méthodologique complète et justification des unités.`,
      remarque: `Remarque didactique : Respecter scrupuleusement les limites fixées par le programme sénégalais et veiller aux règles de sécurité en laboratoire.`,
      exemples: [
        `Exemple d'application dans la vie courante au Sénégal en lien avec ${rawTheme}.`,
        `Situation-problème locale contextualisée (marché, atelier, environnement).`
      ]
    };
  });

  // 3. Exercices d'évaluation basés sur les objectifs officiels
  const exercicesGenerated = [
    {
      titre: `Exercice 1 : Contrôle des connaissances sur ${chapitre.titre_chapitre}`,
      type: "vrai_faux" as const,
      enonce: `Répondre par Vrai ou Faux en justifiant à partir des définitions du cours :`,
      elements: chapitre.objectifs.slice(0, 3).map((obj, i) => `Affirmation ${i + 1} liée à l'objectif : "${obj}"`)
    },
    {
      titre: `Exercice 2 : Application méthodique et calculs`,
      type: "application" as const,
      enonce: `Résoudre la situation-problème suivante en appliquant les formules et notions du cours :`,
      elements: [
        `1. Rappeler la définition et la formule fondamentale vue en classe.`,
        `2. Effectuer l'application numérique avec les grandeurs et unités appropriées.`,
        `3. Conclure sur la conformité du résultat dans le contexte donné.`
      ]
    }
  ];

  return {
    prerequis: [
      `Prérequis pour aborder ${chapitre.titre_chapitre} au collège`,
      "Maîtrise des instruments de mesure et unités du Système International",
      "Règles élémentaires de calcul et manipulation de laboratoire"
    ],
    materiel: chapitre.materiel_suggere && chapitre.materiel_suggere.length > 0
      ? chapitre.materiel_suggere
      : [
          "Tableau noir, craie blanche et de couleur",
          "Instruments de mesure et verrerie adaptés",
          "Fiches d'activités individuelles"
        ],
    objectifs_specifiques: chapitre.objectifs.map((o, idx) => `OS${idx + 1} : ${o}`),
    concepts_cles: chapitre.contenus.slice(0, 5),
    plan: planGenerated,
    sections: sectionsGenerated,
    exercices: exercicesGenerated,
    devoir_maison: {
      titre: `Devoir à la maison : Recherche et consolidation sur ${chapitre.titre_chapitre}`,
      consignes: `Rédiger une synthèse personnelle sur les notions de ${chapitre.titre_chapitre} et résoudre les exercices d'application dans son cahier de devoirs.`
    }
  };
}
