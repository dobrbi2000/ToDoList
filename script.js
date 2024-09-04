let inputBox;
let listContainer;

document.addEventListener("DOMContentLoaded", () => {
  inputBox = document.getElementById("input-box");
  listContainer = document.getElementById("list-todo-app-container");

  checkUserAuth();
  createNewUser();
  loginUser();
  inputBox.addEventListener("keydown", handleEvent);
  listContainer.addEventListener("click", handleEvent);
  showTasks();
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

function request({ method = "POST", suffix, body, credentials }, callback) {
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
    credentials: credentials,
  })
    .then((response) => {
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          return response.json().then(() => callback(false));
        } else {
          return response.text().then(() => callback(false));
        }
      }
      if (contentType && contentType.includes("application/json")) {
        return response.json().then(() => callback(true));
      } else {
        return response.text().then(() => callback(true));
      }
    })
    .catch((error) => {
      console.error("Request failed:", error);
      callback(false);
    });
}

function checkUserAuth() {
  request(
    {
      method: "GET",
      suffix: "auth/user",
      credentials: "include",
    },
    (ok) => {
      if (ok) {
        pageTodo();
      } else {
        pageSignUp();
      }
    }
  );
}

// fetch("https://ya-praktikum.tech/api/v2/auth/user", {
//   method: "GET",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   credentials: "include",
// })
//   .then((response) => {
//     if (response.ok) {
//       pageTodo();
//     } else {
//       pageSignUp();
//     }
//   })
//   .catch((error) => {
//     console.error("Error checking authorization:", error);
//     pageSignUp();
//   });

function addTask() {
  if (inputBox.value === "") {
    alert("You have to write something!");
  } else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
  }
  inputBox.value = "";
  saveData();
}

function handleEvent(event) {
  const { type, target, key } = event;
  if (type === "keydown" && key === "Enter") {
    event.preventDefault();
    addTask();
  }
  if (type === "click") {
    if (target.tagName === "LI") {
      target.classList.toggle("checked");
    } else if (target.tagName === "SPAN") {
      target.parentElement.remove();
    }
  }
  saveData();
}

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTasks() {
  listContainer.innerHTML = localStorage.getItem("data");
}
