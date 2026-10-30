// BONUS — Station connectée : simuler des capteurs qui répondent après un délai.
// Fiche : fiches/6-bonus-station.md · Vérifier : npm run test:station

// Renvoie une promesse qui se résout après capteur.delai millisecondes avec
// { parcelle, humidite }, ou qui est rejetée si le capteur n'est pas en ligne.
export function interrogerCapteur(capteur) {
  // On fabrique nous-mêmes la promesse : resolve = "réussi", reject = "échec".
  return new Promise((resolve, reject) => {
    // setTimeout attend capteur.delai millisecondes, puis exécute la fonction.
    setTimeout(() => {
      if (capteur.enLigne) {
        resolve({ parcelle: capteur.parcelle, humidite: capteur.humidite });
      } else {
        reject(new Error(`Capteur ${capteur.id} hors ligne`));
      }
    }, capteur.delai);
  });
}

// Même travail que interrogerCapteur, mais ne rejette jamais :
// en cas d'erreur, renvoie { parcelle, erreur } avec le message de l'erreur.
export async function interrogerSansPlanter(capteur) {
  try {
    // Le await est indispensable : sans lui, le catch ne verrait pas l'échec.
    return await interrogerCapteur(capteur);
  } catch (erreur) {
    return { parcelle: capteur.parcelle, erreur: erreur.message };
  }
}

// Interroge les capteurs L'UN APRÈS L'AUTRE (on attend chaque réponse).
export async function releverUnParUn(capteurs) {
  const resultats = [];
  for (const capteur of capteurs) {
    // await dans la boucle : on attend la réponse avant de passer au capteur suivant.
    resultats.push(await interrogerSansPlanter(capteur));
  }
  return resultats;
}

// Interroge tous les capteurs EN MÊME TEMPS. Les résultats gardent l'ordre des capteurs.
export async function releverEnParallele(capteurs) {
  // map lance toutes les demandes d'un coup ; Promise.all attend qu'elles soient toutes finies.
  return Promise.all(capteurs.map((capteur) => interrogerSansPlanter(capteur)));
}
