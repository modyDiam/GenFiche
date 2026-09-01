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
1. CONTRAINTE FONDAMENTALE SUR LES LIMITES DU PROGRAMME :
   - Tu ne dois JAMAIS inventer d'objectifs pédagogiques, de formules ou de notions scientifiques en dehors du programme officiel qui t'est fourni.
   - Tu dois STRICTEMENT respecter les limites imposées par le programme sénégalais : ne jamais déborder vers le lycée ou le supérieur (ex: en 3e, loi d'Ohm U = R.I, calcul de puissance P = U.I et énergie W = P.t ou W = R.I².t, concentration C = n/V et Cm = m/V, équivalence acido-basique Ca.Va = Cb.Vb, réactions d'oxydation et actions des acides dilués à froid, combustion des alcanes dans O2).
   - Seuls les contenus et explications pédagogiques associés à chaque objectif spécifique (OS) officiel sont autorisés à varier pour expliciter la notion avec clarté, mais TOUJOURS dans le périmètre strict des savoirs exigibles au collège sénégalais (BFEM / FASTEF).

2. ARCHITECTURE ET STRUCTURATION DU PLAN (INSPIRÉ DES FASCICULES DE RÉFÉRENCE DE MSP / FASTEF) :
   Pour chaque chapitre, tu dois formuler un PLAN PÉDAGOGIQUE SOLIDE, HIÉRARCHISÉ ET COHÉRENT, structuré en grandes parties numérotées en chiffres romains (I, II, III...) et sous-parties (1, 2, 3...) :
   - Formuler un plan clair où chaque point découle logiquement du précédent.
   - Exemple de structure type pour une partie :
     * 1) Définition rigoureuse ou Rappel institutionnel (énoncé exact de la loi ou du concept),
     * 2) Expérience / Activité d'apprentissage (dispositif, observation, interprétation scientifique),
     * 3) Formule mathématique avec unités précises du Système International (ex: C = n/V avec n en mol, V en L, C en mol/L),
     * 4) Remarques importantes & Contre-exemples (ex: mélange hétérogène eau+huile n'est pas une solution ; l'acide nitrique attaque le cuivre avec vapeurs rousses mais n'attaque pas l'aluminium),
     * 5) Application immédiate résolue / Exemple de calcul pas-à-pas.

3. DÉVELOPPEMENT DÉTAILLÉ DES CONTENUS ET DES SECTIONS :
   Pour chaque section du plan, tu dois impérativement fournir un contenu didactique complet, élégant et professionnel :
   - "activite" : Dispositif expérimental concret ou activité d'observation (matériel utilisé, protocole étape par étape, observations attendues des élèves).
   - "definition" : L'énoncé institutionnel ou la formule encadrée avec le nom et les unités de chaque terme.
   - "texte" : L'explication théorique détaillée, l'interprétation microscopique ou macroscopique, les équations chimiques complètes (globales et ioniques le cas échéant : ex. H+ + OH- -> H2O).
   - "remarque" : Précautions de sécurité, pièges fréquents d'élèves, propriétés particulières ou cas limites.
   - "exemples" : 2 à 3 exemples vivants ancrés dans la vie quotidienne et l'environnement sénégalais.
   - "tableau" : Inclure un tableau récapitulatif comparatif dès que pertinent (ex: tableau des propriétés physiques des métaux Cu, Al, Fe, Zn, Pb avec symboles, masses volumiques, couleurs, conductibilités ; tableau des familles d'alcanes/alcènes/alcynes ; tableau de mesure U = f(I)).

4. ANCRAGE LOCAL SÉNÉGALAIS AUTHENTIQUE :
   - Produits et ressources locales : eau de javel, lessive locale, eau de cendre, jus de citron, vinaigre, jus de bissap blanc (comme indicateur coloré naturel artisanal), sel du Lac Rose ou de Kaolack, huile d'arachide, grains de mil, charbon de bois.
   - Vie courante et contexte : visite d'un réparateur de radios du quartier (résistors, codes couleur), pompe hydraulique de puits villageois, atelier de ferronnerie ou de menuiserie métallique (protection anti-rouille, peinture à l'huile), cuisine au réchaud à gaz butane (bouteilles bleues Touba Gaz ou Total).

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
- Durée effective du cours : ${parametres.duree_reelle} (recommandée : ${chapitre.duree_recommandee})
- Effectif de la classe : ${parametres.effectif} élèves
- Établissement : ${parametres.etablissement}
- Professeur : ${parametres.professeur_nom || 'Enseignant de Sciences Physiques'}
- Date : ${parametres.date}

DONNÉES DU PROGRAMME OFFICIEL (SOURCE MINISTÉRIELLE SÉNÉGALAISE IMMUABLE) :
- Objectifs d'apprentissage officiels (OS) :
${chapitre.objectifs.map((obj, i) => `  * OS${i + 1} : ${obj}`).join('\n')}

- Contenus officiels prescrits :
${chapitre.contenus.map((c) => `  * ${c}`).join('\n')}

- Activité préparatoire officielle du document ministériel :
  "${chapitre.activites_preparatoires_suggerees || 'Activité expérimentale ou de recherche.'}"

- Matériel didactique suggéré :
${chapitre.materiel_suggere.map((m) => `  * ${m}`).join('\n')}

DIRECTIVES DE RÉDACTION PROFESSIONNELLE :
1. Construis un PLAN PÉDAGOGIQUE RIGOUREUX (I, II, III...) calqué sur les fascicules de professeurs chevronnés du Sénégal : chaque grand point correspond aux notions clés de la colonne "Contenus" sans rien omettre.
2. Développe chaque section avec précision : définitions institutionnelles exactes, formules avec unités détaillées, activités pratiques et observations, remarques méthodologiques, applications directes et exemples locaux.
3. Insère au moins un tableau comparatif ou récapitulatif clair dans les sections appropriées.
4. Rédige 2 à 3 exercices d'évaluation de niveau BFEM (Vrai/Faux, calculs d'application avec barème suggéré) et un devoir à la maison de consolidation.`;
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
 * Génère un contenu FASTEF simulant l'appel Gemini pour le mode démonstration / hors-ligne.
 */
export function generateSimulatedFASTEF(
  chapitre: ProgrammeChapitre,
  parametres: FicheParametres
): FicheFASTEFContenu {
  const isPC = chapitre.matiere === 'pc';

  if (isPC) {
    return {
      prerequis: [
        "Notion de masse et utilisation de la balance",
        "Mesure des volumes à l'éprouvette graduée",
        "Unités usuelles de mesure (gramme, kilogramme, litre, millilitre)"
      ],
      materiel: [
        "Balance électronique de précision (ou balance de Roberval avec masses marquées)",
        "Éprouvettes graduées de 100 mL et 250 mL",
        "Échantillons solides (briquettes de granite de Thiès, bois, morceaux d'aluminium)",
        "Liquides usuels : eau douce, eau de mer du littoral sénégalais, huile d'arachide locale",
        "Fiches d'activités individuelles et tableau noir"
      ],
      objectifs_specifiques: chapitre.objectifs.map((o, idx) => `OS${idx + 1} : ${o}`),
      concepts_cles: [
        "Masse volumique (ρ)",
        "Densité par rapport à l'eau (d)",
        "Flottabilité des corps",
        "Unités SI : kg/m³ et unité pratique : g/cm³"
      ],
      plan: [
        "I. Notion et détermination de la masse volumique",
        "II. La densité d'un corps par rapport à l'eau",
        "III. Flottabilité et applications pratiques au Sénégal"
      ],
      sections: [
        {
          titre: "I. Détermination de la masse volumique d'un solide et d'un liquide",
          activite: "Activité 1 : Pesée de 50 mL d'eau douce et de 50 mL d'huile d'arachide achetée au marché local. Les élèves relèvent les masses respectives et comparent le rapport masse / volume.",
          definition: "La masse volumique d'un corps homogène est le quotient de sa masse (m) par son volume (V) : ρ = m / V. Dans le Système International, elle s'exprime en kg/m³ (ou g/cm³ en pratique avec 1 g/cm³ = 1000 kg/m³).",
          remarque: "Attention à la lecture du ménisque sur l'éprouvette graduée : l'œil doit être placé rigoureusement au niveau de la base du ménisque concave.",
          exemples: [
            "Masse volumique de l'eau douce : ρ_eau = 1,00 g/cm³ = 1000 kg/m³.",
            "Masse volumique de l'huile d'arachide de Kaolack : ρ_huile ≈ 0,92 g/cm³ = 920 kg/m³.",
            "Masse volumique du fer : ρ_fer = 7,8 g/cm³."
          ],
          tableau: {
            colonnes: ["Substance", "Masse mesurée (g)", "Volume (cm³)", "Masse volumique ρ (g/cm³)"],
            lignes: [
              ["Eau douce", "100", "100", "1,00"],
              ["Huile d'arachide", "92", "100", "0,92"],
              ["Granite local", "135", "50", "2,70"]
            ]
          }
        },
        {
          titre: "II. Définition et calcul de la densité par rapport à l'eau",
          definition: "La densité d'un solide ou d'un liquide par rapport à l'eau est le rapport entre sa masse volumique et celle de l'eau : d = ρ / ρ_eau. La densité est une grandeur sans unité (nombre pur).",
          remarque: "Puisque ρ_eau = 1 g/cm³, la valeur numérique de la densité est égale à celle de la masse volumique exprimée en g/cm³.",
          exemples: [
            "Densité de l'huile d'arachide : d = 0,92 / 1 = 0,92 (inférieure à 1).",
            "Densité du granite : d = 2,70 / 1 = 2,70 (supérieure à 1)."
          ]
        },
        {
          titre: "III. Flottabilité et comparaison des densités dans la vie courante",
          texte: "Un corps immergé dans un liquide flotte si sa densité est inférieure à celle du liquide (d < 1 pour l'eau). Si sa densité est supérieure à celle du liquide (d > 1), le corps coule.",
          exemples: [
            "Application maritime : les pirogues de pêcheurs en bois flottent sur l'océan à Saint-Louis et Kayar car le bois a une densité inférieure à celle de l'eau salée.",
            "Séparation culinaire : lorsqu'on prépare le Ceebu Jën, l'huile d'arachide surnage toujours au-dessus du bouillon aqueux car sa densité (0,92) est plus faible que celle de l'eau."
          ]
        }
      ],
      exercices: [
        {
          titre: "Exercice 1 : Questions à réponses courtes et Vrai/Faux",
          type: "vrai_faux",
          enonce: "Répondre par Vrai ou Faux et justifier brièvement les affirmations suivantes :",
          elements: [
            "a) La densité d'un corps s'exprime obligatoirement en kg/m³.",
            "b) Un solide de masse 250 g et de volume 100 cm³ flotte sur l'eau douce.",
            "c) L'huile d'arachide surnage au-dessus de l'eau parce que sa masse volumique est plus faible que celle de l'eau."
          ]
        },
        {
          titre: "Exercice 2 : Application au marché de Kaolack",
          type: "application",
          enonce: "Un commerçant mesure la masse d'un bidon contenant 5 litres d'huile d'arachide brute. La masse nette de l'huile est trouvée égale à 4,6 kg.",
          elements: [
            "1. Calculer la masse volumique de cette huile en kg/L puis en g/cm³.",
            "2. En déduire la densité de cette huile d'arachide par rapport à l'eau douce.",
            "3. Si l'on verse accidentellement cette huile dans une bassine d'eau de pluie, observera-t-on un dépôt au fond ou une nappe en surface ? Justifier."
          ]
        }
      ],
      devoir_maison: {
        titre: "Devoir de maison : Détermination de la masse volumique d'une roche du Lac Rose",
        consignes: "Un élève de 3ème ramasse un morceau de roche près du Lac Rose. À la maison, à l'aide d'une balance de cuisine, il trouve une masse m = 162 g. Par déplacement d'eau dans un verre mesureur gradué, le niveau passe de 150 mL à 210 mL. 1) Déterminer le volume de la roche en cm³. 2) Calculer sa masse volumique en g/cm³. 3) Calculer sa densité par rapport à l'eau douce."
      }
    };
  } else {
    // Maths
    return {
      prerequis: [
        "Notion de droites parallèles et sécantes",
        "Rapports de proportionnalité et fractions équivalentes",
        "Utilisation de la règle graduée et de l'équerre"
      ],
      materiel: [
        "Instruments de géométrie de tableau (grande règle, équerre, compas)",
        "Cahier quadrillé et matériel individuel des élèves",
        "Exemples de plans et schémas d'arpentage sénégalais"
      ],
      objectifs_specifiques: chapitre.objectifs.map((o, idx) => `OS${idx + 1} : ${o}`),
      concepts_cles: [
        "Configuration de Thalès",
        "Rapports de proportionnalité des longueurs",
        "Réciproque du théorème de Thalès",
        "Parallélisme de droites"
      ],
      plan: [
        "I. Énoncé et configuration du théorème de Thalès",
        "II. Calcul de longueurs inconnues dans un triangle",
        "III. Réciproque du théorème de Thalès et démonstration du parallélisme"
      ],
      sections: [
        {
          titre: "I. Configuration et énoncé du théorème de Thalès",
          activite: "Activité 1 : Dans la cour du collège à Dakar, un poteau vertical et un bâton d'un mètre planté verticalement projettent leurs ombres respectives au sol sous les rayons parallèles du soleil.",
          definition: "Soit un triangle ABC. Si M est un point de la droite (AB), N un point de la droite (AC), et si la droite (MN) est parallèle à la droite (BC), alors : AM / AB = AN / AC = MN / BC.",
          remarque: "Les points A, M, B d'une part, et A, N, C d'autre part, doivent être alignés dans le même ordre.",
          exemples: [
            "Dans un triangle ABC où AB = 8 cm, AC = 10 cm, BC = 6 cm. Si M est sur [AB] avec AM = 2 cm et (MN) // (BC), alors AN = 2,5 cm et MN = 1,5 cm."
          ]
        },
        {
          titre: "II. Calcul pratique de distances inaccessibles",
          texte: "Le théorème de Thalès est l'outil privilégié pour déterminer la hauteur d'un arbre, d'un minaret ou d'un lampadaire sans y grimper.",
          exemples: [
            "Hauteur d'un baobab à Kaolack : l'ombre du baobab mesure 18 mètres au sol alors qu'au même moment, un piquet vertical de 2 m projette une ombre de 3 m. La hauteur du baobab est h = 2 × 18 / 3 = 12 mètres."
          ]
        }
      ],
      exercices: [
        {
          titre: "Exercice 1 : Application directe du calcul de longueur",
          type: "application",
          enonce: "Sur la figure ci-contre, les droites (EF) et (BC) sont parallèles. On donne : AE = 3 cm, AB = 9 cm, AC = 12 cm et BC = 7,5 cm.",
          elements: [
            "1. Justifier l'application du théorème de Thalès.",
            "2. Calculer la longueur AF.",
            "3. Calculer la longueur EF."
          ]
        },
        {
          titre: "Exercice 2 : Démontrer un parallélisme",
          type: "application",
          enonce: "Dans un triangle PQR, on donne PQ = 6 cm, PR = 8 cm. Le point S est sur [PQ] tel que PS = 1,5 cm et le point T est sur [PR] tel que PT = 2 cm.",
          elements: [
            "1. Calculer séparément les rapports PS/PQ et PT/PR.",
            "2. Conclure sur le parallélisme des droites (ST) et (QR)."
          ]
        }
      ],
      devoir_maison: {
        titre: "Devoir à la maison : Le problème du géomètre à Thiès",
        consignes: "Un géomètre veut mesurer la largeur d'une rivière sans la traverser. Il implante des piquets A, B, C, D et E en alignant les visées... Déterminer la largeur en justifiant par le théorème de Thalès."
      }
    };
  }
}
