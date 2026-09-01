import { createClient } from '@/lib/supabase/client';
import type { ProgrammeChapitre, Matiere, Classe } from '@/types/database';

// Chapitres témoins officiels conformes au programme sénégalais FASTEF
export const DEFAULT_CHAPITRES: Omit<ProgrammeChapitre, 'id' | 'created_at'>[] = [
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'Masse volumique et densité',
    duree_recommandee: '4h',
    objectifs: [
      "Définir la masse volumique d'un corps",
      "Déterminer expérimentalement la masse volumique d'un solide et d'un liquide",
      "Calculer la densité d'un corps par rapport à l'eau",
      "Prévoir la flottabilité d'un corps connaissant sa densité"
    ],
    contenus: [
      "Notion de masse volumique : formule ρ = m / V",
      "Unités usuelles et unités SI (kg/m³, g/cm³)",
      "Définition de la densité : d = ρ / ρ_eau",
      "Flottabilité et comparaison des densités relatives"
    ],
    activites_preparatoires_suggerees: "Pesée de volumes croissants d'eau douce et d'huile d'arachide locale à l'aide d'une éprouvette graduée pour comparer leurs masses.",
    materiel_suggere: [
      "Balance électronique ou de Roberval",
      "Éprouvettes graduées de 100 mL",
      "Solides réguliers et cailloux de granite",
      "Huile d'arachide locale",
      "Eau douce"
    ],
    ordre: 1,
  },
  {
    matiere: 'pc',
    classe: '3e',
    titre_chapitre: 'Solutions aqueuses : acides, bases et notion de pH',
    duree_recommandee: '6h',
    objectifs: [
      "Reconnaître le caractère acide, basique ou neutre d'une solution",
      "Mesurer le pH d'une solution aqueuse courante avec du papier pH",
      "Classer des solutions selon leur acidité ou basicité sur l'échelle de pH (0 à 14)",
      "Appliquer les règles de sécurité relatives à la manipulation des acides et des bases"
    ],
    contenus: [
      "Solutions acides, neutres et basiques",
      "Échelle de pH (valeurs de 0 à 14 à 25°C)",
      "Effet de la dilution sur le pH d'une solution",
      "Dangers et pictogrammes des produits corrosifs"
    ],
    activites_preparatoires_suggerees: "Test d'acidité avec du papier pH ou extrait naturel de fleurs d'hibiscus (Bissap local) sur du jus de citron, vinaigre, eau de javel et savon.",
    materiel_suggere: [
      "Papier indicateur de pH",
      "Tubes à essais et porte-tubes",
      "Jus de citron, vinaigre blanc, eau savonneuse",
      "Infusion concentrée de Bissap (indicateur naturel coloré)",
      "Gants et lunettes de protection"
    ],
    ordre: 2,
  },
  {
    matiere: 'pc',
    classe: '4e',
    titre_chapitre: 'Les combustions : combustion du carbone et du soufre',
    duree_recommandee: '4h',
    objectifs: [
      "Distinguer une combustion complète d'une combustion incomplète",
      "Identifier les réactifs et les produits lors de la combustion du carbone",
      "Mettre en évidence le dioxyde de carbone à l'eau de chaux",
      "Appliquer les règles de sécurité relatives aux fourneaux et au monoxyde de carbone"
    ],
    contenus: [
      "Combustion du carbone (charbon de bois)",
      "Mise en évidence expérimentale du CO2 par le trouble de l'eau de chaux",
      "Bilan textuel de la réaction : Carbone + Dioxygène → Dioxyde de carbone",
      "Dangers de l'asphyxie au monoxyde de carbone (CO) avec les fourneaux fermés"
    ],
    activites_preparatoires_suggerees: "Observation d'un morceau de charbon de bois incandescent dans l'air puis dans un flacon de dioxygène ; injection d'eau de chaux pour constater le blanchiment.",
    materiel_suggere: [
      "Morceaux de charbon de bois (fourneau traditionnel)",
      "Flacons en verre transparents avec bouchons",
      "Eau de chaux fraîchement préparée",
      "Pince métallique de laboratoire",
      "Allumettes ou briquet"
    ],
    ordre: 1,
  },
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
    activites_preparatoires_suggerees: "Mesure de la longueur de l'ombre d'un bâton vertical de 1 mètre et de l'ombre d'un poteau dans la cour du collège pour calculer sa hauteur réelle.",
    materiel_suggere: [
      "Bâton étalonné de 1 mètre",
      "Mètre ruban d'arpenteur",
      "Règle graduée, équerre et compas",
      "Cahier d'activités géométriques quadrillé"
    ],
    ordre: 1,
  },
  {
    matiere: 'maths',
    classe: '4e',
    titre_chapitre: 'Triangle rectangle et cercle circonscrit',
    duree_recommandee: '5h',
    objectifs: [
      "Caractériser le triangle rectangle par son cercle circonscrit",
      "Calculer la longueur de la médiane relative à l'hypoténuse",
      "Démontrer qu'un triangle est rectangle en utilisant le diamètre d'un cercle"
    ],
    contenus: [
      "Propriété du cercle circonscrit à un triangle rectangle (centre au milieu de l'hypoténuse)",
      "Théorème de la médiane issue du sommet de l'angle droit",
      "Réciproque : si un triangle est inscrit dans un cercle avec un diamètre pour côté, alors il est rectangle"
    ],
    activites_preparatoires_suggerees: "Tracé de plusieurs triangles inscrits dans un demi-cercle sur une feuille de papier millimétré, puis mesure de l'angle opposé au diamètre avec un rapporteur.",
    materiel_suggere: [
      "Compas de traçage de précision",
      "Rapporteur d'angle en degrés",
      "Règle graduée et équerre",
      "Feuilles de papier millimétré ou quadrillé"
    ],
    ordre: 1,
  }
];

const LOCAL_STORAGE_KEY = 'fastef_programme_chapitres_v1';

export class ProgrammeService {
  /**
   * Récupère tous les chapitres, avec filtrage optionnel par matière et classe.
   * Tente Supabase en premier, sinon lit le stockage local / les données par défaut.
   */
  static async getChapitres(matiere?: Matiere, classe?: Classe): Promise<ProgrammeChapitre[]> {
    const supabase = createClient();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
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
