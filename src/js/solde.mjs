"use strict";

// Importer les fonctions de récupération des données
import { totalDepense } from './depense.mjs';
import { totalRevenus } from './revenu.mjs';

// Sélectionner l'élément HTML du solde
const totalSoldeElement = document.getElementById("total_balance");

// Charger le solde depuis le localStorage lorsque la page se charge
document.addEventListener('DOMContentLoaded', () => {
  const storedSolde = localStorage.getItem('solde');
  if (storedSolde) {
    totalSoldeElement.textContent = `${storedSolde}`; // Afficher le solde stocké
  } else {
    mettreAJourSolde(); // Calculer et afficher le solde si non stocké
  }
});

// Fonction pour calculer et afficher le solde
export function mettreAJourSolde() {
    const solde = totalRevenus() - totalDepense();
    totalSoldeElement.textContent = `${solde}`;

    // Sauvegarder le solde dans le localStorage
    localStorage.setItem('solde', solde);
    console.log(solde); // Afficher le solde dans la console
}
