      // Define la función logout en el ámbito global
      function logout() {
        window.location.href = "login-guest.html";
      }

      document.addEventListener("DOMContentLoaded", () => {
        const thesisList = document.getElementById("thesis-list");
        const addThesisBtn = document.getElementById("add-thesis-btn");

        addThesisBtn.addEventListener("click", () => {
          const newThesis = document.createElement("div");
          newThesis.className = "thesis";
          newThesis.innerHTML = "<h3>Titulo de la tesis</h3>";
          thesisList.appendChild(newThesis);
        });
      });