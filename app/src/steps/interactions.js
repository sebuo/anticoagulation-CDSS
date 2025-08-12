import { INTERACTING_DRUG_IDS } from '../constants.js';

export function initInteractionsStep(formEl, state){
  const el = (id) => formEl.querySelector(`#${id}`);
  const badge = (id) => formEl.querySelector(`#${id}`);

  function computeInteractionsBase(){
    const aspirin = !!el('aspirin')?.checked;
    const clopidogrel = !!el('clopidogrel')?.checked;
    const nsaid = !!el('nsaid')?.checked;
    const ssri = !!el('ssri')?.checked;

    const dual = aspirin && clopidogrel; // derived_dual_antiplatelet_therapy
    const ppiInd = dual || nsaid || ssri; // final rule

    const dualBadge = badge('dualBadge');
    const ppiBadge = badge('ppiBadge');
    const ppiRec = badge('ppiRec');
    const explain = badge('explain');
    if(dualBadge){ dualBadge.textContent = dual ? 'True' : 'False'; }
    if(ppiBadge){ ppiBadge.textContent = ppiInd ? 'True' : 'False'; }
    if(ppiRec){ ppiRec.textContent = ppiInd ? 'PPI Recommended' : 'Not Recommended'; }
    if(explain){
      const reasons = [];
      if(dual) reasons.push('dual antiplatelet therapy');
      if(nsaid) reasons.push('NSAID');
      if(ssri) reasons.push('SSRI/SNRI');
      explain.innerHTML = `Inputs true: <strong>${reasons.length}</strong> [${reasons.join(', ') || 'none'}].`;
    }

    state.interactions = {
      ...state.interactions,
      Aspirin: aspirin,
      Clopidogrel: clopidogrel,
      NSAID: nsaid,
      SSRI_or_SNRI: ssri,
      derived_dual_antiplatelet_therapy: dual,
      derived_PPI_indication: ppiInd,
    };
  }

  function computeInteractionsTriggers(){
    const drugBoxes = INTERACTING_DRUG_IDS.map(id => el(id));
    const anyDrug = drugBoxes.some(cb => cb && cb.checked);
    const riskGates = el('riskGates');
    const drugTriggerBadge = badge('drugTriggerBadge');
    const ageGate = badge('ageGate');
    const gfrGate = badge('gfrGate');
    const wtGate = badge('wtGate');
    const anyGate = badge('anyGate');
    const gateInputs = badge('gateInputs');
    const hasBledBlock = el('hasBledBlock');

    const selectedDrugs = INTERACTING_DRUG_IDS.filter(id => el(id)?.checked);
    state.interactions.interacting_drug_list = selectedDrugs;
    state.interactions['interacting drugs'] = selectedDrugs.length > 0;

    if(riskGates){ riskGates.hidden = !anyDrug; }

    if(!anyDrug){
      if(drugTriggerBadge) { drugTriggerBadge.textContent = 'False'; }
      if(ageGate) { ageGate.textContent = 'False'; }
      if(gfrGate) { gfrGate.textContent = 'False'; }
      if(wtGate) { wtGate.textContent = 'False'; }
      if(anyGate) { anyGate.textContent = 'False'; }
      if(hasBledBlock){ hasBledBlock.hidden = true; hasBledBlock.open = false; }
      state.interactions.derived_age_RF = false;
      state.interactions.derived_GFR_RF = false;
      state.interactions.weight_under_60 = false;
      state.interactions.any_gate_true = false;
      return;
    }

    const age = Number(state.patient.age);
    const weight = Number(state.patient.patient_weight);
    const gfr = Number(state.patient.patient_gfr);
    if(gateInputs){ gateInputs.textContent = `Inputs: age=${age}; weight=${weight}; GFR=${gfr}`; }

    const ageTrue = age >= 75;
    const gfrTrue = gfr < 50;
    const wtTrue = weight <= 60;
    const anyTrue = ageTrue || gfrTrue || wtTrue;

    if(drugTriggerBadge){ drugTriggerBadge.textContent = 'True'; }
    if(ageGate){ ageGate.textContent = ageTrue ? 'True' : 'False'; }
    if(gfrGate){ gfrGate.textContent = gfrTrue ? 'True' : 'False'; }
    if(wtGate){ wtGate.textContent = wtTrue ? 'True' : 'False'; }
    if(anyGate){ anyGate.textContent = anyTrue ? 'True' : 'False'; }

    state.interactions.derived_age_RF = ageTrue;
    state.interactions.derived_GFR_RF = gfrTrue === true;
    state.interactions.weight_under_60 = wtTrue;
    state.interactions.any_gate_true = anyTrue;

    if(hasBledBlock){
      if(anyTrue){ hasBledBlock.hidden = false; hasBledBlock.open = true; }
      else { hasBledBlock.hidden = true; hasBledBlock.open = false; }
    }
  }

  function computeInteractionsAll(){
    computeInteractionsBase();
    computeInteractionsTriggers();
  }

  formEl.addEventListener('change', computeInteractionsAll);
  const resetBtn = el('resetInteractions');
  if(resetBtn){
    resetBtn.addEventListener('click', () => {
      ['aspirin','clopidogrel','nsaid','ssri', ...INTERACTING_DRUG_IDS].forEach(id => { const cb = el(id); if(cb) cb.checked = false; });
      computeInteractionsAll();
    });
  }

  computeInteractionsAll();
}