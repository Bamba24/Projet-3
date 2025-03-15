
"use strict";

// Tableau des revenus
let revenus = [];

// Import de la fonction de mise à jour du solde
import { mettreAJourSolde } from "./solde.mjs";

// Sélection des éléments du DOM pour les revenus
const formRevenu = document.querySelector('.section_formulaire_revenus');
const containerSections = document.querySelector('.container_sections');

const ajoutRevenu = document.getElementById('ajoutRevenu');
const totalRevenusElement = document.getElementById("total_budget"); // Mise à jour du total budget

// Charger les données du localStorage si elles existent
document.addEventListener('DOMContentLoaded', () => {
  const storedRevenus = localStorage.getItem('revenus');
  if (storedRevenus) {
    revenus = JSON.parse(storedRevenus); // Charger les revenus depuis localStorage
    genererTableRevenus("#tbody_revenus"); // Re-générer le tableau avec les données stockées
    totalRevenus(); // Mettre à jour le total
  }
});

// Afficher/Masquer le formulaire de revenu
ajoutRevenu.addEventListener('click', () => {
  if (formRevenu.classList.contains('hide')) {
    formRevenu.classList.remove('hide')
    containerSections.classList.add('hide')
  } else {
    containerSections.classList.add('hide')
  }
});

// Ajouter l'écouteur d'événement au formulaire (ajout d'un revenu)
ValiderFormulaireRevenu("form_revenus");

// Fonction de validation du formulaire de revenu
function ValiderFormulaireRevenu(value) {
  const form = document.getElementById(value.toString());
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    validerRevenu("titre_revenu", "montant");
    form.reset();
    mettreAJourSolde()
  });
}

// Fonction pour valider et ajouter un revenu
function validerRevenu(titreValue, montantValue) {
  let titre = document.getElementById(titreValue.toString()).value.trim();
  let montant = parseFloat(document.getElementById(montantValue.toString()).value.trim());

  if (titre === '' || isNaN(montant) || montant <= 0) {
    alert('Veuillez entrer un titre et un montant valide.');
    return;
  }

  // Ajouter au tableau des revenus
  revenus.push({ titre, montant });

  // Sauvegarder les revenus dans le localStorage
  localStorage.setItem('revenus', JSON.stringify(revenus));

  // Masquer le formulaire et afficher la section principale
  formRevenu.classList.add('hide');
  containerSections.classList.remove('hide');

  // Générer le tableau et mettre à jour le total des revenus
  genererTableRevenus("#tbody_revenus");
  totalRevenus();
  messagePopup(titre, "success")
}

// Fonction pour générer le tableau des revenus
function genererTableRevenus(valueElementParent) {
  const elementParent = document.querySelector(valueElementParent);
  elementParent.innerHTML = ''; // Vider le tableau avant de le regénérer

  revenus.forEach((revenu, index) => {
    const newElement = document.createElement('tr');
    newElement.innerHTML = `
      <td>${revenu.titre}</td>
      <td>${revenu.montant} Fcfa</td>
      <td>
        <button class="delete_btn_revenu" data-index="${index}">Supprimer</button>
      </td>
    `;

    elementParent.appendChild(newElement);
  });

  // Ajouter les événements de suppression
  SuppressionRevenu();
}

// Fonction pour calculer et afficher le total des revenus
export function totalRevenus() {
  const total = revenus.reduce((acc, rev) => acc + rev.montant, 0);
  totalRevenusElement.textContent = `${total} `;
  return total
}

// Fonction pour ajouter les événements de suppression
function SuppressionRevenu() {
  document.querySelectorAll('.delete_btn_revenu').forEach(btn => {
    btn.addEventListener('click', (event) => {
      const index = Number(event.target.dataset.index); // Convertir en nombre
      const revenuSupprime = revenus[index].titre; // Conserver le titre du revenu avant la suppression
      revenus.splice(index, 1); // Supprimer l'élément du tableau

      // Sauvegarder les revenus dans le localStorage après suppression
      localStorage.setItem('revenus', JSON.stringify(revenus));

      genererTableRevenus("#tbody_revenus"); // Mettre à jour l'affichage
      totalRevenus(); // Mettre à jour le total après suppression
      messagePopup(revenuSupprime, "danger"); // Utiliser le titre du revenu supprimé
      mettreAJourSolde(); // Mettre à jour le solde après suppression
    });
  });
}

// Fonction pour afficher le message popup
function messagePopup(messageRevenu, type = "danger") {
  if (!type || type === "success") {
    const elementMessage = document.querySelector(".popup_content p");
    const elementParent = document.querySelector('.popup_message');
    elementParent.classList.add("afficheMessage");
    elementMessage.textContent = `Le revenu ${messageRevenu} a été ajouté avec succès`;
    elementMessage.classList.add("success");

    setTimeout(() => {
      elementParent.classList.remove("afficheMessage");
    }, 3000);
  } else {
    const elementMessage = document.querySelector(".popup_content p");
    const elementParent = document.querySelector('.popup_message');
    elementParent.classList.add("afficheMessage");
    elementMessage.textContent = `Le revenu ${messageRevenu} a été supprimé avec succès`;
    elementMessage.classList.add("danger");

    setTimeout(() => {
      elementParent.classList.remove("afficheMessage");
    }, 3000);
  }
}
