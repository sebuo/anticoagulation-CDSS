import {escapeHtml} from './utils.js';

/**
 * Populates all the summary boxes on the final page with data from the state.
 * @param {object} fullState - The complete application state object.
 */
export function renderSummary(fullState) {
    const {patient = {}, chadsvasc = {}, contraindications = {}, interactions = {}, hasbled = {}} = fullState;

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
/**
 export function buildAndRenderRecommendation(fullState) {
 const { patient = {}, chadsvasc = {}, contraindications = {}, interactions = {} } = fullState;
 const recommendationListEl = document.getElementById('recommendation-list');
 if (!recommendationListEl) return;

 // If there are absolute contraindications, show the Marcoumar recommendation and stop.
 if (contraindications.derived_absolute_contraindication) {
 recommendationListEl.innerHTML = `<li class="tone-warn">Marcoumar, usage of DOAC is contraindicated</li>`;
 return;
 }

 // --- Start building the list of recommendations ---
 const recommendations = [];

 // Get patient data with defaults
 const age = Number(patient.age ?? 0);
 const weight = Number(patient.patient_weight ?? 0);
 const krea = Number(patient.patient_kreatinin ?? 0);
 const gfr = Number(patient.patient_gfr ?? 0);

 // 1. Eliquis Dosage Logic
 if (age >= 80 || weight <= 60 || krea >= 133) {
 recommendations.push({ text: 'Eliquis 2x2.5mg', tone: 'ok' });
 } else {
 recommendations.push({ text: 'Eliquis 2x5mg', tone: 'ok' });
 }

 // 2. Xarelto Dosage Logic
 if (interactions.Aspirin || interactions.Clopidogrel || (gfr >= 30 && gfr < 50)) {
 recommendations.push({ text: 'Xarelto 1x15mg', tone: 'ok' });
 } else {
 // Assuming 20mg is the standard dose if no reduction is needed.
 recommendations.push({ text: 'Xarelto 1x20mg', tone: 'ok' });
 }

 // 3. Hematology Consultation Logic
 if (gfr > 15 && gfr <= 29) {
 recommendations.push({ text: 'Consult Hematology', tone: 'warn' });
 }

 // 4. PPI Recommendation Logic
 if (interactions.derived_PPI_indication) {
 recommendations.push({ text: 'PPI recommendation', tone: 'ok' });
 }

 // 5. Peak Level Control Logic
 // First, calculate the number of risk factors.
 const riskFactors = [
 age >= 75,
 weight <= 60,
 gfr < 50
 ];
 const derived_riskfactor_calculated = riskFactors.filter(Boolean).length;

 if (derived_riskfactor_calculated >= 2) {
 recommendations.push({ text: 'Peak level control recommended', tone: 'warn' });
 }

 // --- Render the final list ---
 if (recommendations.length > 0) {
 recommendationListEl.innerHTML = recommendations
 .map(rec => `<li class="tone-${rec.tone}">${escapeHtml(rec.text)}</li>`)
 .join('');
 } else {
 // Fallback message if no specific recommendations are generated.
 recommendationListEl.innerHTML = `<li>No specific treatment recommendations based on the provided data.</li>`;
 }
 */
function peakLvl(sf) {
    const risk_factor = [
        sf.patient.age >= 75,
        sf.patient.patient_gfr < 50,
        sf.patient.weight <= 60,
        sf.interactions.NSAID,
        sf.hasbled.total_score >= 3
    ]
    const count = risk_factor.filter(Boolean).length;
    return count >= 2 && sf.hasbled.medication_condition_peak_lvl
}

function eliquisDose(sf) {
    const eliquis_risk = [
        sf.patient.age >= 80,
        sf.patient.weight <= 60,
        sf.patient.creatinin >= 133,
    ]
    const count_eli = eliquis_risk.filter(Boolean).length;
    return count_eli >= 2 || sf.interactions.derived_dual_antiplatelet_therapy
}

export function buildAndRenderRecommendation(sf) {
    const recommendationListEl = document.getElementById('recommendation-list');
    if (!recommendationListEl) return;
    const recommendations = [];
    const GFR = sf.patient.patient_gfr;

    if (sf.patient.age < 18) {
        recommendations.push({text: 'Consult Hematology', tone: 'warn'});
    } else {
        if (sf.chadsvasc.score < 2) {
            recommendations.push({text: 'No anticoagulation indicated.', tone: 'warn'});
        } else {
            if ((sf.chadsvasc.score >= 2) && (GFR < 15)) {
                recommendations.push({text: 'Vitamin K antagonist, e.g. Marcoumar.', tone: 'warn'});
            } else {
                if (!!sf.contraindications.derived_absolute_contraindication) {
                    recommendations.push({text: 'Vitamin K antagonist, e.g. Marcoumar.', tone: 'warn'});
                } else {
                    if (eliquisDose(sf)) {
                        recommendations.push({text: 'Eliquis 2x2.5mg', tone: 'warn'});
                    } else if (!eliquisDose(sf)) {
                        recommendations.push({text: 'Eliquis 2x5mg', tone: 'warn'});
                    }
                    if ((GFR >= 15) && (GFR <= 30)) {
                        recommendations.push({text: 'Xarelto 1x10mg after hematology consultation.', tone: 'warn'});
                    } else if ((GFR > 30) && (GFR < 50) && (sf.interactions.Aspirin || sf.interactions.Clopidogrel)) {
                        recommendations.push({text: 'Xarelto 1x15mg', tone: 'warn'});
                        recommendations.push({text: 'Xarelto 1x10mg', tone: 'warn'});
                    } else if ((GFR > 30) && (GFR < 50) && !(sf.interactions.Aspirin) && !(sf.interactions.Clopidogrel)) {
                        recommendations.push({text: 'Xarelto 1x15mg', tone: 'warn'});
                    } else if (GFR >= 50) {
                        recommendations.push({text: 'Xarelto 1x20mg', tone: 'warn'});
                    }

                    if (!!sf.interactions.derived_PPI_indication) {
                        recommendations.push({text: 'Consider additional PPI therapy.', tone: 'warn'});
                    }
                    if (peakLvl(sf)) {
                        recommendations.push({
                            text: 'Monitoring of peak plasma level (2–4 h after intake) is recommended.',
                            tone: 'warn'
                        });
                    }
                }
            }
        }

    }

    recommendationListEl.innerHTML = recommendations
        .map(rec => `<li class="tone-${rec.tone}">${escapeHtml(rec.text)}</li>`)
        .join('');
}
