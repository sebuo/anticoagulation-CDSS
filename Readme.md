# Clinical Decision Support Tool – DOAC Recommendation

This project is a browser-based clinical decision support system (CDSS) designed to calculate the CHA₂DS₂-VASc score for atrial fibrillation patients and recommend appropriate anticoagulant therapy (e.g., DOACs such as Apixaban and Rivaroxaban) based on patient-specific criteria.

The tool is implemented as a set of HTML/JavaScript pages that collect relevant patient information, apply clinical logic, and display therapy recommendations. Data is transferred between pages using JSON objects stored in `localStorage`, ensuring a smooth user flow without the need for a backend server.

## *Todos*

- [ ] Patient Name: First and Lastname, so whitespace allowed
- [ ] ⁠Limitation: we do not check if combination age and weight is possible
- [ ] ⁠Limitation: We do not check if GFR is correct according to weight and krea.
- [ ] ⁠Krea max: 1000 (Akute dialysepflicht, lebensbedrohlich)
- [ ] ⁠Krea logik ist > oder < 133, darf jedoch nicht eingegeben werden
- [ ] ⁠CHADSVASC: Age_group ändern in age. nicht gruppe anzeigen. Age_group kann aktuell noch geändert werden.
- [ ] ⁠Pre-existing conditions: Does your patient have one or more of following conditions? check all which apply.
- [ ] ⁠Contraindications: your patient has an elevated CHADSVASC-score, indicating that anticoagulation is needed.
- [ ] ⁠Drug interactions: As one list. Does your patient take one or more of following medications. please check all which apply.
- [ ] ⁠Uncontrolled Hypertension should only be able to be checked if hypertension (found in chadsvasc) is true, else it is always false.
- [ ] ⁠Stroke history is predefined by chadsvasc- [ ]score input
- [ ] ⁠Elderly is predefined by age input
- [ ] ⁠Rewrite HAS-BLED score with correct wording
- [ ] age < 18 direkte weiteerleitung fehlt but shown in contraindications
- [ ] kreatinine field passt nicht mit limits im data dictionary
- [ ] chadsvasc button nicht korrekt gerrendert
- [ ] weiterleitung von page 1 funktioniert nur, wenn alles ausgefüllt! Wichtig! Was wenn nicht alle werte Verfügbar?
- [ ] readd info buttons?
- [ ] If any is checked, we evaluate three risk gates (from Patient step) and may expand a HAS-BLED form. Sound like additional work the way it is statet. -->Bias?
- [ ] if age = 120 year once the age grouping worked, once not --> keep an eye on it (mostly worked)

## Features

- Interactive UI with radio buttons, dropdowns, and checkboxes for easy data entry  
- CHA₂DS₂-VASc score calculation with real-time recommendations  
- DOAC therapy selection logic based on GFR, co-medications, and contraindications  
- Machine-readable JSON data for interoperability  
- EHR integration-ready architecture with future support for HL7 FHIR and other standards  
- Documentation for logic, implementation, and integration details  

## Project Structure

```bash
project/
│
├── index.html              # Main CHA₂DS₂-VASc scoring page  
├── contraindications.html  # Contraindication assessment page  
├── recommendation.html     # Therapy recommendation output  
│
├── js/
│   ├── chadvasc.js          # Score calculation logic  
│   ├── contraindications.js # Contraindication logic  
│   ├── recommendation.js    # Therapy recommendation logic  
│
├── documentation/          # Full project documentation  
│   ├── architecture.md  
│   ├── executable_layer.md  
│   ├── vision.md  
│   └── ...  
│
└── README.md  
````

## Documentation
The main documentation is located in the documentation folder. 

It includes:
* System architecture and layer descriptions
* Clinical decision logic and rulesets
* Implementation details
* Vision and integration roadmap

## Installation & Usage
Clone this repository:

```bash
git clone https://github.com/yourusername/project-name.git
cd project-name
````
