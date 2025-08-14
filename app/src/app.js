/**
 * @file app.js
 * This file is the main entry point and controller for a multi-step medical questionnaire wizard.
 * It manages the application's state, navigation between steps, DOM updates,
 * and the final rendering of recommendations based on user input.
 *
 * The wizard guides the user through several steps:
 * 1. Patient Information
 * 2. CHA₂DS₂-VASc Score Calculation
 * 3. Contraindications Check
 * 4. Drug Interactions Check
 * 5. Final Summary and Recommendation
 *
 * It dynamically renders HTML templates for each step, validates input,
 * and uses a state object to persist data across the different steps of the questionnaire.
 */

// --- MODULE IMPORTS --------------------------------------------------
// Import dependencies from other modules.
import {TEMPLATES} from './templates.js';
import {state, stepKeys} from './state.js';
import {serializeForm, hydrateForm} from './utils.js';
import {initChadsvascStep} from './steps/chadsvasc.js';
import {initContraindicationsStep} from './steps/contraindications.js';
import {initInteractionsStep} from './steps/interactions.js';
import {initPatientInformationStep, validatePatientInformationStep} from './steps/patientInformation.js';
import {renderSummary, buildAndRenderRecommendation} from './recommendation.js';

// --- DOM ELEMENT REFERENCES ------------------------------------------
// Cache references to frequently used DOM elements for performance.
const FORM = document.getElementById('questionary');
const BTN_PREV = document.getElementById('btnPrev');
const BTN_NEXT = document.getElementById('btnNext');
const BTN_SUBMIT = document.getElementById('btnSubmit');
const STEPPER = document.getElementById('stepper');
const PROGRESS = document.getElementById('progress-bar');

// --- APPLICATION STATE -----------------------------------------------
let currentStep = 0; // Zero-based index of the current step.
const totalSteps = Object.keys(TEMPLATES).length; // Total number of steps in the wizard.
let cleanupStep = () => {}; // A function to clean up event listeners or state from the previous step.

// --- HELPER FUNCTIONS ------------------------------------------------

/**
 * Ensures the step number stays within the valid range [0, totalSteps - 1].
 * @param {number} n - The step number to clamp.
 * @returns {number} The clamped step number.
 */
function clampStep(n) {
    return Math.max(0, Math.min(n, totalSteps - 1));
}

/**
 * Serializes the current form's data and saves it to the global state object.
 * The data is stored under a key corresponding to the current step.
 */
function saveCurrentStep() {
    const key = stepKeys[currentStep];
    state[key] = serializeForm(FORM);
}

/**
 * Updates the visibility and disabled state of the navigation buttons
 * based on the current step.
 */
function updateButtons() {
    BTN_PREV.disabled = currentStep === 0;
    const onLast = currentStep === totalSteps - 1;

    BTN_NEXT.style.display = onLast ? 'none' : '';
    BTN_SUBMIT.style.display = onLast ? '' : 'none';
}

/**
 * Updates the visual progress bar to reflect the user's progress through the wizard.
 */
function updateProgress() {
    if (!PROGRESS) return;
    const pct = totalSteps > 1 ? Math.round((currentStep / (totalSteps - 1)) * 100) : 0;
    PROGRESS.style.width = `${pct}%`;
    PROGRESS.setAttribute('aria-valuenow', String(pct));
}

/**
 * Updates the visual stepper component to highlight the current step.
 * Marks previous steps as 'done' and the current one as 'active'.
 */
function renderStepper() {
    if (!STEPPER) return;
    const items = Array.from(STEPPER.querySelectorAll('[data-step]'));
    items.forEach((el) => {
        const idx = Number(el.getAttribute('data-step'));
        el.classList.remove('is-active', 'is-done');
        if (idx < currentStep) {
            el.classList.add('is-done');
        } else if (idx === currentStep) {
            el.classList.add('is-active');
        }
    });
}

/**
 * Initializes any JavaScript logic specific to the current step.
 * For example, attaching event listeners or performing calculations.
 * @returns {Function} A cleanup function to be called when leaving the step.
 */
function initStepSpecificLogic() {
    // Each step can have its own initialization logic.
    // This function returns a "cleanup" function to remove listeners when the step is left.
    if (currentStep === 0) {
        return initPatientInformationStep(FORM);
    } else if (currentStep === 1) {
        return initChadsvascStep(FORM, state);
    } else if (currentStep === 2) {
        return initContraindicationsStep(FORM, state);
    } else if (currentStep === 3) {
        return initInteractionsStep(FORM, state);
    } else if (currentStep === 4) {
        // On the final summary step, render the results.
        try {
            renderSummary(state);
            buildAndRenderRecommendation(state);
        } catch (e) {
            console.error('Summary rendering failed:', e);
        }
    }
    return () => {}; // Return an empty cleanup function by default.
}

/**
 * Main render function for the application.
 * It orchestrates the entire process of displaying a step:
 * 1. Cleans up the previous step.
 * 2. Renders the new step's HTML template.
 * 3. Hydrates the form with existing data from the state.
 * 4. Initializes step-specific logic.
 * 5. Updates UI components like buttons, stepper, and progress bar.
 */
function render() {
    // Always run the cleanup function from the *previous* step first.
    if (typeof cleanupStep === 'function') {
        cleanupStep();
    }

    // Get the HTML template for the current step.
    const tpl = TEMPLATES[currentStep];
    if (typeof tpl !== 'function') {
        throw new Error(`No template for step ${currentStep}`);
    }
    FORM.innerHTML = tpl();

    // Restore form data from the state object, except for the CHADS-VASc step
    // which has its own complex state management.
    if (currentStep !== 1) {
        const stepKey = stepKeys[currentStep];
        hydrateForm(FORM, state[stepKey] || {});
    }

    // Initialize the new step's logic and get its cleanup function for later.
    cleanupStep = initStepSpecificLogic();

    // Update all UI elements to reflect the new state.
    renderStepper();
    updateButtons();
    updateProgress();
}

// --- NAVIGATION LOGIC ------------------------------------------------

/**
 * Navigates to the previous step.
 */
function goPrev() {
    currentStep = clampStep(currentStep - 1);
    render();
}

/**
 * Validates the current step and navigates to the next one.
 * This function contains the core branching logic of the wizard.
 * Based on user input, it can skip steps or jump directly to the summary.
 */
function goNext() {
    let canProceed = true;
    let nextStep = -1;

    // --- Step 0: Patient Information Validation ---
    if (currentStep === 0) {
        const res = validatePatientInformationStep(FORM);
        if (!res.valid) {
            canProceed = false; // Stay on the current step if validation fails.
        } else {
            saveCurrentStep();
            // Store derived values in the state.
            state.contraindications.underage = res.underage;
            state.patient.creatinin = res.creaNum;
            // If the patient is underage, skip to the final summary step.
            nextStep = res.underage ? (totalSteps - 1) : clampStep(currentStep + 1);
        }
        // --- Step 1: Indication (CHADS-VASc) Logic ---
    } else if (currentStep === 1) {
        if (!state.chadsvasc.sex) {
            canProceed = false;
            alert('Please select a sex before proceeding.');
        } else {
            const score = state.chadsvasc.score;
            const gfr = state.patient.patient_gfr;

            // If score is low, no DOAC is indicated, go to summary.
            if (score < 2){
                nextStep = (totalSteps - 1);
                state.contraindications.ci_renal_failure = false;
                // If score is high but GFR is very low, there's a contraindication, go to summary.
            } else if ((score >= 2) && (gfr < 15)) {
                state.contraindications.ci_renal_failure = true;
                nextStep = (totalSteps - 1);
                // Otherwise, proceed to the next step.
            } else {
                nextStep = clampStep(currentStep + 1);
            }
        }
        // --- Step 2: Contraindications Logic ---
    } else if (currentStep === 2) {
        saveCurrentStep();

        // Check for any absolute contraindications.
        const hasAbsoluteContraindication = [
            state.contraindications.ci_active_bleeding,
            state.contraindications.ci_endocarditis,
            state.contraindications.ci_gi_ulcus_active,
            state.contraindications.ci_liver_failure_child_c_or_coagulopathy,
            state.contraindications.ci_pregnant_or_breastfeeding,
            state.contraindications.ci_drugs,
            state.contraindications.ci_renal_failure,
        ].some(Boolean);

        state.contraindications.derived_absolute_contraindication = hasAbsoluteContraindication;

        // If an absolute contraindication exists, skip to the summary.
        if (hasAbsoluteContraindication) {
            nextStep = (totalSteps - 1);
        } else {
            nextStep = clampStep(currentStep + 1);
        }
        // --- Step 3: Interactions Logic ---
    } else if (currentStep === 3) {
        // This is the last step before the summary, so just proceed.
        nextStep = clampStep(currentStep + 1);
    }

    // If validation passed and a next step is determined, render it.
    if (canProceed && nextStep !== -1) {
        currentStep = nextStep;
        render();
    }
}

/**
 * Handles the final submission of the wizard.
 * Saves the current step's data and jumps to the summary page.
 * @param {Event} e - The form submission event.
 */
function submitWizard(e) {
    e?.preventDefault?.(); // Prevent default form submission.
    saveCurrentStep();
    currentStep = totalSteps - 1; // Go to the last step.
    render();
}

// --- EVENT LISTENERS -------------------------------------------------
// Attach event listeners to the navigation buttons.
BTN_PREV?.addEventListener('click', (e) => {
    e.preventDefault();
    goPrev();
});

BTN_NEXT?.addEventListener('click', (e) => {
    e.preventDefault();
    goNext();
});

BTN_SUBMIT?.addEventListener('click', submitWizard);

// --- APPLICATION BOOTSTRAP -------------------------------------------
// Initial render of the first step when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    render();
});
