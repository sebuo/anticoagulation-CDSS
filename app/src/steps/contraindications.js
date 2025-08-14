/**
 * Initializes the Contraindications step.
 * @param {HTMLElement} formEl - The form element for this step.
 * @param {object} state - The global application state.
 */
export function initContraindicationsStep(formEl, state) {
  // --- HELPERS ---
  const getEl = (name) => formEl.querySelector(`[name="${name}"]`);
  const getSex = () => state.chadsvasc?.sex || null;

  // --- LOGIC ---

  /**
   * Sets up the logic for the "None of the above" checkbox.
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
    ].map(getEl).filter(Boolean); // Get all other checkboxes that exist in the DOM

    if (!noneCheckbox) return;

    // When "None of the above" is clicked...
    noneCheckbox.addEventListener('change', () => {
      const isChecked = noneCheckbox.checked;
      otherCheckboxes.forEach(cb => {
        if (isChecked) {
          cb.checked = false; // Uncheck the others
        }
        cb.disabled = isChecked; // Disable or enable them
      });
    });

    // When any other checkbox is clicked...
    otherCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        // If any other box is checked, "None" cannot be checked.
        if (cb.checked) {
          noneCheckbox.checked = false;
        }
      });
    });
  }

  /**
   * Shows or hides the "Pregnant or breastfeeding" field based on patient's sex.
   */
  function reflectSexVisibility() {
    const field = formEl.querySelector('#pregnantField'); // This uses ID as it's a container
    if (!field) return;

    const isFemale = getSex() === 'F';
    field.hidden = !isFemale;
    // If not female, ensure the checkbox is unchecked.
    if (!isFemale) {
      const cb = getEl('ci_pregnant_or_breastfeeding');
      if (cb) cb.checked = false;
    }
  }

  /**
   * Calculates and stores derived flags and the overall contraindication state.
   */
  function computeAndStoreState() {
    // Helper to read checkbox state using the correct selector
    const readCheckbox = (name) => !!getEl(name)?.checked;

    // Store simple checkbox values using the correct reader
    state.contraindications.ci_active_bleeding = readCheckbox('ci_active_bleeding');
    state.contraindications.ci_endocarditis = readCheckbox('ci_endocarditis');
    state.contraindications.ci_gi_ulcus_active = readCheckbox('ci_gi_ulcus_active');
    state.contraindications.ci_liver_failure_child_c_or_coagulopathy = readCheckbox('ci_liver_failure_child_c_or_coagulopathy');
    state.contraindications.ci_pregnant_or_breastfeeding = readCheckbox('ci_pregnant_or_breastfeeding');
    state.contraindications.ci_drugs = readCheckbox('ci_drugs');
    state.contraindications.ci_none = readCheckbox('ci_none');
  }

  // --- INITIALIZATION ---

  // Set up all the interactive logic for the step.
  setupNoneCheckboxLogic();
  reflectSexVisibility();

  // Listen for any change in the form to re-calculate the state.
  formEl.addEventListener('change', computeAndStoreState);

  // Run an initial calculation to set the state when the step first loads.
  computeAndStoreState();
}
