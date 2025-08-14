/**
 * Initializes info buttons within a given root element.
 * It finds all buttons with a 'data-toggles' attribute and sets them
 * up to toggle the visibility of the element specified by the attribute.
 * It also handles closing the info box when clicking outside of it.
 * @param {HTMLElement} root - The container element for the step.
 */
export function initPatientInformationStep(root) {
    const infoButtons = root.querySelectorAll('.info-btn[data-toggles]');

    // A single handler for all info buttons
    const handleInfoButtonClick = (event, btn) => {
        event.stopPropagation(); // Prevent the document click listener from firing immediately
        const boxId = btn.getAttribute('data-toggles');
        const box = root.querySelector(`#${boxId}`);
        if (!box) return;

        const isVisible = box.classList.contains('is-visible');

        // First, hide all other currently visible info boxes
        root.querySelectorAll('.info-box.is-visible').forEach(openBox => {
            openBox.classList.remove('is-visible');
        });

        // If the clicked box was not already visible, show it.
        // This makes clicking a new button close the old one and open the new one.
        if (!isVisible) {
            box.classList.add('is-visible');
        }
    };

    infoButtons.forEach(btn => {
        btn.addEventListener('click', (event) => handleInfoButtonClick(event, btn));
    });

    // Add a global click listener to hide info boxes when clicking elsewhere
    const handleOutsideClick = () => {
        root.querySelectorAll('.info-box.is-visible').forEach(box => {
            box.classList.remove('is-visible');
        });
    };

    // We attach this listener to the document
    document.addEventListener('click', handleOutsideClick);

    // Note: In a complex single-page app, you'd want to remove this listener
    // when the step is destroyed to prevent memory leaks. For this wizard, it's fine.
}


/**
 * Creates and displays a temporary validation message within the form.
 * @param {HTMLElement} root - The form element.
 * @param {string} message - The message to display.
 */
function showValidationMessage(root, message) {
    const existingMsg = root.querySelector('.validation-message');
    if (existingMsg) {
        existingMsg.remove();
    }

    const msgEl = document.createElement('div');
    msgEl.className = 'validation-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative my-4';
    msgEl.setAttribute('role', 'alert');
    msgEl.textContent = message;

    root.prepend(msgEl);

    setTimeout(() => {
        msgEl.remove();
    }, 5000);
}

/**
 * Validates the patient information form fields.
 * @param {HTMLElement} root - The form element.
 * @returns {{valid: boolean, underage: boolean}} An object indicating if the form is valid and if the patient is underage.
 */
export function validatePatientInformationStep(root) {
    const existingMsg = root.querySelector('.validation-message');
    if (existingMsg) {
        existingMsg.remove();
    }

    const reqText = (sel) => {
        const el = root.querySelector(sel);
        const ok = !!el && !!el.value.trim();
        el && el.classList.toggle('invalid', !ok);
        return ok;
    };

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

    const checks = [
        reqText('[name="first_name"]'),
        reqText('[name="last_name"]'),
        reqNum('[name="age"]', 0, 120),
        reqNum('[name="patient_weight"]', 0, 300),
        reqNum('[name="patient_kreatinin"]', 0, 1000),
        reqNum('[name="patient_gfr"]', 0, 120),
    ];
    const valid = checks.every(Boolean);

    if (!valid) {
        showValidationMessage(root, 'Please fill out all required fields correctly before proceeding.');
    }

    const ageEl = root.querySelector('[name="age"]');
    const ageRaw = ageEl ? ageEl.value : '';
    const ageNum = ageEl && ageEl.type === 'number' ? ageEl.valueAsNumber : Number(ageRaw);
    const underage = ageRaw.trim() !== '' && Number.isFinite(ageNum) && ageNum < 18;

    const crea = root.querySelector('[name="patient_kreatinin"]');
    const creaRaw = crea ? crea.value : '';
    const creaNum = crea && crea.type === 'number' ? crea.valueAsNumber : Number(creaRaw);

    return {valid, underage, creaNum};
}
