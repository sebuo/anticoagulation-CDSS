// It's better practice to define constants outside the main function if they don't change.
const INTERACTING_DRUG_IDS = ['amiodaron', 'chinidin', 'dronedaron', 'diltiazem', 'verapamil', 'erythromycin', 'naproxen', 'fluconazol', 'ciclosporin', 'tacrolimus'];
const BASE_MED_IDS = ['aspirin', 'clopidogrel', 'nsaid', 'ssri'];
const ALL_MED_IDS = [...BASE_MED_IDS, ...INTERACTING_DRUG_IDS];

export function initInteractionsStep(formEl, state) {
  // Helper to select elements by their 'name' attribute.
  const getEl = (name) => formEl.querySelector(`[name="${name}"]`);
  // Helper for elements that might still use ID, like containers.
  const getElById = (id) => formEl.querySelector(`#${id}`);

  /**
   * Sets up the logic for the "None of the above" checkbox.
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

    otherCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          noneCheckbox.checked = false;
        }
      });
    });
  }

  /**
   * Calculates the HAS-BLED score and updates the UI.
   */
  function computeHasBled() {
    const hbHypertension = getEl('hb-hypertension')?.checked || false;
    const hbRenal = getEl('hb-renal')?.checked || false;
    const hbLiver = getEl('hb-liver')?.checked || false;
    const hbBleeding = getEl('hb-bleeding')?.checked || false;
    const hbAlcohol = getEl('hb-alcohol')?.checked || false;
    const hbLabileINR = getEl('hb-labile-inr')?.checked || false;

    // Derived from other parts of the state
    const age = Number(state?.patient?.age);
    const elderly = Number.isFinite(age) && age >= 65;
    const cv = state?.chadsvasc || {};
    const strokeFromChads = !!(cv.stroke_TIA || cv.strokeTIA || cv.stroke);
    const hbDrugs = (getEl('aspirin')?.checked || getEl('clopidogrel')?.checked || getEl('nsaid')?.checked) && !getEl('none')?.checked;

    // Update read-only derived factor checkboxes
    const elderlyCheckbox = getEl('hb-elderly-derived');
    if (elderlyCheckbox) elderlyCheckbox.checked = elderly;
    const strokeCheckbox = getEl('hb-stroke-derived');
    if (strokeCheckbox) strokeCheckbox.checked = strokeFromChads;
    const drugsCheckbox = getEl('hb-drugs-derived');
    if (drugsCheckbox) drugsCheckbox.checked = hbDrugs;

    const components = [
      ['Hypertension', hbHypertension],
      ['Renal/Liver disease', hbRenal || hbLiver], // Renal and Liver count for 1 point total
      ['Stroke', strokeFromChads],
      ['Predisposition to bleeding', hbBleeding],
      ['Labile INR', hbLabileINR],
      ['Elderly (age ≥ 65)', elderly],
      ['Drugs/Alcohol', hbDrugs || hbAlcohol], // Drugs and Alcohol count for 1 point total
    ];

    const total = components.reduce((acc, [, v]) => acc + (v ? 1 : 0), 0);

    const scoreEl = getElById('hb-score');
    if (scoreEl) scoreEl.textContent = String(total);

    // Show or hide the entire HAS-BLED section based on the total.
    const hasBledSection = getElById('has-bled-section');
    if (hasBledSection) {
      hasBledSection.style.display = total > 0 ? 'block' : 'none';
    }

    // Persist in state
    state.hasbled = {
      ...state.hasbled,
      total_score: total,
    };
  }

  /**
   * A master function to compute everything and update the state.
   */
  function computeAndStoreState() {
    const none = getEl('none')?.checked || false;
    const aspirin = getEl('aspirin')?.checked && !none;
    const clopidogrel = getEl('clopidogrel')?.checked && !none;
    const nsaid = getEl('nsaid')?.checked && !none;
    const ssri = getEl('ssri')?.checked && !none;
    const dual = aspirin && clopidogrel;
    const ppiInd = dual || nsaid || ssri;
    const hbDrugs = aspirin || clopidogrel || nsaid;
    const selectedDrugs = ALL_MED_IDS.filter(name => getEl(name)?.checked && !none);

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

    // Always re-calculate HAS-BLED score on any change.
    computeHasBled();
  }

  // --- INITIALIZATION ---
  setupNoneCheckboxLogic();

  // Disable HAS-BLED hypertension checkbox if not applicable from CHADS-VASc
  const hbHypertensionEl = getEl('hb-hypertension');
  if (hbHypertensionEl) {
    hbHypertensionEl.disabled = state.chadsvasc?.hypertension === false;
    if (hbHypertensionEl.disabled) {
      hbHypertensionEl.checked = false;
    }
  }

  formEl.addEventListener('change', computeAndStoreState);

  // Initial state hydration and computation
  const noneCheckbox = getEl('none');
  if (noneCheckbox?.checked) {
    // Manually trigger the change event to disable other checkboxes on load
    noneCheckbox.dispatchEvent(new Event('change'));
  }
  computeAndStoreState();
}
