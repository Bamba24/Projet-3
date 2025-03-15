// Tableau des dépenses
let depenses = [];

// Import de la fonction mise à jour du table
import { mettreAJourSolde } from "./solde.mjs";

// Sélection des éléments du DOM
const formDepense = document.querySelector('.section_formulaire_depenses');
const containerSections = document.querySelector('.container_sections');

const ajoutDepense = document.getElementById('ajoutDepense');
const totalDepensesElement = document.getElementById("total_expense");

// Charger les données du localStorage si elles existent
document.addEventListener('DOMContentLoaded', () => {
    const storedDepenses = localStorage.getItem('depenses');
    if (storedDepenses) {
        depenses = JSON.parse(storedDepenses);
        genererTable("#tbody_depense"); // Re-générer le tableau avec les données stockées
        totalDepense(); // Mettre à jour le total
    }
});

// Afficher/Masquer formulaire de dépense
ajoutDepense.addEventListener('click', () => {
    formDepense.classList.toggle('hide');
    containerSections.classList.toggle('hide');
});

// Fonction d'écoute du formulaire (Ajout une seule fois)
ValiderFormulaireDepense("form_depense");

// Fonction de validation du formulaire de dépense
function ValiderFormulaireDepense(value) {
    const doneeForm = document.getElementById(value.toString());
    doneeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        validerDepense("titre_depense", "montant_depense");
        doneeForm.reset();
        mettreAJourSolde();
    });
}

// Fonction pour valider les dépenses
function validerDepense(titreValue, montantValue) {
    let titre = document.getElementById(titreValue.toString()).value.trim();
    let montant = parseFloat(document.getElementById(montantValue.toString()).value.trim());

    if (titre === '' || isNaN(montant) || montant <= 0) {
        alert('Veuillez remplir tous les champs correctement');
        return;
    }

    // Ajouter aux dépenses
    depenses.push({ titre, montant });

    // Sauvegarder les dépenses dans localStorage
    localStorage.setItem('depenses', JSON.stringify(depenses));

    // Masquer le formulaire et afficher la liste
    formDepense.classList.add('hide');
    containerSections.classList.remove('hide');

    // Générer le tableau et mettre à jour le total
    genererTable("#tbody_depense");
    totalDepense();
    messagePopup(titre, "success");
}

function messagePopup(messageDepense, type = "danger") {
    if (!type || type === "success") {
        const elementMessage = document.querySelector(".popup_content p");
        const elementParent = document.querySelector('.popup_message');
        elementParent.classList.add("afficheMessage");
        elementMessage.textContent = `La depense ${messageDepense} a été ajouté avec succès`;
        elementMessage.classList.add("success");

        setTimeout(() => {
            elementParent.classList.remove("afficheMessage");
        }, 3000);
    } else {
        const elementMessage = document.querySelector(".popup_content p");
        const elementParent = document.querySelector('.popup_message');
        elementParent.classList.add("afficheMessage");
        elementMessage.textContent = `La depense ${messageDepense} a été supprimée avec succès`;
        elementMessage.classList.add("danger");

        setTimeout(() => {
            elementParent.classList.remove("afficheMessage");
        }, 3000);
    }
}

// Fonction pour générer le tableau des dépenses
function genererTable(valueElementParent) {
    const elementParent = document.querySelector(valueElementParent);
    elementParent.innerHTML = ''; // Vider le tableau avant de le regénérer

    depenses.forEach((depense, index) => {
        const newElement = document.createElement('tr');
        newElement.innerHTML = `
            <td>${depense.titre}</td>
            <td>${depense.montant} Fcfa</td>
            <td>
                <button class="delete_btn" data-index="${index}">Supprimer</button>
            </td>
        `;

        elementParent.appendChild(newElement);
    });

    // Ajouter les événements de suppression
    SuppressionDepense();
}

// Fonction pour calculer et afficher le total des dépenses
export function totalDepense() {
    const totalDepense = depenses.reduce((acc, dep) => acc + dep.montant, 0);
    totalDepensesElement.textContent = `${totalDepense}`;
    return totalDepense;
}

// Fonction pour ajouter les événements de suppression
function SuppressionDepense() {
    document.querySelectorAll('.delete_btn').forEach(btn => {
        btn.addEventListener('click', (event) => {

            const index = Number(event.target.dataset.index); // Convertir en nombre
            messagePopup(depenses[index].titre, "danger");
            depenses.splice(index, 1); // Supprimer l'élément du tableau

            localStorage.setItem('depenses', JSON.stringify(depenses)); // Mettre à jour le localStorage
            
            genererTable("#tbody_depense"); // Mettre à jour l'affichage
            totalDepense(); // Mettre à jour le total après suppression
            mettreAJourSolde();
        });
    });
}
