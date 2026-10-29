// MEMBRE 3 — Récoltes : calculer la production, le rendement et le revenu.
// Fiche : fiches/3-recoltes.md · Vérifier : npm run test:recoltes

// Renvoie le total des kilos récoltés sur une parcelle. Aucune récolte : 0.
export function totalRecolte(recoltes, idParcelle) {
  return recoltes
    .filter((recolte) => recolte.parcelle === idParcelle)
    .reduce((total, recolte) => total + recolte.kg, 0);
}

// Renvoie le rendement en kg par hectare, arrondi à l'entier le plus proche.
// Une surface nulle ou négative est une erreur : on lance une RangeError.

export function rendement(kg, surface) {
  // On vérifie d'abord la surface : on ne peut pas diviser par 0.
  if (surface <= 0) {
    throw new RangeError('La surface doit être supérieure à 0');
  }
  return Math.round(kg / surface);
}

// Renvoie le revenu estimé en FCFA.
export function revenu(kg, prixKg) {
  return kg * prixKg;
}

// Renvoie une ligne de bilan par parcelle, dans le même ordre que parcelles.
// Chaque ligne : { id, producteur, culture, kg, rendement, revenu }
export function bilanRecoltes(parcelles, recoltes, cultures) {
  return parcelles.map((parcelle) => {
    // La culture contient le prix au kilo (prixKg).
    const culture = cultures.find((element) => element.code === parcelle.culture);
    if (culture === undefined) {
      throw new Error(`Culture inconnue pour la parcelle ${parcelle.id} : ${parcelle.culture}`);
    }

    // On réutilise nos trois fonctions.
    const kg = totalRecolte(recoltes, parcelle.id);

    return {
      id: parcelle.id,
      producteur: parcelle.producteur,
      culture: parcelle.culture,
      kg,
      rendement: rendement(kg, parcelle.surface),
      revenu: revenu(kg, culture.prixKg),
    };
  });
}

// Renvoie une COPIE du bilan, triée du plus grand revenu au plus petit.
// Le tableau reçu ne doit pas changer d'ordre.
export function classerParRevenu(bilan) {
  // [...bilan] fait une copie : sort modifie le tableau sur lequel on l'appelle,
  // donc on trie la copie et l'original reste intact.
  // b.revenu - a.revenu : du plus grand au plus petit.
  return [...bilan].sort((a, b) => b.revenu - a.revenu);
}

