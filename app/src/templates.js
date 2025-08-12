export const TEMPLATES = {
    0: () => /*html*/`
      <fieldset>
        <legend>Patient Information</legend>
        <div class="grid cols-2">
          <label class="label">Patient Name
            <input class="input" type="text" name="patient_name" pattern="\\S+" placeholder="e.g., Richi" required />
            <div class="help">No whitespace allowed</div>
          </label>
          <label class="label">Age
            <input class="input" type="number" name="age" min="0" max="120" inputmode="numeric" required />
            <div class="help">0–120 years</div>
          </label>
        </div>
        <div class="grid cols-3">
          <label class="label">Weight (kg)
            <input class="input" type="number" name="patient_weight" min="0" max="300" inputmode="numeric" required />
            <div class="help">0–300 kg</div>
          </label>
          <label class="label">Kreatinin (µmol/l)
            <input class="input" type="number" name="patient_kreatinin" min="30" max="120" inputmode="numeric" required />
            <div class="help">30–120 µmol/l</div>
          </label>
          <label class="label">GFR
            <input class="input" type="number" name="patient_gfr" min="0" max="120" inputmode="numeric" required />
            <div class="help">0–120</div>
          </label>
        </div>
      </fieldset>
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
        <legend>Drug-drug Interactions</legend>
    
        <!-- All medications in one list -->
        <div class="medications">
          <div class="grid cols-2" role="group" aria-label="Medications">
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="aspirin" name="aspirin" /> Aspirin (ASS)</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="clopidogrel" name="clopidogrel" /> Clopidogrel</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="nsaid" name="nsaid" /> NSAID</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="ssri" name="ssri" /> SSRI or SNRI</label>
    
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="amiodaron" name="amiodaron"> amiodaron</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="chinidin" name="chinidin"> chinidin</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="dronedaron" name="dronedaron"> dronedaron</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="diltiazem" name="diltiazem"> diltiazem</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="verapamil" name="verapamil"> verapamil</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="erythromycin" name="erythromycin"> erythromycin</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="naproxen" name="naproxen"> naproxen</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="fluconazol" name="fluconazol"> fluconazol</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="ciclosporin" name="ciclosporin"> ciclosporin</label>
            <label class="inline checkbox"><input type="checkbox" class="med-check" id="tacrolimus" name="tacrolimus"> tacrolimus</label>
          </div>
    
          <!-- None of the above -->
          <div style="margin-top:10px">
            <label class="inline checkbox"><input type="checkbox" id="none" name="none"> None of the above</label>
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
            <label class="inline checkbox"><input type="checkbox" id="hb-drugs" name="hb-drugs"> Drugs (antiplatelets/NSAIDs)</label>
            <label class="inline checkbox"><input type="checkbox" id="hb-alcohol" name="hb-alcohol"> Alcohol use</label>
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
        <legend>Treatment Recommendation</legend>
        <div id="summary"></div>
        <hr />
        <div id="recommendationBox" class="notice ok"></div>
      </fieldset>
      <div class="output" id="finalJson"></div>
    `,
};