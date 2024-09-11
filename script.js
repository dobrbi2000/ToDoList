const app = document.getElementById("app");
main();

async function main() {
  window.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await request({
        method: "GET",
        suffix: "auth/user",
      });
      if (response) {
        pages.todo();
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      pages.signup();
    }
  });
}

async function loadPage(pageName) {
  const result = await fetch(`./pages/${pageName}.html`);
  const text = await result.text();
  return text;
}

const pages = {
  todo: async () => {
    try {
      const text = await loadPage("todo");
      app.innerHTML = text;

      const inputBox = document.getElementById("input-box");
      const listContainer = document.getElementById("list-todo-app-container");

      setupEventListeners(inputBox, listContainer);
      showTasks(listContainer);
    } catch (error) {
      console.error("Error loading the todo page:", error);
      app.innerHTML = "<p>Error loading the todo page. Please try again later.</p>";
    }
  },
  signup: async () => {
    try {
      const text = await loadPage("signup");
      app.innerHTML = text;
      createNewUser();
      addClick(".signin-btn", pages.signin);
    } catch (error) {
      console.error("Error loading the signup page:", error);
      app.innerHTML = "<p>Error loading the signup page. Please try again later.</p>";
    }
  },
  signin: async () => {
    try {
      const text = await loadPage("signin");
      app.innerHTML = text;
      loginUser();
      addClick(".signup-btn", pages.signup);
    } catch (error) {
      console.error("Error loading the signin page:", error);
      app.innerHTML = "<p>Error loading the signin page. Please try again later.</p>";
    }
  },
};

function createNewUser() {
  const form = document.getElementById("logonForm");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const userData = {};
      document.querySelectorAll("#logonForm input").forEach((input) => {
        userData[input.name] = input.value;
      });

      console.log("User information sending to API:", userData);

      try {
        const result = await request({
          suffix: form.getAttribute("action"),
          method: form.getAttribute("method").toUpperCase(),
          body: userData,
        });
        if (result) {
          pages.todo();
        } else {
          console.error("Failed to create user");
        }
      } catch (error) {
        console.error("Request failed:", error);
      }
    });
  } else {
    console.error("logonForm not found");
  }
}

function addClick(selector, action) {
  const button = document.querySelector(selector);
  if (button) {
    button.addEventListener("click", action);
  } else {
    console.error(`Button with selector "${selector}" not found`);
  }
}

function loginUser() {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const userData = {};
      document.querySelectorAll("#loginForm input").forEach((input) => {
        userData[input.name] = input.value;
      });

      console.log("User information sending to API:", userData);
      try {
        const result = await request({
          suffix: form.getAttribute("action"),
          method: form.getAttribute("method").toUpperCase(),
          body: userData,
        });
        if (result) {
          pages.todo();
        } else {
          pages.signup();
        }
      } catch (error) {
        pages.signup();
      }
    });
  } else {
    //
    console.error("loginForm not found");
  }
}

async function request({ method = "POST", suffix, body, credentials = "include" }) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const url = `https://ya-praktikum.tech/api/v2/${suffix}`;
  console.log("URL API:", url);

  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(body),
      credentials: credentials,
    });
    console.log("Response from Request:", response);
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      throw new Error("Request failed with status " + response.status);
    }

    if (contentType && contentType.includes("application/json")) {
      await response.json();
    } else {
      await response.text();
    }
    return true;
  } catch (error) {
    console.error("Request failed:", error);
    return false;
  }
}

function addTask(inputBox, listContainer) {
  if (inputBox.value === "") {
    alert("You have to write something!");
  } else {
    let li = document.createElement("li");
    li.textContent = inputBox.value;
    listContainer.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
  }
  inputBox.value = "";
  saveData(listContainer);
}

function handleEvent(event, inputBox, listContainer) {
  const { type, target, key } = event;
  if (type === "keydown" && key === "Enter") {
    event.preventDefault();
    addTask(inputBox, listContainer);
  }
  if (type === "click" && target.tagName === "LI") {
    target.classList.toggle("checked");
  } else if (type === "click" && target.tagName === "SPAN") {
    target.parentElement.remove();
  }

  saveData(listContainer);
}

function setupEventListeners(inputBox, listContainer) {
  document.getElementById("add-task-btn").addEventListener("click", () => addTask(inputBox, listContainer));
  listContainer.addEventListener("click", (event) => handleEvent(event, inputBox, listContainer));
  inputBox.addEventListener("keydown", (event) => handleEvent(event, inputBox, listContainer));
}

function saveData(listContainer) {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTasks(listContainer) {
  listContainer.innerHTML = localStorage.getItem("data");
}
