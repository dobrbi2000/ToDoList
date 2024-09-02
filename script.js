function createNewUser() {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("logonForm");
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const userData = new FormData();
      document.querySelectorAll("#logonForm input").forEach((input) => {
        userData.append(input.name, input.value);
      });
      request({
        suffix: form.getAttribute("action"),
        method: form.getAttribute("method").toUpperCase(),
        body: userData,
      });
    });
  });
}

function request({ method = "POST", ...parameter }) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const url = `https://ya-praktikum.tech/api/v2/${parameter["suffix"]}`;

  fetch(url, {
    method: method,
    headers: headers,
    body: JSON.stringify(Object.fromEntries(body)),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Request failed:", error);
      throw error;
    });
}
