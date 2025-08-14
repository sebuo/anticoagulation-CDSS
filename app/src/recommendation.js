/**
 * @file recommendation.js
 * This file handles the rendering of the final summary and recommendation page.
 * It takes the complete application state and uses it to populate summary boxes
 * and to calculate the final clinical recommendation based on a set of rules.
 */

import {escapeHtml} from './utils.js';

/**
 * Populates all the summary boxes on the final page with data from the state.
 * This function provides a human-readable overview of all the data collected.
 * @param {object} fullState - The complete application state object.
 */
export function renderSummary(fullState) {
    // Destructure the state object with default empty objects to prevent errors.
    const {patient = {}, chadsvasc = {}, contraindications = {}, interactions = {}, hasbled = {}} = fullState;

    /**
     * Helper function to find an element by its ID and safely set its innerHTML.
     * @param {string} id - The ID of the target element.
     * @param {string} content - The HTML content to set.
     */
    const renderTo = (id, content) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = content;
    };

    // 1. Render Patient Information Summary
    renderTo('summary-patient', `
    <p><strong>Name:</strong> ${escapeHtml(patient.first_name || 'N/A')} ${escapeHtml(patient.last_name || '')}</p>
    <p><strong>Age:</strong> ${escapeHtml(patient.age ?? 'N/A')} years</p>
    <p><strong>Weight:</strong> ${escapeHtml(patient.patient_weight ?? 'N/A')} kg</p>
    <p><strong>Creatinine:</strong> ${escapeHtml(patient.patient_kreatinin ?? 'N/A')} µmol/l</p>
    <p><strong>GFR:</strong> ${escapeHtml(patient.patient_gfr ?? 'N/A')} ml/min</p>
  `);

    // 2. Render Indication Summary (CHA₂DS₂-VASc Score)
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

    // 5. Render the full state object for debugging purposes.
    const fullStateEl = document.getElementById('summary-full-state');
    if (fullStateEl) {
        fullStateEl.textContent = JSON.stringify(fullState, null, 2);
    }
}

/**
 * Determines if monitoring of peak plasma level is recommended.
 * This is based on a count of several risk factors.
 * @param {object} sf - The full state object.
 * @returns {boolean} True if peak level monitoring is recommended.
 */
function peakLvl(sf) {
    const risk_factor = [
        sf.patient.age >= 75,
        sf.patient.patient_gfr < 50,
        sf.patient.weight <= 60,
        sf.interactions.NSAID,
        sf.hasbled.total_score >= 3
    ];
    const count = risk_factor.filter(Boolean).length;
    // Recommendation is triggered if 2 or more risk factors are present,
    // and a specific medication condition is met.
    return count >= 2 && sf.hasbled.medication_condition_peak_lvl;
}

/**
 * Determines the appropriate Eliquis dosage.
 * A reduced dose is recommended if the patient meets at least two specific criteria.
 * @param {object} sf - The full state object.
 * @returns {boolean} True if a reduced Eliquis dose is indicated.
 */
function eliquisDose(sf) {
    const eliquis_risk = [
        sf.patient.age >= 80,
        sf.patient.weight <= 60,
        sf.patient.creatinin >= 133,
    ];
    const count_eli = eliquis_risk.filter(Boolean).length;
    // Reduced dose if 2 or more risk factors are present, or if on dual antiplatelet therapy.
    return count_eli >= 2 || sf.interactions.derived_dual_antiplatelet_therapy;
}

/**
 * Builds the final list of treatment recommendations based on the entire state.
 * This function contains the core clinical decision logic of the application.
 * It evaluates all collected data and generates a list of actionable recommendations.
 * @param {object} sf - The full state object (short for "state full").
 */
export function buildAndRenderRecommendation(sf) {
    const recommendationListEl = document.getElementById('recommendation-list');
    if (!recommendationListEl) return;

    const recommendations = [];
    const GFR = sf.patient.patient_gfr;

    // --- Recommendation Logic Tree ---

    if (sf.patient.age < 18) {
        // Underage patients require a specialist consultation.
        recommendations.push({text: 'Consult Hematology', tone: 'warn'});
    } else {
        if (sf.chadsvasc.score < 2) {
            // Low CHA₂DS₂-VASc score means no anticoagulation is needed.
            recommendations.push({text: 'No anticoagulation indicated.', tone: 'warn'});
        } else {
            if ((sf.chadsvasc.score >= 2) && (GFR < 15)) {
                // High score but severe renal failure indicates a Vitamin K antagonist.
                recommendations.push({text: 'Vitamin K antagonist, e.g. Marcoumar.', tone: 'warn'});
            } else {
                if (!!sf.contraindications.derived_absolute_contraindication) {
                    // Any absolute contraindication also points to a Vitamin K antagonist.
                    recommendations.push({text: 'Vitamin K antagonist, e.g. Marcoumar.', tone: 'warn'});
                } else {
                    // --- DOAC Dosage Logic ---

                    // 1. Eliquis Dosage
                    if (eliquisDose(sf)) {
                        recommendations.push({text: 'Eliquis 2x2.5mg', tone: 'warn'});
                    } else {
                        recommendations.push({text: 'Eliquis 2x5mg', tone: 'warn'});
                    }

                    // 2. Xarelto Dosage (depends on GFR and interacting drugs)
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

                    // 3. Additional Recommendations
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

    // --- Render the final list into the DOM ---
    recommendationListEl.innerHTML = recommendations
        .map(rec => `<li class="tone-${rec.tone}">${escapeHtml(rec.text)}</li>`)
        .join('');
}
