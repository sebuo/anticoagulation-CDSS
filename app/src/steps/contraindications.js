/**
 * @file contraindications.js
 * This file contains the logic for the contraindications step of the wizard.
 * It is responsible for:
 * - Handling the logic for the "None of the above" checkbox.
 * - Showing or hiding fields based on previously entered patient data (e.g., sex).
 * - Reading the user's selections and storing them in the global state object.
 */

/**
 * Initializes the Contraindications step by setting up event listeners and dynamic UI logic.
 * @param {HTMLElement} formEl - The form element for this step.
 * @param {object} state - The global application state.
 */
export function initContraindicationsStep(formEl, state) {
  // --- HELPER FUNCTIONS ---
  // A shorthand function to get a form element by its 'name' attribute.
  const getEl = (name) => formEl.querySelector(`[name="${name}"]`);
  // A shorthand function to get the patient's sex from the global state.
  const getSex = () => state.chadsvasc?.sex || null;

  // --- UI LOGIC ---

  /**
   * Sets up the interactive logic for the "None of the above" checkbox.
   * If checked, it disables and unchecks all other contraindication options.
   */
  function setupNoneCheckboxLogic() {
    const noneCheckbox = getEl('ci_none');
    const otherCheckboxes = [
      'ci_active_bleeding',
      'ci_endocarditis',
      'ci_gi_ulcus_active',
      'ci_liver_failure_child_c_or_coagulopathy',
      'ci_pregnant_or_breastfeeding',
      'ci_drugs'
    ].map(getEl).filter(Boolean); // Get all other checkboxes that exist in the DOM.

    if (!noneCheckbox) return; // Exit if the "None" checkbox isn't found.

    // Add a listener to the "None" checkbox.
    noneCheckbox.addEventListener('change', () => {
      const isChecked = noneCheckbox.checked;
      otherCheckboxes.forEach(cb => {
        if (isChecked) {
          cb.checked = false; // Uncheck the others if "None" is selected.
        }
        cb.disabled = isChecked; // Disable or enable them based on "None" state.
      });
    });

    // Add listeners to the other checkboxes.
    otherCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        // If any other box is checked, "None" must be unchecked.
        if (cb.checked) {
          noneCheckbox.checked = false;
        }
      });
    });
  }

  /**
   * Shows or hides the "Pregnant or breastfeeding" field based on the patient's sex,
   * which was recorded in a previous step.
   */
  function reflectSexVisibility() {
    const field = formEl.querySelector('#pregnantField'); // This selector targets the container.
    if (!field) return;

    const isFemale = getSex() === 'F';
    field.hidden = !isFemale; // Hide the field if the patient is not female.

    // If the patient is not female, also ensure the checkbox is unchecked and its value is cleared from the state.
    if (!isFemale) {
      const cb = getEl('ci_pregnant_or_breastfeeding');
      if (cb) cb.checked = false;
    }
  }

  /**
   * Reads the current state of all checkboxes in the form and saves the data
   * to the `state.contraindications` object. This function is called on any form change.
   */
  function computeAndStoreState() {
    // Helper to read a checkbox's checked state safely.
    const readCheckbox = (name) => !!getEl(name)?.checked;

    // Update the global state with the current values from the form.
    state.contraindications.ci_active_bleeding = readCheckbox('ci_active_bleeding');
    state.contraindications.ci_endocarditis = readCheckbox('ci_endocarditis');
    state.contraindications.ci_gi_ulcus_active = readCheckbox('ci_gi_ulcus_active');
    state.contraindications.ci_liver_failure_child_c_or_coagulopathy = readCheckbox('ci_liver_failure_child_c_or_coagulopathy');
    state.contraindications.ci_pregnant_or_breastfeeding = readCheckbox('ci_pregnant_or_breastfeeding');
    state.contraindications.ci_drugs = readCheckbox('ci_drugs');
    state.contraindications.ci_none = readCheckbox('ci_none');
  }

  // --- INITIALIZATION ---

  // Set up all the interactive logic for the step when it first loads.
  setupNoneCheckboxLogic();
  reflectSexVisibility();

  // Add a single event listener to the form that triggers on any change.
  formEl.addEventListener('change', computeAndStoreState);

  // Run an initial calculation to set the state when the step first loads,
  // in case the user is navigating back to this step and data already exists.
  computeAndStoreState();

  // Note: A cleanup function to remove the 'change' listener would be best practice,
  // but for this simple wizard, it's not strictly necessary.
}
