import { getState, setField, patch, reset } from '../state.js';
import { derive, nextRoute } from '../rules.js';

function group(title, inner){
  const fs = document.createElement('fieldset');
  fs.innerHTML = `<legend>${title}</legend>`;
  fs.appendChild(inner);
  return fs;
}
function checkbox(name, label){
  const s = getState();
  const id = 'id_'+name;
  const wrap = document.createElement('div');
  wrap.innerHTML = `<label><input type="checkbox" id="${id}" ${s[name]?'checked':''}/> ${label}</label>`;
  wrap.querySelector('input').addEventListener('change', e => setField(name, !!e.target.checked));
  return wrap;
}
function radio(name, options){
  const s = getState();
  const wrap = document.createElement('div');
  wrap.innerHTML = options.map(v => {
    const id = `id_${name}_${v}`;
    const checked = s[name]===v ? 'checked' : '';
    return `<div><label><input type="radio" name="${name}" id="${id}" value="${v}" ${checked}/> ${v}</label></div>`;
  }).join('');
  wrap.querySelectorAll('input').forEach(inp => inp.addEventListener('change', e => setField(name, e.target.value)));
  return wrap;
}
function select(name, options){
  const s = getState();
  const sel = document.createElement('select');
  sel.innerHTML = `<option value="">-- select --</option>`+options.map(v => `<option ${s[name]===v?'selected':''} value="${v}">${v}</option>`).join('');
  sel.addEventListener('change', e => setField(name, e.target.value));
  return sel;
}

export default function Questionary(){
  const s = getState();
  const root = document.createElement('div');
  root.className = 'card';
  root.innerHTML = `<h2>Questionnaire</h2><p class="notice">Answers persist locally; refresh-safe.</p>`;

  // Patient basics
  const basics = document.createElement('div');
  basics.className = 'grid';
  basics.appendChild(group('Age Group', select('age_group', ['<18','18-64','65-74','75-80','>=80'])));
  basics.appendChild(group('Sex', radio('sex', ['M','F'])));
  root.appendChild(basics);

  // CHADSVASC
  const chads = document.createElement('div');
  chads.className = 'grid';
  chads.appendChild(group('CHADS-VASc', (()=>{
    const d = document.createElement('div');
    ['chf','hypertension','diabetes','stroke_or_tia','vascular_disease'].forEach(k=>d.appendChild(checkbox(k, k.replaceAll('_',' '))));
    return d;
  })()));
  root.appendChild(chads);

  // Renal function
  const renal = document.createElement('div');
  renal.className='grid';
  renal.appendChild(group('GFR', select('GFR', ['<15','15-29','30-49','>=50'])));
  renal.appendChild(group('Creatinine (µmol/l)', select('Kreatinin', ['<133 µmol/l','>= 133 µmol/l'])));
  root.appendChild(renal);

  // Contraindications (pregnancy visible only for F)
  const ci = document.createElement('div');
  const pregVisible = s.sex === 'F';
  ci.appendChild(group('Absolute Contraindications', (()=>{
    const d = document.createElement('div');
    d.appendChild(checkbox('ci_active_bleeding','Active bleeding'));
    d.appendChild(checkbox('ci_liver_failure_child_c_or_coagulopathy','Liver failure Child C / coagulopathy'));
    d.appendChild(checkbox('ci_gi_ulcus_active','Active GI ulcer'));
    if (pregVisible) d.appendChild(checkbox('ci_pregnant_or_breastfeeding','Pregnant or breastfeeding'));
    else patch({ ci_pregnant_or_breastfeeding:false });
    d.appendChild(checkbox('ci_endocarditis','Acute bacterial endocarditis'));
    d.appendChild(checkbox('ci_drugs','Interacting CI drugs (rifampicin, carbamazepin, etc.)'));
    return d;
  })()));
  root.appendChild(ci);

  // Interactions & risk
  const interactions = document.createElement('div');
  interactions.appendChild(group('Concomitant drugs', (()=>{
    const d = document.createElement('div');
    d.appendChild(checkbox('Aspirin','Aspirin (ASA)'));
    d.appendChild(checkbox('Clopidogrel','Clopidogrel'));
    d.appendChild(checkbox('NSAID','NSAID'));
    d.appendChild(checkbox('SSRI_or_SNRI','SSRI or SNRI'));
    d.appendChild(checkbox('weight_under_60','Weight ≤ 60 kg'));
    d.appendChild(checkbox('interacting_drugs','Other interacting drugs (amiodarone, verapamil, etc.)'));
    return d;
  })()));
  root.appendChild(interactions);

  // HAS-BLED – only shown if interacting_drugs is true
  if (s.interacting_drugs) {
    const hasbled = document.createElement('div');
    hasbled.appendChild(group('HAS-BLED (if applicable)', (()=>{
      const d = document.createElement('div');
      if (!s.hypertension) patch({ hasbled_hypertension:false });
      d.appendChild(checkbox('hasbled_hypertension','Uncontrolled hypertension (SBP >160)'));
      d.appendChild(checkbox('hasbled_renal','Abnormal renal function'));
      d.appendChild(checkbox('hasbled_liver','Abnormal liver function'));
      d.appendChild(checkbox('hasbled_bleeding','History/predisposition to bleeding'));
      d.appendChild(checkbox('hasbled_labile_inr','Labile INR'));
      d.appendChild(checkbox('hasbled_drugs_alcohol','Drugs increasing bleeding or alcohol abuse'));
      return d;
    })()));
    root.appendChild(hasbled);
  }

  // Live summary
  const summary = document.createElement('div');
  summary.className = 'notice';
  function renderSummary(){
    const d = derive();
    summary.innerHTML = `
      <strong>Derived:</strong> CHADS-VASc: ${d.CHADSVASC_score} | Absolute CI: ${d.derived_absolute_contraindication?'Yes':'No'} |
      HAS-BLED: ${d.HASBLED_score} (${d.HASBLED_RF_Calc?'≥3':''}) | Risk factors: ${d.derived_riskfactor_count}
    `;
  }
  renderSummary();
  root.appendChild(summary);

  // Actions
  const actions = document.createElement('div');
  actions.style.marginTop = '10px';
  actions.innerHTML = `
    <button class="btn" id="reset">Reset</button>
    <a class="btn primary" id="next" href="#/treatment">Calculate Recommendation</a>
  `;
  actions.querySelector('#reset').addEventListener('click', ()=>{ reset(); location.reload(); });
  root.appendChild(actions);

  // Re-render on input changes
  root.addEventListener('change', renderSummary);

  return root;
}
