// MEMBRE 2 : Mon travail est de  lire les relevés des capteurs et de décider quoi faire.
// Fiche : fiches/2-irrigation.md · Vérifier : npm run test:irrigation

// Renvoie seulement les relevés de la parcelle demandée.
// filter garde les relevés dont le champ "parcelle" est égal à l'id demandé.
export function relevesDeParcelle(releves, idParcelle) {
  return releves.filter((releve) => releve.parcelle === idParcelle);
}

// Renvoie la moyenne des humidités, arrondie à l'entier le plus proche.
// Liste vide : null (on ne peut pas calculer de moyenne).
export function moyenneHumidite(releves) {
  // On traite d'abord le cas sans relevé : on ne peut pas diviser par 0.
  if (releves.length === 0) {
    return null;
  }
  // Somme de toutes les humidités (reduce, comme pour la surface totale).
  const somme = releves.reduce((total, releve) => total + releve.humidite, 0);
  // Moyenne = somme divisée par le nombre de relevés ; Math.round arrondit..
  return Math.round(somme / releves.length);
}

// Renvoie 'INCONNU', 'ARROSER', 'DRAINER' ou 'OK'.

export function etatIrrigation(humidite, culture) {
  // Si Pas de mesure : on ne peut rien dire. Ce test vient EN PREMIER.
  if (humidite === null) {
    return 'INCONNU';
  }
  // Si Trop sec : strictement en dessous du minimum (on utilise < et pas <=).
  if (humidite < culture.humiditeMin) {
    return 'ARROSER';
  }
  // Si Trop humide : strictement au-dessus du maximum.
  if (humidite > culture.humiditeMax) {
    return 'DRAINER';
  }
  // Si Sinon on est dans la zone idéale, bornes comprises.
  return 'OK';
}

// Renvoie un tableau d'alertes, une par parcelle, dans le même ordre que parcelles.
// Chaque alerte : { id, producteur, culture, moyenne, etat }
// Chaque alerte : { id, producteur, culture, moyenne, etat }
export function alertesIrrigation(parcelles, releves, cultures) {
  // map fabrique une alerte pour chaque parcelle, dans le même ordre.
  return parcelles.map((parcelle) => {
    // On retrouve la fiche de la culture (elle contient les seuils d'humidité).
    const culture = cultures.find((element) => element.code === parcelle.culture);
    if (culture === undefined) {
      throw new Error(`Culture inconnue pour la parcelle ${parcelle.id} : ${parcelle.culture}`);
    }

    // On réutilise nos deux fonctions : relevés de la parcelle, puis leur moyenne.
    const moyenne = moyenneHumidite(relevesDeParcelle(releves, parcelle.id));

    return {
      id: parcelle.id,
      producteur: parcelle.producteur,
      culture: parcelle.culture,
      moyenne,
      etat: etatIrrigation(moyenne, culture),
    };
  });
}

