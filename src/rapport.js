// ÉQUIPE — Rapport : assembler le travail des quatre membres.
// Fiche : fiches/5-equipe-rapport.md · Vérifier : npm run test:rapport
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { surfaceTotale } from "./parcelles.js";
import { alertesIrrigation } from "./irrigation.js";
import { bilanRecoltes, classerParRevenu } from "./recoltes.js";

// Renvoie les id des alertes qui ont cet état, séparés par ', ', ou 'aucune'.
export function listerParEtat(alertes, etat) {
  // filter garde les alertes de cet état, map ne garde que leur id.
  const ids = alertes
    .filter((alerte) => alerte.etat === etat)
    .map((alerte) => alerte.id);

  // Aucune parcelle dans cet état : on écrit 'aucune'.
  if (ids.length === 0) {
    return "aucune";
  }
  // join colle les id avec une virgule et une espace : 'P02, P04'.
  return ids.join(", ");
}

// Renvoie le texte complet du rapport (voir fiches/5-equipe-rapport.md).
export function construireRapport(donnees, date) {
  const { parcelles, cultures, releves, recoltes } = donnees;

  // 1) On calcule toutes les valeurs d'abord, avec les fonctions de l'équipe.
  const alertes = alertesIrrigation(parcelles, releves, cultures);
  const bilan = bilanRecoltes(parcelles, recoltes, cultures);
  const classement = classerParRevenu(bilan);

  // Totaux de la production et du revenu (reduce : la calculatrice qui garde le total).
  const productionTotale = bilan.reduce((total, ligne) => total + ligne.kg, 0);
  const revenuTotal = bilan.reduce((total, ligne) => total + ligne.revenu, 0);

  // La meilleure parcelle est la première du classement (undefined s'il n'y a aucune parcelle).
  const meilleure = classement[0];
  const ligneMeilleure =
    meilleure === undefined
      ? "Meilleure parcelle : aucune"
      : `Meilleure parcelle : ${meilleure.id} (${meilleure.producteur}) avec ${meilleure.revenu} FCFA`;

  // 2) On écrit le rapport ligne par ligne. '' est une ligne vide.
  const lignes = [
    `=== RAPPORT AGRISUIVI DU ${date} ===`,
    `Parcelles suivies : ${parcelles.length}`,
    `Surface totale : ${surfaceTotale(parcelles)} ha`,
    "",
    "--- Irrigation ---",
    `À arroser : ${listerParEtat(alertes, "ARROSER")}`,
    `À drainer : ${listerParEtat(alertes, "DRAINER")}`,
    `Sans relevé : ${listerParEtat(alertes, "INCONNU")}`,
    "",
    "--- Récoltes ---",
    `Production totale : ${productionTotale} kg`,
    `Revenu estimé : ${revenuTotal} FCFA`,
    ligneMeilleure,
  ];

  // join colle les lignes avec des retours à la ligne ; le dernier "\n" termine la dernière ligne.
  return lignes.join("\n") + "\n";
}


// Écrit le texte dans le fichier demandé. Crée le dossier s'il n'existe pas.
export async function enregistrerRapport(chemin, texte) {
  // dirname donne le dossier du fichier ('sorties/rapport.txt' donne 'sorties').
  // recursive: true crée le dossier sans erreur s'il existe déjà.
  await mkdir(dirname(chemin), { recursive: true });
  await writeFile(chemin, texte, "utf8");
}

