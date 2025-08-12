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
  2: () => /*html*/`
      <fieldset>
        <legend>Contraindications</legend>
        <p class="instructions"><strong>Please tick all contraindications present for this patient. Multiple selections allowed.</strong></p>
        <p class="subnote">Some contraindications (e.g., renal failure) are assessed automatically from previous patient data.</p>

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
          <label class="inline checkbox"><input type="checkbox" id="ci_liver_failure_child_c_or_coagulopathy" name="ci_liver_failure_child_c_or_coagulopathy" /> Liver failure CHILD C or coagulopathy</label>
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
        <legend>Drug Interactions & PPI Indication</legend>
        <p class="help">Boolean inputs. Derived variables and recommendation compute instantly.</p>

        <!-- Base meds -->
        <div class="grid cols-2" role="group" aria-label="Base meds">
          <label class="inline checkbox"><input type="checkbox" id="aspirin" name="aspirin" /> Aspirin (ASS) <span class="help">Patient takes Aspirin (ASS)</span></label>
          <label class="inline checkbox"><input type="checkbox" id="clopidogrel" name="clopidogrel" /> Clopidogrel <span class="help">Patient takes Clopidogrel</span></label>
          <label class="inline checkbox"><input type="checkbox" id="nsaid" name="nsaid" /> NSAID <span class="help">Patient takes NSAIDs</span></label>
          <label class="inline checkbox"><input type="checkbox" id="ssri" name="ssri" /> SSRI or SNRI <span class="help">Patient takes an SSRI or SNRI</span></label>
        </div>

        <!-- Derived + Recommendation -->
        <div class="notice" aria-live="polite" id="ppiDerivedBox" style="margin-top:10px">
          <div>derived_dual_antiplatelet_therapy: <span id="dualBadge" class="badge">False</span></div>
          <div>derived_PPI_indication: <span id="ppiBadge" class="badge">False</span></div>
        </div>

        <div class="notice ok" aria-live="polite" id="ppiRecBox" style="margin-top:10px">
          <div><strong>PPI Recommendation</strong> <span id="ppiRec" class="badge">Not Recommended</span></div>
          <div id="explain" class="help"></div>
          <div class="help">Rule: <code>derived_PPI_indication = (dual_antiplatelet_therapy OR NSAID OR SSRI_or_SNRI)</code>.</div>
        </div>

        <!-- Additional interacting drugs (trigger block) -->
        <div style="margin-top:10px">
          <h3>Additional interacting drugs</h3>
          <p class="help">If any is checked, we evaluate three risk gates (from Patient step) and may expand a HAS-BLED form.</p>
          <div class="grid cols-2">
            <label class="inline checkbox"><input type="checkbox" id="amiodaron" name="amiodaron"> amiodaron</label>
            <label class="inline checkbox"><input type="checkbox" id="chinidin" name="chinidin"> chinidin</label>
            <label class="inline checkbox"><input type="checkbox" id="dronedaron" name="dronedaron"> dronedaron</label>
            <label class="inline checkbox"><input type="checkbox" id="diltiazem" name="diltiazem"> diltiazem</label>
            <label class="inline checkbox"><input type="checkbox" id="verapamil" name="verapamil"> verapamil</label>
            <label class="inline checkbox"><input type="checkbox" id="erythromycin" name="erythromycin"> erythromycin</label>
            <label class="inline checkbox"><input type="checkbox" id="naproxen" name="naproxen"> naproxen</label>
            <label class="inline checkbox"><input type="checkbox" id="fluconazol" name="fluconazol"> fluconazol</label>
            <label class="inline checkbox"><input type="checkbox" id="ciclosporin" name="ciclosporin"> ciclosporin</label>
            <label class="inline checkbox"><input type="checkbox" id="tacrolimus" name="tacrolimus"> tacrolimus</label>
          </div>

          <div class="notice" id="riskGates" hidden style="margin-top:10px">
            <div>Trigger active: <span id="drugTriggerBadge" class="badge">False</span></div>
            <div class="help" id="gateInputs">Inputs: age=—; weight=—; GFR=—</div>
            <div>age ≥ 75: <span id="ageGate" class="badge">False</span></div>
            <div>GFR &lt; 50: <span id="gfrGate" class="badge">False</span></div>
            <div>weight ≤ 60: <span id="wtGate" class="badge">False</span></div>
            <div><strong>Any gate true</strong>: <span id="anyGate" class="badge">False</span></div>
          </div>
        </div>

        <!-- HAS-BLED expandable stub -->
        <details id="hasBledBlock" hidden style="margin-top:10px">
          <summary>HAS-BLED Score (stub)</summary>
          <div class="notice" style="margin-top:8px">
            <p class="help">Auto-expanded when an interacting drug is present and any risk gate is true. Scoring logic to be implemented.</p>
            <div class="grid cols-2">
              <label class="inline checkbox"><input type="checkbox" id="hb-hypertension" name="hb-hypertension"> Uncontrolled Hypertension (SBP &gt; 160mmHg)</label>
              <label class="inline checkbox"><input type="checkbox" id="hb-abnormal" name="hb-abnormal"> Abnormal renal/liver</label>
              <label class="inline checkbox"><input type="checkbox" id="hb-stroke" name="hb-stroke"> Stroke history</label>
              <label class="inline checkbox"><input type="checkbox" id="hb-bleeding" name="hb-bleeding"> Bleeding history</label>
              <label class="inline checkbox"><input type="checkbox" id="hb-labile-inr" name="hb-labile-inr" disabled> Labile INR (N/A for DOAC)</label>
              <label class="inline checkbox"><input type="checkbox" id="hb-elderly" name="hb-elderly"> Elderly (&gt;65)</label>
              <label class="inline checkbox"><input type="checkbox" id="hb-drugs" name="hb-drugs"> Drugs/alcohol</label>
            </div>
          </div>
        </details>

        <div class="nav">
          <button type="button" id="resetInteractions" class="btn secondary" title="Clear Interactions step only">Reset</button>
        </div>
      </fieldset>
    `,
  4: () => /*html*/`
      <fieldset>
        <legend>Treatment Recommendation</legend>
        <div id="summary"></div>
        <hr />
        <div id="recommendationBox" class="notice ok"></div>
      </fieldset>
      <div class="output" id="finalJson"></div>
    `,
};