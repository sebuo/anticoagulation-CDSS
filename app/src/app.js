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
    // FIX: Use 'is-active' to match the CSS class from index.html
    el.classList.toggle('is-active', idx === currentStep);
    // Use 'is-completed' for styling past steps for consistency
    el.classList.toggle('is-completed', idx < currentStep);
  });
}

function initStepSpecificLogic() {
  // Step-specific initialization hooks after template render + hydration
  if (currentStep === 0) {
    // Patient Information
    initPatientInformationStep(FORM);
  } else if (currentStep === 1) {
    // CHADS-VASc
    // Provide utilities as your existing init expects
    initChadsvascStep(FORM, state);
  } else if (currentStep === 2) {
    // Contraindications
    initContraindicationsStep(FORM);
  } else if (currentStep === 3) {
    // Interactions
    initInteractionsStep(FORM);
  } else if (currentStep === 4) {
    // Summary / Recommendation
    try {
      const recommendation = buildRecommendation(state);
      renderSummary(recommendation);
    } catch (e) {
      // Fail-safe: still render the section to avoid a blank page
      console.error('Summary rendering failed:', e);
    }
  }
}

function render() {
  // 1) Render template for the current step
  const tpl = TEMPLATES[currentStep];
  if (typeof tpl !== 'function') {
    throw new Error(`No template for step ${currentStep}`);
  }
  FORM.innerHTML = tpl();

  // 2) Hydrate with any stored values for this step
  const stepKey = stepKeys[currentStep];
  hydrateForm(FORM, state[stepKey] || {});

  // 3) Step-specific logic (event handlers, computed fields, etc.)
  initStepSpecificLogic();

  // 4) UI chrome
  renderStepper();
  updateButtons();
  updateProgress();
}

// --- NAVIGATION ------------------------------------------------------
function goPrev() {
  saveCurrentStep();
  currentStep = clampStep(currentStep - 1);
  render();
}

function goNext() {
  if (currentStep === 0) {
    const res = validatePatientInformationStep(FORM);
    if (!res.valid) return;           // do not advance if anything missing/invalid
    saveCurrentStep();
    currentStep = res.underage ? 4    // age < 18 => jump to step 4
        : clampStep(currentStep + 1);
    return render();
  }
  saveCurrentStep();
  currentStep = clampStep(currentStep + 1);
  render();
}

function submitWizard(e) {
  e?.preventDefault?.();

  if (currentStep === 0) {
    const { valid } = validatePatientInformationStep(FORM);
    if (!valid) return;
  }
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

// Handle CHADS-VASc logic to switch steps programmatically
// Your initChadsvascStep should dispatch this custom event with { detail: { score } }
FORM.addEventListener('chadsScoreCalculated', (e) => {
  const score = Number(e?.detail?.score);
  // Business rule: score < 2 jumps straight to recommendation; else continue workflow
  if (Number.isFinite(score)) {
    currentStep = score < 2 ? (totalSteps - 1) : 2; // 4 => recommendation, 2 => contraindications
    render();
  }
});

// --- BOOT ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  render();
});
