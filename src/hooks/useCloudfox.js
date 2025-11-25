
import { useEffect } from 'react';

// Utility functions from cloudfox-utils.js
export const getTimestamp = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

export const sanitize = (rawString) => {
  return rawString.replace(/(<([^>]+)>)/ig, "");
};

// App handlers from app 4.js
const App = {
  handlers: {
    methodA: (event) => {
      event.preventDefault();
      console.log("methodA triggered", event);
    },
    methodB: (event) => {
      event.preventDefault();
      console.log("methodB triggered", event);
    },
    methodC: (event, response) => {
      console.log("methodC triggered with response:", response);
    }
  },
  init: () => {
    // Initialization logic if needed
  }
};

// Core logic from cloudfox-core.js
const processRequest = (event) => {
  const target = event.target;
  const appName = target.getAttribute('data-cloudfox-app');
  const handlerName = target.getAttribute('data-cloudfox-handler');
  const callbackName = target.getAttribute('data-cloudfox-callback');
  const modelId = target.getAttribute('data-cloudfox-model-id');

  const inputs = target.querySelectorAll('[data-cloudfox-form] input, [data-cloudfox-form] textarea, [data-cloudfox-form] select');
  const formData = {};
  inputs.forEach(input => {
    formData[input.name] = sanitize(input.value);
  });

  const handler = App.handlers[handlerName];
  if (handler) {
    handler(event);
  }

  const callback = App.handlers[callbackName];
  if (callback) {
    callback(event, { modelId, formData });
  }
};

const initialize = () => {
  const elements = document.querySelectorAll('[data-cloudfox-app]');
  elements.forEach(el => {
    if (el.tagName === 'FORM') {
      el.addEventListener('submit', processRequest);
    } else {
      el.addEventListener('click', processRequest);
    }
  });
};

// React hook to initialize Cloudfox
export const useCloudfox = () => {
  useEffect(() => {
    console.info(`[${getTimestamp()}][INFO] Initializing Cloudfox service.`);
    App.init();
    initialize();
    console.info(`[${getTimestamp()}][INFO] Finished initializing Cloudfox service.`);
  }, []);
};
