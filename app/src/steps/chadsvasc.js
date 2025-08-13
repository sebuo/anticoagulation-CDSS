/**
 * A helper function to determine the age group and corresponding CHADS-VASc points.
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
 * Initializes all info buttons within a given root element.
 * @param {HTMLElement} root - The container element for the step.
 */
function initializeInfoButtons(root) {
  const infoButtons = root.querySelectorAll('.info-btn[data-toggles]');

  const handleInfoButtonClick = (event, btn) => {
    event.stopPropagation();
    const boxId = btn.getAttribute('data-toggles');
    const box = root.querySelector(`#${boxId}`);
    if (!box) return;

    const isVisible = box.classList.contains('is-visible');

    root.querySelectorAll('.info-box.is-visible').forEach(openBox => {
      if (openBox !== box) {
        openBox.classList.remove('is-visible');
      }
    });

    box.classList.toggle('is-visible');
  };

  infoButtons.forEach(btn => {
    if (!btn.hasAttribute('data-listener-attached')) {
      btn.setAttribute('data-listener-attached', 'true');
      btn.addEventListener('click', (event) => handleInfoButtonClick(event, btn));
    }
  });

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
 * Calculates the CHADS-VASc score from the current application state.
 * @param {object} state - The global application state.
 * @returns {number} The calculated score.
 */
export function scoreChadsVascFromState(state){
  const cv = state.chadsvasc || {};
  let score = 0;
  score += Number(cv.agePoints || 0);
  if (cv.sex) {
    score += cv.sex === 'F' ? 1 : 0;
  }
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
  function computeChadsFromForm(){
    // Update state properties directly
    state.chadsvasc.sex = formEl.querySelector('input[name="sex"]:checked')?.id === 'female' ? 'F' : 'M';
    state.chadsvasc.chf = formEl.querySelector('#congestiveHF')?.checked || false;
    state.chadsvasc.hypertension = formEl.querySelector('#hypertension')?.checked || false;
    state.chadsvasc.diabetes = formEl.querySelector('#diabetes')?.checked || false;
    state.chadsvasc.stroke_or_tia = formEl.querySelector('#strokeTIA')?.checked || false;
    state.chadsvasc.vascular_disease = formEl.querySelector('#vascularDisease')?.checked || false;

    const score = scoreChadsVascFromState(state);
    state.chadsvasc.score = score;
    state.chadsvasc.derived_CHADSVASC_Score = score >= 2;

    const scoreEl = document.getElementById('scoreResult');
    if(scoreEl) scoreEl.textContent = String(score);
  }

  // --- INITIALIZATION LOGIC ---
  initializeInfoButtons(formEl);

  const patientAge = Number(state.patient?.age);
  if (isFinite(patientAge)) {
    const { group, points } = getAgeInfo(patientAge);
    state.chadsvasc.age_group = group;
    state.chadsvasc.agePoints = points;
    const displayContainer = formEl.querySelector('#age-group-display');
    if (displayContainer) {
      displayContainer.querySelectorAll('span').forEach(span => span.classList.remove('active'));
      const activeSpan = displayContainer.querySelector(`[data-age-group="${group}"]`);
      if (activeSpan) {
        activeSpan.classList.add('active');
      }
    }
  }

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

  formEl.addEventListener('change', computeChadsFromForm);

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
      formEl.dispatchEvent(new Event('change'));
    });
  }

  computeChadsFromForm();
}
