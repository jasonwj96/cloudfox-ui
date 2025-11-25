import { sanitize, getTimestamp } from "./cloudfox-utils.js";

export const processRequest = (event) => {

  event.preventDefault();

  let app = window[document.querySelector("[data-cloudfox-app]").getAttribute("data-cloudfox-app")];

  if (!app) {
    console.error(`[${getTimestamp()}][ERROR] data-cloudfox-app element not found.`);
    return;
  }

  let target = event.target;

  let handler = sanitize(target.getAttribute("data-cloudfox-handler"));
  let callback = sanitize(target.getAttribute("data-cloudfox-callback"));
  let payload = {};

  let tagName = target.tagName.toLowerCase();

  if (tagName === "form") {
    if (handler) {
      app.handlers[handler](event);
    }

    let modelId = sanitize(event.target.getAttribute("data-cloudfox-model"));
    let inputs = target.querySelectorAll("[data-cloudfox-input]");

    inputs.forEach(input => {
      let inputName = sanitize(input.getAttribute("data-cloudfox-input"));
      payload[inputName] = input.value;
    });

    let requestData = {
      modelId,
      payload
    };

    let url = `${"http://localhost"}:${3001}/api/execute-model`;

    fetch(url, {
      method: "POST",
      body: JSON.stringify(requestData)
    });

  } else if (tagName === "button" || tagName === "div" || tagName === "span") {
    let parentContainer = target.closest("[data-cloudfox-model]");
    let modelId = sanitize(parentContainer.getAttribute("data-cloudfox-model"));
    let inputs = parentContainer.querySelectorAll("[data-cloudfox-input]");

    inputs.forEach(input => {
      let inputName = sanitize(input.getAttribute("data-cloudfox-input"));
      let tagName = input.tagName.toLowerCase();

      if (tagName === "input") {
        payload[inputName] = input.value;
      } else if (tagName === "span" || tagName === "div") {
        payload[inputName] = input.innerText;
      }
    });

    let requestData = {
      modelId,
      payload
    };

    console.log(requestData);
  }

  // Process the 
  if (callback) {
    app.handlers[callback](event, {
      output: {
        score: 1234
      }
    });
  }

};

export const initialize = () => {
  let apps = document.querySelectorAll("[data-cloudfox-app]");

  if (!apps || apps.length === 0) {
    console.error(`[${getTimestamp()}][ERROR] No elements implementing data-cloudfox-app found.`);
  }

  apps.forEach(app => {
    let forms = app.querySelectorAll("form[data-cloudfox-form]");
    let containers = app.querySelectorAll("[data-cloudfox-container]");

    if (forms.length > 0) {
      forms.forEach(form => {
        form.addEventListener("submit", processRequest);
      });
    } else {
      console.warn(`[${getTimestamp()}][WARNING] no elements implementing data-cloudfox-form found.`);
    }

    if (containers.length > 0) {
      containers.forEach(container => {
        let handlers = container.querySelectorAll("[data-cloudfox-handler]");

        handlers.forEach(handler => {
          handler.addEventListener("click", processRequest);
        });

      });
    } else {
      console.warn(`[${getTimestamp()}][WARNING] no elements implementing data-cloudfox-container found.`);
    }
  });
};