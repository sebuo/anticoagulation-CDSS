import {TEMPLATES} from './templates.js';
import {state, stepKeys} from './state.js';
import {serializeForm, hydrateForm} from './utils.js';
import {initChadsvascStep} from './steps/chadsvasc.js';
import {initContraindicationsStep} from './steps/contraindications.js';
import {initInteractionsStep} from './steps/interactions.js';
import {initPatientInformationStep, validatePatientInformationStep} from './steps/patientInformation.js';
// Correctly import both functions from the recommendation module
import {renderSummary, buildAndRenderRecommendation} from './recommendation.js';

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
let cleanupStep = () => {}; // Holds the cleanup function for the current step

// --- HELPERS ---------------------------------------------------------
function clampStep(n) {
    return Math.max(0, Math.min(n, totalSteps - 1));
}

function saveCurrentStep() {
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
            el.classList.add('is-done');
        } else if (idx === currentStep) {
            el.classList.add('is-active');
        }
    });
}

function initStepSpecificLogic() {
    if (currentStep === 0) {
        return initPatientInformationStep(FORM);
    } else if (currentStep === 1) {
        return initChadsvascStep(FORM, state);
    } else if (currentStep === 2) {
        return initContraindicationsStep(FORM, state);
    } else if (currentStep === 3) {
        return initInteractionsStep(FORM, state);
    } else if (currentStep === 4) {
        try {
            // On the final step, call both functions to render the complete summary and recommendation.
            renderSummary(state);
            buildAndRenderRecommendation(state);
        } catch (e) {
            console.error('Summary rendering failed:', e);
        }
    }
    return () => {}; // Default empty cleanup function
}

function render() {
    // Run cleanup from the previous step before doing anything else.
    if (typeof cleanupStep === 'function') {
        cleanupStep();
    }

    const tpl = TEMPLATES[currentStep];
    if (typeof tpl !== 'function') {
        throw new Error(`No template for step ${currentStep}`);
    }
    FORM.innerHTML = tpl();

    // For all steps except CHADS-VASc, hydrate the form from the state.
    if (currentStep !== 1) {
        const stepKey = stepKeys[currentStep];
        hydrateForm(FORM, state[stepKey] || {});
    }

    // Store the cleanup function for the step we are now initializing.
    cleanupStep = initStepSpecificLogic();

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

    // Step 0: Patient Information
    if (currentStep === 0) {
        const res = validatePatientInformationStep(FORM);
        if (!res.valid) {
            canProceed = false;
        } else {
            saveCurrentStep();
            state.contraindications.underage = res.underage;
            nextStep = res.underage ? (totalSteps - 1) : clampStep(currentStep + 1);
        }
        // Step 1: Indication (CHADS-VASc)
    } else if (currentStep === 1) {
        if (!state.chadsvasc.sex) {
            canProceed = false;
            alert('Please select a sex before proceeding.');
        } else {
            const score = state.chadsvasc.score;
            const gfr = state.patient.patient_gfr;

            if (score < 2){
                nextStep = (totalSteps - 1);
                state.contraindications.ci_renal_failure = false;
            } else if ((score >= 2) && (gfr < 15)) {
                state.contraindications.ci_renal_failure = true;
                nextStep = (totalSteps - 1);
            } else {
                nextStep = clampStep(currentStep + 1);
            }
        }
        // Step 2: Contraindications
    } else if (currentStep === 2) {
        saveCurrentStep();

        const hasAbsoluteContraindication = [
            state.contraindications.ci_active_bleeding,
            state.contraindications.ci_endocarditis,
            state.contraindications.ci_gi_ulcus_active,
            state.contraindications.ci_liver_failure_child_c_or_coagulopathy,
            state.contraindications.ci_pregnant_or_breastfeeding,
            state.contraindications.ci_drugs,
            state.contraindications.ci_renal_failure,
        ].some(Boolean);

        // Store the calculated value back into the state for consistency.
        state.contraindications.derived_absolute_contraindication = hasAbsoluteContraindication;

        // Now, check the freshly calculated value.
        if (hasAbsoluteContraindication) {
            nextStep = (totalSteps - 1);
        } else {
            nextStep = clampStep(currentStep + 1);
        }
        // Step 3: Interactions
    } else if (currentStep === 3) {
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
