import { INTERACTING_DRUG_IDS } from '../constants.js';

export function initInteractionsStep(formEl, state){
  const el = (id) => formEl.querySelector(`#${id}`);

  // ---- None-of-the-above mutual exclusivity ----
  const NONE_ID = 'none';
  const BASE_MED_IDS = ['aspirin','clopidogrel','nsaid','ssri'];
  const ALL_MED_IDS = [...BASE_MED_IDS, ...INTERACTING_DRUG_IDS];

  function enforceNoneExclusivity(evt){
    const noneCb = el(NONE_ID);
    if(!noneCb) return;
    const targetId = evt?.target?.id;

    if(targetId === NONE_ID && noneCb.checked){
      ALL_MED_IDS.forEach(id => { const cb = el(id); if(cb) cb.checked = false; });
      return;
    }
    if(ALL_MED_IDS.includes(targetId)){
      const cb = el(targetId);
      if(cb?.checked) noneCb.checked = false;
    }
  }
  // ----------------------------------------------

  function computeInteractionsBase(){
    const none = !!el(NONE_ID)?.checked;

    const aspirin = !none && !!el('aspirin')?.checked;
    const clopidogrel = !none && !!el('clopidogrel')?.checked;
    const nsaid = !none && !!el('nsaid')?.checked;
    const ssri = !none && !!el('ssri')?.checked;

    const dual = aspirin && clopidogrel;           // derived_dual_antiplatelet_therapy
    const ppiInd = dual || nsaid || ssri;          // kept in state only
    // === HAS-BLED: Drugs predisposing to bleeding (ASS, clopidogrel, NSAIDs) ===
    // Count as TRUE if any of: aspirin, clopidogrel, NSAID. (SSRIs do NOT count)
    const hbDrugs = aspirin || clopidogrel || nsaid;
    const hbDrugsEl = el('hb-drugs');
    if (hbDrugsEl) {
      // keep checkbox in sync; downstream HAS-BLED code can listen to 'change'
      const prev = hbDrugsEl.checked;
      hbDrugsEl.checked = hbDrugs;
      if (hbDrugs !== prev) {
        hbDrugsEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

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
    };
  }

  // Disable HAS-BLED uncontrolled hypertension if hypertension in CHA₂DS₂-VASc is false
  const hbHypertensionEl = formEl.querySelector('#hb-hypertension');
  if (hbHypertensionEl) {
    if (state.chadsvasc?.hypertension === false) {
      hbHypertensionEl.checked = false;
      hbHypertensionEl.disabled = true;
    } else {
      hbHypertensionEl.disabled = false;
    }
  }

  function computeInteractionsTriggers(){
    const selectedDrugs = INTERACTING_DRUG_IDS.filter(id => el(id)?.checked);
    state.interactions.interacting_drug_list = selectedDrugs;
    state.interactions['interacting drugs'] = selectedDrugs.length > 0;
  }

  // ---- HAS-BLED ----
  function computeHasBled(){
    // Read checkboxes
    const hbHypertension = !!el('hb-hypertension')?.checked;
    const hbRenal       = !!el('hb-renal')?.checked;
    const hbLiver       = !!el('hb-liver')?.checked;
    const hbBleeding    = !!el('hb-bleeding')?.checked;
    const hbDrugs       = !!el('hb-drugs')?.checked;
    const hbAlcohol     = !!el('hb-alcohol')?.checked;
    const hbLabileINR = !!el('hb-labile-inr')?.checked;

    // Derived from state
    const age = Number(state?.patient?.age);
    const elderly = Number.isFinite(age) && age >= 65;

    // Source stroke history from CHADS-VASc (support common keys conservatively)
    const cv = state?.chadsvasc || {};
    const strokeFromChads =
        !!(cv.stroke_TIA || cv.strokeTIA || cv.stroke || cv.TIA || cv.priorStroke || cv.prior_TIA);

    // Update read-only badges
    const elderlyBadge = el('hb-elderly-badge');
    if(elderlyBadge) elderlyBadge.textContent = elderly ? 'True' : 'False';

    const strokeBadge = el('hb-stroke-badge');
    if(strokeBadge) strokeBadge.textContent = strokeFromChads ? 'True' : 'False';

    // Score components (1 point each)
    const components = [
      ['Hypertension', hbHypertension],
      ['Renal disease', hbRenal],
      ['Liver disease', hbLiver],
      ['Stroke history', strokeFromChads],
      ['Bleeding history', hbBleeding],
      ['Labile INR', hbLabileINR],
      ['Elderly (65+)', elderly],
      ['Drugs (antiplatelets/NSAIDs)', hbDrugs],
      ['Alcohol use', hbAlcohol],
    ];

    const total = components.reduce((acc, [_, v]) => acc + (v ? 1 : 0), 0);

    const scoreEl = el('hb-score');
    if(scoreEl) scoreEl.textContent = String(total);

    const breakdownEl = el('hb-breakdown');
    if(breakdownEl){
      const active = components.filter(([,v]) => v).map(([k]) => k);
      breakdownEl.textContent = active.length ? `Contributors: ${active.join(', ')}` : 'Contributors: none';
    }

    // Persist in state
    state.hasbled = {
      hypertension_uncontrolled: hbHypertension,
      renal_disease: hbRenal,
      liver_disease: hbLiver,
      stroke_history: strokeFromChads,
      bleeding_history: hbBleeding,
      labile_inr: hbLabileINR,
      elderly_65_plus: elderly,
      drugs_antiplatelets_nsaids: hbDrugs,
      alcohol_use: hbAlcohol,
      total_score: total,
    };
  }
  // ------------------

  function computeInteractionsAll(){
    computeInteractionsBase();
    computeInteractionsTriggers();
    computeHasBled();
  }

  formEl.addEventListener('change', (evt) => {
    enforceNoneExclusivity(evt);
    computeInteractionsAll();
  });

  const resetBtn = el('resetInteractions');
  if(resetBtn){
    resetBtn.addEventListener('click', () => {
      [NONE_ID, ...ALL_MED_IDS,
        'hb-hypertension','hb-renal','hb-liver','hb-bleeding','hb-drugs','hb-alcohol'
      ].forEach(id => { const cb = el(id); if(cb) cb.checked = false; });
      computeInteractionsAll();
    });
  }

  if(el(NONE_ID)?.checked){
    ALL_MED_IDS.forEach(id => { const cb = el(id); if(cb) cb.checked = false; });
  }

  computeInteractionsAll();
}
