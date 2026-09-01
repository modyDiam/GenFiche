import { createClient } from '@/lib/supabase/client';
import type { ProgrammeChapitre, Matiere, Classe } from '@/types/database';

// Programme officiel conforme MOT POUR MOT au document officiel du Ministère de l'Éducation Nationale du Sénégal (Août 2008 / FASTEF)
export const DEFAULT_CHAPITRES: Omit<ProgrammeChapitre, 'id' | 'created_at'>[] = [
  // =========================================================================
  // CLASSE DE QUATRIEME (4e) — PROGRAMME DE PHYSIQUE (Total : 30 heures)
  // =========================================================================
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'P1 : Introduction aux sciences physiques',
    duree_recommandee: '2h',
    objectifs: [
      "Distinguer les phénomènes physiques des phénomènes chimiques.",
      "Identifier les différents changements d'état.",
      "Rappeler l'importance de la physique et de la chimie dans divers domaines."
    ],
    contenus: [
      "Sciences Physiques : exemple de sciences expérimentales",
      "Phénomènes physiques, phénomènes chimiques",
      "États de la matière ; changements d'états"
    ],
    activites_preparatoires_suggerees: "Observation et distinction de phénomènes familiers : dissolution du sucre ou du sel, mouvements, changements d'états de l'eau, effet du jus de citron ou vinaigre sur le calcaire. Recherche documentaire sur l'apport de la chimie et de la physique (agriculture, santé, environnement).",
    materiel_suggere: [
      "Verrerie usuelle (béchers, tubes à essais)",
      "Échantillons d'eau, sel, sucre, craie/calcaire",
      "Jus de citron ou vinaigre blanc",
      "Source de chaleur pour observer la vaporisation et la fusion"
    ],
    ordre: 1,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'P2 : Grandeurs physiques et mesures',
    duree_recommandee: '2h',
    objectifs: [
      "Choisir un instrument de mesure adéquat.",
      "Savoir utiliser les puissances de dix (conversions, calculs).",
      "Savoir critiquer une mesure.",
      "Savoir présenter les résultats d'une mesure en notation scientifique."
    ],
    contenus: [
      "Grandeurs physiques : unités de mesures, appareils de mesure, mesures",
      "Conversion des unités : utilisation des puissances de 10",
      "Ordre de grandeur - vraisemblance des résultats",
      "Chiffres significatifs",
      "Notation scientifique"
    ],
    activites_preparatoires_suggerees: "Mesures effectives en classe avec des instruments familiers (règle, verrerie graduée, chronomètre, balance) ; analyse critique des erreurs de lecture et conversion des unités en puissances de dix.",
    materiel_suggere: [
      "Règles graduées et mètre ruban",
      "Verrerie graduée (éprouvettes)",
      "Chronomètre ou montre",
      "Instruments de pesée usuels"
    ],
    ordre: 2,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'P3 : Masse, masse volumique et densité',
    duree_recommandee: '5h',
    objectifs: [
      "Connaître différents types de balances.",
      "Déterminer la masse d'un objet.",
      "Déterminer la masse volumique d'une substance homogène.",
      "Utiliser la relation entre la masse, la masse volumique et le volume.",
      "Vérifier la pureté d'un corps à partir de sa masse volumique.",
      "Déterminer la densité relative.",
      "Prévoir la disposition des constituants d'un mélange liquide hétérogène."
    ],
    contenus: [
      "Masse : balance, définition, unités, mesures",
      "Masse volumique : relation m = ρ × V, unités (kg/m³, g/cm³)",
      "Densité : d = ρ / ρ_eau, comparaison des densités et flottabilité"
    ],
    activites_preparatoires_suggerees: "Pesée rationnelle avec masses marquées et balance de Roberval ou électronique. Détermination expérimentale de la masse et du volume d'eau, d'huile locale et de solides pour calculer la masse volumique et vérifier la flottabilité.",
    materiel_suggere: [
      "Balances (Roberval avec boîte de masses marquées ou électronique)",
      "Éprouvettes graduées de 100 mL",
      "Solides réguliers et cailloux de forme irrégulière",
      "Eau douce et huile d'arachide"
    ],
    ordre: 3,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'P4 : Poids - Relation entre poids et masse',
    duree_recommandee: '5h',
    objectifs: [
      "Identifier le poids comme grandeur vectorielle à partir de ses caractéristiques.",
      "Représenter le vecteur poids d'un objet.",
      "Distinguer poids et masse d'un corps.",
      "Utiliser la relation entre le poids et la masse (P = m × g)."
    ],
    contenus: [
      "Poids : mise en évidence, définition, caractéristiques (point d'application G, droite d'action, sens, valeur en Newton N)",
      "Mesures au dynamomètre et représentation vectorielle",
      "Relation entre poids et masse : intensité de la pesanteur g et son unité (N/kg)"
    ],
    activites_preparatoires_suggerees: "Mise en évidence du poids par la chute des corps et suspension à un dynamomètre. Détermination du centre de gravité d'une plaque mince. Tracé de la courbe P en fonction de m pour prouver la constance du rapport P/m.",
    materiel_suggere: [
      "Dynamomètres de calibres variés (1 N, 2 N, 5 N)",
      "Masses marquées étalonnées (50 g, 100 g, 200 g)",
      "Plaques planes de carton ou contreplaqué et fil à plomb",
      "Potence et pinces"
    ],
    ordre: 4,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: "P5 : Introduction à l'électricité",
    duree_recommandee: '9h',
    objectifs: [
      "Utiliser quelques dipôles.",
      "Schématiser un circuit électrique.",
      "Réaliser un circuit à partir du schéma.",
      "Distinguer expérimentalement un conducteur d'un isolant.",
      "Reconnaître les effets du courant électrique (dans divers appareils).",
      "Indiquer le sens conventionnel du courant électrique.",
      "Utiliser un ampèremètre.",
      "Utiliser un voltmètre.",
      "Placer un ampèremètre, un voltmètre dans le schéma d'un circuit électrique.",
      "Utiliser la loi de l'unicité de l'intensité dans un circuit série.",
      "Utiliser la loi des nœuds.",
      "Utiliser les lois des tensions.",
      "Prendre les précautions pour protéger les personnes et les appareils.",
      "Appliquer et faire appliquer les consignes de sécurité liées au courant électrique."
    ],
    contenus: [
      "Le courant électrique : circuit électrique, dipôles et symboles, conducteurs et isolants électriques",
      "Circuit série, circuit parallèle (dérivation)",
      "Effets du courant électrique : calorifiques, lumineux, chimiques et magnétiques",
      "Sens conventionnel du courant",
      "Intensité : définition, unité (Ampère A), utilisation de l'ampèremètre, lois des intensités (unicité en série, loi des nœuds)",
      "Tension électrique : définition, unité (Volt V), voltmètre, lois des tensions",
      "Protection et sécurité électrique (court-circuit, fusibles)"
    ],
    activites_preparatoires_suggerees: "Montages pratiques sur platine : allumage d'une lampe, test de matériaux conducteurs et isolants, insertion de l'ampèremètre en série et du voltmètre en dérivation, vérification des lois d'additivité et d'unicité.",
    materiel_suggere: [
      "Piles plates 4,5 V ou alimentations basse tension",
      "Lampes sur supports et interrupteurs",
      "Multimètres numériques (ou ampèremètres et voltmètres à aiguille)",
      "Fils de connexion avec pinces crocodiles",
      "Échantillons de métaux, bois, plastique, graphite"
    ],
    ordre: 5,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'P6 : Sources et récepteurs de lumière',
    duree_recommandee: '1h',
    objectifs: [
      "Distinguer une source primaire (réelle) d'une source secondaire (apparente).",
      "Distinguer les sources des récepteurs de lumière."
    ],
    contenus: [
      "Sources réelles (ou primaires) de lumière : Soleil, flammes, lampes allumées",
      "Sources apparentes (ou secondaires) de lumière : Lune, objets diffusants éclairés",
      "Récepteurs de lumière : l'œil humain, cellules photovoltaïques, papier photographique"
    ],
    activites_preparatoires_suggerees: "Observation d'objets dans l'obscurité totale versus éclairés par une lampe torche ; déduction des conditions de visibilité d'un objet et mise en action d'un récepteur (panneau solaire miniature).",
    materiel_suggere: [
      "Lampe torche ou bougie",
      "Écrans blancs et cartons noirs opaques",
      "Mini-cellule solaire photovoltaïque reliée à un moteur ou DEL"
    ],
    ordre: 6,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'P7 : Propagation rectiligne de la lumière',
    duree_recommandee: '4h',
    objectifs: [
      "Identifier des milieux transparents, translucides et opaques.",
      "Expliquer la formation des ombres et des pénombres.",
      "Expliquer le phénomène d'éclipse."
    ],
    contenus: [
      "Propagation rectiligne de la lumière : faisceaux lumineux (convergent, divergent, cylindrique), rayon lumineux",
      "Milieu homogène ; milieu transparent, translucide, opaque",
      "Vitesse ou célérité de la lumière, année lumière",
      "Ombres et pénombres : ombre propre et ombre portée, pénombre propre et pénombre portée",
      "Applications : visée, chambre noire, éclipses de Soleil et de Lune"
    ],
    activites_preparatoires_suggerees: "Expérience des cartons perforés alignés pour prouver le trajet rectiligne ; projection d'ombres d'une sphère sur un écran (zones d'ombre et de pénombre) ; fabrication d'une chambre noire artisanale.",
    materiel_suggere: [
      "Cartons perforés sur supports d'alignement",
      "Source de lumière ponctuelle et source étendue",
      "Écrans de projection et balles opaques",
      "Kit optique ou boîte à lumière",
      "Chambre noire avec papier calque"
    ],
    ordre: 7,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'P8 : Réflexion et réfraction de la lumière',
    duree_recommandee: '2h',
    objectifs: [
      "Utiliser les lois de la réflexion.",
      "Construire l'image d'un objet donné par un miroir plan.",
      "Donner les caractéristiques de l'image d'un objet réel donnée par un miroir plan.",
      "Appliquer la réflexion et la réfraction dans la vie courante."
    ],
    contenus: [
      "Réflexion de la lumière : réflexion diffuse et réflexion spéculaire",
      "Miroir plan, milieu réfringent, point d'incidence, rayon incident et rayon réfléchi",
      "Angle d'incidence et angle de réflexion, lois de Descartes pour la réflexion (î = r)",
      "Objet réel et image virtuelle symétrique",
      "Réfraction de la lumière : rayon réfracté, angle réfracté, applications courantes"
    ],
    activites_preparatoires_suggerees: "Mesure des angles sur disque optique gradué avec miroir plan ; expérience des deux bougies pour situer l'image virtuelle symétrique ; observation de la brisure optique d'un bâton plongé dans l'eau.",
    materiel_suggere: [
      "Miroir plan et vitre transparente",
      "Disque d'optique gradué (disque de Hartl)",
      "Lanterne à fente fine ou rayon laser sécurisé",
      "Deux bougies identiques",
      "Cuve demi-cylindrique remplie d'eau"
    ],
    ordre: 8,
  },

  // =========================================================================
  // CLASSE DE QUATRIEME (4e) — PROGRAMME DE CHIMIE (Total : 18 heures)
  // =========================================================================
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'C1 : Mélanges et corps purs',
    duree_recommandee: '6h',
    objectifs: [
      "Distinguer mélange homogène et mélange hétérogène.",
      "Connaître quelques méthodes de séparation.",
      "Caractériser l'eau par ses constantes physiques.",
      "Distinguer corps pur simple et corps pur composé.",
      "Distinguer mélange et corps pur."
    ],
    contenus: [
      "Mélange : mélange hétérogène, mélange homogène",
      "Méthodes de séparation : décantation, filtration, distillation fractionnée, congélation fractionnée",
      "Corps purs : constantes physiques, critères de pureté",
      "Corps purs composés, corps purs simples",
      "Divers exemples de mélanges et de méthodes de séparation (air, fer-soufre, liquides miscibles/non miscibles, liquide-gaz)",
      "Distinction entre mélange et corps pur"
    ],
    activites_preparatoires_suggerees: "Observation d'eaux naturelles locales. Réalisation d'expériences de décantation et filtration d'eau boueuse, puis distillation de l'eau. Séparation magnétique du mélange fer-soufre à l'aimant. Électrolyse et synthèse de l'eau.",
    materiel_suggere: [
      "Entonnoirs, papier filtre, béchers, ampoules à décanter",
      "Dispositif de distillation (ballon, réfrigérant)",
      "Aimant droit",
      "Voltamètre pour électrolyse de l'eau avec générateur continu",
      "Eau, sel, sable, huile, limaille de fer et poudre de soufre"
    ],
    ordre: 9,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'C2 : Structure de la matière',
    duree_recommandee: '3h',
    objectifs: [
      "Citer les entités chimiques constituant la matière (atomes, molécules, ions simples : ions positifs et ions négatifs).",
      "Donner l'ordre de grandeur des dimensions et masses des atomes et des molécules.",
      "Mettre en évidence quelques éléments chimiques.",
      "Donner la notation chimique (éléments, corps purs, ions).",
      "Utiliser une formule chimique.",
      "Distinguer un corps pur simple d'un corps pur composé.",
      "Utiliser des modèles moléculaires."
    ],
    contenus: [
      "Structure de la matière : discontinuité de la matière, molécule, atome, ion simple, ion polyatomique, élément chimique",
      "Notation chimique : symbole des éléments, formule d'un corps pur",
      "Modèle atomique et moléculaire (boules compactes et éclatées)"
    ],
    activites_preparatoires_suggerees: "Mise en évidence expérimentale de la discontinuité par dilution poussée d'un colorant (permanganate de potassium ou bleu de méthylène). Écriture de formules et manipulation de boîtes de modèles moléculaires (H2O, O2, N2, CO2, CH4).",
    materiel_suggere: [
      "Boîtes de modèles moléculaires didactiques",
      "Pâte à modeler colorée",
      "Cristaux de permanganate de potassium ou colorant alimentaire",
      "Tableau mural des symboles chimiques des éléments"
    ],
    ordre: 10,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'C3 : Mole et grandeurs molaires',
    duree_recommandee: '3h',
    objectifs: [
      "Distinguer les différentes grandeurs molaires et leurs unités.",
      "Déterminer la masse molaire d'un corps pur.",
      "Exprimer une quantité de matière par : n = m / M et n = V / Vm.",
      "Exprimer la densité d'un gaz.",
      "Lier le volume molaire d'un gaz aux conditions de température et de pression.",
      "Distinguer les deux significations d'une formule chimique."
    ],
    contenus: [
      "La mole : unité de quantité de matière, constante d'Avogadro",
      "Masse molaire : masse molaire atomique, masse molaire moléculaire",
      "Volume molaire : loi d'Avogadro-Ampère, volume molaire Vm (en L/mol)",
      "Densité d'un gaz par rapport à l'air : formule d = M / 29"
    ],
    activites_preparatoires_suggerees: "Utilisation du tableau périodique pour relever les masses atomiques. Calcul de masses molaires de corps purs (H2O, CO2, NaCl, C4H10). Application des relations n = m/M, n = V/Vm et d = M/29 à travers des exercices concrets.",
    materiel_suggere: [
      "Tableau périodique des éléments avec masses atomiques",
      "Balance de précision pour peser une mole de substances usuelles",
      "Fiches de calculs et conversions didactiques"
    ],
    ordre: 11,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'C4 : Réaction chimique',
    duree_recommandee: '6h',
    objectifs: [
      "Distinguer les réactifs des produits d'une réaction chimique.",
      "Donner la signification d'une réaction chimique.",
      "Utiliser la loi de conservation de la matière.",
      "Écrire l'équation-bilan d'une réaction chimique.",
      "Donner la signification de l'équation-bilan (échelles macroscopique et microscopique).",
      "Résoudre des problèmes de chimie sur les réactions chimiques.",
      "Prendre des mesures de sécurité par rapport aux dangers de certaines réactions chimiques."
    ],
    contenus: [
      "Réaction chimique : exemples de réactions chimiques, réactif, produit",
      "Caractéristiques d'une réaction chimique : aspect énergétique, loi de Lavoisier",
      "Équation-bilan d'une réaction chimique : écriture, équilibrage par coefficients stœchiométriques, interprétation",
      "Application : résolution de problèmes de stœchiométrie chimique"
    ],
    activites_preparatoires_suggerees: "Réalisation d'expériences témoins : combustion du carbone dans le dioxygène avec test à l'eau de chaux ; réaction fer-soufre ; action de l'acide chlorhydrique sur le calcaire. Écriture et équilibrage pas-à-pas des équations-bilans.",
    materiel_suggere: [
      "Flacons de dioxygène transparents",
      "Charbon de bois, soufre en poudre, limaille de fer",
      "Eau de chaux fraîchement préparée",
      "Tubes à essais, brûleur ou lampe à alcool, pinces en bois",
      "Acide chlorhydrique dilué et morceaux de craie"
    ],
    ordre: 12,
  },

  // =========================================================================
  // CLASSE DE TROISIEME (3e) — PROGRAMME DE PHYSIQUE (Total : 24 heures)
  // =========================================================================
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'P1 : Lentilles minces',
    duree_recommandee: '4h',
    objectifs: [
      "Donner les symboles des lentilles minces (convergente et divergente).",
      "Identifier une lentille.",
      "Donner les caractéristiques d'une lentille.",
      "Caractériser les images.",
      "Expliquer les différentes anomalies de la vision et leur correction.",
      "Utiliser une lentille convergente."
    ],
    contenus: [
      "Lentilles minces : lentilles convergentes, divergentes",
      "Axe optique, centre optique, foyer objet, foyer image, distance focale, vergence",
      "Objet réel, image réelle, image virtuelle, image droite, image renversée, grandissement",
      "Applications : anomalies de la vision et correction, loupe, objectif photographique, projecteur de diapositives"
    ],
    activites_preparatoires_suggerees: "Recherche sur l'œil, les anomalies visuelles et les verres correcteurs. Manipulation d'un kit ou banc d'optique : mise en évidence du foyer d'une lentille convergente, détermination expérimentale de la distance focale f et construction graphique de l'image A'B'.",
    materiel_suggere: [
      "Banc d'optique ou kit d'optique didactique",
      "Lentilles convergentes (+2 δ, +5 δ, +10 δ) et divergentes",
      "Source lumineuse avec objet transparent (lettre 'F')",
      "Écran blanc de projection"
    ],
    ordre: 13,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'P2 : Dispersion de la lumière',
    duree_recommandee: '1h',
    objectifs: [
      "Donner l'ordre de dispersion de la lumière.",
      "Expliquer la couleur des objets.",
      "Expliquer qualitativement la formation de l'arc-en-ciel."
    ],
    contenus: [
      "Phénomène de dispersion",
      "Spectre de la lumière : ordre de dispersion (rouge, orangé, jaune, vert, bleu, indigo, violet)",
      "Lumière monochromatique, lumière polychromatique",
      "Recomposition de la lumière blanche",
      "Applications et explication de l'arc-en-ciel"
    ],
    activites_preparatoires_suggerees: "Observation de la dispersion de la lumière blanche à travers un prisme en verre ou un récipient d'eau incliné. Observation de l'ordre spectral. Expérience de recomposition des couleurs par rotation rapide du disque de Newton.",
    materiel_suggere: [
      "Prisme optique en verre",
      "Source de lumière blanche à fente fine collimatée",
      "Disque de Newton à manivelle ou monté sur moteur",
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
      "Définir une force à partir de ses effets.",
      "Donner l'unité internationale d'intensité de force.",
      "Donner des exemples de forces et les classer.",
      "Représenter un vecteur force.",
      "Donner les caractéristiques de différentes forces (Poids, tension d'un fil, réaction d'un support).",
      "Donner des exemples de solides en équilibre sous l'action de deux forces.",
      "Appliquer les conditions nécessaires d'équilibre d'un solide soumis à deux forces.",
      "Énoncer le principe des actions réciproques."
    ],
    contenus: [
      "Forces : effets statiques, effets dynamiques, types de forces, exemples",
      "Caractéristiques d'une force, unité d'intensité de force (Newton N), représentation vectorielle",
      "Équilibre d'un solide soumis à l'action de deux forces : notion d'équilibre, conditions nécessaires d'équilibre, forces directement opposées (F1 + F2 = 0)",
      "Principe des actions réciproques"
    ],
    activites_preparatoires_suggerees: "Mesure de forces au dynamomètre. Représentation vectorielle à l'échelle. Réalisation expérimentale de l'équilibre d'un solide soumis à deux forces directement opposées (anneau léger tiré par deux dynamomètres, corps suspendu).",
    materiel_suggere: [
      "Dynamomètres étalonnés",
      "Anneaux légers, potences et fils de fixation",
      "Solides réguliers et masses suspendues",
      "Règles graduées pour la représentation vectorielle"
    ],
    ordre: 15,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'P4 : Travail et puissance mécaniques',
    duree_recommandee: '3h',
    objectifs: [
      "Donner la nature d'un travail (moteur, résistant ou nul).",
      "Donner les conditions de nullité du travail.",
      "Utiliser les expressions du travail et de la puissance mécanique.",
      "Donner l'ordre de grandeur de certaines puissances."
    ],
    contenus: [
      "Travail mécanique : travail moteur, travail résistant, travail nul, travail du poids, unité du SI : le joule (J)",
      "Puissance mécanique : unité du SI : le watt (W)",
      "Formules : W = F × L et P = W / t (et P = F × V)"
    ],
    activites_preparatoires_suggerees: "Enquête sur les situations où l'on parle de travail dans le langage courant. Calcul du travail d'une force constante colinéaire au déplacement, calcul du travail du poids d'un corps soulevé, et calcul de puissances développées dans des situations familières.",
    materiel_suggere: [
      "Chronomètre",
      "Mètre ruban",
      "Dynamomètres de traction",
      "Chariot sur plan de roulement"
    ],
    ordre: 16,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'P5 : Électrisation par frottement, le courant électrique',
    duree_recommandee: '4h',
    objectifs: [
      "Interpréter le phénomène d'électrisation.",
      "Citer les deux espèces d'électricité.",
      "Citer quelques conducteurs et isolants électriques.",
      "Interpréter la nature du courant électrique.",
      "Citer quelques électrolytes.",
      "Utiliser les relations : I = q / t et q = n × e."
    ],
    contenus: [
      "Électrisation par frottement : les deux types d'électricité (+ et -), atome, électrons, charges électriques",
      "Conducteurs et isolants électriques, conducteur métallique",
      "Le courant électrique : porteurs de charges, conducteur électrolytique, sens conventionnel du courant électrique, nature du courant électrique",
      "Intensité du courant électrique : relations I = q / t et q = n × e"
    ],
    activites_preparatoires_suggerees: "Expériences d'électrisation par frottement de bâtons d'ébonite, verre ou plastique sur chiffon de laine. Interaction entre corps électrisés (attraction, répulsion). Preuve expérimentale de la conduction dans les solutions aqueuses électrolytiques.",
    materiel_suggere: [
      "Bâtons d'ébonite, de verre, règles en plastique",
      "Tissus de laine et soie",
      "Pendule électrostatique ou électroscope",
      "Cuve à électrolyse avec électrodes et solution d'eau salée"
    ],
    ordre: 17,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'P6 : Résistance électrique',
    duree_recommandee: '6h',
    objectifs: [
      "Énoncer la loi d'Ohm pour un résistor.",
      "Tracer la courbe U = f(I) à partir d'un tableau de mesure.",
      "Déterminer la résistance d'un résistor.",
      "Utiliser la loi d'Ohm.",
      "Utiliser l'expression de la résistance d'un fil cylindrique homogène.",
      "Utiliser l'expression de la résistance équivalente pour deux résistors montés en série ou montés en parallèle (l'inverse de la résistance équivalente = somme des inverses)."
    ],
    contenus: [
      "Conducteur ohmique : résistor, loi d'Ohm, résistance, unité : Ohm (Ω), résistivité",
      "Résistance d'un fil cylindrique homogène de section constante : R = ρ × L / S",
      "Résistor équivalent : associations en série (Req = R1 + R2) et en dérivation (1/Req = 1/R1 + 1/R2)",
      "Rhéostat et potentiomètre"
    ],
    activites_preparatoires_suggerees: "Étude expérimentale du résistor : relevé point par point des couples (I, U) et tracé de la caractéristique linéaire U = f(I). Vérification expérimentale des lois d'association des résistors en série et en dérivation.",
    materiel_suggere: [
      "Résistors de valeurs variées (100 Ω, 220 Ω, 470 Ω)",
      "Alimentation réglable basse tension",
      "Multimètres numériques (voltmètre et ampèremètre)",
      "Rhéostat de laboratoire et fils de connexion"
    ],
    ordre: 18,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'P7 : Transformations d’énergies',
    duree_recommandee: '2h',
    objectifs: [
      "Citer des formes d'énergie.",
      "Utiliser les expressions de l'énergie cinétique, de l'énergie potentielle.",
      "Définir l'énergie mécanique.",
      "Utiliser les expressions de puissance et d'énergie électriques dissipées par effet Joule.",
      "Utiliser la loi de Joule.",
      "Prendre conscience de la pollution liée à certaines formes d'énergie."
    ],
    contenus: [
      "Énergie : notion d'énergie, unité du SI : le joule (J)",
      "Formes d'énergie : énergie électrique, énergie thermique ou calorifique, énergie lumineuse, énergie éolienne, énergie chimique, énergie potentielle (élastique et de pesanteur), énergie cinétique",
      "Transformation d'énergie : exemples, rendement d'une transformation d'énergie",
      "Énergie et puissance électriques : énergie électrique W = U × I × t, puissance électrique P = U × I, effet Joule, loi de Joule : W = R × I² × t"
    ],
    activites_preparatoires_suggerees: "Mise en évidence expérimentale des transformations d'énergie (électrique en mécanique par un moteur, électrique en thermique par une résistance chauffante). Calculs de consommation sur une facture Senelec et calcul de rendement.",
    materiel_suggere: [
      "Petit moteur électrique avec masse suspendue",
      "Résistance chauffante immergée ou thermoplongeur didactique",
      "Voltmètre, ampèremètre et chronomètre",
      "Factures réelles d'électricité anonymisées"
    ],
    ordre: 19,
  },

  // =========================================================================
  // CLASSE DE TROISIEME (3e) — PROGRAMME DE CHIMIE (Total : 18 heures)
  // =========================================================================
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'C1 : Solutions aqueuses',
    duree_recommandee: '6h',
    objectifs: [
      "Utiliser les expressions des concentrations molaire et massique volumiques.",
      "Préparer une solution de concentration donnée.",
      "Montrer l'importance des solutions dans la vie courante.",
      "Utiliser rationnellement les produits dans la préparation des solutions.",
      "Respecter les consignes de sécurité en manipulant certains produits."
    ],
    contenus: [
      "Solution : solvant, soluté, solution saturée, solubilité",
      "Concentration molaire volumique : définition, formulation (C = n / V), unité (mol/L)",
      "Concentration massique : définition, formulation (Cm = m / V), unités (g/L)",
      "Relation : Cm = C × M",
      "Applications : dilutions et préparation de solutions"
    ],
    activites_preparatoires_suggerees: "Étude expérimentale de la solubilité du sel dans l'eau en fonction de la température. Préparation d'une solution par dissolution d'une masse pesée de soluté et par dilution avec choix de matériel adapté (pipette, fiole jaugée).",
    materiel_suggere: [
      "Fioles jaugées de 50 mL et 100 mL",
      "Pipettes jaugées et pipettes graduées avec poires",
      "Balance de précision et spatules",
      "Sulfate de cuivre ou permanganate de potassium"
    ],
    ordre: 20,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'C2 : Acides et bases',
    duree_recommandee: '4h',
    objectifs: [
      "Identifier le caractère acide, basique ou neutre d'une solution en utilisant le BBT.",
      "Mettre en évidence le caractère ionique des solutions d'acide et de bases (présence d'ions H+ dans les solutions d'acides et de HO- dans les solutions basiques).",
      "Écrire l'équation-bilan de la réaction entre l'acide chlorhydrique et la soude (écrire l'équation ionique d'interprétation).",
      "Utiliser la relation à l'équivalence : nA = nB.",
      "Prendre les précautions nécessaires pour la manipulation des acides.",
      "Montrer l'importance des acides et du dosage acido-basique dans la vie courante."
    ],
    contenus: [
      "Classification des solutions : solutions acides, solutions basiques, solution neutre, indicateur coloré (BBT, papier pH)",
      "Propriétés des acides et des bases : conductibilité électrique, action des acides sur le calcaire",
      "Réaction entre l'acide chlorhydrique et la soude : réaction exothermique, neutralisation, équation-bilan (H+ + HO- → H2O)",
      "Dosage colorimétrique : équivalence acido-basique, relation CA × VA = CB × VB"
    ],
    activites_preparatoires_suggerees: "Classification de solutions courantes au BBT et papier pH. Réalisation de la neutralisation acidobasique avec suivi thermométrique et changement de teinte de l'indicateur. Dosage colorimétrique guidé.",
    materiel_suggere: [
      "Burette graduée sur support",
      "Béchers et agitateurs magnétiques ou manuels",
      "Solutions d'acide chlorhydrique et d'hydroxyde de sodium de concentrations connues",
      "Indicateur coloré BBT (Bleu de Bromothymol)",
      "Gants et lunettes de protection"
    ],
    ordre: 21,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'C3 : Propriétés chimiques des métaux usuels',
    duree_recommandee: '4h',
    objectifs: [
      "Reconnaître un métal par son aspect physique.",
      "Comparer les propriétés physiques des métaux usuels.",
      "Écrire les équations-bilans des réactions (équations ioniques).",
      "Prendre conscience de l'intérêt de la protection des métaux.",
      "Choisir le métal le mieux adapté pour une utilisation donnée.",
      "Prendre les précautions nécessaires pour la manipulation des acides et l'utilisation du brûleur."
    ],
    contenus: [
      "Propriétés physiques des métaux usuels (Al, Zn, Fe, Pb, Cu) : couleur, densité, éclat",
      "Propriétés chimiques : oxydation à froid (formation de rouille sur le fer, alumine), oxydation à chaud",
      "Action des acides dilués à froid sur les métaux : acide chlorhydrique, acide sulfurique, dégagement de H2 et formation d'ions métalliques"
    ],
    activites_preparatoires_suggerees: "Observation d'échantillons métalliques neufs et corrodés. Réactions à chaud avec le brûleur. Attaque à froid de clous en fer, grenailles de zinc et tournures de cuivre par l'acide chlorhydrique avec test d'identification du gaz H2 à la flamme.",
    materiel_suggere: [
      "Échantillons de fer, cuivre, zinc, aluminium, plomb",
      "Tubes à essais et pinces en bois",
      "Solution d'acide chlorhydrique diluée",
      "Brûleur ou lampe à alcool, allumettes"
    ],
    ordre: 22,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'C4 : Les hydrocarbures',
    duree_recommandee: '4h',
    objectifs: [
      "Identifier la famille à laquelle appartient un hydrocarbure à partir de sa formule brute.",
      "Écrire l'équation-bilan de la combustion complète d'un hydrocarbure dans le dioxygène.",
      "Utiliser l'équation-bilan de la combustion complète d'un hydrocarbure dans le dioxygène.",
      "Prendre conscience de l'importance des hydrocarbures dans la vie courante.",
      "Prendre conscience des risques liés à l'utilisation domestique des hydrocarbures et de la pollution."
    ],
    contenus: [
      "Hydrocarbures : définition, familles et formules générales (alcanes CnH2n+2)",
      "Formules brutes de quelques hydrocarbures (méthane CH4, éthane C2H6, propane C3H8, butane C4H10)",
      "Combustion d'hydrocarbures dans le dioxygène : combustion complète, combustion incomplète",
      "Applications industrielles des hydrocarbures, hydrocarbures et environnement"
    ],
    activites_preparatoires_suggerees: "Observation et réglage de la flamme d'un brûleur ou réchaud à gaz butane (flamme bleue de combustion complète vs flamme jaune de combustion incomplète). Caractérisation de l'eau et du CO2 formés. Sensibilisation aux consignes de sécurité des bouteilles de gaz.",
    materiel_suggere: [
      "Brûleur à gaz avec virole réglable ou réchaud à gaz butane",
      "Bécher propre pour dépôt de buée",
      "Flacon et eau de chaux pour caractériser le CO2",
      "Modèles moléculaires des quatre premiers alcanes"
    ],
    ordre: 23,
  },

  // =========================================================================
  // PROGRAMME DE MATHEMATIQUES DU CYCLE MOYEN (4e et 3e)
  // =========================================================================
  {
    matiere: 'maths',
    classe: '3e',
    titre_chapitre: 'Théorème de Thalès dans le triangle',
    duree_recommandee: '6h',
    objectifs: [
      "Énoncer le théorème de Thalès dans une configuration triangulaire.",
      "Calculer une longueur inconnue en appliquant l'égalité des rapports.",
      "Énoncer et utiliser la réciproque du théorème de Thalès pour démontrer le parallélisme de deux droites."
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
      "Caractériser le triangle rectangle par son cercle circonscrit.",
      "Démontrer qu'un triangle inscrit dans un demi-cercle est rectangle.",
      "Appliquer la propriété de la médiane relative à l'hypoténuse."
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

const LOCAL_STORAGE_KEY = 'fastef_programme_chapitres_v3';

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
