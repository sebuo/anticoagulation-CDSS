(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&c(a)}).observe(document,{childList:!0,subtree:!0});function n(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(t){if(t.ep)return;t.ep=!0;const o=n(t);fetch(t.href,o)}})();const B={0:()=>`
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
          Myocardial infarction (MI), peripheral artery disease (PAD), and aortic plaque are all related to atherosclerosis, a condition where fatty deposits (plaque) build up in arteries.
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
      <ul id="recommendation-list">
        <!-- Dynamic content will be injected here -->
      </ul>
    </div>

    <!-- New box to display the full state object -->
    <div class="summary-box">
      <h3>Full State Object (for debugging)</h3>
      <pre id="summary-full-state" class="state-preview"></pre>
    </div>
  </fieldset>
`},g={patient:{},chadsvasc:{},contraindications:{},interactions:{},recommendation:{}},T=["patient","chadsvasc","contraindications","interactions","recommendation"];function m(i){return i==null?"":String(i).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function z(i){const e=new FormData(i),n={};for(const[c,t]of e.entries())n[c]=t;return i.querySelectorAll('input[type="checkbox"][name]').forEach(c=>{n[c.name]=c.checked}),i.querySelectorAll('input[type="number"][name]').forEach(c=>{const t=c.name;if(n[t]===""||n[t]==null)return;const o=Number(n[t]);n[t]=Number.isNaN(o)?n[t]:o}),n}function G(i,e){Object.entries(e||{}).forEach(([n,c])=>{const t=i.querySelector(`[name="${CSS.escape(n)}"]`);t&&(t.type==="checkbox"?t.checked=!!c:t.value=c)})}function j(i){return i>=75?{group:">=75",points:2}:i>=65?{group:"65-74",points:1}:{group:"<65",points:0}}function W(i){const e=i.querySelectorAll(".info-btn[data-toggles]"),n=(c,t)=>{c.stopPropagation();const o=t.getAttribute("data-toggles"),a=i.querySelector(`#${o}`);a&&(a.classList.contains("is-visible"),i.querySelectorAll(".info-box.is-visible").forEach(l=>{l!==a&&l.classList.remove("is-visible")}),a.classList.toggle("is-visible"))};e.forEach(c=>{c.hasAttribute("data-listener-attached")||(c.setAttribute("data-listener-attached","true"),c.addEventListener("click",t=>n(t,c)))}),document.body.hasAttribute("data-infobox-listener-set")||(document.body.setAttribute("data-infobox-listener-set","true"),document.addEventListener("click",()=>{document.querySelectorAll(".info-box.is-visible").forEach(c=>{c.classList.remove("is-visible")})}))}function K(i){const e=i.chadsvasc||{};let n=0;return n+=Number(e.agePoints||0),e.sex&&(n+=e.sex==="F"?1:0),n+=e.chf?1:0,n+=e.hypertension?1:0,n+=e.diabetes?1:0,n+=e.stroke_or_tia?2:0,n+=e.vascular_disease?1:0,n}function U(i,e){function n(){e.chadsvasc.sex=i.querySelector('input[name="sex"]:checked')?.id==="female"?"F":"M",e.chadsvasc.chf=i.querySelector("#congestiveHF")?.checked||!1,e.chadsvasc.hypertension=i.querySelector("#hypertension")?.checked||!1,e.chadsvasc.diabetes=i.querySelector("#diabetes")?.checked||!1,e.chadsvasc.stroke_or_tia=i.querySelector("#strokeTIA")?.checked||!1,e.chadsvasc.vascular_disease=i.querySelector("#vascularDisease")?.checked||!1;const a=K(e);e.chadsvasc.score=a,e.chadsvasc.derived_CHADSVASC_Score=a>=2;const l=document.getElementById("scoreResult");l&&(l.textContent=String(a))}W(i);const c=Number(e.patient?.age);if(isFinite(c)){const{group:a,points:l}=j(c);e.chadsvasc.age_group=a,e.chadsvasc.agePoints=l;const h=i.querySelector("#age-group-display");if(h){h.querySelectorAll("span").forEach(r=>r.classList.remove("active"));const s=h.querySelector(`[data-age-group="${a}"]`);s&&s.classList.add("active")}}if(e.chadsvasc.sex){const a=e.chadsvasc.sex==="M"?"male":"female",l=i.querySelector(`#${a}`);l&&(l.checked=!0)}i.querySelector("#congestiveHF")&&(i.querySelector("#congestiveHF").checked=!!e.chadsvasc.chf),i.querySelector("#hypertension")&&(i.querySelector("#hypertension").checked=!!e.chadsvasc.hypertension),i.querySelector("#diabetes")&&(i.querySelector("#diabetes").checked=!!e.chadsvasc.diabetes),i.querySelector("#strokeTIA")&&(i.querySelector("#strokeTIA").checked=!!e.chadsvasc.stroke_or_tia),i.querySelector("#vascularDisease")&&(i.querySelector("#vascularDisease").checked=!!e.chadsvasc.vascular_disease),i.addEventListener("change",n);const t=i.querySelector("#None"),o=i.querySelectorAll('input[type="checkbox"]:not(#None)');t&&t.addEventListener("change",()=>{const a=t.checked;o.forEach(l=>{l.disabled=a,a&&(l.checked=!1)}),i.dispatchEvent(new Event("change"))}),n()}function X(i,e){const n=s=>i.querySelector(`[name="${s}"]`),c=()=>e.chadsvasc?.sex||null,t=()=>Number(e.patient?.age)||null,o=()=>Number(e.patient?.patient_gfr)||null;function a(){const s=n("ci_none"),r=["ci_active_bleeding","ci_endocarditis","ci_gi_ulcus_active","ci_liver_failure_child_c_or_coagulopathy","ci_pregnant_or_breastfeeding","ci_drugs"].map(n).filter(Boolean);s&&(s.addEventListener("change",()=>{const d=s.checked;r.forEach(b=>{d&&(b.checked=!1),b.disabled=d})}),r.forEach(d=>{d.addEventListener("change",()=>{d.checked&&(s.checked=!1)})}))}function l(){const s=i.querySelector("#pregnantField");if(!s)return;const r=c()==="F";if(s.hidden=!r,!r){const d=n("ci_pregnant_or_breastfeeding");d&&(d.checked=!1)}}function h(){e.contraindications.ci_active_bleeding=n("ci_active_bleeding")?.checked||!1,e.contraindications.ci_endocarditis=n("ci_endocarditis")?.checked||!1,e.contraindications.ci_gi_ulcus_active=n("ci_gi_ulcus_active")?.checked||!1,e.contraindications.ci_liver_failure_child_c_or_coagulopathy=n("ci_liver_failure_child_c_or_coagulopathy")?.checked||!1,e.contraindications.ci_pregnant_or_breastfeeding=n("ci_pregnant_or_breastfeeding")?.checked||!1,e.contraindications.ci_drugs=n("ci_drugs")?.checked||!1,e.contraindications.ci_none=n("ci_none")?.checked||!1;const s=t(),r=o();e.contraindications.derived_ci_age=s!==null&&s<18,e.contraindications.ci_renal_failure=r!==null&&r<15;const d=e.contraindications.derived_ci_age||e.contraindications.ci_renal_failure||e.contraindications.ci_active_bleeding||e.contraindications.ci_endocarditis||e.contraindications.ci_gi_ulcus_active||e.contraindications.ci_liver_failure_child_c_or_coagulopathy||e.contraindications.ci_pregnant_or_breastfeeding||e.contraindications.ci_drugs;e.contraindications.derived_absolute_contraindication=d}a(),l(),i.addEventListener("change",h),h()}const Y=["amiodaron","chinidin","dronedaron","diltiazem","verapamil","erythromycin","naproxen","fluconazol","ciclosporin","tacrolimus"],J=["aspirin","clopidogrel","nsaid","ssri"],R=[...J,...Y];function Q(i,e){const n=s=>i.querySelector(`[name="${s}"]`),c=s=>i.querySelector(`#${s}`);function t(){const s=n("none"),r=R.map(n).filter(Boolean);if(!s)return;const d=()=>{s.checked?r.forEach(b=>{b.checked=!1,b.disabled=!0}):r.forEach(b=>b.disabled=!1)};s.addEventListener("change",d),r.forEach(b=>{b.addEventListener("change",()=>{b.checked&&(s.checked=!1)})})}function o(){const s=n("hb-hypertension")?.checked||!1,r=n("hb-renal")?.checked||!1,d=n("hb-liver")?.checked||!1,b=n("hb-bleeding")?.checked||!1,p=n("hb-alcohol")?.checked||!1,_=n("hb-labile-inr")?.checked||!1,x=Number(e?.patient?.age),f=Number.isFinite(x)&&x>=65,v=!!e?.chadsvasc.strokeTIA,S=(n("aspirin")?.checked||n("clopidogrel")?.checked||n("nsaid")?.checked)&&!n("none")?.checked,C=n("hb-elderly-derived");C&&(C.checked=f);const E=n("hb-stroke-derived");E&&(E.checked=v);const D=n("hb-drugs-derived");D&&(D.checked=S);const q=[["Hypertension",s],["Renal/Liver disease",r||d],["Stroke",v],["Predisposition to bleeding",b],["Labile INR",_],["Elderly (age ≥ 65)",f],["Drugs/Alcohol",S||p]].reduce((O,[,V])=>O+(V?1:0),0),F=c("hb-score");F&&(F.textContent=String(q));const w=c("has-bled-section");w&&(w.style.display=q>0?"block":"none"),e.hasbled={...e.hasbled,total_score:q}}function a(){const s=n("none")?.checked||!1,r=n("aspirin")?.checked&&!s,d=n("clopidogrel")?.checked&&!s,b=n("nsaid")?.checked&&!s,p=n("ssri")?.checked&&!s,_=r&&d,x=_||b||p,f=r||d||b,v=R.filter(S=>n(S)?.checked&&!s);e.interactions={...e.interactions,None_of_the_above:s,Aspirin:r,Clopidogrel:d,NSAID:b,SSRI_or_SNRI:p,derived_dual_antiplatelet_therapy:_,derived_PPI_indication:x,derived_HASBLED_drugs_bleeding_predisposition:f,interacting_drug_list:v,"interacting drugs":v.length>0},o()}t();const l=n("hb-hypertension");l&&(l.disabled=e.chadsvasc?.hypertension===!1,l.disabled&&(l.checked=!1)),i.addEventListener("change",a);const h=n("none");h?.checked&&h.dispatchEvent(new Event("change")),a()}function Z(i){const e=i.querySelectorAll(".info-btn[data-toggles]"),n=(t,o)=>{t.stopPropagation();const a=o.getAttribute("data-toggles"),l=i.querySelector(`#${a}`);if(!l)return;const h=l.classList.contains("is-visible");i.querySelectorAll(".info-box.is-visible").forEach(s=>{s.classList.remove("is-visible")}),h||l.classList.add("is-visible")};e.forEach(t=>{t.addEventListener("click",o=>n(o,t))});const c=()=>{i.querySelectorAll(".info-box.is-visible").forEach(t=>{t.classList.remove("is-visible")})};document.addEventListener("click",c)}function ee(i,e){const n=i.querySelector(".validation-message");n&&n.remove();const c=document.createElement("div");c.className="validation-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative my-4",c.setAttribute("role","alert"),c.textContent=e,i.prepend(c),setTimeout(()=>{c.remove()},5e3)}function ie(i){const e=i.querySelector(".validation-message");e&&e.remove();const n=r=>{const d=i.querySelector(r),b=!!d&&!!d.value.trim();return d&&d.classList.toggle("invalid",!b),b},c=(r,d,b)=>{const p=i.querySelector(r);if(!p)return!1;const _=p.value??"",x=_.trim()!=="",f=p.type==="number"?p.valueAsNumber:Number(_),v=x&&Number.isFinite(f)&&f>=d&&f<=b;return p.classList.toggle("invalid",!v),v},o=[n('[name="first_name"]'),n('[name="last_name"]'),c('[name="age"]',0,120),c('[name="patient_weight"]',0,300),c('[name="patient_kreatinin"]',0,1e3),c('[name="patient_gfr"]',0,120)].every(Boolean);o||ee(i,"Please fill out all required fields correctly before proceeding.");const a=i.querySelector('[name="age"]'),l=a?a.value:"",h=a&&a.type==="number"?a.valueAsNumber:Number(l),s=l.trim()!==""&&Number.isFinite(h)&&h<18;return{valid:o,underage:s}}function ne(i){const{patient:e={},chadsvasc:n={},contraindications:c={},interactions:t={},hasbled:o={}}=i,a=(s,r)=>{const d=document.getElementById(s);d&&(d.innerHTML=r)};a("summary-patient",`
    <p><strong>Name:</strong> ${m(e.first_name||"N/A")} ${m(e.last_name||"")}</p>
    <p><strong>Age:</strong> ${m(e.age??"N/A")} years</p>
    <p><strong>Weight:</strong> ${m(e.patient_weight??"N/A")} kg</p>
    <p><strong>Creatinine:</strong> ${m(e.patient_kreatinin??"N/A")} µmol/l</p>
    <p><strong>GFR:</strong> ${m(e.patient_gfr??"N/A")} ml/min</p>
  `),a("summary-indication",`
    <p><strong>CHA₂DS₂-VASc Score:</strong> <strong class="score">${n.score??"N/A"}</strong></p>
    <p><strong>DOAC Indication:</strong> ${n.derived_CHADSVASC_Score?"Yes":"No"}</p>
  `);const l=[];c.derived_ci_age&&l.push("Patient is under 18"),c.ci_renal_failure&&l.push("Renal failure (GFR < 15)"),c.ci_active_bleeding&&l.push("Active bleeding"),a("summary-contraindication",`
    <p><strong>Absolute Contraindication Present:</strong> ${c.derived_absolute_contraindication?"Yes":"No"}</p>
    ${l.length>0?`<ul>${l.map(s=>`<li>${m(s)}</li>`).join("")}</ul>`:"<p>No specific contraindications recorded.</p>"}
  `),a("summary-interactions",`
    <p><strong>HAS-BLED Score:</strong> <strong class="score">${o.total_score??"N/A"}</strong></p>
    <p><strong>Interacting Drugs Selected:</strong> ${t["interacting drugs"]?"Yes":"No"}</p>
    ${t.interacting_drug_list?.length>0?`<p>Medications: ${m(t.interacting_drug_list.join(", "))}</p>`:""}
  `);const h=document.getElementById("summary-full-state");h&&(h.textContent=JSON.stringify(i,null,2))}function te(i){const{patient:e={},chadsvasc:n={},contraindications:c={},interactions:t={}}=i,o=document.getElementById("recommendation-list");if(!o)return;if(c.derived_absolute_contraindication){o.innerHTML='<li class="tone-warn">Marcoumar, usage of DOAC is contraindicated</li>';return}const a=[],l=Number(e.age??0),h=Number(e.patient_weight??0),s=Number(e.patient_kreatinin??0),r=Number(e.patient_gfr??0);l>=80||h<=60||s>=133?a.push({text:"Eliquis 2x2.5mg",tone:"ok"}):a.push({text:"Eliquis 2x5mg",tone:"ok"}),t.Aspirin||t.Clopidogrel||r>=30&&r<50?a.push({text:"Xarelto 1x15mg",tone:"ok"}):a.push({text:"Xarelto 1x20mg",tone:"ok"}),r>15&&r<=29&&a.push({text:"Consult Hematology",tone:"warn"}),t.derived_PPI_indication&&a.push({text:"PPI recommendation",tone:"ok"}),[l>=75,h<=60,r<50].filter(Boolean).length>=2&&a.push({text:"Peak level control recommended",tone:"warn"}),a.length>0?o.innerHTML=a.map(p=>`<li class="tone-${p.tone}">${m(p.text)}</li>`).join(""):o.innerHTML="<li>No specific treatment recommendations based on the provided data.</li>"}const y=document.getElementById("questionary"),H=document.getElementById("btnPrev"),M=document.getElementById("btnNext"),$=document.getElementById("btnSubmit"),P=document.getElementById("stepper"),I=document.getElementById("progress-bar");let u=0;const k=Object.keys(B).length;function A(i){return Math.max(0,Math.min(i,k-1))}function N(){const i=T[u];g[i]=z(y)}function ce(){H.disabled=u===0;const i=u===k-1;M.style.display=i?"none":"",$.style.display=i?"":"none"}function ae(){if(!I)return;const i=k>1?Math.round(u/(k-1)*100):0;I.style.width=`${i}%`,I.setAttribute("aria-valuenow",String(i))}function se(){if(!P)return;Array.from(P.querySelectorAll("[data-step]")).forEach(e=>{const n=Number(e.getAttribute("data-step"));e.classList.remove("is-active","is-done"),n<u?e.classList.add("is-done"):n===u&&e.classList.add("is-active")})}function oe(){if(u===0)Z(y);else if(u===1)U(y,g);else if(u===2)X(y,g);else if(u===3)Q(y,g);else if(u===4)try{ne(g),te(g)}catch(i){console.error("Summary rendering failed:",i)}}function L(){const i=B[u];if(typeof i!="function")throw new Error(`No template for step ${u}`);if(y.innerHTML=i(),u!==1){const e=T[u];G(y,g[e]||{})}oe(),se(),ce(),ae()}function le(){u=A(u-1),L()}function re(){let i=!0,e=-1;if(u===0){const n=ie(y);n.valid?(N(),e=n.underage?k-1:A(u+1)):i=!1}else u===1?g.chadsvasc.sex?e=g.chadsvasc.score<2?k-1:2:(i=!1,alert("Please select a sex before proceeding.")):u===2?(N(),g.contraindications.derived_absolute_contraindication?e=k-1:e=A(u+1)):u===3&&(N(),e=A(u+1));i&&e!==-1&&(u=e,L())}function de(i){i?.preventDefault?.(),N(),u=k-1,L()}H?.addEventListener("click",i=>{i.preventDefault(),le()});M?.addEventListener("click",i=>{i.preventDefault(),re()});$?.addEventListener("click",de);document.addEventListener("DOMContentLoaded",()=>{L()});
