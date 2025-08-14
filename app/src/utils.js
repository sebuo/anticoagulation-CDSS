/**
 * @file utils.js
 * This file contains utility functions that are used across the application.
 * These helpers perform common tasks such as sanitizing HTML, serializing form data into an object,
 * and populating a form with data from an object.
 */

/**
 * Escapes special HTML characters in a string to prevent XSS (Cross-Site Scripting) attacks.
 * If the input is null or undefined, it returns an empty string.
 * @param {string | null | undefined} str The string to escape.
 * @returns {string} The sanitized string, safe for insertion into HTML.
 */
export function escapeHtml(str){
  if(str == null) return '';
  return String(str)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#39;');
}

/**
 * Serializes all input fields in a form into a single JavaScript object.
 * It correctly handles text inputs, checkboxes, and number inputs.
 * @param {HTMLFormElement} formEl The form element to serialize.
 * @returns {object} An object where keys are the input names and values are their corresponding values.
 */
export function serializeForm(formEl){
  const fd = new FormData(formEl);
  const obj = {};

  // Convert FormData entries to a plain object.
  for(const [k, v] of fd.entries()){
    obj[k] = v;
  }

  // Explicitly handle checkboxes, as FormData only includes checked ones.
  // This ensures we have a `false` value for unchecked boxes.
  formEl.querySelectorAll('input[type="checkbox"][name]').forEach(cb => {
    obj[cb.name] = cb.checked;
  });

  // Convert numeric input values from strings to numbers.
  // If the value is not a valid number, it remains a string.
  formEl.querySelectorAll('input[type="number"][name]').forEach(inp => {
    const name = inp.name;
    if(obj[name] === '' || obj[name] == null) return;
    const num = Number(obj[name]);
    obj[name] = Number.isNaN(num) ? obj[name] : num;
  });

  return obj;
}

/**
 * Populates a form's input fields with data from a JavaScript object.
 * This is the inverse of `serializeForm`. It's used to restore user input
 * when navigating back and forth between steps.
 * @param {HTMLFormElement} formEl The form element to populate.
 * @param {object} data The data object to hydrate the form with.
 */
export function hydrateForm(formEl, data){
  Object.entries(data || {}).forEach(([k,v]) => {
    // Find the corresponding form element by its 'name' attribute.
    const el = formEl.querySelector(`[name="${CSS.escape(k)}"]`);
    if(!el) return; // Skip if no matching element is found.

    // Set the value based on the element type.
    if(el.type === 'checkbox'){
      el.checked = Boolean(v);
    } else {
      el.value = v;
    }
  });
}
