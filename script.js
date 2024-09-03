document.addEventListener("DOMContentLoaded", () => {
  checkUserAuth();
  createNewUser();
  loginUser();
});

function hideAllPages(idToShow) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    if (page.matches(idToShow)) {
      page.classList.remove("hidden");
    } else {
      page.classList.add("hidden");
    }
  });
}
//registration
function pageSignUp() {
  hideAllPages(".page-signup");
}
//login
function pageSignIn() {
  hideAllPages(".page-signin");
}

function pageTodo() {
  hideAllPages(".page-todo");
}

function createNewUser() {
  const form = document.getElementById("logonForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const userData = {};
      document.querySelectorAll("#logonForm input").forEach((input) => {
        userData[input.name] = input.value;
      });

      console.log("User information sending to API:", userData);

      request(
        {
          suffix: form.getAttribute("action"),
          method: form.getAttribute("method").toUpperCase(),
          body: JSON.stringify(userData),
        },
        () => pageTodo()
      );
    });
  } else {
    console.error("logonForm not found");
  }
}

function loginUser() {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const userData = {};
      document.querySelectorAll("#loginForm input").forEach((input) => {
        userData[input.name] = input.value;
      });

      console.log("User information sending to API:", userData);

      request(
        {
          suffix: form.getAttribute("action"),
          method: form.getAttribute("method").toUpperCase(),
          body: JSON.stringify(userData),
        },
        () => pageTodo()
      );
    });
  } else {
    console.error("loginForm not found");
  }
}

function request({ method = "POST", suffix, body }, callback) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const url = `https://ya-praktikum.tech/api/v2/${suffix}`;

  console.log("URL API:", url);

  fetch(url, {
    method: method,
    headers: headers,
    body: body,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response from server:", data);
      if (callback) {
        callback();
      }
    })
    .catch((error) => {
      console.error("Request failed:", error);
      throw error;
    });
}

function checkUserAuth() {
  fetch("https://ya-praktikum.tech/api/v2/auth/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (response.ok) {
        pageTodo();
      } else {
        pageSignUp();
      }
    })
    .catch((error) => {
      console.error("Ошибка при проверке авторизации:", error);
      pageSignUp();
    });
}
