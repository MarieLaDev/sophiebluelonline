import { fetchAPI } from "./fetchAPI.js";

export const utils = {
    displayOneWork,
    setFiltersCatgories,
    createFiltersBtns,
    filterClick,
    editMode,
    showHideModal,
    deleteOneWork,
    displayModaleAdd,
    createWork,
};

/** Génère et affiche un élément work dans la galerie et la modale
 * @param {object} work 
 * @param {value} token 
 */
function displayOneWork(work, token) {
    // **** Construction galerie et  modale **** //
    const gallery = document.querySelector(".gallery");
    const modale = document.querySelector(".miniatures");
    
    // **** élément "work" de galerie **** //
    const galleryWork = document.createElement("figure");
    galleryWork.id = "p" + work.id;
    galleryWork.dataset.categoryid = work.category.id;
    if (work.category && work.category.name !== undefined) {
         galleryWork.dataset.categoryname = work.category.name;
    }
    // L'image avec son src et alt
    const imgWork = document.createElement("img");
    imgWork.src = work.imageUrl; 
    imgWork.alt = work.title; 
    // Titre
    const titleWork = document.createElement("figcaption");
    titleWork.textContent = work.title; 
    // Rattache les éléments du "work" dans gallery
    galleryWork.appendChild(imgWork);
    galleryWork.appendChild(titleWork);

    // **** élement work de la modale **** //
    // Conteneur img et trash modale
    const modaleWork = document.createElement("div");  
    modaleWork.id = "m" + work.id;
    // Clone de l'image pour la modale
    const imgModaleWork = imgWork.cloneNode();
    // Element trash
    const supprimeWork = document.createElement("i");
    supprimeWork.classList.add("fa-solid", "fa-trash", "trash-work");
    supprimeWork.id = "s" + work.id;

    // Rattache les éléments du "work" dans le bloc modale
    modaleWork.appendChild(imgModaleWork);
    modaleWork.appendChild(supprimeWork);
    
    // Ajouter les conteneurs à la galerie et à la modale
    gallery.appendChild(galleryWork);
    modale.appendChild(modaleWork);

    if (token) {
        deleteOneWork(token);
    }
}

/** Génération des catégories pour les filtres
 * Teste la catégorie d'un work pour l'ajouter au set
 * le set doit être déclaré avant de lancer la fonction
 * let addCategory = new Set(); 
 * let categories = [{"id" : 0, "name" : "Tous"},];
 * @param {object} work 
 * @param {object} addCategory (set) 
 * @param {object} categories (liste des catégories avec "Tous")
 * @returns {object} categories avec "Tous" pour les filtres
 */
function setFiltersCatgories(work, addCategory, categories) {
    let objetcategory = {
        id: work.category.id,
        name: work.category.name
    };
    // Transforme l'objet pour garantir l'unicité dans le set
    let newCateg = JSON.stringify(objetcategory);

    // Vérifie que l'objet newCateg n'est pas déjà présent dans le set
    if (objetcategory.name && !addCategory.has(newCateg)) {
        // créer l'ajout dans le set pour la prochaine boucle
        addCategory.add(newCateg);
    
        // Ajouter l'élément au tableau final
        categories.push(objetcategory); 
    }
    categories =  categories.sort((a, b) => a.id - b.id);
    return categories
}

/** Crée les boutons filtres en fonction des catégories projets
 * @param {object} categories 
 */
function createFiltersBtns(categories) {
    // **** Prépare le DOM filtres ****/
    // Récupère le h2 de portfolio => filtres après le h2
    const titreGalerie = portfolio.querySelector("#portfolio .titre-galerie");
    // Crée la div des boutons filtres
    const filterArea = document.createElement("div");
    filterArea.className = "btn-zone" 

    // Créer les boutons dans boucle for
    for (let category of categories) {
        // Crée l'élément <a> du filtre
        const newFilter = document.createElement("a");
        newFilter.className = "btn";
        newFilter.textContent = category.name;
        newFilter.dataset.categoryname = category.name;
        newFilter.dataset.categoryid = category.id;
        newFilter.id = "f" + category.id;
        // si l'id de la catégorie est 0, mettre le focus
        newFilter.classList.toggle("focus", category.id === 0);

        // Mettre le btn filtre dans le filterArea
        filterArea.appendChild(newFilter);
    }
    // Insére filterAera après le h2
    titreGalerie.insertAdjacentElement("afterend", filterArea);
}

/** Gère les focus filtres et l'affichage des projets correspondants
 * @param {object} works 
 */
function filterClick(works) {
    // Récupérer la zone-filtre et écouter la balise a qui a été cliquée
    const allFilters = document.querySelectorAll('.btn-zone a');

    for(let filter of allFilters) {
        filter.addEventListener('click', (event) => {
            event.preventDefault();
            
            // récupérer le bouton cliqué
            const clickedBtn = event.target;
            const filterClickId = filter.id;

            // Ajout ou retire le focus des boutons
            for (let filter of allFilters) {
                filter.classList.toggle("focus", filter === clickedBtn);   
            }
            console.log(clickedBtn.dataset.categoryid);
            
            for (let work of works) {
                let workDOM = document.getElementById("p" + work.id);
                
                // défini les conditions d'un projet visible ou caché
                const visibleWork = filterClickId === "f0" || filterClickId === "f" + work.category.id;
                
                // toggle(classe, true/false) fait add si true et remove si false
                workDOM.classList.toggle("hidden", !visibleWork);
            }
        });
    }
}

/** Gére le mode édition en fonction du token + Lance le fetch catégories
 * @param {string localStorage} token 
 * @returns {categsAPI}
 */
async function editMode(token = false) {

    const editDiv = document.getElementById("edit");
    const filtersZone = document.querySelector(".btn-zone");
    const editBtn = document.querySelector(".titre-galerie a");
    const log = document.getElementById("log");
    
    editDiv.classList.toggle("hidden", token === null);
    editDiv.classList.toggle("edit-bar", token !== null);
    filtersZone.classList.toggle("hidden", token !== null);
    editBtn.classList.toggle("hidden", token === null);

    if (token) {
        const categsAPI = await fetchAPI('categories');
        console.log(categsAPI);

        const categSelect = document.getElementById("categorie-ajout");

        // Créer les boutons dans boucle for
        for (let category of categsAPI) {
            // Crée l'élément <option>
            let newOption = document.createElement("option");
            newOption.textContent = category.name;
            newOption.dataset.value = category.name;
            newOption.dataset.categoryid = category.id;

            // Mettre l'option dans le select
            categSelect.appendChild(newOption);
        }
    }

    if (log && token) {
        log.textContent="logout";
        log.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.clear();
            window.location.reload();
        });
    }
}

/** Gère l'ouverture et la fermeture de la modale
 */
function showHideModal() {
    const editBtn = document.getElementById("edit-works");

    editBtn.addEventListener("click", (event) => {
        event.preventDefault();
        // changer les classes de la modale et l'arrière plan
        const modal = document.getElementById("modale")
        const background = document.getElementById("arriere")
        
        modal.classList.add("active");
        background.classList.add("arriere-plan");

        const closeBtn = document.getElementById("close-modale");

        // Remise à zéro de la modale
        const eraseModal = () => {
            event.preventDefault();
            // retirer l'arrière plan opacifié
            background.classList.remove("arriere-plan");
            modal.classList.remove("active");
            document.getElementById("form-ajout").reset();
            document.getElementById("zone-ajout-img").innerHTML = '';
            document.getElementById("defaut-input").classList.remove("hidden");
            document.getElementById("modale-galerie").classList.remove("hidden");
            document.getElementById("modale-ajout").classList.add("hidden");
            document.getElementById("retour-modale").classList.add("hidden");
            document.getElementById("valider-ajout").classList.add("avant-ok");
        }

        closeBtn.addEventListener("click", (event) => {
            eraseModal();
        });

        // fermeture si clic en dehors de la modale
        background.addEventListener("click", (event) => {
            eraseModal();

        });
    });
}

/** Cache un élément work dans la galerie et la modale
 * @param {string} id du work (au format s0)
 * @param {value} token
 */
async function deleteOneWork(token) {
    // Ecouteur des clics trashs
    let trashs = document.querySelectorAll(".trash-work");
    for (let del of trashs) {
         del.addEventListener("click", async (event) => {
            event.preventDefault();
            const id = del.id;
            // récupère l'id projet dans l'id trash
            let workTrashId = id.slice(1);

            document.getElementById("p" + workTrashId).classList.add("hidden");
            document.getElementById("m" + workTrashId).classList.add("hidden");

            workTrashId = parseInt(workTrashId, 10);

            // Créer l'objet pour l'API avec le token
            let objetAPI = { method: "DELETE", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json"}};

            console.log(objetAPI);

            // Envoyer le DELETE à l'API et attendre la réponse
            let reponse = await fetchAPI(`works/${workTrashId}`, objetAPI); 
            console.log("Projet " + workTrashId + " surppimé");
        });
    }
}

/** Affichage ou disparition de "l'ajout photo" dans la modale
 */
function displayModaleAdd() {
    
    const btnAjout = document.getElementById("ouvrir-ajout");
    const modaleGalerie = document.getElementById("modale-galerie");
    const modaleAjout = document.getElementById("modale-ajout");
    const btnRetour = document.getElementById("retour-modale");

    // Toggle affichage ou masque les modales
    const toggleModales = () => {
        modaleGalerie.classList.toggle("hidden");
        modaleAjout.classList.toggle("hidden");
        btnRetour.classList.toggle("hidden");
    };

    // Écouteur pour ouvrir la modale d'ajout
    btnAjout.addEventListener("click", (event) => {
        event.preventDefault();
        toggleModales();
    });

    // Écouteur pour fermer la modale d'ajout
    btnRetour.addEventListener("click", (event) => {
        event.preventDefault();
        toggleModales();
        resetForm();
    });
}

/** Gère l'ajout de projet (2 fonctions appelées showFile et processFormSubmit)
 * @param {value} token 
 */
function createWork(token) {
    const form = document.getElementById("form-ajout");
    const validBtn = document.getElementById("valider-ajout");
    const inputFile = document.getElementById("files");
    const defaultInput = document.getElementById("defaut-input");
    const workTitle = document.getElementById("titre-projet");
    const categoryAdd = document.getElementById("categorie-ajout");

    validBtn.classList.add("avant-ok");
    
    let fileOK = false

    form.addEventListener("change", (event) => {
        event.preventDefault();
        // Vérifie si tous les champs du formulaire sont remplis pour changer le bouton
        if (workTitle.value.trim() !== '' && categoryAdd.value !== '' && inputFile.files.length > 0 && fileOK) {
            validBtn.classList.remove("avant-ok");
        }
    });
    
    // Appelle showFile au changement du fichier
    inputFile.addEventListener("change", () => {
        fileOK = showFile(inputFile, defaultInput);
    });
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (fileOK) {
            if (validateFormFields()) {
                const work = await sendWorkToAPI(token);
                displayOneWork(work, token);
                resetForm();
            }
        } else { 
            alert("Vous devez choisir une image valide");
        }
    });
}

/*******************************************/
/*** Fonctions utilisées dans createWork ***/
/*******************************************/

/** Valide ou non le formulaire (tous les champs remplis)
 * @returns {boolean} Formulaire valide
 */
function validateFormFields() {
    const workTitle = document.getElementById("titre-projet").value.trim();
    const categoryAdd = document.getElementById("categorie-ajout").value;
    const inputFile = document.getElementById("files").files.length;

    if (workTitle === '' || categoryAdd === '' || inputFile === 0) {
        alert("Tous les champs doivent être remplis.");
        return false;
    }
    return true;
}

/** Envoie le nouveau projet à l'API
 * @param {value} token 
 * @returns {object work} work pour l'afficher avec displayOneWork(work, token)
 */
async function sendWorkToAPI(token) {
    const workTitle = document.getElementById("titre-projet").value.trim();
    const categoryAdd = document.getElementById("categorie-ajout");
    const inputFile = document.getElementById("files");

    const categoryId = categoryAdd.options[categoryAdd.selectedIndex].getAttribute("data-categoryid");

    const formData = new FormData();
    formData.append('title', workTitle);
    formData.append('category', parseInt(categoryId));
    formData.append('image', inputFile.files[0]);

    let addWork = {
        method: "POST",
        body: formData,
        headers: {"Authorization": `Bearer ${token}`}
    };
    
    let data = await fetchAPI("works", addWork);

    // Construit et retourne l'objet `work` pour displayOneWork(work, token)
    const work = {
        id: data.id,
        category: { id: data.categoryId },
        imageUrl: data.imageUrl,
        title: data.title
    };

    return work;
}

/** Remet le formulaire d'ajout à blanc
 * 
 */
function resetForm() {
    const defaultInput = document.getElementById("defaut-input");
    const validBtn = document.getElementById("valider-ajout");

    document.getElementById("form-ajout").reset();
    document.getElementById("zone-ajout-img").innerHTML = ''; 
    defaultInput.classList.remove('hidden'); 
    validBtn.classList.add("avant-ok");
}

/** Affiche l'image choisie dans la modale
 * @param {HTMLInputElement} inputFile 
 * @param {HTMLElement} defaultInput zone d'ajout fichier sans l'image de l'input file pour hidden
 * @returns {boolean} true si le fichier est valide, sinon false
 */
function showFile(inputFile, defaultInput, fileOK) {
    if (inputFile.files.length > 0) {
        let file = inputFile.files[0];
        
        if (file) {
            // Vérifiez la taille du fichier (4 Mo max)
            if (file.size > 4 * 1024 * 1024) {
                alert("Le fichier image ne doit pas dépasser 4 Mo.");
                return false;
            }
    
            // Vérifiez le format du fichier (.png ou .jpg)
            const allowedFormats = ['image/png', 'image/jpeg'];
            if (!allowedFormats.includes(file.type)) {
                alert("Le fichier doit être au format PNG ou JPG.");
                return false;
            }
            
        }

        const reader = new FileReader();
        
        reader.onload = () => {
            let showImg = document.getElementById("zone-ajout-img");
            showImg.innerHTML = '';
            
            const img = document.createElement("img");
            img.src = reader.result;
            img.classList.add("image-ajout");
            showImg.appendChild(img);
        };

        reader.onerror = () => console.log(reader.error);
        reader.readAsDataURL(file);
        // Masquer le message par défaut
        defaultInput.classList.add('hidden'); 

        return true;
    } else {
        // Réafficher le message par défaut
        defaultInput.classList.remove('hidden'); 
        return false;
    }
}