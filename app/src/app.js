import { TEMPLATES } from './templates.js';
import { state, stepKeys } from './state.js';
import { escapeHtml, serializeForm, hydrateForm, deriveAgeGroupFromNumeric } from './utils.js';
import { initChadsvascStep } from './steps/chadsvasc.js';
import { initContraindicationsStep } from './steps/contraindications.js';
import { initInteractionsStep } from './steps/interactions.js';
import { buildRecommendation, renderSummary } from './recommendation.js';

const FORM = document.getElementById('questionary');
const BTN_PREV = document.getElementById('btnPrev');
const BTN_NEXT = document.getElementById('btnNext');
const BTN_SUBMIT = document.getElementById('btnSubmit');
const STEPPER = document.getElementById('stepper');
const PROGRESS = document.getElementById('progress-bar');

let currentStep = 0;

function validateStep(stepIndex, dataForStep){
  switch(stepIndex){
    case 0: {
      const required = ['patient_name','age','patient_weight','patient_kreatinin','patient_gfr'];
      const missing = required.filter(k => dataForStep[k] === undefined || dataForStep[k] === null || dataForStep[k] === '');
      if(missing.length){ return { ok:false, message: 'Please fill all patient fields.' }; }
      if(!/^[^\s]+$/.test(String(dataForStep.patient_name))){ return { ok:false, message:'Patient name cannot contain whitespace.' }; }
      const age = Number(dataForStep.age), wt=Number(dataForStep.patient_weight), cr=Number(dataForStep.patient_kreatinin), gfr=Number(dataForStep.patient_gfr);
      if(!(age >= 0 && age <= 120)) return { ok:false, message:'Age must be between 0 and 120.' };
      if(!(wt >= 0 && wt <= 300)) return { ok:false, message:'Weight must be between 0 and 300.' };
      if(!(cr >= 30 && cr <= 120)) return { ok:false, message:'Kreatinin must be between 30 and 120 µmol/l.' };
      if(!(gfr >= 0 && gfr <= 120)) return { ok:false, message:'GFR must be between 0 and 120.' };
      return { ok:true };
    }
    case 1:
      return { ok:true };
    default:
      return { ok:true };
  }
}

function saveCurrentStep(){
  const data = serializeForm(FORM);
  const key = stepKeys[currentStep];
  state[key] = { ...state[key], ...data };
  if(currentStep === 1){
    // nothing additional; chadsvasc module recomputes on change
  }
  if(currentStep === 2){
    const age = Number(state.patient?.age);
    const gfr = Number(state.patient?.patient_gfr);
    state.contraindications.derived_ci_age = (age < 18);
    state.contraindications.ci_renal_failure = (gfr < 15);
    state.contraindications.sex = state.chadsvasc?.sex || state.contraindications.sex;
    state.contraindications.derived_absolute_contraindication = !!(
      state.contraindications.derived_ci_age || state.contraindications.ci_renal_failure ||
      state.contraindications.ci_active_bleeding || state.contraindications.ci_endocarditis ||
      state.contraindications.ci_gi_ulcus_active || state.contraindications.ci_liver_failure_child_c_or_coagulopathy ||
      (state.contraindications.sex === 'F' && state.contraindications.ci_pregnant_or_breastfeeding) ||
      state.contraindications.ci_drugs
    );
  }
}

function render(){
  FORM.innerHTML = TEMPLATES[currentStep]();

  // Minimal fade/slide-in on each step mount
  const first = FORM.firstElementChild; // expected <fieldset>
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(first && !reduce){
    first.classList.remove('step-animate-in');
    void first.offsetWidth; // reflow to restart animation
    first.classList.add('step-animate-in');
  }

  hydrateForm(FORM, state[stepKeys[currentStep]] || {});

  BTN_PREV.disabled = currentStep === 0;
  BTN_NEXT.hidden = currentStep === stepKeys.length - 1;
  BTN_SUBMIT.hidden = !(currentStep === stepKeys.length - 1);

  [...STEPPER.children].forEach((li, idx) => {
    li.classList.toggle('is-active', idx === currentStep);
    li.classList.toggle('is-done', idx < currentStep);
  });

  const pct = (currentStep) / (stepKeys.length - 1) * 100;
  PROGRESS.style.width = `${pct}%`;

  if(currentStep === 1){
    initChadsvascStep(FORM, state, deriveAgeGroupFromNumeric);
  }

  if(currentStep === 2){
    initContraindicationsStep(FORM, state);
  }

  if(currentStep === 3){
    initInteractionsStep(FORM, state);
  }

  if(currentStep === 4){
    const summary = document.getElementById('summary');
    const recBox = document.getElementById('recommendationBox');
    const finalJson = document.getElementById('finalJson');
    const rec = buildRecommendation(state);
    recBox.classList.remove('ok','warn');
    recBox.classList.add(rec.tone);
    recBox.innerHTML = `
      <strong>Recommendation</strong><br/>
      ${escapeHtml(rec.text)}
      ${rec.interactionNotes.length ? `<div class="badge">Notes</div> ${escapeHtml(rec.interactionNotes.join(' '))}` : ''}
    `;
    summary.innerHTML = renderSummary(state);
    finalJson.textContent = JSON.stringify(state, null, 2);
  }
}

// Wire up controls
BTN_PREV.addEventListener('click', () => { saveCurrentStep(); currentStep = Math.max(0, currentStep - 1); render(); });
BTN_NEXT.addEventListener('click', () => {
  saveCurrentStep();
  const { ok, message } = validateStep(currentStep, state[stepKeys[currentStep]]);
  if(!ok){ alert(message || 'Please complete required fields.'); return; }
  currentStep = Math.min(stepKeys.length - 1, currentStep + 1); render();
});
FORM.addEventListener('submit', (e) => { e.preventDefault(); saveCurrentStep(); const { ok, message } = validateStep(currentStep, state[stepKeys[currentStep]]); if(!ok){ alert(message || 'Please complete required fields.'); return; } alert('Questionnaire finished. See the summary and JSON output below.'); });
STEPPER.addEventListener('click', (e) => { const li = e.target.closest('li.step'); if(!li) return; const dest = Number(li.dataset.step); if(Number.isNaN(dest)) return; if(dest <= currentStep){ saveCurrentStep(); currentStep = dest; render(); } });

// Init
render();