(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))t(c);new MutationObserver(c=>{for(const l of c)if(l.type==="childList")for(const s of l.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function i(c){const l={};return c.integrity&&(l.integrity=c.integrity),c.referrerPolicy&&(l.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?l.credentials="include":c.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function t(c){if(c.ep)return;c.ep=!0;const l=i(c);fetch(c.href,l)}})();const $={0:()=>`
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
        <div id="creatinine-info-box" class="info-box">If serum creatinine is above 1000 µmol/L, enter 1000.</div>
      </label>
      <label class="label">GFR
        <div class="input-with-button-container">
          <input class="input" type="number" name="patient_gfr" min="0" max="120" inputmode="numeric" required />
          <!-- The new GFR info button -->
          <button type="button" class="info-btn" data-toggles="gfr-info-box">i</button>
        </div>
        <div class="help">0–120 (ml/min)</div>
        <!-- The new GFR info box -->
        <div id="gfr-info-box" class="info-box">If GFR is above 120 mL/min, enter 120.</div>
      </label>
    </div>
  </fieldset>
  `,1:()=>`
      <fieldset>
        <legend>CHADS-VASc</legend>
    
        <!-- Age group is now a display-only container -->
        <div class="mb-3">
          <label class="label">Age group</label>
          <div id="age-group-display" class="age-group-container">
            <span data-age-group="<65">&lt;65 years (0 points)</span>
            <span data-age-group="65-74">65-74 years (1 point)</span>
            <span data-age-group=">=75">&ge;75 years (2 points)</span>
          </div>
        </div>
    
        <div class="mb-3">
          <label class="label">Sex</label>
          <div class="grid">
            <label class="inline"><input type="radio" id="male" name="sex" value="0" required> <span>Male</span></label>
            <label class="inline"><input type="radio" id="female" name="sex" value="1" required> <span>Female</span></label>
          </div>
        </div>
    
        <p><strong>Does your patient have one or more of the following pre-existing conditions? Select all that apply</strong></p>
        <div class="grid">
          <label class="inline checkbox"><input type="checkbox" id="congestiveHF" name="congestiveHF" value="1"> Congestive Heart Failure</label>
          <label class="inline checkbox"><input type="checkbox" id="hypertension" name="hypertension" value="1"> Hypertension</label>
          <label class="inline checkbox"><input type="checkbox" id="diabetes" name="diabetes" value="1"> Diabetes Mellitus</label>
          <label class="inline checkbox"><input type="checkbox" id="strokeTIA" name="strokeTIA" value="2"> Stroke / TIA / Thromboembolism</label>
                <div class="checkbox-with-info">
        <label class="inline checkbox">
          <input type="checkbox" id="vascularDisease" name="vascularDisease" value="1">
          <span>Vascular Disease</span>
        </label>
        <button type="button" class="info-btn" data-toggles="vascular-disease-info-box">i</button>
        <div id="vascular-disease-info-box" class="info-box">
          Myocardial infarction (MI), peripheral artery disease (PAD), and aortic plaque.
        </div>
      </div>

          <label class="inline checkbox"><input type="checkbox" id="None" name="None" value="0"> None of the above</label>
        </div>
    
        <div class="notice ok" id="chads-preview" aria-live="polite">
          Score: <strong id="scoreResult">-</strong>
        </div>
      </fieldset>
    `,2:()=>`
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
    `,3:()=>`
  <fieldset>
    <legend>Drug-drug Interactions & Bleeding Risk</legend>
    
    <div class="section">
      <p class="instructions"><strong>Select all medications the patient is currently taking.</strong></p>
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
          <label class="inline checkbox"><input type="checkbox" name="none" /> None of the above</label>
        </div>
      </div>
    </div>

    <!-- This entire section is now hidden by default -->
    <div id="has-bled-section" style="display: none;">
      <hr class="divider">
      <div class="section">
        <p class="instructions"><strong>HAS-BLED Score for major bleeding risk.</strong></p>
        <div class="grid has-bled-grid">
          <label class="inline checkbox"><input type="checkbox" name="hb-hypertension" /> Uncontrolled Hypertension</label>
          <label class="inline checkbox"><input type="checkbox" name="hb-renal" /> Abnormal Renal Function</label>
          <label class="inline checkbox"><input type="checkbox" name="hb-liver" /> Abnormal Liver Function</label>
          <label class="inline checkbox"><input type="checkbox" name="hb-bleeding" /> Predisposition to bleeding</label>
          <label class="inline checkbox"><input type="checkbox" name="hb-labile-inr" /> Labile INR</label>
          <label class="inline checkbox"><input type="checkbox" name="hb-alcohol" /> Alcohol Abuse</label>
          
          <label class="inline checkbox disabled"><input type="checkbox" name="hb-stroke-derived" disabled /> Stroke History</label>
          <label class="inline checkbox disabled"><input type="checkbox" name="hb-elderly-derived" disabled /> Elderly (≥65)</label>
          <label class="inline checkbox disabled"><input type="checkbox" name="hb-drugs-derived" disabled /> Drugs (Antiplatelets/NSAID)</label>
        </div>
        <div class="notice ok" id="hasbled-preview" aria-live="polite">
          HAS-BLED Score: <strong id="hb-score">-</strong>
      </div>
    </div>
  </fieldset>
`,4:()=>`
  <fieldset>
    <legend>Summary & Recommendation</legend>
    
    <div class="summary-box">
      <h3>Patient Information</h3>
      <div id="summary-patient"></div>
    </div>

    <div class="summary-box">
      <h3>Indication (CHA₂DS₂-VASc)</h3>
      <div id="summary-indication"></div>
    </div>

    <div class="summary-box">
      <h3>Contraindications</h3>
      <div id="summary-contraindication"></div>
    </div>

    <div class="summary-box">
      <h3>Interactions & Bleeding Risk (HAS-BLED)</h3>
      <div id="summary-interactions"></div>
    </div>

    <div class="summary-box recommendation">
      <h3>Treatment Recommendation</h3>
      <p>If multiple DOACs are recommended, only choose one.</p>
      <ul id="recommendation-list">
        <!-- Dynamic content will be injected here -->
      </ul>
    </div>
  </fieldset>
`},u={patient:{},chadsvasc:{},contraindications:{},interactions:{},recommendation:{},hasbled:{}},O=["patient","chadsvasc","contraindications","interactions","recommendation"];function f(e){return e==null?"":String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function K(e){const n=new FormData(e),i={};for(const[t,c]of n.entries())i[t]=c;return e.querySelectorAll('input[type="checkbox"][name]').forEach(t=>{i[t.name]=t.checked}),e.querySelectorAll('input[type="number"][name]').forEach(t=>{const c=t.name;if(i[c]===""||i[c]==null)return;const l=Number(i[c]);i[c]=Number.isNaN(l)?i[c]:l}),i}function W(e,n){Object.entries(n||{}).forEach(([i,t])=>{const c=e.querySelector(`[name="${CSS.escape(i)}"]`);c&&(c.type==="checkbox"?c.checked=!!t:c.value=t)})}function U(e){return e>=75?{group:">=75",points:2}:e>=65?{group:"65-74",points:1}:{group:"<65",points:0}}function Y(e){const n=e.querySelectorAll(".info-btn[data-toggles]"),i=(t,c)=>{t.stopPropagation();const l=c.getAttribute("data-toggles"),s=e.querySelector(`#${l}`);s&&(s.classList.contains("is-visible"),e.querySelectorAll(".info-box.is-visible").forEach(a=>{a!==s&&a.classList.remove("is-visible")}),s.classList.toggle("is-visible"))};n.forEach(t=>{t.hasAttribute("data-listener-attached")||(t.setAttribute("data-listener-attached","true"),t.addEventListener("click",c=>i(c,t)))}),document.body.hasAttribute("data-infobox-listener-set")||(document.body.setAttribute("data-infobox-listener-set","true"),document.addEventListener("click",()=>{document.querySelectorAll(".info-box.is-visible").forEach(t=>{t.classList.remove("is-visible")})}))}function J(e){const n=e.chadsvasc||{};let i=0;return i+=Number(n.agePoints||0),n.sex&&(i+=n.sex==="F"?1:0),i+=n.chf?1:0,i+=n.hypertension?1:0,i+=n.diabetes?1:0,i+=n.stroke_or_tia?2:0,i+=n.vascular_disease?1:0,i}function Q(e,n){function i(){n.chadsvasc.sex=e.querySelector('input[name="sex"]:checked')?.id==="female"?"F":"M",n.chadsvasc.chf=e.querySelector("#congestiveHF")?.checked||!1,n.chadsvasc.hypertension=e.querySelector("#hypertension")?.checked||!1,n.chadsvasc.diabetes=e.querySelector("#diabetes")?.checked||!1,n.chadsvasc.stroke_or_tia=e.querySelector("#strokeTIA")?.checked||!1,n.chadsvasc.vascular_disease=e.querySelector("#vascularDisease")?.checked||!1;const s=J(n);n.chadsvasc.score=s,n.chadsvasc.derived_CHADSVASC_Score=s>=2;const a=document.getElementById("scoreResult");a&&(a.textContent=String(s))}Y(e);const t=Number(n.patient?.age);if(isFinite(t)){const{group:s,points:a}=U(t);n.chadsvasc.age_group=s,n.chadsvasc.agePoints=a;const d=e.querySelector("#age-group-display");if(d){d.querySelectorAll("span").forEach(p=>p.classList.remove("active"));const o=d.querySelector(`[data-age-group="${s}"]`);o&&o.classList.add("active")}}if(n.chadsvasc.sex){const s=n.chadsvasc.sex==="M"?"male":"female",a=e.querySelector(`#${s}`);a&&(a.checked=!0)}e.querySelector("#congestiveHF")&&(e.querySelector("#congestiveHF").checked=!!n.chadsvasc.chf),e.querySelector("#hypertension")&&(e.querySelector("#hypertension").checked=!!n.chadsvasc.hypertension),e.querySelector("#diabetes")&&(e.querySelector("#diabetes").checked=!!n.chadsvasc.diabetes),e.querySelector("#strokeTIA")&&(e.querySelector("#strokeTIA").checked=!!n.chadsvasc.stroke_or_tia),e.querySelector("#vascularDisease")&&(e.querySelector("#vascularDisease").checked=!!n.chadsvasc.vascular_disease),e.addEventListener("change",i);const c=e.querySelector("#None"),l=e.querySelectorAll('input[type="checkbox"]:not(#None)');return c&&c.addEventListener("change",()=>{const s=c.checked;l.forEach(a=>{a.disabled=s,s&&(a.checked=!1)}),e.dispatchEvent(new Event("change"))}),i(),()=>{e.removeEventListener("change",i)}}function Z(e,n){const i=a=>e.querySelector(`[name="${a}"]`),t=()=>n.chadsvasc?.sex||null;function c(){const a=i("ci_none"),d=["ci_active_bleeding","ci_endocarditis","ci_gi_ulcus_active","ci_liver_failure_child_c_or_coagulopathy","ci_pregnant_or_breastfeeding","ci_drugs"].map(i).filter(Boolean);a&&(a.addEventListener("change",()=>{const o=a.checked;d.forEach(p=>{o&&(p.checked=!1),p.disabled=o})}),d.forEach(o=>{o.addEventListener("change",()=>{o.checked&&(a.checked=!1)})}))}function l(){const a=e.querySelector("#pregnantField");if(!a)return;const d=t()==="F";if(a.hidden=!d,!d){const o=i("ci_pregnant_or_breastfeeding");o&&(o.checked=!1)}}function s(){const a=d=>!!i(d)?.checked;n.contraindications.ci_active_bleeding=a("ci_active_bleeding"),n.contraindications.ci_endocarditis=a("ci_endocarditis"),n.contraindications.ci_gi_ulcus_active=a("ci_gi_ulcus_active"),n.contraindications.ci_liver_failure_child_c_or_coagulopathy=a("ci_liver_failure_child_c_or_coagulopathy"),n.contraindications.ci_pregnant_or_breastfeeding=a("ci_pregnant_or_breastfeeding"),n.contraindications.ci_drugs=a("ci_drugs"),n.contraindications.ci_none=a("ci_none")}c(),l(),e.addEventListener("change",s),s()}const V=["amiodaron","chinidin","dronedaron","diltiazem","verapamil","erythromycin","naproxen","fluconazol","ciclosporin","tacrolimus"],ee=["aspirin","clopidogrel","nsaid","ssri"],H=[...ee,...V];function ie(e,n){const i=o=>e.querySelector(`[name="${o}"]`),t=o=>e.querySelector(`#${o}`);function c(){const o=i("none"),p=H.map(i).filter(Boolean);if(!o)return;const b=()=>{o.checked?p.forEach(h=>{h.checked=!1,h.disabled=!0}):p.forEach(h=>h.disabled=!1)};o.addEventListener("change",b),p.forEach(h=>{h.addEventListener("change",()=>{h.checked&&(o.checked=!1)})})}function l(){const o=i("hb-hypertension")?.checked||!1,p=i("hb-renal")?.checked||!1,b=i("hb-liver")?.checked||!1,h=i("hb-bleeding")?.checked||!1,g=i("hb-alcohol")?.checked||!1,v=i("hb-labile-inr")?.checked||!1,m=Number(n?.patient?.age),S=Number.isFinite(m)&&m>=65,k=!!n.chadsvasc?.stroke_or_tia;console.log(k);const _=(i("aspirin")?.checked||i("clopidogrel")?.checked||i("nsaid")?.checked)&&!i("none")?.checked,A=i("hb-elderly-derived");A&&(A.checked=S);const D=i("hb-stroke-derived");D&&(D.checked=k);const w=i("hb-drugs-derived");w&&(w.checked=_);const R=[["Hypertension",o],["Renal/Liver disease",p||b],["Stroke",k],["Predisposition to bleeding",h],["Labile INR",v],["Elderly (age ≥ 65)",S],["Drugs/Alcohol",_||g]].reduce((q,[,X])=>q+(X?1:0),0),F=t("hb-score");F&&(F.textContent=String(R));const B=V.some(q=>i(q)?.checked),P=t("has-bled-section");P&&(P.style.display=B?"block":"none"),n.hasbled={...n.hasbled,total_score:R,medication_condition_peak_lvl:B}}function s(){const o=i("none")?.checked||!1,p=i("aspirin")?.checked&&!o,b=i("clopidogrel")?.checked&&!o,h=i("nsaid")?.checked&&!o,g=i("ssri")?.checked&&!o,v=p&&b,m=v||h||g,S=p||b||h,k=H.filter(_=>i(_)?.checked&&!o);n.interactions={...n.interactions,None_of_the_above:o,Aspirin:p,Clopidogrel:b,NSAID:h,SSRI_or_SNRI:g,derived_dual_antiplatelet_therapy:v,derived_PPI_indication:m,derived_HASBLED_drugs_bleeding_predisposition:S,interacting_drug_list:k,"interacting drugs":k.length>0},l()}c();const a=i("hb-hypertension");a&&(a.disabled=n.chadsvasc?.hypertension===!1,a.disabled&&(a.checked=!1)),e.addEventListener("change",s);const d=i("none");d?.checked&&d.dispatchEvent(new Event("change")),s()}function ne(e){const n=e.querySelectorAll(".info-btn[data-toggles]"),i=(c,l)=>{c.stopPropagation();const s=l.getAttribute("data-toggles"),a=e.querySelector(`#${s}`);if(!a)return;const d=a.classList.contains("is-visible");e.querySelectorAll(".info-box.is-visible").forEach(o=>{o.classList.remove("is-visible")}),d||a.classList.add("is-visible")};n.forEach(c=>{c.addEventListener("click",l=>i(l,c))});const t=()=>{e.querySelectorAll(".info-box.is-visible").forEach(c=>{c.classList.remove("is-visible")})};document.addEventListener("click",t)}function te(e,n){const i=e.querySelector(".validation-message");i&&i.remove();const t=document.createElement("div");t.className="validation-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative my-4",t.setAttribute("role","alert"),t.textContent=n,e.prepend(t),setTimeout(()=>{t.remove()},5e3)}function ce(e){const n=e.querySelector(".validation-message");n&&n.remove();const i=h=>{const g=e.querySelector(h),v=!!g&&!!g.value.trim();return g&&g.classList.toggle("invalid",!v),v},t=(h,g,v)=>{const m=e.querySelector(h);if(!m)return!1;const S=m.value??"",k=S.trim()!=="",_=m.type==="number"?m.valueAsNumber:Number(S),A=k&&Number.isFinite(_)&&_>=g&&_<=v;return m.classList.toggle("invalid",!A),A},l=[i('[name="first_name"]'),i('[name="last_name"]'),t('[name="age"]',0,120),t('[name="patient_weight"]',0,300),t('[name="patient_kreatinin"]',0,1e3),t('[name="patient_gfr"]',0,120)].every(Boolean);l||te(e,"Please fill out all required fields correctly before proceeding.");const s=e.querySelector('[name="age"]'),a=s?s.value:"",d=s&&s.type==="number"?s.valueAsNumber:Number(a),o=a.trim()!==""&&Number.isFinite(d)&&d<18,p=e.querySelector('[name="patient_kreatinin"]'),b=Number(p);return{valid:l,underage:o,creaNum:b}}function ae(e){const{patient:n={},chadsvasc:i={},contraindications:t={},interactions:c={},hasbled:l={}}=e,s=(o,p)=>{const b=document.getElementById(o);b&&(b.innerHTML=p)};s("summary-patient",`
    <p><strong>Name:</strong> ${f(n.first_name||"N/A")} ${f(n.last_name||"")}</p>
    <p><strong>Age:</strong> ${f(n.age??"N/A")} years</p>
    <p><strong>Weight:</strong> ${f(n.patient_weight??"N/A")} kg</p>
    <p><strong>Creatinine:</strong> ${f(n.patient_kreatinin??"N/A")} µmol/l</p>
    <p><strong>GFR:</strong> ${f(n.patient_gfr??"N/A")} ml/min</p>
  `),s("summary-indication",`
    <p><strong>CHA₂DS₂-VASc Score:</strong> <strong class="score">${i.score??"N/A"}</strong></p>
    <p><strong>DOAC Indication:</strong> ${i.derived_CHADSVASC_Score?"Yes":"No"}</p>
  `);const a=[];t.derived_ci_age&&a.push("Patient is under 18"),t.ci_renal_failure&&a.push("Renal failure (GFR < 15)"),t.ci_active_bleeding&&a.push("Active bleeding"),s("summary-contraindication",`
    <p><strong>Absolute Contraindication Present:</strong> ${t.derived_absolute_contraindication?"Yes":"No"}</p>
    ${a.length>0?`<ul>${a.map(o=>`<li>${f(o)}</li>`).join("")}</ul>`:"<p>No specific contraindications recorded.</p>"}
  `),s("summary-interactions",`
    <p><strong>HAS-BLED Score:</strong> <strong class="score">${l.total_score??"N/A"}</strong></p>
    <p><strong>Interacting Drugs Selected:</strong> ${c["interacting drugs"]?"Yes":"No"}</p>
    ${c.interacting_drug_list?.length>0?`<p>Medications: ${f(c.interacting_drug_list.join(", "))}</p>`:""}
  `);const d=document.getElementById("summary-full-state");d&&(d.textContent=JSON.stringify(e,null,2))}function se(e){return[e.patient.age>=75,e.patient.patient_gfr<50,e.patient.weight<=60,e.interactions.NSAID,e.hasbled.total_score>=3].filter(Boolean).length>=2&&e.hasbled.medication_condition_peak_lvl}function T(e){return[e.patient.age>=80,e.patient.weight<=60,e.patient.creatinin>=133].filter(Boolean).length>=2||e.interactions.derived_dual_antiplatelet_therapy}function oe(e){const n=document.getElementById("recommendation-list");if(!n)return;const i=[],t=e.patient.patient_gfr;e.patient.age<18?i.push({text:"Consult Hematology",tone:"warn"}):e.chadsvasc.score<2?i.push({text:"No anticoagulation indicated.",tone:"warn"}):e.chadsvasc.score>=2&&t<15?i.push({text:"Vitamin K antagonist, e.g. Marcoumar.",tone:"warn"}):e.contraindications.derived_absolute_contraindication?i.push({text:"Vitamin K antagonist, e.g. Marcoumar.",tone:"warn"}):(T(e)?i.push({text:"Eliquis 2x2.5mg",tone:"warn"}):T(e)||i.push({text:"Eliquis 2x5mg",tone:"warn"}),t>=15&&t<=30?i.push({text:"Xarelto 1x10mg after hematology consultation.",tone:"warn"}):t>30&&t<50&&(e.interactions.Aspirin||e.interactions.Clopidogrel)?(i.push({text:"Xarelto 1x15mg",tone:"warn"}),i.push({text:"Xarelto 1x10mg",tone:"warn"})):t>30&&t<50&&!e.interactions.Aspirin&&!e.interactions.Clopidogrel?i.push({text:"Xarelto 1x15mg",tone:"warn"}):t>=50&&i.push({text:"Xarelto 1x20mg",tone:"warn"}),e.interactions.derived_PPI_indication&&i.push({text:"Consider additional PPI therapy.",tone:"warn"}),se(e)&&i.push({text:"Monitoring of peak plasma level (2–4 h after intake) is recommended.",tone:"warn"})),n.innerHTML=i.map(c=>`<li class="tone-${c.tone}">${f(c.text)}</li>`).join("")}const x=document.getElementById("questionary"),z=document.getElementById("btnPrev"),G=document.getElementById("btnNext"),j=document.getElementById("btnSubmit"),M=document.getElementById("stepper"),I=document.getElementById("progress-bar");let r=0;const y=Object.keys($).length;let C=()=>{};function N(e){return Math.max(0,Math.min(e,y-1))}function E(){const e=O[r];u[e]=K(x)}function le(){z.disabled=r===0;const e=r===y-1;G.style.display=e?"none":"",j.style.display=e?"":"none"}function re(){if(!I)return;const e=y>1?Math.round(r/(y-1)*100):0;I.style.width=`${e}%`,I.setAttribute("aria-valuenow",String(e))}function de(){if(!M)return;Array.from(M.querySelectorAll("[data-step]")).forEach(n=>{const i=Number(n.getAttribute("data-step"));n.classList.remove("is-active","is-done"),i<r?n.classList.add("is-done"):i===r&&n.classList.add("is-active")})}function ue(){if(r===0)return ne(x);if(r===1)return Q(x,u);if(r===2)return Z(x,u);if(r===3)return ie(x,u);if(r===4)try{ae(u),oe(u)}catch(e){console.error("Summary rendering failed:",e)}return()=>{}}function L(){typeof C=="function"&&C();const e=$[r];if(typeof e!="function")throw new Error(`No template for step ${r}`);if(x.innerHTML=e(),r!==1){const n=O[r];W(x,u[n]||{})}C=ue(),de(),le(),re()}function pe(){r=N(r-1),L()}function he(){let e=!0,n=-1;if(r===0){const i=ce(x);i.valid?(E(),u.contraindications.underage=i.underage,u.patient.creatinin=i.creaNum,n=i.underage?y-1:N(r+1)):e=!1}else if(r===1)if(!u.chadsvasc.sex)e=!1,alert("Please select a sex before proceeding.");else{const i=u.chadsvasc.score,t=u.patient.patient_gfr;i<2?(n=y-1,u.contraindications.ci_renal_failure=!1):i>=2&&t<15?(u.contraindications.ci_renal_failure=!0,n=y-1):n=N(r+1)}else if(r===2){E();const i=[u.contraindications.ci_active_bleeding,u.contraindications.ci_endocarditis,u.contraindications.ci_gi_ulcus_active,u.contraindications.ci_liver_failure_child_c_or_coagulopathy,u.contraindications.ci_pregnant_or_breastfeeding,u.contraindications.ci_drugs,u.contraindications.ci_renal_failure].some(Boolean);u.contraindications.derived_absolute_contraindication=i,i?n=y-1:n=N(r+1)}else r===3&&(n=N(r+1));e&&n!==-1&&(r=n,L())}function be(e){e?.preventDefault?.(),E(),r=y-1,L()}z?.addEventListener("click",e=>{e.preventDefault(),pe()});G?.addEventListener("click",e=>{e.preventDefault(),he()});j?.addEventListener("click",be);document.addEventListener("DOMContentLoaded",()=>{L()});
