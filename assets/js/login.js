import { fetchAPI } from "./fetchAPI.js";

const form = document.getElementById("connex");
// "Ecoute" le submit du formulaire de connexion
form.addEventListener("submit", async (event) => {
     event.preventDefault();
     APIConnec(form);
});


/** Gère la connexion utilisateur, envoie un POST à l'API => token
 *  stocke token en localStorage
 * @param {HTMLFormElement} form 
 */
async function APIConnec(form) {
          
     // récupére la valeur l'input email et password
     const email = form.querySelector("#email").value;
     const password = form.querySelector("#password").value;
     
     console.log(`L'email est ${email} et le mot de passe est ${password}`);

     // Crée l'objet pour le post
     let objetLogin = {
          method: "POST",
          body: JSON.stringify({email, password}),
          headers: { "Content-Type": "application/json" }
          };
     
     console.log(objetLogin);
     
     try {
          // Poster à l'API et attendre la réponse
          let reponse = await fetchAPI("users/login", objetLogin);

          const token = reponse.token 
                         
          // Mettre en forme et stocker le token dans le sessionStorage
          localStorage.setItem("token", JSON.stringify(token));
          
          // retourner sur index.html
          window.location.href = "../../index.html";

     } catch(error) {
          alert("Il y a une erreur dans l'email ou le mot de passe : " + error);
     }
}