import { escapeHtml } from '../utils.js';

export function initContraindicationsStep(formEl, state){
  const el = (id) => formEl.querySelector(`#${id}`);
  const badge = (id) => formEl.querySelector(`#${id}`);

  function getSex(){ return state.chadsvasc?.sex || null; }
  function getAge(){ const v = Number(state.patient?.age); return Number.isNaN(v) ? null : v; }
  function getGFR(){ const v = Number(state.patient?.patient_gfr); return Number.isNaN(v) ? null : v; }

  function computeDerivedFlags(){
    const age = getAge();
    const gfr = getGFR();
// a constant is a variable; container that stores a value which can’t be reassigned later
// if variable age is not null: if age < 18; then True, else (:) False
    const derived_ci_age = age != null ? (age < 18) : false;
    const ci_renal_failure = gfr != null ? (gfr < 15) : false;
    state.contraindications.derived_ci_age = derived_ci_age;
    state.contraindications.ci_renal_failure = ci_renal_failure;
    const ageFlag = badge('flag_ci_age');
    const renalFlag = badge('flag_ci_renal');
    if(ageFlag) ageFlag.textContent = derived_ci_age ? 'True' : 'False';
    if(renalFlag) renalFlag.textContent = ci_renal_failure ? 'True' : 'False';
  }

  function reflectSexVisibility(){
    const field = el('pregnantField');
    const sex = getSex();
    if(field){
      const isF = sex === 'F';
      field.hidden = !isF;
      if(!isF){ const cb = el('ci_pregnant_or_breastfeeding'); if(cb) cb.checked = false; }
      state.contraindications.sex = sex || undefined;
    }
  }

  function setupNoneCheckboxLogic() {
    const noneCheckbox = el('ci_none');
    const contraindicationIds = [
      'ci_active_bleeding',
      'ci_endocarditis',
      'ci_gi_ulcus_active',
      'ci_liver_failure_child_c_or_coagulopathy',
      'ci_pregnant_or_breastfeeding',
      'ci_drugs'
    ].filter(id => el(id));  // only include if element exists
  
    if (!noneCheckbox) return;
  
    // When "None of the above" is changed:
    noneCheckbox.addEventListener('change', () => {
      if (noneCheckbox.checked) {
        // Uncheck and disable all other checkboxes
        contraindicationIds.forEach(id => {
          const cb = el(id);
          if (cb) {
            cb.checked = false;
            cb.disabled = true;
          }
        });
      } else {
        // Enable all other checkboxes
        contraindicationIds.forEach(id => {
          const cb = el(id);
          if (cb) cb.disabled = false;
        });
      }
    });
  
    // When any other contraindication checkbox changes:
    contraindicationIds.forEach(id => {
      const cb = el(id);
      if (!cb) return;
      cb.addEventListener('change', () => {
        if (cb.checked) {
          noneCheckbox.checked = false;
          noneCheckbox.disabled = true;
        } else {
          // Check if all other checkboxes are unchecked, then enable "None of the above"
          const anyChecked = contraindicationIds.some(otherId => el(otherId)?.checked);
          if (!anyChecked) {
            noneCheckbox.disabled = false;
          }
        }
      });
    });
  }
  
  function ensureAtLeastOneSelected() {
    const ids = [
      'ci_active_bleeding',
      'ci_endocarditis',
      'ci_gi_ulcus_active',
      'ci_liver_failure_child_c_or_coagulopathy',
      'ci_pregnant_or_breastfeeding',
      'ci_drugs',
      'ci_none'
    ].filter(id => el(id));
  
    const anyChecked = ids.some(id => !!el(id)?.checked);
    const btn = el('btnCICompute');
  
    if (btn) btn.disabled = !anyChecked;
  }
  function attachAtLeastOneListeners() {
    const ids = [
      'ci_active_bleeding',
      'ci_endocarditis',
      'ci_gi_ulcus_active',
      'ci_liver_failure_child_c_or_coagulopathy',
      'ci_pregnant_or_breastfeeding',
      'ci_drugs',
      'ci_none'
    ].filter(id => el(id));
  
    ids.forEach(id => {
      const cb = el(id);
      if (!cb) return;
      cb.addEventListener('change', () => {
        ensureAtLeastOneSelected();
      });
    });
  }  

  function currentReasons(){
    // This adds all contraindications to the constant reasons
    // We could add this to utils, since contraindication aga and renal failure are seen in patient_information
    const reasons = [];
    if(state.contraindications.derived_ci_age) reasons.push('Patient is under 18 years old');
    if(state.contraindications.ci_renal_failure) reasons.push('Renal failure (GFR < 15)');
    if(el('ci_active_bleeding')?.checked) reasons.push('Active bleeding');
    if(el('ci_endocarditis')?.checked) reasons.push('Acute bacterial endocarditis');
    if(el('ci_gi_ulcus_active')?.checked) reasons.push('Active gastrointestinal ulcer');
    if(el('ci_liver_failure_child_c_or_coagulopathy')?.checked) reasons.push('Liver failure CHILD C or liver disease with coagulopathy');
    if(getSex() === 'F' && el('ci_pregnant_or_breastfeeding')?.checked) reasons.push('Pregnant or breastfeeding');
    if(el('ci_drugs')?.checked) reasons.push('Interacting medication present');
    return reasons;
  }

  function computeCI(){
    // if element doesn't exist --> !node
    // !! akes sure a value is a boolean
    ['ci_active_bleeding','ci_endocarditis','ci_gi_ulcus_active','ci_liver_failure_child_c_or_coagulopathy','ci_pregnant_or_breastfeeding','ci_drugs','ci_none'].forEach(id => {
      const node = el(id); if(!node) return; state.contraindications[id] = !!node.checked;
    });
    computeDerivedFlags();
    const reasons = currentReasons();
    const noneSelected = state.contraindications.ci_none === true;
    const derived_absolute_contraindication = !noneSelected && reasons.length > 0;    
    state.contraindications.derived_absolute_contraindication = derived_absolute_contraindication;
    const box = el('ciResult');
    if(box){
      if(derived_absolute_contraindication){
        box.classList.remove('ok'); box.classList.add('warn');
        box.innerHTML = `<strong>Absolute contraindications found:</strong><ul>` + reasons.map(c => `<li>${escapeHtml(c)}</li>`).join('') + `</ul><p><strong>Patient is NOT eligible for DOAC therapy.</strong></p>`;
      } else {
        box.classList.remove('warn'); box.classList.add('ok');
        box.innerHTML = `<strong>No contraindications detected. Patient is eligible for DOAC therapy.</strong>`;
      }
    }
  }

  function showCIJson(){ // shows the payload, could be deleted later
    computeCI();
    const data = {
      ci_none: !!el('ci_none')?.checked,
      ci_active_bleeding: !!el('ci_active_bleeding')?.checked,
      ci_endocarditis: !!el('ci_endocarditis')?.checked,
      ci_gi_ulcus_active: !!el('ci_gi_ulcus_active')?.checked,
      ci_liver_failure_child_c_or_coagulopathy: !!el('ci_liver_failure_child_c_or_coagulopathy')?.checked,
      ci_pregnant_or_breastfeeding: getSex() === 'F' ? !!el('ci_pregnant_or_breastfeeding')?.checked : false,
      ci_drugs: !!el('ci_drugs')?.checked,
      derived_ci_age: !!state.contraindications.derived_ci_age,
      ci_renal_failure: !!state.contraindications.ci_renal_failure,
      sex: getSex()
    };
    const box = el('ciResult');
    if(box){ box.classList.remove('warn','ok'); box.innerHTML = `<pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>`; }
  }

  el('btnCICompute')?.addEventListener('click', computeCI);
  el('btnCIJson')?.addEventListener('click', showCIJson);
  formEl.addEventListener('change', (e) => {
    if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)){
      computeDerivedFlags();
    }
  });

  reflectSexVisibility();
  computeDerivedFlags();
  setupNoneCheckboxLogic();
  ensureAtLeastOneSelected();
  attachAtLeastOneListeners();
  computeCI();
}