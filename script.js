// "use strict";
// var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
//     function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
//     return new (P || (P = Promise))(function (resolve, reject) {
//         function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
//         function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
//         function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
//         step((generator = generator.apply(thisArg, _arguments || [])).next());
//     });
// };
// const app = document.getElementById("app");
// window.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
//     try {
//         const response = yield request({
//             method: "GET",
//             suffix: "auth/user",
//         });
//         if (response) {
//             pages.todo();
//         }
//         else {
//             throw new Error("Authentication failed");
//         }
//     }
//     catch (error) {
//         pages.signup();
//     }
// }));
// function loadPage(pageName) {
//     return __awaiter(this, void 0, void 0, function* () {
//         const result = yield fetch(`/pages/${pageName}.html`);
//         if (!result.ok) {
//             throw new Error(`Failed to load page: ${pageName}, status: ${result.status}`);
//         }
//         const text = yield result.text();
//         return text;
//     });
// }
// const pages = {
//     todo: () => __awaiter(void 0, void 0, void 0, function* () {
//         try {
//             const text = yield loadPage("todo");
//             app.innerHTML = text;
//             updateHistory("todo", "ToDo Page", "/todo");
//             const inputBox = document.getElementById("input-box");
//             const listContainer = document.getElementById("list-todo-app-container");
//             setupEventListeners(inputBox, listContainer);
//             showTasks(listContainer);
//         }
//         catch (error) {
//             console.error("Error loading the todo page:", error);
//             app.innerHTML = "<p>Error loading the todo page. Please try again later.</p>";
//         }
//     }),
//     signup: () => __awaiter(void 0, void 0, void 0, function* () {
//         try {
//             const text = yield loadPage("signup");
//             app.innerHTML = text;
//             updateHistory("signup", "SignUp Page", "/signup");
//             createNewUser();
//             addClick(".signin-btn", pages.signin);
//         }
//         catch (error) {
//             console.error("Error loading the signup page:", error);
//             app.innerHTML = "<p>Error loading the signup page. Please try again later.</p>";
//         }
//     }),
//     signin: () => __awaiter(void 0, void 0, void 0, function* () {
//         try {
//             const text = yield loadPage("signin");
//             app.innerHTML = text;
//             updateHistory("signin", "SignIn Page", "/signin");
//             loginUser();
//             addClick(".signup-btn", pages.signup);
//         }
//         catch (error) {
//             console.error("Error loading the signin page:", error);
//             app.innerHTML = "<p>Error loading the signin page. Please try again later.</p>";
//         }
//     }),
// };
// document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
//     const path = window.location.pathname;
//     if (path === "/todo") {
//         pages.todo();
//     }
//     else if (path === "/signup") {
//         pages.signup();
//     }
//     else if (path === "/signin") {
//         pages.signin();
//     }
//     else {
//         pages.signup();
//     }
// }));
// window.addEventListener("popstate", (event) => {
//     if (event.state) {
//         const page = event.state.page;
//         if (page === "todo") {
//             pages.todo();
//         }
//         else if (page === "signup") {
//             pages.signup();
//         }
//         else if (page === "signin") {
//             pages.signin();
//         }
//     }
//     else {
//         pages.signup();
//     }
// });
// function createNewUser() {
//     const form = document.getElementById("logonForm");
//     if (form) {
//         form.addEventListener("submit", (event) => __awaiter(this, void 0, void 0, function* () {
//             var _a;
//             event.preventDefault();
//             const userData = {};
//             document.querySelectorAll("#logonForm input").forEach((input) => {
//                 userData[input.name] = input.value;
//             });
//             console.log("User information sending to API:", userData);
//             try {
//                 const action = form.getAttribute("action");
//                 const method = (_a = form.getAttribute("method")) === null || _a === void 0 ? void 0 : _a.toUpperCase();
//                 const result = yield request({
//                     suffix: action,
//                     method: method,
//                     body: userData,
//                 });
//                 if (result) {
//                     pages.todo();
//                 }
//                 else {
//                     console.error("Failed to create user");
//                 }
//             }
//             catch (error) {
//                 console.error("Request failed:", error);
//             }
//         }));
//     }
//     else {
//         console.error("logonForm not found");
//     }
// }
// function addClick(selector, action) {
//     const button = document.querySelector(selector);
//     if (button) {
//         button.addEventListener("click", action);
//     }
//     else {
//         console.error(`Button with selector "${selector}" not found`);
//     }
// }
// function loginUser() {
//     return __awaiter(this, void 0, void 0, function* () {
//         const form = document.getElementById("loginForm");
//         if (form) {
//             form.addEventListener("submit", (event) => __awaiter(this, void 0, void 0, function* () {
//                 var _a;
//                 event.preventDefault();
//                 const userData = {};
//                 document.querySelectorAll("#loginForm input").forEach((input) => {
//                     userData[input.name] = input.value;
//                 });
//                 console.log("User information sending to API:", userData);
//                 try {
//                     const action = form.getAttribute("action");
//                     const method = (_a = form.getAttribute("method")) === null || _a === void 0 ? void 0 : _a.toUpperCase();
//                     const result = yield request({
//                         suffix: action,
//                         method: method,
//                         body: userData,
//                     });
//                     if (result) {
//                         pages.todo();
//                     }
//                     else {
//                         pages.signup();
//                     }
//                 }
//                 catch (error) {
//                     console.error("Error during login:", error);
//                     pages.signup();
//                 }
//             }));
//         }
//         else {
//             console.error("loginForm not found");
//         }
//     });
// }
// function request(_a) {
//     return __awaiter(this, arguments, void 0, function* ({ method = "POST", suffix, body, credentials = "include" }) {
//         const headers = {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//         };
//         const url = `https://ya-praktikum.tech/api/v2/${suffix}`;
//         console.log("URL API:", url);
//         try {
//             const response = yield fetch(url, {
//                 method: method,
//                 headers: headers,
//                 body: JSON.stringify(body),
//                 credentials: credentials,
//             });
//             console.log("Response from Request:", response);
//             const contentType = response.headers.get("content-type");
//             if (!response.ok) {
//                 throw new Error("Request failed with status " + response.status);
//             }
//             if (contentType && contentType.includes("application/json")) {
//                 yield response.json();
//             }
//             else {
//                 yield response.text();
//             }
//             return true;
//         }
//         catch (error) {
//             console.error("Request failed:", error);
//             return false;
//         }
//     });
// }
// function addTask(inputBox, listContainer) {
//     if (inputBox.value === "") {
//         alert("You have to write something!");
//     }
//     else {
//         let li = document.createElement("li");
//         li.textContent = inputBox.value;
//         listContainer.appendChild(li);
//         let span = document.createElement("span");
//         span.innerHTML = "\u00d7";
//         li.appendChild(span);
//     }
//     inputBox.value = "";
//     saveData(listContainer);
// }
// function handleEvent(event, inputBox, listContainer) {
//     const { type, target, key } = event;
//     if (type === "keydown" && key === "Enter") {
//         event.preventDefault();
//         addTask(inputBox, listContainer);
//     }
//     if (type === "click" && target instanceof HTMLElement) {
//         if (target.tagName === "LI") {
//             target.classList.toggle("checked");
//         }
//         else if (target.tagName === "SPAN" && target.parentElement) {
//             target.parentElement.remove();
//         }
//     }
//     saveData(listContainer);
// }
// function setupEventListeners(inputBox, listContainer) {
//     const addButton = document.getElementById("add-task-btn");
//     if (addButton instanceof HTMLButtonElement) {
//         addButton.addEventListener("click", () => addTask(inputBox, listContainer));
//     }
//     else {
//         console.error("Add button not found");
//     }
//     listContainer.addEventListener("click", (event) => handleEvent(event, inputBox, listContainer));
//     inputBox.addEventListener("keydown", (event) => handleEvent(event, inputBox, listContainer));
// }
// function saveData(listContainer) {
//     localStorage.setItem("data", listContainer.innerHTML);
// }
// function showTasks(listContainer) {
//     const storeData = localStorage.getItem("data");
//     listContainer.innerHTML = storeData !== null ? storeData : "";
// }
// function updateHistory(pageName, pageTitle, pagePath) {
//     history.pushState({ page: pageName }, pageTitle, pagePath);
// }
