/**
 * @file chadsvasc.js
 * This file contains the logic for the CHA₂DS₂-VASc score calculation step of the wizard.
 * It handles:
 * - Calculating points based on the patient's age.
 * - Tallying the total score based on various clinical factors.
 * - Initializing the UI, including info buttons and form state.
 * - Updating the score in real-time as the user interacts with the form.
 */

/**
 * A helper function to determine the age group and corresponding CHA₂DS₂-VASc points.
 * @param {number} numericAge - The patient's age as a number.
 * @returns {{group: string, points: number}} An object with the group name and score points.
 */
function getAgeInfo(numericAge) {
  if (numericAge >= 75) {
    return { group: '>=75', points: 2 };
  }
  if (numericAge >= 65) {
    return { group: '65-74', points: 1 };
  }
  return { group: '<65', points: 0 };
}

/**
 * Initializes all info buttons within the step's container.
 * This allows users to click for more information about each scoring criterion.
 * It also handles closing any open info box when the user clicks elsewhere.
 * @param {HTMLElement} root - The container element for the step.
 */
function initializeInfoButtons(root) {
  const infoButtons = root.querySelectorAll('.info-btn[data-toggles]');

  const handleInfoButtonClick = (event, btn) => {
    event.stopPropagation(); // Prevent the document-level click listener from immediately closing the box.
    const boxId = btn.getAttribute('data-toggles');
    const box = root.querySelector(`#${boxId}`);
    if (!box) return;

    const isVisible = box.classList.contains('is-visible');

    // Hide any other info boxes that are currently open.
    root.querySelectorAll('.info-box.is-visible').forEach(openBox => {
      if (openBox !== box) {
        openBox.classList.remove('is-visible');
      }
    });

    // Toggle the visibility of the clicked info box.
    box.classList.toggle('is-visible');
  };

  infoButtons.forEach(btn => {
    // Add a marker attribute to prevent attaching the same listener multiple times.
    if (!btn.hasAttribute('data-listener-attached')) {
      btn.setAttribute('data-listener-attached', 'true');
      btn.addEventListener('click', (event) => handleInfoButtonClick(event, btn));
    }
  });

  // Add a global listener to the body to close info boxes when clicking outside.
  if (!document.body.hasAttribute('data-infobox-listener-set')) {
    document.body.setAttribute('data-infobox-listener-set', 'true');
    document.addEventListener('click', () => {
      document.querySelectorAll('.info-box.is-visible').forEach(box => {
        box.classList.remove('is-visible');
      });
    });
  }
}


/**
 * Calculates the total CHA₂DS₂-VASc score based on the data in the global state.
 * @param {object} state - The global application state.
 * @returns {number} The calculated score.
 */
export function scoreChadsVascFromState(state){
  const cv = state.chadsvasc || {};
  let score = 0;
  // Each factor adds points to the total score.
  score += Number(cv.agePoints || 0);
  if (cv.sex) {
    score += cv.sex === 'F' ? 1 : 0; // 1 point for female sex.
  }
  score += cv.chf ? 1 : 0;
  score += cv.hypertension ? 1 : 0;
  score += cv.diabetes ? 1 : 0;
  score += cv.stroke_or_tia ? 2 : 0; // 2 points for prior stroke/TIA.
  score += cv.vascular_disease ? 1 : 0;
  return score;
}

/**
 * Initializes the CHA₂DS₂-VASc step, setting up event listeners and initial state.
 * This is the main function exported by this module.
 * @param {HTMLElement} formEl - The form element for this step.
 * @param {object} state - The global application state.
 * @returns {Function} A cleanup function to remove event listeners when the user leaves the step.
 */
export function initChadsvascStep(formEl, state){
  /**
   * Reads values from the form, calculates the score, and updates the state and UI.
   * This function is called whenever a change is detected in the form.
   */
  function computeChadsFromForm(){
    // 1. Update the state directly from the form inputs.
    state.chadsvasc.sex = formEl.querySelector('input[name="sex"]:checked')?.id === 'female' ? 'F' : 'M';
    state.chadsvasc.chf = formEl.querySelector('#congestiveHF')?.checked || false;
    state.chadsvasc.hypertension = formEl.querySelector('#hypertension')?.checked || false;
    state.chadsvasc.diabetes = formEl.querySelector('#diabetes')?.checked || false;
    state.chadsvasc.stroke_or_tia = formEl.querySelector('#strokeTIA')?.checked || false;
    state.chadsvasc.vascular_disease = formEl.querySelector('#vascularDisease')?.checked || false;

    // 2. Recalculate the score and update the state.
    const score = scoreChadsVascFromState(state);
    state.chadsvasc.score = score;
    // A score of 2 or more generally indicates a need for anticoagulation.
    state.chadsvasc.derived_CHADSVASC_Score = score >= 2;

    // 3. Update the score displayed on the page.
    const scoreEl = document.getElementById('scoreResult');
    if(scoreEl) scoreEl.textContent = String(score);
  }

  // --- INITIALIZATION LOGIC ---

  // Set up the info buttons.
  initializeInfoButtons(formEl);

  // Determine age points from the patient data entered in the previous step.
  const patientAge = Number(state.patient?.age);
  if (isFinite(patientAge)) {
    const { group, points } = getAgeInfo(patientAge);
    state.chadsvasc.age_group = group;
    state.chadsvasc.agePoints = points;
    // Update the UI to show which age category the patient falls into.
    const displayContainer = formEl.querySelector('#age-group-display');
    if (displayContainer) {
      displayContainer.querySelectorAll('span').forEach(span => span.classList.remove('active'));
      const activeSpan = displayContainer.querySelector(`[data-age-group="${group}"]`);
      if (activeSpan) {
        activeSpan.classList.add('active');
      }
    }
  }

  // Hydrate the form with any existing data from the state.
  // This ensures that if the user navigates back to this step, their previous selections are restored.
  if(state.chadsvasc.sex){
    const id = state.chadsvasc.sex === 'M' ? 'male' : 'female';
    const el = formEl.querySelector(`#${id}`);
    if(el) el.checked = true;
  }
  formEl.querySelector('#congestiveHF') && (formEl.querySelector('#congestiveHF').checked = !!state.chadsvasc.chf);
  formEl.querySelector('#hypertension') && (formEl.querySelector('#hypertension').checked = !!state.chadsvasc.hypertension);
  formEl.querySelector('#diabetes') && (formEl.querySelector('#diabetes').checked = !!state.chadsvasc.diabetes);
  formEl.querySelector('#strokeTIA') && (formEl.querySelector('#strokeTIA').checked = !!state.chadsvasc.stroke_or_tia);
  formEl.querySelector('#vascularDisease') && (formEl.querySelector('#vascularDisease').checked = !!state.chadsvasc.vascular_disease);

  // Add the main event listener to recalculate the score on any form change.
  formEl.addEventListener('change', computeChadsFromForm);

  // Logic for the "None of the above" checkbox.
  const noneCheckbox = formEl.querySelector('#None');
  const conditionCheckboxes = formEl.querySelectorAll('input[type="checkbox"]:not(#None)');
  if (noneCheckbox) {
    noneCheckbox.addEventListener('change', () => {
      const isChecked = noneCheckbox.checked;
      // If "None" is checked, disable and uncheck all other condition checkboxes.
      conditionCheckboxes.forEach(cb => {
        cb.disabled = isChecked;
        if (isChecked) {
          cb.checked = false;
        }
      });
      // Manually trigger a change event to update the score.
      formEl.dispatchEvent(new Event('change'));
    });
  }

  // Perform an initial calculation when the step loads.
  computeChadsFromForm();

  // Return a cleanup function to be called when the user navigates away from this step.
  // This prevents memory leaks by removing the event listener.
  return () => {
    formEl.removeEventListener('change', computeChadsFromForm);
  }
}
