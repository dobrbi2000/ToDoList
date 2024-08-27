const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-todo-app-container");
let isSignUpMode = true;
//auth

document.addEventListener("DOMContentLoaded", function () {
  checkUserAuth();
});

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
        showTodoApp();
      } else {
        showLogonContainer();
      }
    })
    .catch((error) => {
      console.error("Ошибка при проверке авторизации:", error);
      showLogonContainer();
    });
}

function showLogonContainer() {
  document.querySelector(".logon-container").style.display = "block";
  document.querySelector(".todo-app-container").style.display = "none";
}

function showTodoApp() {
  document.querySelector(".logon-container").style.display = "none";
  document.querySelector(".todo-app-container").style.display = "block";
}

document
  .getElementById("logonForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    if (isSignUpMode) {
      const userData = {
        first_name: document.querySelector("#firstName input").value,
        second_name: document.querySelector("#secondName input").value,
        login: document.querySelector("#login input").value,
        email: document.querySelector("#email input").value,
        password: document.querySelector("#password input").value,
        phone: document.querySelector("#phone input").value,
      };
      createUser(userData);
    } else {
      const loginData = {
        login: document.querySelector("#login input").value,
        password: document.querySelector("#password input").value,
      };
      loginUser(loginData);
    }
  });

function createUser(userData) {
  fetch("https://ya-praktikum.tech/api/v2/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Пользователь успешно создан");
        showTodoApp;
      } else {
        console.log("Ошибка при регистрации, статус: ", response.status);
      }
    })
    .catch((error) => {
      console.error("Ошибка при создании пользователя:", error);
    });
}

function loginUser(loginData) {
  fetch("https://ya-praktikum.tech/api/v2/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Вход выполнен успешно");
        showTodoApp();
      } else {
        console.log("Ошибка при входе, статус: ", response.status);
      }
    })
    .catch((error) => {
      console.error("Ошибка при входе:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const signinBtn = document.getElementById("signinBtn");
  const firstName = document.getElementById("firstName");
  const secondName = document.getElementById("secondName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");

  signinBtn.addEventListener("click", function () {
    isSignUpMode = false;
    firstName.style.maxHeight = "0";
    secondName.style.maxHeight = "0";
    email.style.maxHeight = "0";
    phone.style.maxHeight = "0";
    title.innerHTML = "Sign In";
    signupBtn.classList.add("disable");
    signinBtn.classList.remove("disable");
  });

  signupBtn.addEventListener("click", function () {
    isSignUpMode = true;
    firstName.style.maxHeight = "60px";
    secondName.style.maxHeight = "60px";
    email.style.maxHeight = "60px";
    phone.style.maxHeight = "60px";
    title.innerHTML = "Sign Up";
    signupBtn.classList.remove("disable");
    signinBtn.classList.add("disable");
  });
});

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

inputBox.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addTask();
  }
});

listContainer.addEventListener(
  "click",
  function (event) {
    if (event.target.tagName === "LI") {
      event.target.classList.toggle("checked");
      saveData();
    } else if (event.target.tagName === "SPAN") {
      event.target.parentElement.remove();
      saveData();
    }
  },
  false
);

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTasks() {
  listContainer.innerHTML = localStorage.getItem("data");
}
showTasks();
