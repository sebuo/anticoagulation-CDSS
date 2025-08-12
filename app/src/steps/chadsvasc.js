import { ageIdToGroup } from '../constants.js';

export function scoreChadsVascFromState(state){
  const cv = state.chadsvasc || {};
  let score = 0;
  score += Number(cv.agePoints || 0);
  score += cv.sex === 'F' ? 1 : 0;
  score += cv.chf ? 1 : 0;
  score += cv.hypertension ? 1 : 0;
  score += cv.diabetes ? 1 : 0;
  score += cv.stroke_or_tia ? 2 : 0;
  score += cv.vascular_disease ? 1 : 0;
  return score;
}

export function initChadsvascStep(formEl, state, deriveAgeGroupFromNumeric){
  const ageRadio = formEl.querySelector('input[name="age"]:checked');
  const sexRadio = formEl.querySelector('input[name="sex"]:checked');

  function computeChadsFromForm(){
    const ageRadio = formEl.querySelector('input[name="age"]:checked');
    const sexRadio = formEl.querySelector('input[name="sex"]:checked');

    let age_group = null, agePoints = 0;
    if(ageRadio){
      age_group = ageIdToGroup[ageRadio.id] || null;
      agePoints = Number(ageRadio.value) || 0;
    }

    let sex = null;
    if(sexRadio){ sex = sexRadio.id === 'male' ? 'M' : 'F'; }

    const chf = formEl.querySelector('#congestiveHF')?.checked || false;
    const hypertension = formEl.querySelector('#hypertension')?.checked || false;
    const diabetes = formEl.querySelector('#diabetes')?.checked || false;
    const stroke_or_tia = formEl.querySelector('#strokeTIA')?.checked || false;
    const vascular_disease = formEl.querySelector('#vascularDisease')?.checked || false;

    state.chadsvasc = {
      ...state.chadsvasc,
      age_group,
      agePoints,
      sex,
      chf,
      hypertension,
      diabetes,
      stroke_or_tia,
      vascular_disease
    };

    const score = scoreChadsVascFromState(state);
    state.chadsvasc.score = score;
    state.chadsvasc.derived_CHADSVASC_Score = score >= 2;

    const scoreEl = document.getElementById('scoreResult');
    const adviceEl = document.getElementById('treatmentAdvice');
    if(scoreEl) scoreEl.textContent = String(score);
    if(adviceEl){
      if(score < 2){ adviceEl.textContent = 'No DOAK treatment indicated'; adviceEl.className = 'advice-green'; }
      else { adviceEl.textContent = 'Continue with contraindication assessment'; adviceEl.className = 'advice-red'; }
    }
  }

  formEl.addEventListener('change', computeChadsFromForm);

  const derivedGroup = deriveAgeGroupFromNumeric(state.patient.age);
  if(derivedGroup && !state.chadsvasc.age_group){
    const id = Object.entries(ageIdToGroup).find(([k,v]) => v === derivedGroup)?.[0];
    if(id){ const el = formEl.querySelector(`#${id}`); if(el){ el.checked = true; } }
    state.chadsvasc.age_group = derivedGroup;
    state.chadsvasc.agePoints = Number(formEl.querySelector(`#${id}`)?.value || 0);
  }
  if(state.chadsvasc.sex){
    const id = state.chadsvasc.sex === 'M' ? 'male' : 'female';
    const el = formEl.querySelector(`#${id}`); if(el) el.checked = true;
  }
  formEl.querySelector('#congestiveHF') && (formEl.querySelector('#congestiveHF').checked = !!state.chadsvasc.chf);
  formEl.querySelector('#hypertension') && (formEl.querySelector('#hypertension').checked = !!state.chadsvasc.hypertension);
  formEl.querySelector('#diabetes') && (formEl.querySelector('#diabetes').checked = !!state.chadsvasc.diabetes);
  formEl.querySelector('#strokeTIA') && (formEl.querySelector('#strokeTIA').checked = !!state.chadsvasc.stroke_or_tia);
  formEl.querySelector('#vascularDisease') && (formEl.querySelector('#vascularDisease').checked = !!state.chadsvasc.vascular_disease);
  computeChadsFromForm();
}