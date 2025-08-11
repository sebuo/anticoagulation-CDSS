import { getState } from './state.js';

const inSet = (v, set) => set.includes(v);

export function derive() {
  const s = structuredClone(getState());

  // CHADS-VASc points
  const chadsPoints =
    (s.chf?1:0) +
    (s.hypertension?1:0) +
    (s.diabetes?1:0) +
    (s.stroke_or_tia?2:0) +
    (s.vascular_disease?1:0) +
    (s.age_group === '65-74' ? 1 : 0) +
    (inSet(s.age_group, ['75-80','75-79','>=80']) ? 2 : 0) +
    (s.sex === 'F' ? 1 : 0);
  s.CHADSVASC_score = chadsPoints;
  s.derived_CHADSVASC = chadsPoints >= 2;

  // contraindications
  s.derived_ci_age = (s.age_group === '<18');
  s.ci_renal_failure = (s.GFR === '<15');
  const absCIs = [
    s.ci_renal_failure, s.ci_active_bleeding, s.ci_liver_failure_child_c_or_coagulopathy,
    s.ci_gi_ulcus_active, s.ci_pregnant_or_breastfeeding, s.ci_endocarditis, s.derived_ci_age, s.ci_drugs
  ];
  s.derived_absolute_contraindication = absCIs.some(Boolean);

  // interactions
  s.derived_dual_antiplatelet_therapy = !!(s.Aspirin && s.Clopidogrel);
  s.derived_PPI_indication = !!(s.derived_dual_antiplatelet_therapy || s.NSAID || s.SSRI_or_SNRI);

  // HAS-BLED
  const hasbled_age_elderly = inSet(s.age_group, ['65-74','75-80','75-79','>=80']);
  const hasbled_hypertension = s.hypertension && s.hasbled_hypertension;
  const hasbledScore =
    (hasbled_hypertension?1:0) +
    (s.hasbled_renal?1:0) +
    (s.hasbled_liver?1:0) +
    (s.stroke_or_tia?1:0) +
    (s.hasbled_bleeding?1:0) +
    (s.hasbled_labile_inr?1:0) +
    (hasbled_age_elderly?1:0) +
    (s.hasbled_drugs_alcohol?1:0);
  s.HASBLED_score = hasbledScore;
  s.HASBLED_RF_Calc = hasbledScore >= 3;

  // risk factors for peak level monitoring
  s.derived_age_RF = inSet(s.age_group, ['75-80','75-79','>=80']);
  s.derived_GFR_RF = !(s.GFR === '>=50');
  const riskFactors = [
    s.derived_age_RF, s.derived_GFR_RF, s.Aspirin, s.Clopidogrel, s.NSAID, s.HASBLED_RF_Calc
  ];
  s.derived_riskfactor_count = riskFactors.filter(Boolean).length;
  s.derived_riskfactor_calculated = s.derived_riskfactor_count >= 2;

  return s;
}

export function nextRoute() {
  const s = derive();

  if (s.derived_ci_age) return { path: '/treatment', reason: 'age<18' };
  if (!s.derived_CHADSVASC) return { path: '/treatment', reason: 'chadsvasc<2' };
  if (s.GFR === '<15') return { path: '/treatment', reason: 'gfr<15' };
  if (s.derived_absolute_contraindication) return { path: '/treatment', reason: 'absolute_CI' };

  return { path: '/treatment', reason: 'ok_to_treatment' };
}

export function recommendations() {
  const s = derive();
  const out = { notes: [], drugs: [], flags: [] };

  if (s.derived_absolute_contraindication) {
    out.flags.push('DOAC contraindicated');
    out.drugs.push('Marcoumar (VKA) - consider as alternative');
    return { s, ...out };
  }

  // Eliquis dose
  const needs_reduced_eliquis = (
    inSet(s.age_group, ['>=80']) || s.weight_under_60 || (s.Kreatinin === '>= 133 µmol/l')
  );
  out.drugs.push(needs_reduced_eliquis ? "Eliquis 2×2.5 mg" : "Eliquis 2×5 mg");

  // Xarelto 15 mg if aspirin/clopidogrel or GFR 30-49
  const xarelto15 = (s.Aspirin || s.Clopidogrel || s.GFR === '30-49');
  if (xarelto15) out.drugs.push('Xarelto 1×15 mg');

  // Hematology consult for GFR 15–29
  if (s.GFR === '15-29') out.flags.push('Consult Hematology');

  if (s.derived_PPI_indication) out.notes.push('Add PPI');
  if (s.derived_riskfactor_calculated) out.notes.push('Order DOAC peak level monitoring');

  return { s, ...out };
}
