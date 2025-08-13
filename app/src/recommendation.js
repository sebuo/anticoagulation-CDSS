import { escapeHtml } from './utils.js';

/**
 * Populates all the summary boxes on the final page with data from the state.
 * @param {object} fullState - The complete application state object.
 */
export function renderSummary(fullState) {
  const { patient = {}, chadsvasc = {}, contraindications = {}, interactions = {}, hasbled = {} } = fullState;

  // --- Helper to safely get an element and set its innerHTML ---
  const renderTo = (id, content) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = content;
  };

  // 1. Render Patient Information
  renderTo('summary-patient', `
    <p><strong>Name:</strong> ${escapeHtml(patient.first_name || 'N/A')} ${escapeHtml(patient.last_name || '')}</p>
    <p><strong>Age:</strong> ${escapeHtml(patient.age ?? 'N/A')} years</p>
    <p><strong>Weight:</strong> ${escapeHtml(patient.patient_weight ?? 'N/A')} kg</p>
    <p><strong>Creatinine:</strong> ${escapeHtml(patient.patient_kreatinin ?? 'N/A')} µmol/l</p>
    <p><strong>GFR:</strong> ${escapeHtml(patient.patient_gfr ?? 'N/A')} ml/min</p>
  `);

  // 2. Render Indication Summary
  renderTo('summary-indication', `
    <p><strong>CHA₂DS₂-VASc Score:</strong> <strong class="score">${chadsvasc.score ?? 'N/A'}</strong></p>
    <p><strong>DOAC Indication:</strong> ${chadsvasc.derived_CHADSVASC_Score ? 'Yes' : 'No'}</p>
  `);

  // 3. Render Contraindications Summary
  const contraReasons = [];
  if (contraindications.derived_ci_age) contraReasons.push('Patient is under 18');
  if (contraindications.ci_renal_failure) contraReasons.push('Renal failure (GFR < 15)');
  if (contraindications.ci_active_bleeding) contraReasons.push('Active bleeding');
  // ... add other contraindication reasons as needed
  renderTo('summary-contraindication', `
    <p><strong>Absolute Contraindication Present:</strong> ${contraindications.derived_absolute_contraindication ? 'Yes' : 'No'}</p>
    ${contraReasons.length > 0 ? `<ul>${contraReasons.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>` : '<p>No specific contraindications recorded.</p>'}
  `);

  // 4. Render Interactions & HAS-BLED Summary
  renderTo('summary-interactions', `
    <p><strong>HAS-BLED Score:</strong> <strong class="score">${hasbled.total_score ?? 'N/A'}</strong></p>
    <p><strong>Interacting Drugs Selected:</strong> ${interactions['interacting drugs'] ? 'Yes' : 'No'}</p>
    ${(interactions.interacting_drug_list?.length > 0) ? `<p>Medications: ${escapeHtml(interactions.interacting_drug_list.join(', '))}</p>` : ''}
  `);

  // 5. Render the full state object for debugging
  const fullStateEl = document.getElementById('summary-full-state');
  if (fullStateEl) {
    fullStateEl.textContent = JSON.stringify(fullState, null, 2);
  }
}


/**
 * Calculates the final recommendation and renders it into the recommendation list.
 * @param {object} fullState - The complete application state object.
 */
export function buildAndRenderRecommendation(fullState) {
  const { patient, chadsvasc, contraindications, interactions } = fullState;
  const recommendationListEl = document.getElementById('recommendation-list');
  if (!recommendationListEl) return;

  const chads = Number(chadsvasc.score ?? 0);
  const hasContra = !!contraindications.derived_absolute_contraindication;

  let rec, tone;
  if (hasContra) {
    rec = 'Absolute contraindication(s) present. Anticoagulation is NOT appropriate until addressed.';
    tone = 'warn';
  } else if (chads >= 2) {
    rec = 'Recommend anticoagulation (e.g., DOAC).';
    tone = 'ok';
  } else if (chads === 1) {
    rec = 'Consider anticoagulation based on patient values and bleeding risk.';
    tone = 'ok';
  } else {
    rec = 'Anticoagulation generally not indicated; re-evaluate if risk profile changes.';
    tone = 'ok';
  }

  const interactionNotes = [];
  const egfr = patient.patient_gfr ? Number(patient.patient_gfr) : null;
  if (egfr !== null && egfr < 30) {
    interactionNotes.push('Impaired renal function — check DOAC dose/choice.');
  }

  if (interactions.derived_PPI_indication) {
    interactionNotes.push('PPI recommended due to concomitant medications.');
  }

  // --- Render the final recommendation ---
  recommendationListEl.innerHTML = `
    <li class="tone-${tone}">${escapeHtml(rec)}</li>
    ${interactionNotes.map(note => `<li>${escapeHtml(note)}</li>`).join('')}
  `;
}
