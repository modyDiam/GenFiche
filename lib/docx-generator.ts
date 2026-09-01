import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  Packer,
  ShadingType,
  convertInchesToTwip,
} from 'docx';
import type { FicheFASTEFContenu, ProgrammeChapitre, FicheParametres } from '@/types/database';

// Palette officielle FASTEF
const COLOR_NAVY = '0F2C59';
const COLOR_WHITE = 'FFFFFF';
const COLOR_GRAY_BG = 'F1F5F9';
const COLOR_AMBER_BG = 'FEF3C7';
const COLOR_AMBER_BORDER = 'D97706';
const COLOR_TEXT_DARK = '0F172A';
const COLOR_BORDER_GRAY = 'CBD5E1';

export async function generateFASTEFDocx(
  chapitre: ProgrammeChapitre,
  parametres: FicheParametres,
  contenu: FicheFASTEFContenu
): Promise<Buffer> {
  const children: (Paragraph | Table)[] = [];

  const matiereLabel =
    chapitre.matiere === 'pc' ? 'SCIENCES PHYSIQUES (PC)' : 'MATHÉMATIQUES';
  const classeLabel = chapitre.classe === '3e' ? '3ème' : '4ème';

  // 1. Bandeau Déontologique FASTEF obligatoire
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 200 },
      children: [
        new TextRun({
          text: '⚠️ FICHE DE PRÉPARATION PÉDAGOGIQUE — GABARIT FASTEF SÉNÉGAL',
          bold: true,
          size: 18,
          color: '92400E',
        }),
        new TextRun({
          text: ' (À relire et adapter impérativement avant utilisation en classe)',
          italics: true,
          size: 16,
          color: '92400E',
        }),
      ],
    })
  );

  // 2. Titre Principal en Bandeau Bleu Marine
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: COLOR_NAVY, type: ShadingType.CLEAR },
              margins: { top: 180, bottom: 180, left: 240, right: 240 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `FICHE DE LEÇON — DISCIPLINE : ${matiereLabel} (${classeLabel})`,
                      bold: true,
                      size: 24,
                      color: COLOR_WHITE,
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 80 },
                  children: [
                    new TextRun({
                      text: `CHAPITRE : ${chapitre.titre_chapitre.toUpperCase()}`,
                      bold: true,
                      size: 22,
                      color: 'FDE68A',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  children.push(new Paragraph({ spacing: { before: 150, after: 150 } }));

  // 3. Tableau d'identification de la séance
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Établissement :', bold: true, size: 18 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 75, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: parametres.etablissement, size: 18 })],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Professeur :', bold: true, size: 18 })],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: parametres.professeur_nom || 'Enseignant', size: 18 })],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Date & Durée :', bold: true, size: 18 })],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Date : ${parametres.date}  |  Durée : ${parametres.duree_reelle}  |  Effectif : ${parametres.effectif} élèves`,
                      size: 18,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  children.push(new Paragraph({ spacing: { before: 200, after: 100 } }));

  // Helper pour titre de section standardisé FASTEF
  const createSectionHeader = (title: string) => {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: COLOR_NAVY, type: ShadingType.CLEAR },
              margins: { top: 120, bottom: 120, left: 160, right: 160 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: title.toUpperCase(),
                      bold: true,
                      size: 20,
                      color: COLOR_WHITE,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  // Helper pour encadré grisé (Définition / Retenons)
  const createGrayBox = (title: string, content: string) => {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: COLOR_GRAY_BG, type: ShadingType.CLEAR },
              borders: {
                left: { style: BorderStyle.SINGLE, size: 30, color: COLOR_NAVY },
                top: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
              },
              margins: { top: 120, bottom: 120, left: 180, right: 180 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: `${title} : `, bold: true, size: 18, color: COLOR_NAVY }),
                    new TextRun({ text: content, size: 18, color: COLOR_TEXT_DARK }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  // Helper pour encadré d'activité d'apprentissage
  const createActivityBox = (title: string, content: string) => {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: COLOR_AMBER_BG, type: ShadingType.CLEAR },
              borders: {
                left: { style: BorderStyle.SINGLE, size: 30, color: COLOR_AMBER_BORDER },
                top: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER_GRAY },
                right: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER_GRAY },
                bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER_GRAY },
              },
              margins: { top: 120, bottom: 120, left: 180, right: 180 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: `${title} : `, bold: true, size: 18, color: '78350F' }),
                    new TextRun({ text: content, size: 18, color: COLOR_TEXT_DARK }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  // 4. FICHE D'IDENTIFICATION
  children.push(createSectionHeader("I. FICHE D'IDENTIFICATION PÉDAGOGIQUE"));
  children.push(new Paragraph({ spacing: { before: 100, after: 100 } }));

  // Prérequis
  children.push(
    new Paragraph({
      children: [new TextRun({ text: 'A. Prérequis nécessaires :', bold: true, size: 19 })],
    })
  );
  contenu.prerequis.forEach((p) => {
    children.push(
      new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: p, size: 18 })],
      })
    );
  });

  children.push(new Paragraph({ spacing: { before: 80 } }));

  // Matériel
  children.push(
    new Paragraph({
      children: [new TextRun({ text: 'B. Matériel et supports didactiques :', bold: true, size: 19 })],
    })
  );
  contenu.materiel.forEach((m) => {
    children.push(
      new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: m, size: 18 })],
      })
    );
  });

  children.push(new Paragraph({ spacing: { before: 80 } }));

  // Objectifs Spécifiques
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: 'C. Objectifs Spécifiques officiels (OS) :', bold: true, size: 19 }),
      ],
    })
  );
  contenu.objectifs_specifiques.forEach((os) => {
    children.push(
      new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: os, size: 18, bold: true, color: COLOR_NAVY })],
      })
    );
  });

  children.push(new Paragraph({ spacing: { before: 80 } }));

  // Concepts clés
  children.push(
    new Paragraph({
      children: [new TextRun({ text: 'D. Notions et concepts clés :', bold: true, size: 19 })],
    })
  );
  children.push(
    new Paragraph({
      children: [new TextRun({ text: contenu.concepts_cles.join('  •  '), size: 18, italics: true })],
    })
  );

  children.push(new Paragraph({ spacing: { before: 80 } }));

  // Plan du cours
  children.push(
    new Paragraph({
      children: [new TextRun({ text: 'E. Plan de la séance :', bold: true, size: 19 })],
    })
  );
  contenu.plan.forEach((partie, idx) => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: `  ${partie}`, size: 18, bold: true })],
      })
    );
  });

  children.push(new Paragraph({ spacing: { before: 200, after: 100 } }));

  // 5. DÉROULEMENT DU COURS
  children.push(createSectionHeader('II. DÉROULEMENT DU COURS (SÉQUENCEMENT)'));
  children.push(new Paragraph({ spacing: { before: 100, after: 100 } }));

  contenu.sections.forEach((sec, idx) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 150, after: 80 },
        children: [
          new TextRun({
            text: sec.titre,
            bold: true,
            size: 20,
            color: COLOR_NAVY,
          }),
        ],
      })
    );

    if (sec.activite) {
      children.push(createActivityBox("Activité d'apprentissage", sec.activite));
      children.push(new Paragraph({ spacing: { before: 60 } }));
    }

    if (sec.definition) {
      children.push(createGrayBox('Définition / Retenons', sec.definition));
      children.push(new Paragraph({ spacing: { before: 60 } }));
    }

    if (sec.texte) {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [new TextRun({ text: sec.texte, size: 18 })],
        })
      );
    }

    if (sec.application) {
      children.push(createActivityBox("Application immédiate / Exemple résolu", sec.application));
      children.push(new Paragraph({ spacing: { before: 60 } }));
    }

    if (sec.remarque) {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({ text: 'Remarque importante : ', bold: true, size: 18, color: 'B45309' }),
            new TextRun({ text: sec.remarque, size: 18, italics: true }),
          ],
        })
      );
    }

    if (sec.schema_montage) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({ text: `📐 Schéma du montage expérimental : ${sec.schema_montage.titre}`, bold: true, size: 18, color: '0F2C59' }),
          ],
        })
      );
      if (sec.schema_montage.legendes && sec.schema_montage.legendes.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 20, after: 60 },
            children: [
              new TextRun({ text: `Légendes à reproduire au tableau et par les élèves : ${sec.schema_montage.legendes.join(' • ')}`, italics: true, size: 17, color: '4B5563' }),
            ],
          })
        );
      }
    }

    if (sec.exemples && sec.exemples.length > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 40 },
          children: [
            new TextRun({ text: "Exemples d'application (Contexte Sénégal) :", bold: true, size: 18 }),
          ],
        })
      );
      sec.exemples.forEach((ex) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: ex, size: 18 })],
          })
        );
      });
    }

    // Tableau si présent
    if (sec.tableau && sec.tableau.colonnes && sec.tableau.lignes) {
      children.push(new Paragraph({ spacing: { before: 80 } }));
      const tableRows: TableRow[] = [];

      // En-tête de tableau
      tableRows.push(
        new TableRow({
          children: sec.tableau.colonnes.map((col) =>
            new TableCell({
              shading: { fill: COLOR_NAVY, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: col, bold: true, color: COLOR_WHITE, size: 17 })],
                }),
              ],
            })
          ),
        })
      );

      // Lignes de données
      sec.tableau.lignes.forEach((row, rIdx) => {
        tableRows.push(
          new TableRow({
            children: row.map((cell) =>
              new TableCell({
                shading: {
                  fill: rIdx % 2 === 0 ? COLOR_WHITE : COLOR_GRAY_BG,
                  type: ShadingType.CLEAR,
                },
                children: [new Paragraph({ children: [new TextRun({ text: cell, size: 17 })] })],
              })
            ),
          })
        );
      });

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows,
        })
      );
    }

    children.push(new Paragraph({ spacing: { before: 120 } }));
  });

  // 6. ÉVALUATION FORMATIVE
  children.push(createSectionHeader('III. ÉVALUATION FORMATIVE (EXERCICES)'));
  children.push(new Paragraph({ spacing: { before: 100, after: 100 } }));

  contenu.exercices.forEach((exo, i) => {
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 50 },
        children: [
          new TextRun({
            text: `${exo.titre} (${exo.type.toUpperCase()}) :`,
            bold: true,
            size: 19,
            color: COLOR_NAVY,
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        children: [new TextRun({ text: exo.enonce, size: 18 })],
      })
    );

    if (exo.elements && exo.elements.length > 0) {
      exo.elements.forEach((el) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: el, size: 18 })],
          })
        );
      });
    }

    children.push(new Paragraph({ spacing: { before: 80 } }));
  });

  // 7. DEVOIR À LA MAISON
  children.push(createSectionHeader('IV. DEVOIR À LA MAISON'));
  children.push(new Paragraph({ spacing: { before: 100, after: 80 } }));

  children.push(
    createGrayBox(
      contenu.devoir_maison.titre || 'Consignes du devoir individuel',
      contenu.devoir_maison.consignes
    )
  );

  // Construction du Document Word
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8),
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
