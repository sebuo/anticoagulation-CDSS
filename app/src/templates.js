export const TEMPLATES = {
  0: () => /*html*/`
    <fieldset>
  <legend>Patient Information</legend>

  <!-- Row 1: First Name, Last Name -->
  <div class="grid cols-2">
    <label class="label">First Name
      <input class="input" type="text" name="first_name" pattern="\S+" placeholder="e.g., Richi" required />
    </label>
    <label class="label">Last Name
      <input class="input" type="text" name="last_name" pattern="\S+" placeholder="e.g., Meier" required />
    </label>
  </div>

  <!-- Row 2: Age, Weight -->
  <div class="grid cols-2">
    <label class="label">Age
      <input class="input" type="number" name="age" min="0" max="120" inputmode="numeric" required />
      <div class="help">0–120 years</div>
    </label>
    <label class="label">Weight (kg)
      <input class="input" type="number" name="patient_weight" min="0" max="300" inputmode="numeric" required />
      <div class="help">0–300 kg</div>
    </label>
  </div>

  <!-- Row 3: Creatinine, GFR -->
<div class="grid cols-2">
<label class="label">Creatinine (µmol/l)
  <div class="creatinine-container">
    <input class="input" type="number" name="patient_kreatinin" min="30" max="120" inputmode="numeric" required />
    <button 
      type="button" 
      id="creatinine-info-btn" 
      style="border: none; background: none; cursor: pointer; font-size: 1.2em;">
      ℹ️
    </button>
    <div id="creatinine-info-box">
      If creatinine is above 1000 µmol/l, please enter 1000.
    </div>
  </div>
  <div class="help">0–1000 µmol/l</div>
</label>

  <label class="label">GFR (ml/min)
    <input class="input" type="number" name="patient_gfr" min="0" max="120" inputmode="numeric" required />
    <div class="help">0–120</div>
  </label>

<!-- Hidden info box -->
<div id="creatinine-info-box" 
     style="display:none; background:#eef6ff; padding:10px; border:1px solid #007bff; border-radius:5px; margin-top:5px; max-width:250px;">
  If creatinine is above 1000 µmol/l, please enter 1000.
</div>

<script>
  document.getElementById("creatinine-info-btn").addEventListener("click", function() {
    const infoBox = document.getElementById("creatinine-info-box");
    infoBox.style.display = infoBox.style.display === "none" ? "block" : "none";
  });
</script>
    `,
    1: () => /*html*/`
      <fieldset>
        <legend>CHA<sub>2</sub>DS<sub>2</sub>-VASc</legend>

        <div class="mb-3">
          <label class="label">Age group</label>
          <div class="grid">
            <label class="inline"><input type="radio" name="age" id="age1" value="0"> <span>&lt;18</span></label>
            <label class="inline"><input type="radio" name="age" id="age2" value="0"> <span>18-64</span></label>
            <label class="inline"><input type="radio" name="age" id="age3" value="1"> <span>65-74</span></label>
            <label class="inline"><input type="radio" name="age" id="age4" value="2"> <span>75-80</span></label>
            <label class="inline"><input type="radio" name="age" id="age5" value="2"> <span>&ge;80</span></label>
          </div>
          <div class="help">Auto-derived from Step 0 age when possible; you can still override.</div>
        </div>

        <div class="mb-3">
          <label class="label">Sex</label>
          <div class="grid">
            <label class="inline"><input type="radio" name="sex" id="male" value="0"> <span>Male</span></label>
            <label class="inline"><input type="radio" name="sex" id="female" value="1"> <span>Female</span></label>
          </div>
        </div>

        <p><strong>Pre-existing conditions</strong></p>
        <div class="grid cols-2">
          <label class="inline checkbox"><input type="checkbox" id="congestiveHF" name="congestiveHF" value="1"> Congestive Heart Failure</label>
          <label class="inline checkbox"><input type="checkbox" id="hypertension" name="hypertension" value="1"> Hypertension</label>
          <label class="inline checkbox"><input type="checkbox" id="diabetes" name="diabetes" value="1"> Diabetes Mellitus</label>
          <label class="inline checkbox"><input type="checkbox" id="strokeTIA" name="strokeTIA" value="2"> Stroke / TIA / Thromboembolism</label>
          <label class="inline checkbox"><input type="checkbox" id="vascularDisease" name="vascularDisease" value="1"> Vascular Disease (MI, PAD, Aortic plaque)</label>
        </div>

        <div class="notice ok" id="chads-preview" aria-live="polite">
          Score: <strong id="scoreResult">-</strong> — <span id="treatmentAdvice"></span>
        </div>
      </fieldset>
    `,
  2: () => /*html button CIJSON can be dropped*/`
      <fieldset>
        <legend>Contraindications</legend>
        <p class="instructions"><strong>Does your patient have one or more of the conditions and/or medications?</strong></p>

        <div class="field">
          <label class="inline checkbox"><input type="checkbox" id="ci_active_bleeding" name="ci_active_bleeding" /> Active bleeding</label>
        </div>
        <div class="field">
          <label class="inline checkbox"><input type="checkbox" id="ci_endocarditis" name="ci_endocarditis" /> Acute bacterial endocarditis</label>
        </div>
        <div class="field">
          <label class="inline checkbox"><input type="checkbox" id="ci_gi_ulcus_active" name="ci_gi_ulcus_active" /> Active gastrointestinal ulcer</label>
        </div>
        <div class="field">
          <label class="inline checkbox"><input type="checkbox" id="ci_liver_failure_child_c_or_coagulopathy" name="ci_liver_failure_child_c_or_coagulopathy" /> Liver failure CHILD C or liver disease with coagulopathy</label>
        </div>
        <div class="field" id="pregnantField" hidden>
          <label class="inline checkbox"><input type="checkbox" id="ci_pregnant_or_breastfeeding" name="ci_pregnant_or_breastfeeding" /> Pregnant or breastfeeding</label>
        </div>
        <div class="field">
          <label class="inline checkbox"><input type="checkbox" id="ci_drugs" name="ci_drugs" /> One or more interacting medications present</label>
          <div class="med-info">
            Includes: rifampicin, carbamazepin, phenobarbital, phenytoin, St. John's wort, HIV-Protease inhibitor, azol-antimycotic, clarithromycin
          </div>
        </div>
        <div class="field">
          <label class="inline checkbox"><input type="checkbox" id="ci_none" name="ci_none" /> None of the above</label>
        </div>

        <div class="nav">
          <button type="button" id="btnCICompute" class="btn">Check Contraindications</button>
          <button type="button" id="btnCIJson" class="btn secondary">Show JSON Output</button>
        </div>

        <div id="ciResult" class="notice" style="margin-top:12px" aria-live="polite"></div>

        <div class="notice" id="derivedFlags" style="margin-top:8px">
          <div>derived_ci_age (&lt;18): <span id="flag_ci_age" class="badge">False</span></div>
          <div>ci_renal_failure (GFR &lt; 15): <span id="flag_ci_renal" class="badge">False</span></div>
        </div>
      </fieldset>
    `,
    3: () => /*html*/`
      <fieldset>
        <legend>Drug-drug Interactions</legend>
        <!-- All medications in one list -->
        <div class="medications">
          <div class="grid cols-2" role="group" aria-label="Medications">
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="aspirin" name="aspirin" /> Aspirin (ASS)</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="clopidogrel" name="clopidogrel" /> Clopidogrel</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="nsaid" name="nsaid" /> NSAID</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="ssri" name="ssri" /> SSRI or SNRI</label>
            
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="amiodaron" name="amiodaron"> Amiodaron</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="chinidin" name="chinidin"> Chinidin</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="dronedaron" name="dronedaron"> Dronedaron</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="diltiazem" name="diltiazem"> Diltiazem</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="verapamil" name="verapamil"> Verapamil</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="erythromycin" name="erythromycin"> Erythromycin</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="naproxen" name="naproxen"> Naproxen</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="fluconazol" name="fluconazol"> Fluconazol</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="ciclosporin" name="ciclosporin"> Ciclosporin</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="tacrolimus" name="tacrolimus"> Tacrolimus</label>
          </div>
   
         <div class="none-of-above">
          <label class="inline checkbox">
            <input type="checkbox" id="none" name="none"> None of the Above
          </label>
        </div>
        </div>
    
        <!-- HAS-BLED (always visible) -->
        <div id="hasBled" class="notice" style="margin-top:10px">
          <summary>HAS-BLED Score</summary>
          <div class="grid cols-2" style="margin-top:8px">
            <label class="inline checkbox"><input type="checkbox" id="hb-hypertension" name="hb-hypertension"> Uncontrolled Hypertension (SBP &gt; 160mmHg)</label>
            <label class="inline checkbox"><input type="checkbox" id="hb-renal" name="hb-renal"> Renal disease</label>
            <label class="inline checkbox"><input type="checkbox" id="hb-liver" name="hb-liver"> Liver disease</label>
            <label class="inline checkbox"><input type="checkbox" id="hb-bleeding" name="hb-bleeding"> Bleeding history</label>
            <label class="inline checkbox"><input type="checkbox" id="hb-labile-inr" name="hb-labile-inr"> Labile INR</label>
            <label class="inline checkbox">
              <input type="checkbox" id="hb-drugs" name="hb-drugs" disabled title="Auto-calculated from Aspirin, Clopidogrel, NSAID">
                Drugs predisposing to bleeding (ASS/Clopidogrel/NSAIDs)
            </label>
            <label class="inline checkbox"><input type="checkbox" id="hb-alcohol" name="hb-alcohol"> Alcohol use (≥8 drinks/week)</label>
          </div>
          <div style="margin-top:8px">
            <div>Elderly (65+): <span id="hb-elderly-badge" class="badge">False</span></div>
            <div>Stroke history: <span id="hb-stroke-badge" class="badge">False</span></div>
          </div>
    
          <!-- Score (bottom) -->
          <div style="margin-top:10px">
            <strong>Total HAS-BLED:</strong> <span id="hb-score" class="badge">0</span>
          </div>
          <div id="hb-breakdown" style="margin-top:6px;"></div>
        </div>
    
        <div class="nav">
          <button type="button" id="resetInteractions" class="btn secondary" title="Clear Interactions step only">Reset</button>
        </div>
      </fieldset>
    `,

    4: () => /*html*/`
  <fieldset>
    <legend>Summary</legend>
    
    <!-- Patient Information -->
    <div class="summary-box">
      <h3>Patient Information</h3>
      <div id="summary-patient"></div>
    </div>

    <!-- Indication -->
    <div class="summary-box">
      <h3>Indication</h3>
      <div id="summary-indication"></div>
    </div>

    <!-- Contraindication -->
    <div class="summary-box">
      <h3>Contraindication</h3>
      <div id="summary-contraindication"></div>
    </div>

    <!-- Drug-drug Interactions -->
    <div class="summary-box">
      <h3>Drug-drug Interaction</h3>
      <div id="summary-interactions"></div>
    </div>

    <!-- Treatment Recommendation -->
    <div class="summary-box recommendation">
      <h3>Treatment Recommendation</h3>
      <ul id="recommendation-list" class="highlight-list">
        <!-- Example possible outputs -->
        <li>Eliquis 2 × 5 mg</li>
        <li>Eliquis 2 × 2.5 mg</li>
        <li>Xarelto 1 × 20 mg</li>
        <li>Xarelto 1 × 15 mg</li>
        <li>Xarelto 1 × 10 mg</li>
        <li>Marcoumar</li>
        <li>Consult hematology</li>
        <li>Consider additional PPI therapy</li>
        <li>Peak level monitoring after 2–4 h recommended</li>
      </ul>
    </div>
  </fieldset>

  <style>
    .summary-box {
      background: #f8f9fa;
      border: 1px solid #ccc;
      padding: 10px;
      margin-bottom: 12px;
      border-radius: 6px;
    }
    .summary-box h3 {
      margin-top: 0;
    }
    .highlight-list {
      list-style: none;
      padding: 0;
    }
    .highlight-list li {
      background: #e8f4ff;
      padding: 6px 8px;
      margin: 4px 0;
      border-left: 4px solid #007bff;
      border-radius: 4px;
    }
    .recommendation {
      background: #fff3cd;
      border-color: #ffeeba;
    }
  </style>
`,
};