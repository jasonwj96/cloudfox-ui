(() => {
  const Apps = (() => {
    const htmlElements = {

    };

    const methods = {

    };

    const handlers = {
      methodA(event) {
        event.preventDefault();
        console.log("Calling methodA");
        console.log("Form processed.");
      },
      methodB(event) {
        event.preventDefault();
        console.log("Calling methodB");
        console.log("Form processed.");
      },
      methodC(event, response) {
        console.log("Calling methodC");
        console.log(response);
      }
    };

    return {
      handlers,
      init() {

      }
    }
  })();

  window.App = Apps; // Agregar globalmente

  Apps.init();
})();