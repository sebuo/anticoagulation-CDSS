/**
 * @file patientInformation.js
 * This file contains the logic for the first step of the wizard: Patient Information.
 * It is responsible for:
 * - Initializing UI components like info buttons.
 * - Validating all required form fields to ensure data integrity.
 * - Displaying user-friendly validation messages if input is missing or incorrect.
 * - Returning validation status and key derived values (e.g., underage status) to the main app controller.
 */

/**
 * Initializes interactive info buttons within the step's container.
 * It finds all buttons with a 'data-toggles' attribute and sets them
 * up to toggle the visibility of a corresponding info box.
 * It also handles closing any open info box when the user clicks elsewhere on the page.
 * @param {HTMLElement} root - The container element for the step, typically the form.
 */
export function initPatientInformationStep(root) {
    const infoButtons = root.querySelectorAll('.info-btn[data-toggles]');

    // A single, delegated event handler for all info buttons.
    const handleInfoButtonClick = (event, btn) => {
        event.stopPropagation(); // Prevent the document click listener from firing immediately.
        const boxId = btn.getAttribute('data-toggles');
        const box = root.querySelector(`#${boxId}`);
        if (!box) return;

        const isVisible = box.classList.contains('is-visible');

        // First, hide any other info boxes that are currently visible.
        root.querySelectorAll('.info-box.is-visible').forEach(openBox => {
            openBox.classList.remove('is-visible');
        });

        // If the clicked box was not already visible, show it.
        // This behavior ensures that clicking a new button closes the old one.
        if (!isVisible) {
            box.classList.add('is-visible');
        }
    };

    infoButtons.forEach(btn => {
        btn.addEventListener('click', (event) => handleInfoButtonClick(event, btn));
    });

    // Add a global click listener to the document to hide info boxes when clicking anywhere else.
    const handleOutsideClick = () => {
        root.querySelectorAll('.info-box.is-visible').forEach(box => {
            box.classList.remove('is-visible');
        });
    };

    document.addEventListener('click', handleOutsideClick);

    // In a more complex Single Page Application, it would be crucial to return
    // `handleOutsideClick` as part of a cleanup function to remove the document-level
    // event listener when the view is destroyed, preventing memory leaks.
}


/**
 * Creates and displays a temporary validation error message at the top of the form.
 * The message automatically disappears after a few seconds.
 * @param {HTMLElement} root - The form element where the message will be prepended.
 * @param {string} message - The validation message to display.
 */
function showValidationMessage(root, message) {
    // Remove any existing message to prevent duplicates.
    const existingMsg = root.querySelector('.validation-message');
    if (existingMsg) {
        existingMsg.remove();
    }

    const msgEl = document.createElement('div');
    msgEl.className = 'validation-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative my-4';
    msgEl.setAttribute('role', 'alert');
    msgEl.textContent = message;

    root.prepend(msgEl);

    // The message is automatically removed after 5 seconds.
    setTimeout(() => {
        msgEl.remove();
    }, 5000);
}

/**
 * Validates all the required fields in the patient information form.
 * It checks for presence, correct format, and valid ranges.
 * It also adds a visual 'invalid' class to fields that fail validation.
 * @param {HTMLElement} root - The form element to validate.
 * @returns {{valid: boolean, underage: boolean, creaNum: number}} An object containing the overall validity,
 * a flag for whether the patient is underage, and the numeric value for creatinine.
 */
export function validatePatientInformationStep(root) {
    // Clear any old validation messages before starting a new validation check.
    const existingMsg = root.querySelector('.validation-message');
    if (existingMsg) {
        existingMsg.remove();
    }

    // Helper for validating required text inputs.
    const reqText = (sel) => {
        const el = root.querySelector(sel);
        const ok = !!el && !!el.value.trim();
        el && el.classList.toggle('invalid', !ok);
        return ok;
    };

    // Helper for validating required numeric inputs within a min/max range.
    const reqNum = (sel, min, max) => {
        const el = root.querySelector(sel);
        if (!el) return false;
        const raw = el.value ?? '';
        const hasValue = raw.trim() !== '';
        const val = el.type === 'number' ? el.valueAsNumber : Number(raw);
        const ok = hasValue && Number.isFinite(val) && val >= min && val <= max;
        el.classList.toggle('invalid', !ok);
        return ok;
    };

    // Run all validation checks.
    const checks = [
        reqText('[name="first_name"]'),
        reqText('[name="last_name"]'),
        reqNum('[name="age"]', 0, 120),
        reqNum('[name="patient_weight"]', 0, 300),
        reqNum('[name="patient_kreatinin"]', 0, 1000),
        reqNum('[name="patient_gfr"]', 0, 120),
    ];
    const valid = checks.every(Boolean);

    // If any check fails, show a generic error message.
    if (!valid) {
        showValidationMessage(root, 'Please fill out all required fields correctly before proceeding.');
    }

    // Extract age to check if the patient is underage, which is a critical branching condition.
    const ageEl = root.querySelector('[name="age"]');
    const ageRaw = ageEl ? ageEl.value : '';
    const ageNum = ageEl && ageEl.type === 'number' ? ageEl.valueAsNumber : Number(ageRaw);
    const underage = ageRaw.trim() !== '' && Number.isFinite(ageNum) && ageNum < 18;

    // Extract creatinine value as it's needed for logic in later steps.
    const crea = root.querySelector('[name="patient_kreatinin"]');
    const creaRaw = crea ? crea.value : '';
    const creaNum = crea && crea.type === 'number' ? crea.valueAsNumber : Number(creaRaw);

    return {valid, underage, creaNum};
}
