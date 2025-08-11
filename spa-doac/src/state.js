const KEY = 'doac_state_v1';

const DEFAULTS = {
  // patient basics
  age_group: '', sex: '',
  // CHADSVASC booleans
  chf:false, hypertension:false, diabetes:false, stroke_or_tia:false, vascular_disease:false,
  // renal
  GFR:'', Kreatinin:'',
  // CI
  ci_active_bleeding:false, ci_liver_failure_child_c_or_coagulopathy:false, ci_gi_ulcus_active:false,
  ci_pregnant_or_breastfeeding:false, ci_endocarditis:false, ci_drugs:false,
  // interactions
  Aspirin:false, Clopidogrel:false, NSAID:false, SSRI_or_SNRI:false,
  // weight & risk
  weight_under_60:false, interacting_drugs:false,
  // HASBLED extras
  hasbled_hypertension:false, hasbled_renal:false, hasbled_liver:false, hasbled_bleeding:false,
  hasbled_labile_inr:false, hasbled_drugs_alcohol:false
};

let STATE = {...DEFAULTS};

export function initState() {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    try { STATE = {...DEFAULTS, ...JSON.parse(raw)}; } catch {}
  }
  save();
}

export function getState() { return STATE; }

export function setField(name, value) {
  STATE[name] = value;
  save();
}

export function patch(p) {
  Object.assign(STATE, p);
  save();
}

export function reset() {
  STATE = {...DEFAULTS};
  save();
}

function save(){ localStorage.setItem(KEY, JSON.stringify(STATE)); }
