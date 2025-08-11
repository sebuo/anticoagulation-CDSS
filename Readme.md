# Clinical Decision Support Tool – DOAC Recommendation

This project is a browser-based clinical decision support system (CDSS) designed to calculate the CHA₂DS₂-VASc score for atrial fibrillation patients and recommend appropriate anticoagulant therapy (e.g., DOACs such as Apixaban and Rivaroxaban) based on patient-specific criteria.

The tool is implemented as a set of HTML/JavaScript pages that collect relevant patient information, apply clinical logic, and display therapy recommendations. Data is transferred between pages using JSON objects stored in `localStorage`, ensuring a smooth user flow without the need for a backend server.

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
