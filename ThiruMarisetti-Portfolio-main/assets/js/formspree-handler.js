/**
 * Formspree Contact Form Handler
 * Handles form submission to Formspree service
 */
(function () {
  "use strict";

  let forms = document.querySelectorAll('.formspree-form');

  forms.forEach(function(form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');
      let loadingEl = thisForm.querySelector('.loading');
      let errorEl = thisForm.querySelector('.error-message');
      let successEl = thisForm.querySelector('.sent-message');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      // Show loading state
      loadingEl.style.display = 'block';
      errorEl.style.display = 'none';
      successEl.style.display = 'none';

      let formData = new FormData(thisForm);

      fetch(action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        loadingEl.style.display = 'none';
        
        if (response.ok) {
          successEl.style.display = 'block';
          thisForm.reset();
        } else {
          return response.json().then(data => {
            if (Object.hasOwnProperty.call(data, 'errors')) {
              throw new Error(data["errors"].map(error => error["message"]).join(", "));
            } else {
              throw new Error("Oops! There was a problem submitting your form");
            }
          });
        }
      })
      .catch(error => {
        displayError(thisForm, error.message);
      });
    });
  });

  function displayError(thisForm, error) {
    let loadingEl = thisForm.querySelector('.loading');
    let errorEl = thisForm.querySelector('.error-message');
    
    loadingEl.style.display = 'none';
    errorEl.innerHTML = error;
    errorEl.style.display = 'block';
  }

})();
