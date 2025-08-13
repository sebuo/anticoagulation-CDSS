(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const p of a.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&s(p)}).observe(document,{childList:!0,subtree:!0});function e(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(t){if(t.ep)return;t.ep=!0;const a=e(t);fetch(t.href,a)}})();const j={0:()=>`
    <fieldset>
  <legend>Patient Information</legend>

  <!-- Row 1: First Name, Last Name -->
  <div class="grid cols-2">
    <label class="label">First Name
      <input class="input" type="text" name="first_name" pattern="S+" placeholder="e.g., Richi" required />
    </label>
    <label class="label">Last Name
      <input class="input" type="text" name="last_name" pattern="S+" placeholder="e.g., Meier" required />
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
<\/script>
    `,1:()=>`
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
    `,2:()=>`
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
    `,3:()=>`
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
    `,4:()=>`
      <fieldset>
        <legend>Treatment Recommendation</legend>
        <div id="summary"></div>
        <hr />
        <div id="recommendationBox" class="notice ok"></div>
      </fieldset>
      <div class="output" id="finalJson"></div>
    `},b={patient:{},chadsvasc:{},contraindications:{},interactions:{},recommendation:{}},I=["patient","chadsvasc","contraindications","interactions","recommendation"];function y(n){return n==null?"":String(n).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function V(n){if(n==null||Number.isNaN(Number(n)))return null;const i=Number(n);return i<18?"<18":i<=64?"18-64":i<=74?"65-74":i<80?"75-79":">=80"}function U(n){const i=new FormData(n),e={};for(const[s,t]of i.entries())e[s]=t;return n.querySelectorAll('input[type="checkbox"][name]').forEach(s=>{e[s.name]=s.checked}),n.querySelectorAll('input[type="number"][name]').forEach(s=>{const t=s.name;if(e[t]===""||e[t]==null)return;const a=Number(e[t]);e[t]=Number.isNaN(a)?e[t]:a}),e}function W(n,i){Object.entries(i||{}).forEach(([e,s])=>{const t=n.querySelector(`[name="${CSS.escape(e)}"]`);t&&(t.type==="checkbox"?t.checked=!!s:t.value=s)})}const $=["amiodaron","chinidin","dronedaron","diltiazem","verapamil","erythromycin","naproxen","fluconazol","ciclosporin","tacrolimus"],H={age1:"<18",age2:"18-64",age3:"65-74",age4:"75-80",age5:">=80"};function K(n){const i=n.chadsvasc||{};let e=0;return e+=Number(i.agePoints||0),e+=i.sex==="F"?1:0,e+=i.chf?1:0,e+=i.hypertension?1:0,e+=i.diabetes?1:0,e+=i.stroke_or_tia?2:0,e+=i.vascular_disease?1:0,e}function X(n,i,e){n.querySelector('input[name="age"]:checked'),n.querySelector('input[name="sex"]:checked');function s(){const a=n.querySelector('input[name="age"]:checked'),p=n.querySelector('input[name="sex"]:checked');let g=null,_=0;a&&(g=H[a.id]||null,_=Number(a.value)||0);let x=null;p&&(x=p.id==="male"?"M":"F");const m=n.querySelector("#congestiveHF")?.checked||!1,S=n.querySelector("#hypertension")?.checked||!1,u=n.querySelector("#diabetes")?.checked||!1,l=n.querySelector("#strokeTIA")?.checked||!1,f=n.querySelector("#vascularDisease")?.checked||!1;i.chadsvasc={...i.chadsvasc,age_group:g,agePoints:_,sex:x,chf:m,hypertension:S,diabetes:u,stroke_or_tia:l,vascular_disease:f};const c=K(i);i.chadsvasc.score=c,i.chadsvasc.derived_CHADSVASC_Score=c>=2;const r=document.getElementById("scoreResult"),o=document.getElementById("treatmentAdvice");r&&(r.textContent=String(c)),o&&(c<2?(o.textContent="No DOAK treatment indicated",o.className="advice-green"):(o.textContent="Continue with contraindication assessment",o.className="advice-red"))}n.addEventListener("change",s);const t=e(i.patient.age);if(t&&!i.chadsvasc.age_group){const a=Object.entries(H).find(([p,g])=>g===t)?.[0];if(a){const p=n.querySelector(`#${a}`);p&&(p.checked=!0)}i.chadsvasc.age_group=t,i.chadsvasc.agePoints=Number(n.querySelector(`#${a}`)?.value||0)}if(i.chadsvasc.sex){const a=i.chadsvasc.sex==="M"?"male":"female",p=n.querySelector(`#${a}`);p&&(p.checked=!0)}n.querySelector("#congestiveHF")&&(n.querySelector("#congestiveHF").checked=!!i.chadsvasc.chf),n.querySelector("#hypertension")&&(n.querySelector("#hypertension").checked=!!i.chadsvasc.hypertension),n.querySelector("#diabetes")&&(n.querySelector("#diabetes").checked=!!i.chadsvasc.diabetes),n.querySelector("#strokeTIA")&&(n.querySelector("#strokeTIA").checked=!!i.chadsvasc.stroke_or_tia),n.querySelector("#vascularDisease")&&(n.querySelector("#vascularDisease").checked=!!i.chadsvasc.vascular_disease),s()}function Q(n,i){const e=c=>n.querySelector(`#${c}`),s=c=>n.querySelector(`#${c}`);function t(){return i.chadsvasc?.sex||null}function a(){const c=Number(i.patient?.age);return Number.isNaN(c)?null:c}function p(){const c=Number(i.patient?.patient_gfr);return Number.isNaN(c)?null:c}function g(){const c=a(),r=p(),o=c!=null?c<18:!1,d=r!=null?r<15:!1;i.contraindications.derived_ci_age=o,i.contraindications.ci_renal_failure=d;const v=s("flag_ci_age"),k=s("flag_ci_renal");v&&(v.textContent=o?"True":"False"),k&&(k.textContent=d?"True":"False")}function _(){const c=e("pregnantField"),r=t();if(c){const o=r==="F";if(c.hidden=!o,!o){const d=e("ci_pregnant_or_breastfeeding");d&&(d.checked=!1)}i.contraindications.sex=r||void 0}}function x(){const c=e("ci_none"),r=["ci_active_bleeding","ci_endocarditis","ci_gi_ulcus_active","ci_liver_failure_child_c_or_coagulopathy","ci_pregnant_or_breastfeeding","ci_drugs"].filter(o=>e(o));c&&(c.addEventListener("change",()=>{c.checked?r.forEach(o=>{const d=e(o);d&&(d.checked=!1,d.disabled=!0)}):r.forEach(o=>{const d=e(o);d&&(d.disabled=!1)})}),r.forEach(o=>{const d=e(o);d&&d.addEventListener("change",()=>{d.checked?(c.checked=!1,c.disabled=!0):r.some(k=>e(k)?.checked)||(c.disabled=!1)})}))}function m(){const r=["ci_active_bleeding","ci_endocarditis","ci_gi_ulcus_active","ci_liver_failure_child_c_or_coagulopathy","ci_pregnant_or_breastfeeding","ci_drugs","ci_none"].filter(d=>e(d)).some(d=>!!e(d)?.checked),o=e("btnCICompute");o&&(o.disabled=!r)}function S(){["ci_active_bleeding","ci_endocarditis","ci_gi_ulcus_active","ci_liver_failure_child_c_or_coagulopathy","ci_pregnant_or_breastfeeding","ci_drugs","ci_none"].filter(r=>e(r)).forEach(r=>{const o=e(r);o&&o.addEventListener("change",()=>{m()})})}function u(){const c=[];return i.contraindications.derived_ci_age&&c.push("Patient is under 18 years old"),i.contraindications.ci_renal_failure&&c.push("Renal failure (GFR < 15)"),e("ci_active_bleeding")?.checked&&c.push("Active bleeding"),e("ci_endocarditis")?.checked&&c.push("Acute bacterial endocarditis"),e("ci_gi_ulcus_active")?.checked&&c.push("Active gastrointestinal ulcer"),e("ci_liver_failure_child_c_or_coagulopathy")?.checked&&c.push("Liver failure CHILD C or liver disease with coagulopathy"),t()==="F"&&e("ci_pregnant_or_breastfeeding")?.checked&&c.push("Pregnant or breastfeeding"),e("ci_drugs")?.checked&&c.push("Interacting medication present"),c}function l(){["ci_active_bleeding","ci_endocarditis","ci_gi_ulcus_active","ci_liver_failure_child_c_or_coagulopathy","ci_pregnant_or_breastfeeding","ci_drugs","ci_none"].forEach(v=>{const k=e(v);k&&(i.contraindications[v]=!!k.checked)}),g();const c=u(),o=!(i.contraindications.ci_none===!0)&&c.length>0;i.contraindications.derived_absolute_contraindication=o;const d=e("ciResult");d&&(o?(d.classList.remove("ok"),d.classList.add("warn"),d.innerHTML="<strong>Absolute contraindications found:</strong><ul>"+c.map(v=>`<li>${y(v)}</li>`).join("")+"</ul><p><strong>Patient is NOT eligible for DOAC therapy.</strong></p>"):(d.classList.remove("warn"),d.classList.add("ok"),d.innerHTML="<strong>No contraindications detected. Patient is eligible for DOAC therapy.</strong>"))}function f(){l();const c={ci_none:!!e("ci_none")?.checked,ci_active_bleeding:!!e("ci_active_bleeding")?.checked,ci_endocarditis:!!e("ci_endocarditis")?.checked,ci_gi_ulcus_active:!!e("ci_gi_ulcus_active")?.checked,ci_liver_failure_child_c_or_coagulopathy:!!e("ci_liver_failure_child_c_or_coagulopathy")?.checked,ci_pregnant_or_breastfeeding:t()==="F"?!!e("ci_pregnant_or_breastfeeding")?.checked:!1,ci_drugs:!!e("ci_drugs")?.checked,derived_ci_age:!!i.contraindications.derived_ci_age,ci_renal_failure:!!i.contraindications.ci_renal_failure,sex:t()},r=e("ciResult");r&&(r.classList.remove("warn","ok"),r.innerHTML=`<pre>${y(JSON.stringify(c,null,2))}</pre>`)}e("btnCICompute")?.addEventListener("click",l),e("btnCIJson")?.addEventListener("click",f),n.addEventListener("change",c=>{["INPUT","SELECT","TEXTAREA"].includes(c.target.tagName)&&g()}),_(),g(),x(),m(),S(),l()}function Y(n,i){const e=u=>n.querySelector(`#${u}`),s="none",a=[...["aspirin","clopidogrel","nsaid","ssri"],...$];function p(u){const l=e(s);if(!l)return;const f=u?.target?.id;if(f===s&&l.checked){a.forEach(c=>{const r=e(c);r&&(r.checked=!1)});return}a.includes(f)&&e(f)?.checked&&(l.checked=!1)}function g(){const u=!!e(s)?.checked,l=!u&&!!e("aspirin")?.checked,f=!u&&!!e("clopidogrel")?.checked,c=!u&&!!e("nsaid")?.checked,r=!u&&!!e("ssri")?.checked,o=l&&f,d=o||c||r;i.interactions={...i.interactions,None_of_the_above:u,Aspirin:l,Clopidogrel:f,NSAID:c,SSRI_or_SNRI:r,derived_dual_antiplatelet_therapy:o,derived_PPI_indication:d}}function _(){const u=$.filter(l=>e(l)?.checked);i.interactions.interacting_drug_list=u,i.interactions["interacting drugs"]=u.length>0}function x(){const u=!!e("hb-hypertension")?.checked,l=!!e("hb-renal")?.checked,f=!!e("hb-liver")?.checked,c=!!e("hb-bleeding")?.checked,r=!!e("hb-drugs")?.checked,o=!!e("hb-alcohol")?.checked,d=!!e("hb-labile-inr")?.checked,v=Number(i?.patient?.age),k=Number.isFinite(v)&&v>=65,A=i?.chadsvasc||{},F=!!(A.stroke_TIA||A.strokeTIA||A.stroke||A.TIA||A.priorStroke||A.prior_TIA),T=e("hb-elderly-badge");T&&(T.textContent=k?"True":"False");const w=e("hb-stroke-badge");w&&(w.textContent=F?"True":"False");const q=[["Hypertension",u],["Renal disease",l],["Liver disease",f],["Stroke history",F],["Bleeding history",c],["Labile INR",d],["Elderly (65+)",k],["Drugs (antiplatelets/NSAIDs)",r],["Alcohol use",o]],E=q.reduce((C,[L,J])=>C+(J?1:0),0),B=e("hb-score");B&&(B.textContent=String(E));const P=e("hb-breakdown");if(P){const C=q.filter(([,L])=>L).map(([L])=>L);P.textContent=C.length?`Contributors: ${C.join(", ")}`:"Contributors: none"}i.hasbled={hypertension_uncontrolled:u,renal_disease:l,liver_disease:f,stroke_history:F,bleeding_history:c,labile_inr:!1,elderly_65_plus:k,drugs_antiplatelets_nsaids:r,alcohol_use:o,total_score:E}}function m(){g(),_(),x()}n.addEventListener("change",u=>{p(u),m()});const S=e("resetInteractions");S&&S.addEventListener("click",()=>{[s,...a,"hb-hypertension","hb-renal","hb-liver","hb-bleeding","hb-drugs","hb-alcohol"].forEach(u=>{const l=e(u);l&&(l.checked=!1)}),m()}),e(s)?.checked&&a.forEach(u=>{const l=e(u);l&&(l.checked=!1)}),m()}function Z(n){const i=n.patient||{},e=n.chadsvasc||{};return n.contraindications,`
      <div class="grid cols-2">
        <div>
          <h3>Patient</h3>
          <div class="notice">
            Name: ${y(i.patient_name||"—")}<br/>
            Age: ${y(i.age??"—")}<br/>
            Weight: ${y(i.patient_weight??"—")} kg<br/>
            Kreatinin: ${y(i.patient_kreatinin??"—")} µmol/l<br/>
            GFR: ${y(i.patient_gfr??"—")}
          </div>
        </div>
        <div>
          <h3>CHA₂DS₂-VASc</h3>
          <div class="notice">
            Age group: ${y(e.age_group||"—")}<br/>
            Sex: ${y(e.sex||"—")}<br/>
            Score: <strong>${e.score??"—"}</strong><br/>
            DOAC indication (derived): <strong>${e.derived_CHADSVASC_Score?"True":"False"}</strong>
          </div>
          <div class="notice" style="margin-top:6px">
            <strong>Contraindications</strong><br/>
            Absolute CI (derived): <strong>${n.contraindications?.derived_absolute_contraindication?"True":"False"}</strong><br/>
            Under 18: ${n.contraindications?.derived_ci_age?"True":"False"}; Renal failure (GFR <15): ${n.contraindications?.ci_renal_failure?"True":"False"}
          </div>
        </div>
      </div>
    `}function ee(n){const{patient:i,chadsvasc:e,contraindications:s,interactions:t}=n,a=Number(e.score??0),p=!!s.derived_absolute_contraindication;let g,_;p?(g="Absolute contraindication(s) present. Anticoagulation likely NOT appropriate until addressed.",_="warn"):a>=2?(g="Recommend anticoagulation (e.g., DOAC) unless other risks prevail. Consider shared decision-making.",_="ok"):a===1?(g="Consider anticoagulation based on patient values and bleeding risk.",_="ok"):(g="Anticoagulation generally not indicated; re-evaluate if risk profile changes.",_="ok");const x=i.patient_gfr!==void 0?Number(i.patient_gfr):null,m=[];x!==null&&!Number.isNaN(x)&&x<30&&m.push("Impaired renal function — check DOAC dose/choice.");const S=[t.Aspirin?"Aspirin":null,t.Clopidogrel?"Clopidogrel":null,t.NSAID?"NSAID":null,t.SSRI_or_SNRI?"SSRI/SNRI":null].filter(Boolean);S.length&&m.push(`Concomitant meds: ${S.join(", ")}.`);const u=Array.isArray(t.interacting_drug_list)?t.interacting_drug_list:[];if(u.length&&m.push(`Other interacting drugs: ${u.join(", ")}.`),t.derived_PPI_indication){const l=[];t.derived_dual_antiplatelet_therapy&&l.push("dual antiplatelet therapy"),t.NSAID&&l.push("NSAID"),t.SSRI_or_SNRI&&l.push("SSRI/SNRI"),m.push(`PPI recommended (${l.join(", ")}).`)}else m.push("PPI not routinely indicated from current inputs.");if(t["interacting drugs"]){const l=[];t.derived_age_RF&&l.push("age ≥75"),t.derived_GFR_RF&&l.push("GFR <50"),t.weight_under_60&&l.push("weight ≤60kg"),l.length&&m.push(`Risk gates positive: ${l.join(", ")}.`)}return{text:g,tone:_,interactionNotes:m}}const N=document.getElementById("questionary"),O=document.getElementById("btnPrev"),M=document.getElementById("btnNext"),ie=document.getElementById("btnSubmit"),G=document.getElementById("stepper"),ne=document.getElementById("progress-bar");let h=0;function z(n,i){switch(n){case 0:{if(["first_name","last_name","age","patient_weight","patient_kreatinin","patient_gfr"].filter(_=>i[_]===void 0||i[_]===null||i[_].toString().trim()==="").length)return{ok:!1,message:"Please fill all patient fields."};if(!/^\S+$/.test(String(i.first_name)))return{ok:!1,message:"First name cannot contain whitespace."};if(!/^\S+$/.test(String(i.last_name)))return{ok:!1,message:"Last name cannot contain whitespace."};const t=Number(i.age),a=Number(i.patient_weight),p=Number(i.patient_kreatinin),g=Number(i.patient_gfr);return t>=0&&t<=120?a>=0&&a<=300?p>=0&&p<=1e3?g>=0&&g<=120?{ok:!0}:{ok:!1,message:"GFR must be between 0 and 120 ml/min."}:{ok:!1,message:"Creatinine must be between 0 and 1000 µmol/l."}:{ok:!1,message:"Weight must be between 0 and 300."}:{ok:!1,message:"Age must be between 0 and 120."}}case 1:return{ok:!0};default:return{ok:!0}}}function R(){const n=U(N),i=I[h];if(b[i]={...b[i],...n},h===2){const e=Number(b.patient?.age),s=Number(b.patient?.patient_gfr);b.contraindications.derived_ci_age=e<18,b.contraindications.ci_renal_failure=s<15,b.contraindications.sex=b.chadsvasc?.sex||b.contraindications.sex,b.contraindications.derived_absolute_contraindication=!!(b.contraindications.derived_ci_age||b.contraindications.ci_renal_failure||b.contraindications.ci_active_bleeding||b.contraindications.ci_endocarditis||b.contraindications.ci_gi_ulcus_active||b.contraindications.ci_liver_failure_child_c_or_coagulopathy||b.contraindications.sex==="F"&&b.contraindications.ci_pregnant_or_breastfeeding||b.contraindications.ci_drugs)}}function D(){N.innerHTML=j[h]();const n=N.firstElementChild,i=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;n&&!i&&(n.classList.remove("step-animate-in"),n.offsetWidth,n.classList.add("step-animate-in")),W(N,b[I[h]]||{}),O.disabled=h===0,M.hidden=h===I.length-1,ie.hidden=h!==I.length-1,[...G.children].forEach((s,t)=>{s.classList.toggle("is-active",t===h),s.classList.toggle("is-done",t<h)});const e=h/(I.length-1)*100;if(ne.style.width=`${e}%`,h===1&&X(N,b,V),h===2&&Q(N,b),h===3&&Y(N,b),h===4){const s=document.getElementById("summary"),t=document.getElementById("recommendationBox"),a=document.getElementById("finalJson"),p=ee(b);t.classList.remove("ok","warn"),t.classList.add(p.tone),t.innerHTML=`
      <strong>Recommendation</strong><br/>
      ${y(p.text)}
      ${p.interactionNotes.length?`<div class="badge">Notes</div> ${y(p.interactionNotes.join(" "))}`:""}
    `,s.innerHTML=Z(b),a.textContent=JSON.stringify(b,null,2)}}O.addEventListener("click",()=>{R(),h=Math.max(0,h-1),D()});M.addEventListener("click",()=>{R();const{ok:n,message:i}=z(h,b[I[h]]);if(!n){alert(i||"Please complete required fields.");return}h=Math.min(I.length-1,h+1),D()});N.addEventListener("submit",n=>{n.preventDefault(),R();const{ok:i,message:e}=z(h,b[I[h]]);if(!i){alert(e||"Please complete required fields.");return}alert("Questionnaire finished. See the summary and JSON output below.")});G.addEventListener("click",n=>{const i=n.target.closest("li.step");if(!i)return;const e=Number(i.dataset.step);Number.isNaN(e)||e<=h&&(R(),h=e,D())});D();
