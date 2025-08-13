import { TEMPLATES } from './templates.js';
import { state, stepKeys } from './state.js';
import { serializeForm, hydrateForm } from './utils.js';
import { initChadsvascStep } from './steps/chadsvasc.js';
import { initContraindicationsStep } from './steps/contraindications.js';
import { initInteractionsStep } from './steps/interactions.js';
import { initPatientInformationStep, validatePatientInformationStep } from './steps/patientInformation.js';
import { buildRecommendation, renderSummary } from './recommendation.js';

// --- DOM -------------------------------------------------------------
const FORM = document.getElementById('questionary');
const BTN_PREV = document.getElementById('btnPrev');
const BTN_NEXT = document.getElementById('btnNext');
const BTN_SUBMIT = document.getElementById('btnSubmit');
const STEPPER = document.getElementById('stepper');
const PROGRESS = document.getElementById('progress-bar');

// --- STATE -----------------------------------------------------------
let currentStep = 0;
const totalSteps = Object.keys(TEMPLATES).length; // expected 5 (0..4)

// --- HELPERS ---------------------------------------------------------
function clampStep(n) {
  return Math.max(0, Math.min(n, totalSteps - 1));
}

function saveCurrentStep() {
  // Persist current step form values into shared state
  const key = stepKeys[currentStep];
  state[key] = serializeForm(FORM);
}

function updateButtons() {
  BTN_PREV.disabled = currentStep === 0;
  const onLast = currentStep === totalSteps - 1;

  BTN_NEXT.style.display = onLast ? 'none' : '';
  BTN_SUBMIT.style.display = onLast ? '' : 'none';
}

function updateProgress() {
  if (!PROGRESS) return;
  const pct = totalSteps > 1 ? Math.round((currentStep / (totalSteps - 1)) * 100) : 0;
  PROGRESS.style.width = `${pct}%`;
  PROGRESS.setAttribute('aria-valuenow', String(pct));
}

function renderStepper() {
  if (!STEPPER) return;
  const items = Array.from(STEPPER.querySelectorAll('[data-step]'));
  items.forEach((el) => {
    const idx = Number(el.getAttribute('data-step'));

    // More robustly handle classes: first remove all, then add the correct one.
    el.classList.remove('is-active', 'is-done');

    if (idx < currentStep) {
      // Use the correct class name for completed steps.
      el.classList.add('is-done');
    } else if (idx === currentStep) {
      el.classList.add('is-active');
    }
  });
}

function initStepSpecificLogic() {
  // Step-specific initialization hooks after template render + hydration
  if (currentStep === 0) {
    initPatientInformationStep(FORM);
  } else if (currentStep === 1) {
    // CHADS-VASc state is updated live by its own module.
    initChadsvascStep(FORM, state);
  } else if (currentStep === 2) {
    // FIX: Pass the state object to the function
    initContraindicationsStep(FORM, state);
  } else if (currentStep === 3) {
    // Proactively pass state here as well, as it will likely be needed.
    initInteractionsStep(FORM, state);
  } else if (currentStep === 4) {
    try {
      const recommendation = buildRecommendation(state);
      renderSummary(recommendation);
    } catch (e) {
      console.error('Summary rendering failed:', e);
    }
  }
}

function render() {
  const tpl = TEMPLATES[currentStep];
  if (typeof tpl !== 'function') {
    throw new Error(`No template for step ${currentStep}`);
  }
  FORM.innerHTML = tpl();

  // For all steps except CHADS-VASc, hydrate the form from the state.
  // CHADS-VASc handles its own state hydration.
  if (currentStep !== 1) {
    const stepKey = stepKeys[currentStep];
    hydrateForm(FORM, state[stepKey] || {});
  }

  initStepSpecificLogic();

  renderStepper();
  updateButtons();
  updateProgress();
}

// --- NAVIGATION ------------------------------------------------------
function goPrev() {
  currentStep = clampStep(currentStep - 1);
  render();
}

function goNext() {
  let canProceed = true;
  let nextStep = -1;

  if (currentStep === 0) {
    const res = validatePatientInformationStep(FORM);
    if (!res.valid) {
      canProceed = false;
    } else {
      saveCurrentStep();
      nextStep = res.underage ? (totalSteps - 1) : clampStep(currentStep + 1);
    }
  } else if (currentStep === 1) {
    if (!state.chadsvasc.sex) {
      canProceed = false;
      alert('Please select a sex before proceeding.');
    } else {
      const score = state.chadsvasc.score;
      nextStep = score < 2 ? (totalSteps - 1) : 2;
      // Log the navigation decision for debugging
      console.log(`[app.js] Navigating from CHADS-VASc. Score: ${score}, Next Step: ${nextStep}`);
    }
  } else {
    // For all other steps, just save and go to the next one.
    saveCurrentStep();
    nextStep = clampStep(currentStep + 1);
  }

  // If all checks passed, update the current step and render the new view.
  if (canProceed && nextStep !== -1) {
    currentStep = nextStep;
    render();
  }
}

function submitWizard(e) {
  e?.preventDefault?.();
  saveCurrentStep();
  currentStep = totalSteps - 1;
  render();
}


// --- EVENTS ----------------------------------------------------------
BTN_PREV?.addEventListener('click', (e) => {
  e.preventDefault();
  goPrev();
});

BTN_NEXT?.addEventListener('click', (e) => {
  e.preventDefault();
  goNext();
});

BTN_SUBMIT?.addEventListener('click', submitWizard);

// --- BOOT ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  render();
});
