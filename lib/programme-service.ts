import { createClient } from '@/lib/supabase/client';
import type { ProgrammeChapitre, Matiere, Classe } from '@/types/database';

// Programme officiel conforme au Sommaire Officiel du Ministère de l'Éducation Nationale du Sénégal (FASTEF)
export const DEFAULT_CHAPITRES: Omit<ProgrammeChapitre, 'id' | 'created_at'>[] = [
  // ==========================================
  // CLASSE DE QUATRIEME (4e) — PHYSIQUE (30h)
  // ==========================================
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'P1 : Introduction aux sciences physiques',
    duree_recommandee: '2h',
    objectifs: [
      "Définir les sciences physiques et leurs deux branches (Physique et Chimie)",
      "Comprendre la démarche expérimentale et scientifique",
      "Identifier les pictogrammes de sécurité et appliquer les consignes au laboratoire"
    ],
    contenus: [
      "Définition et objet de la physique et de la chimie",
      "La méthode scientifique : observation, hypothèse, expérimentation, conclusion",
      "Règles d'hygiène et de sécurité au laboratoire de sciences"
    ],
    activites_preparatoires_suggerees: "Présentation de la verrerie et des instruments usuels du laboratoire ; décryptage des pictogrammes de danger sur les produits du quotidien.",
    materiel_suggere: [
      "Verrerie de laboratoire (bécher, éprouvette, tube à essai)",
      "Affiches des pictogrammes de danger normalisés",
      "Équipements de protection (gants, blouse)"
    ],
    ordre: 1,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'P2 : Grandeurs physiques et mesures',
    duree_recommandee: '2h',
    objectifs: [
      "Définir une grandeur physique et son unité légale dans le Système International (SI)",
      "Identifier et manipuler les instruments de mesure usuels (règle, pied à coulisse, éprouvette)",
      "Effectuer des conversions d'unités et exprimer un résultat de mesure avec précision"
    ],
    contenus: [
      "Notion de grandeur physique mesurable (longueur, volume, température, temps)",
      "Unités SI fondamentales et dérivées (mètre, mètre cube, seconde, degré Celsius)",
      "Techniques de mesure et évitement de l'erreur de parallaxe"
    ],
    activites_preparatoires_suggerees: "Mesure de la longueur et de la largeur de la table de classe, et mesure du volume d'eau dans une éprouvette avec lecture correcte du ménisque.",
    materiel_suggere: [
      "Règles graduées et mètre ruban",
      "Éprouvettes graduées de 100 mL",
      "Thermomètres à alcool",
      "Pied à coulisse"
    ],
    ordre: 2,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'P3 : Masse, masse volumique et densité',
    duree_recommandee: '5h',
    objectifs: [
      "Mesurer la masse d'un solide ou d'un liquide à l'aide d'une balance",
      "Déterminer expérimentalement la masse volumique d'un corps : formule ρ = m / V",
      "Calculer la densité d'un corps par rapport à l'eau : d = ρ / ρ_eau",
      "Prévoir et expliquer la flottabilité des corps (pirogues en bois, huile, métaux)"
    ],
    contenus: [
      "Masse et utilisation de la balance (tare et pesée)",
      "Formule de la masse volumique ρ = m / V (unités kg/m³ et g/cm³)",
      "Définition de la densité sans unité : d = ρ / ρ_eau",
      "Conditions de flottabilité dans l'eau douce et l'eau de mer"
    ],
    activites_preparatoires_suggerees: "Pesée de volumes croissants d'eau douce et d'huile d'arachide locale pour comparer leurs masses volumiques et vérifier que l'huile surnage.",
    materiel_suggere: [
      "Balance électronique ou de Roberval avec boîte de masses marquées",
      "Éprouvettes graduées",
      "Échantillons solides (bois, fer, aluminium, cailloux)",
      "Eau douce et huile d'arachide locale"
    ],
    ordre: 3,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'P4 : Poids - Relation entre poids et masse',
    duree_recommandee: '5h',
    objectifs: [
      "Définir le poids d'un corps comme l'attraction gravitationnelle exercée par la Terre",
      "Mesurer l'intensité du poids d'un corps à l'aide d'un dynamomètre",
      "Distinguer rigoureusement la masse (invariable) du poids (variable)",
      "Appliquer la relation fondamentale P = m × g (avec g ≈ 9,8 N/kg au Sénégal)"
    ],
    contenus: [
      "Caractéristiques du poids : point d'application (centre de gravité G), direction (verticale), sens (vers le bas), intensité (en Newtons N)",
      "Utilisation du dynamomètre et étalonnage",
      "Différence entre masse (kg) et poids (N)",
      "Relation P = m × g et intensité de la pesanteur au Sénégal"
    ],
    activites_preparatoires_suggerees: "Suspension de masses marquées croissantes à un dynamomètre, relevé des couples (m, P) et tracé de la droite d'étalonnage pour déterminer le coefficient g.",
    materiel_suggere: [
      "Dynamomètres de calibres 1 N, 2 N et 5 N",
      "Jeux de masses marquées de 50 g et 100 g",
      "Potences avec pinces de fixation",
      "Papier millimétré pour le tracé graphique"
    ],
    ordre: 4,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: "P5 : Introduction à l'électricité",
    duree_recommandee: '9h',
    objectifs: [
      "Identifier les dipôles d'un circuit électrique élémentaire (générateur, récepteur, interrupteur)",
      "Schématiser un circuit électrique en utilisant les symboles normalisés",
      "Distinguer un montage en série d'un montage en dérivation (parallèle)",
      "Comprendre les dangers du court-circuit et le rôle protecteur du fusible"
    ],
    contenus: [
      "Circuit électrique simple : boucle fermée, générateurs et récepteurs",
      "Symboles normalisés (pile, lampe, interrupteur ouvert/fermé, fils)",
      "Propriétés des circuits en série (dépendance des lampes)",
      "Propriétés des circuits avec dérivation (indépendance des appareils domestiques)",
      "Court-circuit : causes, risques d'échauffement/incendie et fusibles"
    ],
    activites_preparatoires_suggerees: "Réalisation sur platine de montage d'un circuit simple, puis de deux lampes montées en série et en dérivation pour observer l'effet du dévissage d'une lampe.",
    materiel_suggere: [
      "Piles plates de 4,5 V ou alimentations basse tension",
      "Lampes témoins 3,8 V sur supports",
      "Interrupteurs à couteau ou à bascule",
      "Fils de connexion avec pinces crocodiles",
      "Paille de fer pour modéliser le fusible"
    ],
    ordre: 5,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'P6 : Sources et récepteurs de lumière',
    duree_recommandee: '1h',
    objectifs: [
      "Distinguer une source primaire d'une source secondaire (objet diffusant)",
      "Identifier les conditions pour qu'un objet soit visible par l'œil",
      "Classifier les récepteurs de lumière naturels et artificiels"
    ],
    contenus: [
      "Sources primaires de lumière : Soleil, flammes, lampes allumées",
      "Sources secondaires : Lune, objets éclairés et diffusants",
      "Récepteurs de lumière : l'œil humain, pellicule photo, cellules photovoltaïques (panneaux solaires)"
    ],
    activites_preparatoires_suggerees: "Observation dans l'obscurité d'un objet noir versus un objet blanc éclairé par une lampe torche pour déduire les conditions de visibilité.",
    materiel_suggere: [
      "Lampe torche ou bougie",
      "Écrans blancs et cartons noirs",
      "Mini-cellule solaire reliée à un voltmètre ou une diode LED"
    ],
    ordre: 6,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'P7 : Propagation rectiligne de la lumière',
    duree_recommandee: '4h',
    objectifs: [
      "Énoncer le principe de propagation rectiligne de la lumière dans un milieu transparent et homogène",
      "Représenter un rayon lumineux et un faisceau lumineux",
      "Expliquer le principe de la chambre noire et la formation de l'image inversée",
      "Décrire la formation des ombres (propre et portée) et le mécanisme des éclipses"
    ],
    contenus: [
      "Milieu transparent et homogène (air, eau claire, verre)",
      "Modèle du rayon lumineux avec flèche de propagation",
      "Chambre noire : sténopé et inversion de l'image",
      "Ombre propre, cône d'ombre, ombre portée et zone de pénombre",
      "Éclipses de Soleil et éclipses de Lune"
    ],
    activites_preparatoires_suggerees: "Alignement de trois cartons perforés éclairés par une source lumineuse pour prouver le trajet rectiligne de la lumière, puis projection d'ombres avec une balle de tennis.",
    materiel_suggere: [
      "Trois cartons perforés montés sur supports",
      "Source de lumière ponctuelle et étendue",
      "Balle opaque (modèle de la Terre / Lune)",
      "Écran blanc de projection",
      "Modèle de chambre noire simple"
    ],
    ordre: 7,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'P8 : Réflexion et réfraction de la lumière',
    duree_recommandee: '2h',
    objectifs: [
      "Observer le phénomène de réflexion de la lumière sur un miroir plan",
      "Énoncer et appliquer la loi de la réflexion (angle d'incidence = angle de réflexion)",
      "Mettre en évidence la réfraction de la lumière lors du changement de milieu (air-eau)",
      "Identifier les applications pratiques (miroirs, rétroviseurs, mirages)"
    ],
    contenus: [
      "Miroir plan, rayon incident, rayon réfléchi et normale",
      "Lois de Descartes pour la réflexion : î = r",
      "Phénomène de réfraction (brisure du bâton plongé dans l'eau)",
      "Applications de la réflexion et réfraction au Sénégal"
    ],
    activites_preparatoires_suggerees: "Envoi d'un rayon lumineux sur un disque gradué au centre duquel est placé un miroir plan pour mesurer les angles d'incidence et de réflexion.",
    materiel_suggere: [
      "Boîte d'optique avec disque gradué (disque de Hartl)",
      "Source lumineuse à fente unique (laser ou lanterne)",
      "Miroir plan",
      "Cuve demi-cylindrique transparente remplie d'eau"
    ],
    ordre: 8,
  },

  // ==========================================
  // CLASSE DE QUATRIEME (4e) — CHIMIE (18h)
  // ==========================================
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'C1 : Mélanges et corps purs',
    duree_recommandee: '6h',
    objectifs: [
      "Distinguer un mélange homogène d'un mélange hétérogène",
      "Réaliser des techniques de séparation : décantation, filtration, distillation",
      "Définir un corps pur et énoncer ses critères de pureté physique (températures de changement d'état)"
    ],
    contenus: [
      "Mélanges hétérogènes (eau boueuse) et homogènes (eau salée, eau sucrée)",
      "Méthodes physiques de séparation : décantation, filtration simple, distillation de l'eau",
      "Notion de corps pur (eau distillée) et critères de pureté à pression normale"
    ],
    activites_preparatoires_suggerees: "Filtration d'un échantillon d'eau boueuse du fleuve ou de marigot, suivie d'une distillation simple pour récupérer de l'eau limpide.",
    materiel_suggere: [
      "Entonnoirs en verre et papier filtre",
      "Béchers et éprouvettes graduées",
      "Ballon à distiller avec réfrigérant à eau ou montage artisanal",
      "Sable, eau et sel de cuisine"
    ],
    ordre: 9,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'C2 : Structure de la matière',
    duree_recommandee: '3h',
    objectifs: [
      "Comprendre la structure discontinue de la matière à l'échelle microscopique",
      "Distinguer un atome d'une molécule",
      "Connaître les symboles chimiques des éléments courants (C, H, O, N, Fe, Cu, S)",
      "Écrire et interpréter les formules de molécules usuelles (H2O, CO2, O2, N2, CH4)"
    ],
    contenus: [
      "Modèle particulaire de la matière : atomes constitutifs",
      "Symboles chimiques des principaux éléments (majuscule et minuscule)",
      "Modèle moléculaire et formule brute des molécules simples",
      "Représentation avec les modèles moléculaires compacts et éclatés"
    ],
    activites_preparatoires_suggerees: "Construction de molécules usuelles (eau, dioxygène, dioxyde de carbone) avec des boules de pâte à modeler colorées ou boîtes de modèles moléculaires.",
    materiel_suggere: [
      "Boîte de modèles moléculaires (boules noires, blanches, rouges, bleues)",
      "Pâte à modeler et cure-dents",
      "Tableau périodique simplifié mural"
    ],
    ordre: 10,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'C3 : Mole et grandeurs molaires',
    duree_recommandee: '3h',
    objectifs: [
      "Définir la mole comme unité SI de quantité de matière",
      "Comprendre la constante d'Avogadro (NA = 6,02 × 10²³ mol⁻¹)",
      "Calculer la masse molaire atomique (M) et la masse molaire moléculaire",
      "Appliquer la formule reliant la quantité de matière à la masse : n = m / M"
    ],
    contenus: [
      "Nécessité de regrouper les atomes : la douzaine du chimiste (la mole)",
      "Constante d'Avogadro NA",
      "Masse molaire atomique et calcul des masses molaires moléculaires en g/mol",
      "Relation mathématique n = m / M et calculs d'applications"
    ],
    activites_preparatoires_suggerees: "Pesée d'une mole d'eau (18 g mesurés à l'éprouvette) et d'une mole de carbone (12 g de charbon de bois) pour matérialiser la quantité de matière.",
    materiel_suggere: [
      "Balance de précision",
      "Échantillons de substances pures (eau, cuivre, fer, sucre)",
      "Tableau des masses molaires atomiques usuelles"
    ],
    ordre: 11,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'C4 : Réaction chimique',
    duree_recommandee: '6h',
    objectifs: [
      "Distinguer une transformation physique d'une réaction chimique",
      "Identifier les réactifs consommés et les produits formés lors d'une réaction",
      "Énoncer la loi de conservation de la masse (loi de Lavoisier)",
      "Écrire et équilibrer des équations chimiques simples (combustion du carbone, du soufre, du fer)"
    ],
    contenus: [
      "Définition de la réaction chimique : réactifs et produits",
      "Combustion du carbone : Carbone + Dioxygène → Dioxyde de carbone",
      "Test caractéristique du dioxyde de carbone à l'eau de chaux",
      "Loi de Lavoisier : rien ne se perd, rien ne se crée, tout se transforme",
      "Équilibrage des équations chimiques avec les coefficients stœchiométriques"
    ],
    activites_preparatoires_suggerees: "Combustion d'un morceau de charbon de bois dans un flacon de dioxygène ; test à l'eau de chaux ; vérification de la conservation de la masse dans un système fermé.",
    materiel_suggere: [
      "Flacons de dioxygène transparents",
      "Morceaux de charbon de bois et cuillère de déflagration",
      "Eau de chaux fraîche",
      "Balance pour vérifier la conservation de la masse"
    ],
    ordre: 12,
  },

  // ==========================================
  // CLASSE DE TROISIEME (3e) — PHYSIQUE (24h)
  // ==========================================
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'P1 : Lentilles minces',
    duree_recommandee: '4h',
    objectifs: [
      "Reconnaître au toucher et observer des lentilles minces convergentes et divergentes",
      "Définir le centre optique, l'axe principal optique et les foyers (objet et image)",
      "Calculer la vergence d'une lentille convergente : C = 1 / f (en dioptries δ)",
      "Construire géométriquement l'image réelle ou virtuelle d'un objet lumineux"
    ],
    contenus: [
      "Lentilles convergentes (bords minces) et divergentes (bords épais)",
      "Éléments remarquables : O, axe optique, foyer objet F, foyer image F', distance focale f",
      "Relation de vergence C = 1 / f et unité dioptrie (δ)",
      "Règles de tracé des trois rayons particuliers et construction de l'image A'B'"
    ],
    activites_preparatoires_suggerees: "Recherche de la distance focale d'une loupe en projetant l'image nette d'un arbre lointain ou du soleil sur une feuille blanche (foyer image).",
    materiel_suggere: [
      "Banc d'optique gradué",
      "Lentilles convergentes (+2 δ, +5 δ, +10 δ) sur supports",
      "Lentilles divergentes",
      "Source lumineuse avec objet transparent (lettre 'F')",
      "Écran blanc de projection"
    ],
    ordre: 13,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'P2 : Dispersion de la lumière',
    duree_recommandee: '2h',
    objectifs: [
      "Observer la décomposition de la lumière blanche par un prisme ou un réseau",
      "Identifier les couleurs du spectre visible de la lumière (du rouge au violet)",
      "Expliquer la formation de l'arc-en-ciel au Sénégal",
      "Réaliser la recombinaison de la lumière blanche à l'aide du disque de Newton"
    ],
    contenus: [
      "Mise en évidence expérimentale de la dispersion de la lumière blanche",
      "Spectre continu de la lumière blanche (7 couleurs fondamentales)",
      "Lumières monochromatiques et lumière polychromatique",
      "Phénomène naturel de l'arc-en-ciel et synthèse des couleurs (disque de Newton)"
    ],
    activites_preparatoires_suggerees: "Projection d'un faisceau de lumière blanche à travers un prisme en verre sur un écran pour observer le spectre, puis rotation rapide du disque de Newton coloré.",
    materiel_suggere: [
      "Prisme optique en verre",
      "Source de lumière blanche collimatée (fente fine)",
      "Disque de Newton à manivelle ou sur moteur",
      "Écran blanc"
    ],
    ordre: 14,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'P3 : Forces',
    duree_recommandee: '3h',
    objectifs: [
      "Définir une action mécanique et ses effets (statique ou dynamique)",
      "Énoncer les quatre caractéristiques d'une force (point d'application, droite d'action, sens, valeur)",
      "Représenter une force par un vecteur-force avec une échelle appropriée",
      "Énoncer les conditions d'équilibre statique d'un solide soumis à deux forces"
    ],
    contenus: [
      "Notion de force et effets (mise en mouvement, déformation, équilibre)",
      "Vecteur-force : caractéristiques et mesure au dynamomètre (en Newtons N)",
      "Principe d'inertie et condition d'équilibre à deux forces : F1 + F2 = 0",
      "Solide suspendu et solide posé sur un plan horizontal"
    ],
    activites_preparatoires_suggerees: "Traction d'un anneau léger par deux dynamomètres opposés pour constater l'égalité des valeurs et l'alignement des forces à l'équilibre.",
    materiel_suggere: [
      "Dynamomètres de laboratoire",
      "Anneaux légers et potences",
      "Masses suspendues",
      "Règles et rapporteurs pour la représentation vectorielle"
    ],
    ordre: 15,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'P4 : Travail et puissance mécaniques',
    duree_recommandee: '3h',
    objectifs: [
      "Définir le travail mécanique d'une force constante en déplacement rectiligne",
      "Calculer le travail avec la formule W = F × L (en Joules J)",
      "Distinguer un travail moteur d'un travail résistant",
      "Calculer la puissance mécanique développée : P = W / t (en Watts W)"
    ],
    contenus: [
      "Notion de travail mécanique d'une force : relation W = F × L",
      "Travail moteur (force dans le sens du mouvement) et travail résistant (frottements)",
      "Travail du poids : W = ± m × g × h",
      "Définition de la puissance mécanique P = W / t et unité Watt (W)"
    ],
    activites_preparatoires_suggerees: "Calcul du travail et de la puissance développée par un élève qui monte les escaliers du collège en mesurant la hauteur et le temps chronométré.",
    materiel_suggere: [
      "Chronomètre",
      "Mètre ruban",
      "Dynamomètre de traction",
      "Chariot sur plan incliné"
    ],
    ordre: 16,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'P5 : Électrisation par frottement, le courant électrique',
    duree_recommandee: '4h',
    objectifs: [
      "Mettre en évidence expérimentalement l'électrisation par frottement, contact et influence",
      "Distinguer les deux types d'électricité statique : positive (+) et négative (-)",
      "Énoncer la loi des interactions électrostatiques (répulsion et attraction)",
      "Expliquer la nature du courant électrique (déplacement d'électrons dans les métaux et d'ions en solution)"
    ],
    contenus: [
      "Phénomènes d'électrisation : bâtons d'ébonite, verre, plastique",
      "Charges électriques positives et négatives",
      "Loi de Coulomb qualitative : charges de même signe se repoussent, de signes contraires s'attirent",
      "Nature du courant électrique : porteurs de charges mobiles (électrons libres et ions)",
      "Sens conventionnel du courant versus sens réel des électrons"
    ],
    activites_preparatoires_suggerees: "Frottement d'une règle en plastique sur des cheveux ou un tissu pour attirer des petits morceaux de papier ; déviation d'un filet d'eau.",
    materiel_suggere: [
      "Bâtons de verre et d'ébonite ou PVC",
      "Tissus de laine et soie",
      "Électroscope à feuilles d'aluminium",
      "Pendule électrostatique"
    ],
    ordre: 17,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'P6 : Résistance électrique',
    duree_recommandee: '6h',
    objectifs: [
      "Identifier un conducteur ohmique (résistor) et son rôle dans un circuit",
      "Déterminer la valeur d'une résistance à l'aide d'un ohmmètre ou du code des couleurs",
      "Tracer la caractéristique U = f(I) d'un conducteur ohmique",
      "Énoncer et appliquer la loi d'Ohm : U = R × I",
      "Calculer la résistance équivalente pour des associations en série et en dérivation"
    ],
    contenus: [
      "Conducteur ohmique et symbole normalisé",
      "Unité de résistance : l'Ohm (Ω) et ses multiples (kΩ, MΩ)",
      "Loi d'Ohm pour un dipôle passif : U = R × I",
      "Interprétation graphique de la caractéristique (droite linéaire passant par l'origine)",
      "Associations de résistances en série (Req = R1 + R2) et en parallèle"
    ],
    activites_preparatoires_suggerees: "Montage d'un circuit avec rhéostat, mesure simultanée de la tension U aux bornes du conducteur ohmique et de l'intensité I pour tracer la caractéristique linéaire.",
    materiel_suggere: [
      "Multimètres numériques (voltmètre et ampèremètre)",
      "Conducteurs ohmiques de différentes valeurs (100 Ω, 220 Ω, 1 kΩ)",
      "Alimentation stabilisée réglable",
      "Fils de connexion et boîte de résistances"
    ],
    ordre: 18,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'P7 : Énergie et rendement',
    duree_recommandee: '2h',
    objectifs: [
      "Calculer la puissance électrique consommée par un appareil : P = U × I",
      "Calculer l'énergie électrique consommée : E = P × t (en Joules J et en kWh)",
      "Énoncer la loi de Joule et ses applications (fers à repasser, chauffe-eau)",
      "Définir et calculer le rendement énergétique d'un convertisseur : η = E_utile / E_absorbée",
      "Sensibiliser aux économies d'énergie et décrypter une facture Senelec"
    ],
    contenus: [
      "Puissance nominale des appareils domestiques",
      "Énergie électrique : relation E = P × t (conversion 1 kWh = 3,6 × 10⁶ J)",
      "Effet Joule : formule E = R × I² × t, avantages et inconvénients thermiques",
      "Notion de rendement énergétique η (en pourcentage)",
      "Lecture et analyse des tranches tarifaires d'une facture d'électricité"
    ],
    activites_preparatoires_suggerees: "Étude d'une facture d'électricité réelle (Senelec), calcul de la consommation d'une lampe classique comparée à une lampe LED économique.",
    materiel_suggere: [
      "Compteur électrique didactique ou wattmètre à prise",
      "Lampes à incandescence et lampes LED",
      "Exemplaires de factures d'électricité réelles anonymisées"
    ],
    ordre: 19,
  },

  // ==========================================
  // CLASSE DE TROISIEME (3e) — CHIMIE (18h)
  // ==========================================
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'C1 : Notion de solution',
    duree_recommandee: '6h',
    objectifs: [
      "Définir les notions de solvant, soluté, solution aqueuse et solution saturée",
      "Calculer la concentration massique Cm = m / V (en g/L)",
      "Calculer la concentration molaire C = n / V (en mol/L)",
      "Réaliser expérimentalement une dissolution et une dilution de solution"
    ],
    contenus: [
      "Définitions fondamentales : solvant (eau), soluté (sel, sucre, sulfate de cuivre)",
      "Solubilité limite et notion de solution saturée",
      "Concentration massique (Cm = m / V) et concentration molaire (C = n / V)",
      "Relation entre Cm et C : Cm = C × M",
      "Protocole expérimental de préparation d'une solution par pesée et par dilution"
    ],
    activites_preparatoires_suggerees: "Préparation d'une solution de sulfate de cuivre ou de sel de cuisine de concentration donnée à l'aide d'une fiole jaugée de 100 mL.",
    materiel_suggere: [
      "Fioles jaugées de 50 mL et 100 mL",
      "Pipettes jaugées et poires d'aspiration (propipettes)",
      "Spatules et verres de montre",
      "Balance de précision et pissette d'eau distillée",
      "Sulfate de cuivre pentahydraté bleu"
    ],
    ordre: 20,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'C2 : Acides et bases',
    duree_recommandee: '4h',
    objectifs: [
      "Définir le caractère acide (ions H+) et le caractère basique (ions OH-)",
      "Mesurer le pH d'une solution avec du papier indicateur de pH ou un pH-mètre",
      "Classer des solutions sur l'échelle de pH (0 à 14 à 25°C)",
      "Comprendre la réaction de neutralisation acidobasique et appliquer les règles de sécurité"
    ],
    contenus: [
      "Ions hydrogène H+ et ions hydroxyde OH-",
      "Échelle de pH : solutions acides (pH < 7), neutres (pH = 7), basiques (pH > 7)",
      "Effet de la dilution sur une solution acide ou basique",
      "Réaction de neutralisation : Acide + Base → Sel + Eau (H+ + OH- → H2O)",
      "Pictogrammes de danger des acides et bases concentrés (corrosifs)"
    ],
    activites_preparatoires_suggerees: "Mesure du pH de solutions du quotidien au Sénégal (jus de bissap, citron, vinaigre, eau de javel, savon) avec papier pH et extrait naturel de fleurs d'hibiscus.",
    materiel_suggere: [
      "Papier indicateur de pH avec échelle de teintes",
      "Tubes à essais et portoirs",
      "Solutions d'acide chlorhydrique dilué et d'hydroxyde de sodium (soude)",
      "Extrait aqueux de Bissap local",
      "Lunettes et gants de protection"
    ],
    ordre: 21,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'C3 : Quelques propriétés chimiques des métaux',
    duree_recommandee: '4h',
    objectifs: [
      "Étudier l'action de l'acide chlorhydrique sur les métaux usuels (fer, zinc, aluminium)",
      "Identifier le dégagement de dihydrogène gazeux (test de la détonation à la flamme)",
      "Caractériser les ions métalliques en solution (Fe²⁺, Fe³⁺, Zn²⁺, Cu²⁺) par précipitation à la soude",
      "Écrire et équilibrer les équations-bilans de réaction d'oxydoréduction en solution"
    ],
    contenus: [
      "Action de l'acide chlorhydrique sur le fer, le zinc et l'aluminium (inactivité sur le cuivre)",
      "Propriétés du dihydrogène H2 (gaz inflammable et détonant à la flamme)",
      "Tests d'identification des ions métalliques par l'hydroxyde de sodium : précipité vert (Fe²⁺), rouille (Fe³⁺), blanc (Zn²⁺), bleu (Cu²⁺)",
      "Écritures ioniques et moléculaires des bilans de réaction"
    ],
    activites_preparatoires_suggerees: "Attaque de grenaille de zinc et de clous en fer par l'acide chlorhydrique ; recueil du gaz formé et test de la flamme (bruit d'aboiement caractéristique).",
    materiel_suggere: [
      "Grenailles de zinc, clous en fer décapés, tournures de cuivre",
      "Solution d'acide chlorhydrique (1 mol/L)",
      "Solution d'hydroxyde de sodium (soude)",
      "Tubes à essais, pinces en bois et allumettes"
    ],
    ordre: 22,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'C4 : Les hydrocarbures',
    duree_recommandee: '4h',
    objectifs: [
      "Définir un hydrocarbure comme un composé formé uniquement de carbone et d'hydrogène",
      "Connaître la formule générale des alcanes : CnH2n+2",
      "Nommer et représenter les quatre premiers alcanes (méthane, éthane, propane, butane)",
      "Écrire les réactions de combustion complète et incomplète des alcanes",
      "Sensibiliser à l'utilisation sécurisée du gaz butane domestique au Sénégal"
    ],
    contenus: [
      "Définition des hydrocarbures et classification des alcanes",
      "Méthane (CH4), Éthane (C2H6), Propane (C3H8), Butane (C4H10)",
      "Combustion complète dans le dioxygène : formation de CO2 et H2O",
      "Combustion incomplète : danger du monoxyde de carbone (CO) et dépôt de suie (C)",
      "Consignes de sécurité sur les bouteilles de gaz butane domestique"
    ],
    activites_preparatoires_suggerees: "Observation de la flamme bleue (complète) versus flamme jaune (incomplète) d'un brûleur à gaz en réglant la virole d'arrivée d'air ; test à l'eau de chaux des gaz de combustion.",
    materiel_suggere: [
      "Brûleur à gaz de laboratoire ou réchaud à gaz butane domestique",
      "Bécher propre pour observer le dépôt de buée et de suie",
      "Eau de chaux pour caractériser le dioxyde de carbone",
      "Modèles moléculaires des alcanes"
    ],
    ordre: 23,
  },

  // ==========================================
  // PROGRAMME DE MATHEMATIQUES (4e et 3e)
  // ==========================================
  {
    matiere: 'maths',
    classe: '3e',
    titre_chapitre: 'Théorème de Thalès dans le triangle',
    duree_recommandee: '6h',
    objectifs: [
      "Énoncer le théorème de Thalès dans une configuration triangulaire",
      "Calculer une longueur inconnue en appliquant l'égalité des rapports",
      "Énoncer et utiliser la réciproque du théorème de Thalès pour démontrer le parallélisme de deux droites"
    ],
    contenus: [
      "Configuration de Thalès : points alignés et droites sécantes",
      "Égalité des rapports de proportionnalité : AM/AB = AN/AC = MN/BC",
      "Réciproque du théorème de Thalès et condition d'alignement dans le même ordre"
    ],
    activites_preparatoires_suggerees: "Mesure de la hauteur d'un arbre ou d'un mât de drapeau dans la cour du collège à l'aide de son ombre portée et d'un bâton vertical.",
    materiel_suggere: [
      "Règle graduée, équerre et compas",
      "Mètre ruban pour les mesures d'ombres dans la cour",
      "Papier millimétré et calculatrice scientifique"
    ],
    ordre: 24,
  },
  {
    matiere: 'maths',
    classe: '4e',
    titre_chapitre: 'Triangle rectangle et cercle circonscrit',
    duree_recommandee: '5h',
    objectifs: [
      "Caractériser le triangle rectangle par son cercle circonscrit",
      "Démontrer qu'un triangle inscrit dans un demi-cercle est rectangle",
      "Appliquer la propriété de la médiane relative à l'hypoténuse"
    ],
    contenus: [
      "Cercle circonscrit à un triangle rectangle : l'hypoténuse est le diamètre",
      "Théorème direct et réciproque du triangle inscrit dans un demi-cercle",
      "Longueur de la médiane relative à l'hypoténuse : m = Hyp / 2"
    ],
    activites_preparatoires_suggerees: "Tracé géométrique de plusieurs triangles ayant pour base le diamètre d'un cercle pour vérifier au rapporteur que l'angle opposé mesure toujours 90°.",
    materiel_suggere: [
      "Règle plate, compas de précision et équerre",
      "Rapporteur d'angles"
    ],
    ordre: 25,
  },
];

const LOCAL_STORAGE_KEY = 'fastef_programme_chapitres_v2';

export class ProgrammeService {
  /**
   * Récupère la liste des chapitres officiels (filtrable par matière et classe)
   */
  static async getChapitres(matiere?: Matiere, classe?: Classe): Promise<ProgrammeChapitre[]> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Si Supabase est configuré, on essaie de récupérer depuis la base
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = createClient();
        let query = supabase
          .from('programme_chapitres')
          .select('*')
          .order('ordre', { ascending: true })
          .order('created_at', { ascending: true });

        if (matiere) {
          query = query.eq('matiere', matiere);
        }
        if (classe) {
          query = query.eq('classe', classe);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as ProgrammeChapitre[];
        }
      } catch (err) {
        console.warn('Supabase non disponible, fallback local:', err);
      }
    }

    // Fallback local
    return this.getLocalChapitres(matiere, classe);
  }

  /**
   * Récupère un chapitre par son identifiant unique
   */
  static async getChapitreById(id: string): Promise<ProgrammeChapitre | null> {
    const chapitres = await this.getChapitres();
    return chapitres.find((c) => c.id === id) || null;
  }

  /**
   * Ajoute un nouveau chapitre dans la base officielle
   */
  static async addChapitre(
    nouveau: Omit<ProgrammeChapitre, 'id' | 'created_at'>
  ): Promise<ProgrammeChapitre> {
    const supabase = createClient();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const { data, error } = await supabase
          .from('programme_chapitres')
          .insert([nouveau])
          .select()
          .single();

        if (!error && data) {
          return data as ProgrammeChapitre;
        }
      } catch (err) {
        console.warn('Erreur ajout Supabase, stockage local:', err);
      }
    }

    // Sauvegarde en LocalStorage
    const fullChapitre: ProgrammeChapitre = {
      ...nouveau,
      id: 'local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      created_at: new Date().toISOString(),
    };

    const currentList = this.getLocalChapitres();
    const updatedList = [...currentList, fullChapitre];
    this.saveLocalChapitres(updatedList);

    return fullChapitre;
  }

  /**
   * Réinitialise les chapitres locaux avec les chapitres par défaut du programme sénégalais
   */
  static resetDefaultLocalChapitres(): ProgrammeChapitre[] {
    const defaultFull: ProgrammeChapitre[] = DEFAULT_CHAPITRES.map((c, index) => ({
      ...c,
      id: `default_${c.matiere}_${c.classe}_${index + 1}`,
      created_at: new Date().toISOString(),
    }));
    this.saveLocalChapitres(defaultFull);
    return defaultFull;
  }

  private static getLocalChapitres(matiere?: Matiere, classe?: Classe): ProgrammeChapitre[] {
    if (typeof window === 'undefined') {
      let list: ProgrammeChapitre[] = DEFAULT_CHAPITRES.map((c, index) => ({
        ...c,
        id: `default_${c.matiere}_${c.classe}_${index + 1}`,
        created_at: new Date().toISOString(),
      }));
      if (matiere) list = list.filter((c) => c.matiere === matiere);
      if (classe) list = list.filter((c) => c.classe === classe);
      return list;
    }

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    let list: ProgrammeChapitre[] = [];

    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch {
        list = this.resetDefaultLocalChapitres();
      }
    } else {
      list = this.resetDefaultLocalChapitres();
    }

    if (matiere) {
      list = list.filter((c) => c.matiere === matiere);
    }
    if (classe) {
      list = list.filter((c) => c.classe === classe);
    }

    return list;
  }

  private static saveLocalChapitres(list: ProgrammeChapitre[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    }
  }
}
