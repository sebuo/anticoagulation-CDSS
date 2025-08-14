/**
 * @file interactions.js
 * This file manages the logic for the drug interactions step of the wizard.
 * Its primary responsibilities are:
 * - Recording which medications the patient is taking.
 * - Calculating the HAS-BLED score for bleeding risk.
 * - Dynamically showing or hiding the HAS-BLED section based on selections.
 * - Deriving clinical flags based on drug combinations (e.g., need for PPI).
 * - Storing all relevant data and scores in the global state.
 */

// Define constants for drug identifiers to avoid magic strings and improve maintainability.
const INTERACTING_DRUG_IDS = ['amiodaron', 'chinidin', 'dronedaron', 'diltiazem', 'verapamil', 'erythromycin', 'naproxen', 'fluconazol', 'ciclosporin', 'tacrolimus'];
const BASE_MED_IDS = ['aspirin', 'clopidogrel', 'nsaid', 'ssri'];
const ALL_MED_IDS = [...BASE_MED_IDS, ...INTERACTING_DRUG_IDS];

/**
 * Initializes the drug interactions step.
 * @param {HTMLElement} formEl - The form element for this step.
 * @param {object} state - The global application state.
 */
export function initInteractionsStep(formEl, state) {
  // Helper to select an element by its 'name' attribute.
  const getEl = (name) => formEl.querySelector(`[name="${name}"]`);
  // Helper to select an element by its ID, for containers or unique elements.
  const getElById = (id) => formEl.querySelector(`#${id}`);

  /**
   * Sets up the logic for the "None of the above" checkbox. When checked, it
   * disables and unchecks all other medication checkboxes.
   */
  function setupNoneCheckboxLogic() {
    const noneCheckbox = getEl('none');
    const otherCheckboxes = ALL_MED_IDS.map(getEl).filter(Boolean);

    if (!noneCheckbox) return;

    const handleChange = () => {
      if (noneCheckbox.checked) {
        otherCheckboxes.forEach(cb => {
          cb.checked = false;
          cb.disabled = true;
        });
      } else {
        otherCheckboxes.forEach(cb => cb.disabled = false);
      }
    };

    noneCheckbox.addEventListener('change', handleChange);

    // If any other medication is checked, the "None" checkbox should be unchecked.
    otherCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          noneCheckbox.checked = false;
        }
      });
    });
  }

  /**
   * Calculates the HAS-BLED score based on form inputs and data from previous steps.
   * It also controls the visibility of the HAS-BLED section itself.
   */
  function computeHasBled() {
    // Read directly from the HAS-BLED section of the form.
    const hbHypertension = getEl('hb-hypertension')?.checked || false;
    const hbRenal = getEl('hb-renal')?.checked || false;
    const hbLiver = getEl('hb-liver')?.checked || false;
    const hbBleeding = getEl('hb-bleeding')?.checked || false;
    const hbAlcohol = getEl('hb-alcohol')?.checked || false;
    const hbLabileINR = getEl('hb-labile-inr')?.checked || false;

    // Derive factors from other parts of the global state.
    const age = Number(state?.patient?.age);
    const elderly = Number.isFinite(age) && age >= 65;
    const strokeFromChads = !!state.chadsvasc?.stroke_or_tia;
    const hbDrugs = (getEl('aspirin')?.checked || getEl('clopidogrel')?.checked || getEl('nsaid')?.checked) && !getEl('none')?.checked;

    // Update the read-only checkboxes in the UI that show these derived factors.
    const elderlyCheckbox = getEl('hb-elderly-derived');
    if (elderlyCheckbox) elderlyCheckbox.checked = elderly;
    const strokeCheckbox = getEl('hb-stroke-derived');
    if (strokeCheckbox) strokeCheckbox.checked = strokeFromChads;
    const drugsCheckbox = getEl('hb-drugs-derived');
    if (drugsCheckbox) drugsCheckbox.checked = hbDrugs;

    // Tally the final score. Note that some criteria are combined (e.g., renal/liver).
    const components = [
      ['Hypertension', hbHypertension],
      ['Renal/Liver disease', hbRenal || hbLiver], // Renal and Liver count for 1 point total.
      ['Stroke', strokeFromChads],
      ['Predisposition to bleeding', hbBleeding],
      ['Labile INR', hbLabileINR],
      ['Elderly (age ≥ 65)', elderly],
      ['Drugs/Alcohol', hbDrugs || hbAlcohol], // Drugs and Alcohol count for 1 point total.
    ];

    const total = components.reduce((acc, [, v]) => acc + (v ? 1 : 0), 0);

    // Update the score display in the UI.
    const scoreEl = getElById('hb-score');
    if (scoreEl) scoreEl.textContent = String(total);

    // --- DYNAMIC VISIBILITY LOGIC ---
    // The HAS-BLED section should only be visible if a specific interacting drug is selected.
    const isInteractingDrugSelected = INTERACTING_DRUG_IDS.some(drugId => getEl(drugId)?.checked);
    const hasBledSection = getElById('has-bled-section');
    if (hasBledSection) {
      hasBledSection.style.display = isInteractingDrugSelected ? 'block' : 'none';
    }

    // Persist the calculated score and the condition for showing the section into the state.
    state.hasbled = {
      ...state.hasbled,
      total_score: total,
      medication_condition_peak_lvl: isInteractingDrugSelected,
    };
  }

  /**
   * A master function that reads all form inputs for this step, computes derived
   * values, and stores everything in the global state object.
   */
  function computeAndStoreState() {
    const none = getEl('none')?.checked || false;
    const aspirin = getEl('aspirin')?.checked && !none;
    const clopidogrel = getEl('clopidogrel')?.checked && !none;
    const nsaid = getEl('nsaid')?.checked && !none;
    const ssri = getEl('ssri')?.checked && !none;

    // Derive clinical flags based on drug combinations.
    const dual = aspirin && clopidogrel; // Dual antiplatelet therapy
    const ppiInd = dual || nsaid || ssri; // Indication for a Proton Pump Inhibitor
    const hbDrugs = aspirin || clopidogrel || nsaid; // Drugs that contribute to HAS-BLED score
    const selectedDrugs = ALL_MED_IDS.filter(name => getEl(name)?.checked && !none);

    // Update the 'interactions' slice of the global state.
    state.interactions = {
      ...state.interactions,
      None_of_the_above: none,
      Aspirin: aspirin,
      Clopidogrel: clopidogrel,
      NSAID: nsaid,
      SSRI_or_SNRI: ssri,
      derived_dual_antiplatelet_therapy: dual,
      derived_PPI_indication: ppiInd,
      derived_HASBLED_drugs_bleeding_predisposition: hbDrugs,
      interacting_drug_list: selectedDrugs,
      'interacting drugs': selectedDrugs.length > 0,
    };

    // Always re-calculate the HAS-BLED score on any change.
    computeHasBled();
  }

  // --- INITIALIZATION ---
  setupNoneCheckboxLogic();

  // Pre-fill/disable the HAS-BLED hypertension checkbox based on CHADS-VASc data.
  const hbHypertensionEl = getEl('hb-hypertension');
  if (hbHypertensionEl) {
    hbHypertensionEl.disabled = state.chadsvasc?.hypertension === false;
    if (hbHypertensionEl.disabled) {
      hbHypertensionEl.checked = false;
    }
  }

  // Add the main event listener to re-calculate everything on any form change.
  formEl.addEventListener('change', computeAndStoreState);

  // Initial state hydration and computation when the step loads.
  const noneCheckbox = getEl('none');
  if (noneCheckbox?.checked) {
    // Manually trigger the change event to ensure other checkboxes are disabled on load.
    noneCheckbox.dispatchEvent(new Event('change'));
  }
  computeAndStoreState();
}
