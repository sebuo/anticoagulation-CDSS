/**
 * @file state.js
 * This file defines the central state management for the application.
 * It exports a single state object that holds all the data collected
 * from the user across the different steps of the questionnaire.
 */

/**
 * The global state object.
 * It's a single source of truth for all form data. Each top-level key
 * corresponds to a step in the wizard, and its value is an object
 * containing the data collected in that step.
 */
export const state = {
  patient: {},          // Holds data from the patient information step.
  chadsvasc: {},        // Holds data and scores from the CHA₂DS₂-VASc step.
  contraindications: {},// Holds data from the contraindications step.
  interactions: {},     // Holds data from the drug interactions step.
  recommendation: {},   // Reserved for the final recommendation details.
  hasbled: {},          // Holds data and scores for the HAS-BLED calculation.
};

/**
 * An array of keys that correspond to the steps of the wizard.
 * The order of keys in this array MUST match the order of the steps
 * in the UI and the order of the templates in `templates.js`.
 * This is used to associate form data with the correct part of the state object.
 */
export const stepKeys = ['patient','chadsvasc','contraindications','interactions','recommendation'];
