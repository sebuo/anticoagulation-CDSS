/**
 * A helper function to determine the age group and corresponding CHADS-VASc points.
 * This replaces the need for external constants or utility functions.
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
 * Calculates the CHADS-VASc score from the current application state.
 * @param {object} state - The global application state.
 * @returns {number} The calculated score.
 */
export function scoreChadsVascFromState(state){
  const cv = state.chadsvasc || {};
  let score = 0;
  score += Number(cv.agePoints || 0);
  score += cv.sex === 'F' ? 1 : 0;
  score += cv.chf ? 1 : 0;
  score += cv.hypertension ? 1 : 0;
  score += cv.diabetes ? 1 : 0;
  score += cv.stroke_or_tia ? 2 : 0;
  score += cv.vascular_disease ? 1 : 0;
  return score;
}

/**
 * Initializes the CHADS-VASc step logic.
 * @param {HTMLElement} formEl - The form element for the step.
 * @param {object} state - The global application state.
 */
export function initChadsvascStep(formEl, state){
  /**
   * Reads form values (excluding age) and updates the state and UI.
   */
  function computeChadsFromForm(){
    const sexRadio = formEl.querySelector('input[name="sex"]:checked');
    let sex = null;
    if(sexRadio){ sex = sexRadio.id === 'female' ? 'F' : 'M'; }

    const chf = formEl.querySelector('#congestiveHF')?.checked || false;
    const hypertension = formEl.querySelector('#hypertension')?.checked || false;
    const diabetes = formEl.querySelector('#diabetes')?.checked || false;
    const stroke_or_tia = formEl.querySelector('#strokeTIA')?.checked || false;
    const vascular_disease = formEl.querySelector('#vascularDisease')?.checked || false;

    // Update state, preserving the age points that were set during initialization.
    state.chadsvasc = {
      ...state.chadsvasc,
      sex,
      chf,
      hypertension,
      diabetes,
      stroke_or_tia,
      vascular_disease
    };

    const score = scoreChadsVascFromState(state);
    state.chadsvasc.score = score;
    state.chadsvasc.derived_CHADSVASC_Score = score >= 2;

    // Update UI
    const scoreEl = document.getElementById('scoreResult');
    if(scoreEl) scoreEl.textContent = String(score);
  }

  // --- INITIALIZATION LOGIC ---

  // 1. Determine age group and points from patient data using the local helper function.
  const patientAge = Number(state.patient?.age);
  if (isFinite(patientAge)) {
    const { group, points } = getAgeInfo(patientAge);
    state.chadsvasc.age_group = group;
    state.chadsvasc.agePoints = points;

    // Highlight the correct age group in the display
    const displayContainer = formEl.querySelector('#age-group-display');
    if (displayContainer) {
      // Clear previous active states
      displayContainer.querySelectorAll('span').forEach(span => span.classList.remove('active'));
      // Set the new active state
      const activeSpan = displayContainer.querySelector(`[data-age-group="${group}"]`);
      if (activeSpan) {
        activeSpan.classList.add('active');
      }
    }
  }

  // 2. Initialize form fields from state (sex and checkboxes)
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

  // 3. Set up event listeners
  formEl.addEventListener('change', computeChadsFromForm);

  const btn = formEl.querySelector('#calculateChadsScore');
  if(btn){
    btn.addEventListener('click', () => {
      computeChadsFromForm();
      const score = state.chadsvasc.score;
      const evt = new CustomEvent('chadsScoreCalculated', { detail: { score } });
      formEl.dispatchEvent(evt);
    });
  }

  // 4. "None of the above" checkbox logic
  const noneCheckbox = formEl.querySelector('#None');
  const conditionCheckboxes = formEl.querySelectorAll('input[type="checkbox"]:not(#None)');
  if (noneCheckbox) {
    noneCheckbox.addEventListener('change', () => {
      const isChecked = noneCheckbox.checked;
      conditionCheckboxes.forEach(cb => {
        cb.disabled = isChecked;
        if (isChecked) {
          cb.checked = false;
        }
      });
      // Recalculate score when "None" is checked/unchecked
      computeChadsFromForm();
    });
  }

  // 5. Run initial computation to set the score when the step loads
  computeChadsFromForm();
}
