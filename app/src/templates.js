export const TEMPLATES = {
    0: () => /*html*/`
  <fieldset>
    <legend>Patient Information</legend>

    <!-- Row 1: First Name, Last Name -->
    <div class="grid">
      <label class="label">First Name
        <input class="input" type="text" name="first_name" pattern="\\S+" placeholder="e.g., Richi" required />
      </label>
      <label class="label">Last Name
        <input class="input" type="text" name="last_name" pattern="\\S+" placeholder="e.g., Meier" required />
      </label>
    </div>

    <!-- Row 2: Age, Weight -->
    <div class="grid">
      <label class="label">Age
        <input class="input" type="number" name="age" min="0" max="120" inputmode="numeric" required />
        <div class="help">0–120 years</div>
      </label>
      <label class="label">Weight
        <input class="input" type="number" name="patient_weight" min="0" max="300" inputmode="numeric" required />
        <div class="help">0–300 kg</div>
      </label>
    </div>

    <!-- Row 3: Creatinine, GFR -->
    <div class="grid">
      <label class="label">Creatinine
        <div class="input-with-button-container">
          <input class="input" type="number" name="patient_kreatinin" min="0" max="1000" inputmode="numeric" required />
          <!-- The button now uses a data-attribute to link to its info box -->
          <button type="button" class="info-btn" data-toggles="creatinine-info-box">i</button>
        </div>
        <div class="help">0–1000 µmol/l</div>
        <!-- The info box, hidden by default -->
        <div id="creatinine-info-box" class="info-box">Creatinine is a waste product from the normal breakdown of muscle tissue.</div>
      </label>
      <label class="label">GFR
        <div class="input-with-button-container">
          <input class="input" type="number" name="patient_gfr" min="0" max="120" inputmode="numeric" required />
          <!-- The new GFR info button -->
          <button type="button" class="info-btn" data-toggles="gfr-info-box">i</button>
        </div>
        <div class="help">0–120 (ml/min)</div>
        <!-- The new GFR info box -->
        <div id="gfr-info-box" class="info-box">Glomerular Filtration Rate</div>
      </label>
    </div>
  </fieldset>
  `,

    1: () => /*html*/`
      <fieldset>
        <legend>CHADS-VASc</legend>
    
        <!-- Age group is now a display-only container -->
        <div class="mb-3">
          <label class="label">Age group (determined from patient info)</label>
          <div id="age-group-display" class="age-group-container">
            <span data-age-group="<65">&lt;65 years (0 points)</span>
            <span data-age-group="65-74">65-74 years (1 point)</span>
            <span data-age-group=">=75">&ge;75 years (2 points)</span>
          </div>
        </div>
    
        <div class="mb-3">
          <label class="label">Sex</label>
          <div class="grid">
            <label class="inline"><input type="radio" id="male" name="sex" value="0"> <span>Male</span></label>
            <label class="inline"><input type="radio" id="female" name="sex" value="1"> <span>Female</span></label>
          </div>
        </div>
    
        <p><strong>Does your patient have one or more of the following pre-existing conditions? Select all that apply</strong></p>
        <div class="grid">
          <label class="inline checkbox"><input type="checkbox" id="congestiveHF" name="congestiveHF" value="1"> Congestive Heart Failure</label>
          <label class="inline checkbox"><input type="checkbox" id="hypertension" name="hypertension" value="1"> Hypertension</label>
          <label class="inline checkbox"><input type="checkbox" id="diabetes" name="diabetes" value="1"> Diabetes Mellitus</label>
          <label class="inline checkbox"><input type="checkbox" id="strokeTIA" name="strokeTIA" value="2"> Stroke / TIA / Thromboembolism</label>
          <label class="inline checkbox"><input type="checkbox"id="vascularDisease" name="vascularDisease" value="1"> Vascular Disease (MI, PAD, Aortic plaque)</label>
          <label class="inline checkbox"><input type="checkbox" id="None" name="None" value="0"> None of the above</label>
        </div>
    
        <div class="nav" style="margin-top:12px;">
          <button type="button" class="btn primary" id="calculateChadsScore">Calculate Score</button>
        </div>
    
        <div class="notice ok" id="chads-preview" aria-live="polite" style="margin-top:10px;">
          Score: <strong id="scoreResult">-</strong>
        </div>
      </fieldset>
    `,
    2: () => /*html*/`
      <fieldset>
        <legend>Contraindications</legend>
        <p class="instructions"><strong>Does your patient have one or more of the conditions and/or medications?</strong></p>
        <div class="grid">
            <div class="field">
              <label class="inline checkbox"><input type="checkbox" name="ci_active_bleeding" /> Active bleeding</label>
            </div>
            <div class="field">
              <label class="inline checkbox"><input type="checkbox" name="ci_endocarditis" /> Acute bacterial endocarditis</label>
            </div>
            <div class="field">
              <label class="inline checkbox"><input type="checkbox" name="ci_gi_ulcus_active" /> Active gastrointestinal ulcer</label>
            </div>
            <div class="field">
              <label class="inline checkbox"><input type="checkbox" name="ci_liver_failure_child_c_or_coagulopathy" /> Liver failure CHILD C or liver disease with coagulopathy</label>
            </div>
            <div class="field" id="pregnantField" hidden>
              <label class="inline checkbox"><input type="checkbox" name="ci_pregnant_or_breastfeeding" /> Pregnant or breastfeeding</label>
            </div>
            <div class="field">
              <label class="inline checkbox"><input type="checkbox" name="ci_drugs" /> One or more interacting medications present</label>
              <div class="help">
                Includes: rifampicin, carbamazepin, phenobarbital, phenytoin, St. John's wort, HIV-Protease inhibitor, azol-antimycotic, clarithromycin
              </div>
            </div>
            <div class="field">
              <label class="inline checkbox"><input type="checkbox" name="ci_none" /> None of the above</label>
            </div>
        </div>
      </fieldset>
    `,
    3: () => /*html*/`
      <fieldset>
        <legend>Drug-drug Interactions</legend>
        <div class="medications">
          <div class="grid" role="group" aria-label="Medications">
            <label class="inline checkbox"><input type="checkbox" class="med-check" name="aspirin" /> Aspirin (ASS)</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" name="clopidogrel" /> Clopidogrel</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" name="nsaid" /> NSAID</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" name="ssri" /> SSRI or SNRI</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" name="amiodaron"> Amiodaron</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" name="chinidin"> Chinidin</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" name="dronedaron"> Dronedaron</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" name="diltiazem"> Diltiazem</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" name="verapamil"> Verapamil</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" name="erythromycin"> Erythromycin</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" name="naproxen"> Naproxen</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" name="fluconazol"> Fluconazol</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" name="ciclosporin"> Ciclosporin</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" name="tacrolimus"> Tacrolimus</label>
          </div>
        </div>
      </fieldset>
    `,

    4: () => /*html*/`
  <fieldset>
    <legend>Summary</legend>
    
    <div class="summary-box">
      <h3>Patient Information</h3>
      <div id="summary-patient"></div>
    </div>

    <div class="summary-box">
      <h3>Indication</h3>
      <div id="summary-indication"></div>
    </div>

    <div class="summary-box">
      <h3>Contraindication</h3>
      <div id="summary-contraindication"></div>
    </div>

    <div class="summary-box">
      <h3>Drug-drug Interaction</h3>
      <div id="summary-interactions"></div>
    </div>

    <div class="summary-box recommendation">
      <h3>Treatment Recommendation</h3>
      <ul id="recommendation-list">
        <!-- Dynamic content here -->
      </ul>
    </div>
  </fieldset>
`,
};
