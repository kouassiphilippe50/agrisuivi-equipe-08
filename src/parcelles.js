// MEMBRE 1 Mon travail consiste à lister les parcelles, additionner leur surface,
// ne garder que celles d'une culture (ex. le cacao), faire une fiche complète d'une parcelle,humidité en pourcentage et température, interroger les capteurs.

// Renvoie d'une ligne de texte qui décrit la parcelle.

// Exemple : 'P01 | Awa Diallo | Soubré | cacao | 3 ha'

export function formaterParcelle(parcelle) {
  return `${parcelle.id} | ${parcelle.producteur} | ${parcelle.localite} | ${parcelle.culture} | ${parcelle.surface}  ha`;
}

// Renvoie la parcelle dont l'id est demandé, ou undefined si elle n'existe pas.
export function trouverParcelle(parcelles, id) {
  return parcelles.find((parcelle) => parcelle.id === id);
} 

// Renvoie un nouveau tableau avec seulement les parcelles de cette culture.
export function parcellesParCulture(parcelles, culture) {
  return parcelles.filter((parcelle) => parcelle.culture === culture);
}

// Renvoie la somme des surfaces (en hectares). Liste vide : 0.
export function surfaceTotale(parcelles) {
  return parcelles.reduce((total, parcelle) => total + parcelle.surface, 0);
}

// Renvoie un objet : pour chaque culture, le nombre de parcelles et leur surface.
export function resumeParCulture(parcelles) {
  const resume = {};

  for (const parcelle of parcelles) {
    if (resume[parcelle.culture] === undefined) {
      resume[parcelle.culture] = { nombre: 0, surface: 0 };
    }
    resume[parcelle.culture].nombre += 1;
    resume[parcelle.culture].surface += parcelle.surface;
  }

  return resume;
}