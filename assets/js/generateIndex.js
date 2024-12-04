import { fetchAPI } from "./fetchAPI.js";
import { utils } from "./utils.js";

document.addEventListener('DOMContentLoaded', generateIndex);

/** Gestion de la page index (affichages projets, filtres, modale)
 */
export async function generateIndex() {
     // Lance GET dans l'API works await réponse => async fonction
     const works = await fetchAPI('works');

     let token;

     //**** Tableau des catégories ****/ & déclare le set() (entrée unique)
     let categories = [{"id" : 0, "name" : "Tous"},];
     let addCategory = new Set();

     for (let work of works) {
          utils.displayOneWork(work, token);
          utils.setFiltersCatgories(work, addCategory, categories);
     }
     console.log(categories);

     // Créer les filtres + écoute
     utils.createFiltersBtns(categories);
     utils.filterClick(works);

     // Récupérer le token dans local storage
     token = JSON.parse(localStorage.getItem("token"));

     // Gère le mode édition (présence token)
     utils.editMode(token);

     // Affiche ou masque la modale
     utils.showHideModal();
     
     // Ecouteur des trashs + API DELETE + hidden projet
     utils.deleteOneWork(token);

     // Affiche ou masque l'ajout projet dans la modale
     utils.displayModaleAdd();

     // Gère l'ajout d'un projet
     utils.createWork(token);
}
