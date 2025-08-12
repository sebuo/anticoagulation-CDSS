import { escapeHtml } from './utils.js';

export function renderSummary(s){
  const p = s.patient || {}; const c = s.chadsvasc || {}; const ci = s.contraindications || {};
  return `
      <div class="grid cols-2">
        <div>
          <h3>Patient</h3>
          <div class="notice">
            Name: ${escapeHtml(p.patient_name || '—')}<br/>
            Age: ${escapeHtml(p.age ?? '—')}<br/>
            Weight: ${escapeHtml(p.patient_weight ?? '—')} kg<br/>
            Kreatinin: ${escapeHtml(p.patient_kreatinin ?? '—')} µmol/l<br/>
            GFR: ${escapeHtml(p.patient_gfr ?? '—')}
          </div>
        </div>
        <div>
          <h3>CHA₂DS₂-VASc</h3>
          <div class="notice">
            Age group: ${escapeHtml(c.age_group || '—')}<br/>
            Sex: ${escapeHtml(c.sex || '—')}<br/>
            Score: <strong>${c.score ?? '—'}</strong><br/>
            DOAC indication (derived): <strong>${c.derived_CHADSVASC_Score ? 'True' : 'False'}</strong>
          </div>
          <div class="notice" style="margin-top:6px">
            <strong>Contraindications</strong><br/>
            Absolute CI (derived): <strong>${(s.contraindications?.derived_absolute_contraindication) ? 'True' : 'False'}</strong><br/>
            Under 18: ${(s.contraindications?.derived_ci_age) ? 'True' : 'False'}; Renal failure (GFR <15): ${(s.contraindications?.ci_renal_failure) ? 'True' : 'False'}
          </div>
        </div>
      </div>
    `;
}

export function buildRecommendation(fullState){
  const { patient, chadsvasc, contraindications, interactions } = fullState;

  const chads = Number(chadsvasc.score ?? 0);
  const hasContra = !!contraindications.derived_absolute_contraindication;

  let rec, tone;
  if(hasContra){ rec = 'Absolute contraindication(s) present. Anticoagulation likely NOT appropriate until addressed.'; tone='warn'; }
  else if(chads >= 2){ rec = 'Recommend anticoagulation (e.g., DOAC) unless other risks prevail. Consider shared decision-making.'; tone='ok'; }
  else if(chads === 1){ rec = 'Consider anticoagulation based on patient values and bleeding risk.'; tone='ok'; }
  else { rec = 'Anticoagulation generally not indicated; re-evaluate if risk profile changes.'; tone='ok'; }

  const egfr = (patient.patient_gfr !== undefined ? Number(patient.patient_gfr) : null);
  const interactionNotes = [];
  if(egfr !== null && !Number.isNaN(egfr) && egfr < 30){ interactionNotes.push('Impaired renal function — check DOAC dose/choice.'); }

  const medsTrue = [
    interactions.Aspirin ? 'Aspirin' : null,
    interactions.Clopidogrel ? 'Clopidogrel' : null,
    interactions.NSAID ? 'NSAID' : null,
    interactions.SSRI_or_SNRI ? 'SSRI/SNRI' : null,
  ].filter(Boolean);
  if(medsTrue.length){ interactionNotes.push(`Concomitant meds: ${medsTrue.join(', ')}.`); }

  const extraDrugs = Array.isArray(interactions.interacting_drug_list) ? interactions.interacting_drug_list : [];
  if(extraDrugs.length){ interactionNotes.push(`Other interacting drugs: ${extraDrugs.join(', ')}.`); }

  if(interactions.derived_PPI_indication){
    const reasons = [];
    if(interactions.derived_dual_antiplatelet_therapy) reasons.push('dual antiplatelet therapy');
    if(interactions.NSAID) reasons.push('NSAID');
    if(interactions.SSRI_or_SNRI) reasons.push('SSRI/SNRI');
    interactionNotes.push(`PPI recommended (${reasons.join(', ')}).`);
  } else {
    interactionNotes.push('PPI not routinely indicated from current inputs.');
  }

  if(interactions['interacting drugs']){
    const gates = [];
    if(interactions.derived_age_RF) gates.push('age ≥75');
    if(interactions.derived_GFR_RF) gates.push('GFR <50');
    if(interactions.weight_under_60) gates.push('weight ≤60kg');
    if(gates.length){ interactionNotes.push(`Risk gates positive: ${gates.join(', ')}.`); }
  }

  return { text: rec, tone, interactionNotes };
}