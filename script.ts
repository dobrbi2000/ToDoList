const app = document.getElementById("app") as HTMLElement;

interface RequestParams {
  method: string | undefined;
  suffix: string | null;
  body?: Record<string, any>;
  credentials?: RequestCredentials;
}

interface UserData {
  [key: string]: string;
}

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

async function loadPage(pageName: string): Promise<string> {
  const result: Response = await fetch(`/pages/${pageName}.html`);
  if (!result.ok) {
    throw new Error(`Failed to load page: ${pageName}, status: ${result.status}`);
  }
  const text = await result.text();
  return text;
}

const pages = {
  todo: async () => {
    try {
      const text = await loadPage("todo");
      app.innerHTML = text;
      updateHistory("todo", "ToDo Page", "/todo");

      const inputBox = document.getElementById("input-box") as HTMLInputElement;
      const listContainer = document.getElementById("list-todo-app-container") as HTMLElement;

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
      updateHistory("signup", "SignUp Page", "/signup");
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
      updateHistory("signin", "SignIn Page", "/signin");
      loginUser();
      addClick(".signup-btn", pages.signup);
    } catch (error) {
      console.error("Error loading the signin page:", error);
      app.innerHTML = "<p>Error loading the signin page. Please try again later.</p>";
    }
  },
};

document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;
  if (path === "/todo") {
    pages.todo();
  } else if (path === "/signup") {
    pages.signup();
  } else if (path === "/signin") {
    pages.signin();
  } else {
    pages.signup();
  }
});

window.addEventListener("popstate", (event) => {
  if (event.state) {
    const page = event.state.page;
    if (page === "todo") {
      pages.todo();
    } else if (page === "signup") {
      pages.signup();
    } else if (page === "signin") {
      pages.signin();
    }
  } else {
    pages.signup();
  }
});

function createNewUser() {
  const form = document.getElementById("logonForm") as HTMLElement | null;
  if (form) {
    form.addEventListener("submit", async (event: Event) => {
      event.preventDefault();

      const userData: UserData = {};
      document.querySelectorAll<HTMLInputElement>("#logonForm input").forEach((input) => {
        userData[input.name] = input.value;
      });

      console.log("User information sending to API:", userData);

      try {
        const action = form.getAttribute("action");
        const method = form.getAttribute("method")?.toUpperCase();
        const result = await request({
          suffix: action,
          method: method,
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

function addClick(selector: string, action: () => void): void {
  const button = document.querySelector(selector);
  if (button) {
    button.addEventListener("click", action);
  } else {
    console.error(`Button with selector "${selector}" not found`);
  }
}

async function loginUser(): Promise<void> {
  const form = document.getElementById("loginForm") as HTMLHtmlElement | null;
  if (form) {
    form.addEventListener("submit", async (event: Event) => {
      event.preventDefault();

      const userData: UserData = {};
      document.querySelectorAll<HTMLInputElement>("#loginForm input").forEach((input) => {
        userData[input.name] = input.value;
      });

      console.log("User information sending to API:", userData);
      try {
        const action = form.getAttribute("action");
        const method = form.getAttribute("method")?.toUpperCase();
        const result = await request({
          suffix: action,
          method: method,
          body: userData,
        });
        if (result) {
          pages.todo();
        } else {
          pages.signup();
        }
      } catch (error) {
        console.error("Error during login:", error);
        pages.signup();
      }
    });
  } else {
    console.error("loginForm not found");
  }
}

async function request({ method = "POST", suffix, body, credentials = "include" }: RequestParams): Promise<boolean> {
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

function addTask(inputBox: HTMLInputElement, listContainer: HTMLElement): void {
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

function handleEvent(event: Event, inputBox: HTMLInputElement, listContainer: HTMLElement) {
  const { type, target, key } = event as KeyboardEvent & MouseEvent;
  if (type === "keydown" && key === "Enter") {
    event.preventDefault();
    addTask(inputBox, listContainer);
  }
  if (type === "click" && target instanceof HTMLElement) {
    if (target.tagName === "LI") {
      target.classList.toggle("checked");
    } else if (target.tagName === "SPAN" && target.parentElement) {
      target.parentElement.remove();
    }
  }

  saveData(listContainer);
}

function setupEventListeners(inputBox: HTMLInputElement, listContainer: HTMLElement): void {
  const addButton = document.getElementById("add-task-btn");
  if (addButton instanceof HTMLButtonElement) {
    addButton.addEventListener("click", () => addTask(inputBox, listContainer));
  } else {
    console.error("Add button not found");
  }

  listContainer.addEventListener("click", (event: MouseEvent) => handleEvent(event, inputBox, listContainer));
  inputBox.addEventListener("keydown", (event: KeyboardEvent) => handleEvent(event, inputBox, listContainer));
}

function saveData(listContainer: HTMLElement): void {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTasks(listContainer: HTMLElement): void {
  const storeData = localStorage.getItem("data");
  listContainer.innerHTML = storeData !== null ? storeData : "";
}

function updateHistory(pageName: string, pageTitle: string, pagePath: string) {
  history.pushState({ page: pageName }, pageTitle, pagePath);
}
