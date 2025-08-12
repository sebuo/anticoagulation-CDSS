(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const c of t)if(c.type==="childList")for(const r of c.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function i(t){const c={};return t.integrity&&(c.integrity=t.integrity),t.referrerPolicy&&(c.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?c.credentials="include":t.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(t){if(t.ep)return;t.ep=!0;const c=i(t);fetch(t.href,c)}})();const H={0:()=>`
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
    `,3:()=>`
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
    `,4:()=>`
      <fieldset>
        <legend>Treatment Recommendation</legend>
        <div id="summary"></div>
        <hr />
        <div id="recommendationBox" class="notice ok"></div>
      </fieldset>
      <div class="output" id="finalJson"></div>
    `},o={patient:{},chadsvasc:{},contraindications:{},interactions:{},recommendation:{}},S=["patient","chadsvasc","contraindications","interactions","recommendation"];function y(n){return n==null?"":String(n).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function M(n){if(n==null||Number.isNaN(Number(n)))return null;const e=Number(n);return e<18?"<18":e<=64?"18-64":e<=74?"65-74":e<=80?"75-80":">=80"}function E(n){const e=new FormData(n),i={};for(const[s,t]of e.entries())i[s]=t;return n.querySelectorAll('input[type="checkbox"][name]').forEach(s=>{i[s.name]=s.checked}),n.querySelectorAll('input[type="number"][name]').forEach(s=>{const t=s.name;if(i[t]===""||i[t]==null)return;const c=Number(i[t]);i[t]=Number.isNaN(c)?i[t]:c}),i}function z(n,e){Object.entries(e||{}).forEach(([i,s])=>{const t=n.querySelector(`[name="${CSS.escape(i)}"]`);t&&(t.type==="checkbox"?t.checked=!!s:t.value=s)})}const P=["amiodaron","chinidin","dronedaron","diltiazem","verapamil","erythromycin","naproxen","fluconazol","ciclosporin","tacrolimus"],L={age1:"<18",age2:"18-64",age3:"65-74",age4:"75-80",age5:">=80"};function J(n){const e=n.chadsvasc||{};let i=0;return i+=Number(e.agePoints||0),i+=e.sex==="F"?1:0,i+=e.chf?1:0,i+=e.hypertension?1:0,i+=e.diabetes?1:0,i+=e.stroke_or_tia?2:0,i+=e.vascular_disease?1:0,i}function j(n,e,i){n.querySelector('input[name="age"]:checked'),n.querySelector('input[name="sex"]:checked');function s(){const c=n.querySelector('input[name="age"]:checked'),r=n.querySelector('input[name="sex"]:checked');let b=null,d=0;c&&(b=L[c.id]||null,d=Number(c.value)||0);let v=null;r&&(v=r.id==="male"?"M":"F");const h=n.querySelector("#congestiveHF")?.checked||!1,f=n.querySelector("#hypertension")?.checked||!1,a=n.querySelector("#diabetes")?.checked||!1,l=n.querySelector("#strokeTIA")?.checked||!1,p=n.querySelector("#vascularDisease")?.checked||!1;e.chadsvasc={...e.chadsvasc,age_group:b,agePoints:d,sex:v,chf:h,hypertension:f,diabetes:a,stroke_or_tia:l,vascular_disease:p};const g=J(e);e.chadsvasc.score=g,e.chadsvasc.derived_CHADSVASC_Score=g>=2;const _=document.getElementById("scoreResult"),m=document.getElementById("treatmentAdvice");_&&(_.textContent=String(g)),m&&(g<2?(m.textContent="No DOAK treatment indicated",m.className="advice-green"):(m.textContent="Continue with contraindication assessment",m.className="advice-red"))}n.addEventListener("change",s);const t=i(e.patient.age);if(t&&!e.chadsvasc.age_group){const c=Object.entries(L).find(([r,b])=>b===t)?.[0];if(c){const r=n.querySelector(`#${c}`);r&&(r.checked=!0)}e.chadsvasc.age_group=t,e.chadsvasc.agePoints=Number(n.querySelector(`#${c}`)?.value||0)}if(e.chadsvasc.sex){const c=e.chadsvasc.sex==="M"?"male":"female",r=n.querySelector(`#${c}`);r&&(r.checked=!0)}n.querySelector("#congestiveHF")&&(n.querySelector("#congestiveHF").checked=!!e.chadsvasc.chf),n.querySelector("#hypertension")&&(n.querySelector("#hypertension").checked=!!e.chadsvasc.hypertension),n.querySelector("#diabetes")&&(n.querySelector("#diabetes").checked=!!e.chadsvasc.diabetes),n.querySelector("#strokeTIA")&&(n.querySelector("#strokeTIA").checked=!!e.chadsvasc.stroke_or_tia),n.querySelector("#vascularDisease")&&(n.querySelector("#vascularDisease").checked=!!e.chadsvasc.vascular_disease),s()}function V(n,e){const i=a=>n.querySelector(`#${a}`),s=a=>n.querySelector(`#${a}`);function t(){return e.chadsvasc?.sex||null}function c(){const a=Number(e.patient?.age);return Number.isNaN(a)?null:a}function r(){const a=Number(e.patient?.patient_gfr);return Number.isNaN(a)?null:a}function b(){const a=c(),l=r(),p=a!=null?a<18:!1,g=l!=null?l<15:!1;e.contraindications.derived_ci_age=p,e.contraindications.ci_renal_failure=g;const _=s("flag_ci_age"),m=s("flag_ci_renal");_&&(_.textContent=p?"True":"False"),m&&(m.textContent=g?"True":"False")}function d(){const a=i("pregnantField"),l=t();if(a){const p=l==="F";if(a.hidden=!p,!p){const g=i("ci_pregnant_or_breastfeeding");g&&(g.checked=!1)}e.contraindications.sex=l||void 0}}function v(){const a=[];return e.contraindications.derived_ci_age&&a.push("Patient is under 18 years old"),e.contraindications.ci_renal_failure&&a.push("Renal failure (GFR < 15)"),i("ci_active_bleeding")?.checked&&a.push("Active bleeding"),i("ci_endocarditis")?.checked&&a.push("Acute bacterial endocarditis"),i("ci_gi_ulcus_active")?.checked&&a.push("Active gastrointestinal ulcer"),i("ci_liver_failure_child_c_or_coagulopathy")?.checked&&a.push("Liver failure CHILD C or liver disease with coagulopathy"),t()==="F"&&i("ci_pregnant_or_breastfeeding")?.checked&&a.push("Pregnant or breastfeeding"),i("ci_drugs")?.checked&&a.push("Interacting medication present"),a}function h(){["ci_active_bleeding","ci_endocarditis","ci_gi_ulcus_active","ci_liver_failure_child_c_or_coagulopathy","ci_pregnant_or_breastfeeding","ci_drugs"].forEach(g=>{const _=i(g);_&&(e.contraindications[g]=!!_.checked)}),b();const a=v(),l=a.length>0;e.contraindications.derived_absolute_contraindication=l;const p=i("ciResult");p&&(l?(p.classList.remove("ok"),p.classList.add("warn"),p.innerHTML="<strong>Absolute contraindications found:</strong><ul>"+a.map(g=>`<li>${y(g)}</li>`).join("")+"</ul><p><strong>Patient is NOT eligible for DOAC therapy.</strong></p>"):(p.classList.remove("warn"),p.classList.add("ok"),p.innerHTML="<strong>No contraindications detected. Patient is eligible for DOAC therapy.</strong>"))}function f(){h();const a={ci_active_bleeding:!!i("ci_active_bleeding")?.checked,ci_endocarditis:!!i("ci_endocarditis")?.checked,ci_gi_ulcus_active:!!i("ci_gi_ulcus_active")?.checked,ci_liver_failure_child_c_or_coagulopathy:!!i("ci_liver_failure_child_c_or_coagulopathy")?.checked,ci_pregnant_or_breastfeeding:t()==="F"?!!i("ci_pregnant_or_breastfeeding")?.checked:!1,ci_drugs:!!i("ci_drugs")?.checked,derived_ci_age:!!e.contraindications.derived_ci_age,ci_renal_failure:!!e.contraindications.ci_renal_failure,sex:t()},l=i("ciResult");l&&(l.classList.remove("warn","ok"),l.innerHTML=`<pre>${y(JSON.stringify(a,null,2))}</pre>`)}i("btnCICompute")?.addEventListener("click",h),i("btnCIJson")?.addEventListener("click",f),n.addEventListener("change",a=>{["INPUT","SELECT","TEXTAREA"].includes(a.target.tagName)&&b()}),d(),b(),h()}function K(n,e){const i=d=>n.querySelector(`#${d}`),s=d=>n.querySelector(`#${d}`);function t(){const d=!!i("aspirin")?.checked,v=!!i("clopidogrel")?.checked,h=!!i("nsaid")?.checked,f=!!i("ssri")?.checked,a=d&&v,l=a||h||f,p=s("dualBadge"),g=s("ppiBadge"),_=s("ppiRec"),m=s("explain");if(p&&(p.textContent=a?"True":"False"),g&&(g.textContent=l?"True":"False"),_&&(_.textContent=l?"PPI Recommended":"Not Recommended"),m){const k=[];a&&k.push("dual antiplatelet therapy"),h&&k.push("NSAID"),f&&k.push("SSRI/SNRI"),m.innerHTML=`Inputs true: <strong>${k.length}</strong> [${k.join(", ")||"none"}].`}e.interactions={...e.interactions,Aspirin:d,Clopidogrel:v,NSAID:h,SSRI_or_SNRI:f,derived_dual_antiplatelet_therapy:a,derived_PPI_indication:l}}function c(){const v=P.map(I=>i(I)).some(I=>I&&I.checked),h=i("riskGates"),f=s("drugTriggerBadge"),a=s("ageGate"),l=s("gfrGate"),p=s("wtGate"),g=s("anyGate"),_=s("gateInputs"),m=i("hasBledBlock"),k=P.filter(I=>i(I)?.checked);if(e.interactions.interacting_drug_list=k,e.interactions["interacting drugs"]=k.length>0,h&&(h.hidden=!v),!v){f&&(f.textContent="False"),a&&(a.textContent="False"),l&&(l.textContent="False"),p&&(p.textContent="False"),g&&(g.textContent="False"),m&&(m.hidden=!0,m.open=!1),e.interactions.derived_age_RF=!1,e.interactions.derived_GFR_RF=!1,e.interactions.weight_under_60=!1,e.interactions.any_gate_true=!1;return}const w=Number(e.patient.age),B=Number(e.patient.patient_weight),D=Number(e.patient.patient_gfr);_&&(_.textContent=`Inputs: age=${w}; weight=${B}; GFR=${D}`);const R=w>=75,C=D<50,F=B<=60,T=R||C||F;f&&(f.textContent="True"),a&&(a.textContent=R?"True":"False"),l&&(l.textContent=C?"True":"False"),p&&(p.textContent=F?"True":"False"),g&&(g.textContent=T?"True":"False"),e.interactions.derived_age_RF=R,e.interactions.derived_GFR_RF=C===!0,e.interactions.weight_under_60=F,e.interactions.any_gate_true=T,m&&(T?(m.hidden=!1,m.open=!0):(m.hidden=!0,m.open=!1))}function r(){t(),c()}n.addEventListener("change",r);const b=i("resetInteractions");b&&b.addEventListener("click",()=>{["aspirin","clopidogrel","nsaid","ssri",...P].forEach(d=>{const v=i(d);v&&(v.checked=!1)}),r()}),r()}function U(n){const e=n.patient||{},i=n.chadsvasc||{};return n.contraindications,`
      <div class="grid cols-2">
        <div>
          <h3>Patient</h3>
          <div class="notice">
            Name: ${y(e.patient_name||"—")}<br/>
            Age: ${y(e.age??"—")}<br/>
            Weight: ${y(e.patient_weight??"—")} kg<br/>
            Kreatinin: ${y(e.patient_kreatinin??"—")} µmol/l<br/>
            GFR: ${y(e.patient_gfr??"—")}
          </div>
        </div>
        <div>
          <h3>CHA₂DS₂-VASc</h3>
          <div class="notice">
            Age group: ${y(i.age_group||"—")}<br/>
            Sex: ${y(i.sex||"—")}<br/>
            Score: <strong>${i.score??"—"}</strong><br/>
            DOAC indication (derived): <strong>${i.derived_CHADSVASC_Score?"True":"False"}</strong>
          </div>
          <div class="notice" style="margin-top:6px">
            <strong>Contraindications</strong><br/>
            Absolute CI (derived): <strong>${n.contraindications?.derived_absolute_contraindication?"True":"False"}</strong><br/>
            Under 18: ${n.contraindications?.derived_ci_age?"True":"False"}; Renal failure (GFR <15): ${n.contraindications?.ci_renal_failure?"True":"False"}
          </div>
        </div>
      </div>
    `}function W(n){const{patient:e,chadsvasc:i,contraindications:s,interactions:t}=n,c=Number(i.score??0),r=!!s.derived_absolute_contraindication;let b,d;r?(b="Absolute contraindication(s) present. Anticoagulation likely NOT appropriate until addressed.",d="warn"):c>=2?(b="Recommend anticoagulation (e.g., DOAC) unless other risks prevail. Consider shared decision-making.",d="ok"):c===1?(b="Consider anticoagulation based on patient values and bleeding risk.",d="ok"):(b="Anticoagulation generally not indicated; re-evaluate if risk profile changes.",d="ok");const v=e.patient_gfr!==void 0?Number(e.patient_gfr):null,h=[];v!==null&&!Number.isNaN(v)&&v<30&&h.push("Impaired renal function — check DOAC dose/choice.");const f=[t.Aspirin?"Aspirin":null,t.Clopidogrel?"Clopidogrel":null,t.NSAID?"NSAID":null,t.SSRI_or_SNRI?"SSRI/SNRI":null].filter(Boolean);f.length&&h.push(`Concomitant meds: ${f.join(", ")}.`);const a=Array.isArray(t.interacting_drug_list)?t.interacting_drug_list:[];if(a.length&&h.push(`Other interacting drugs: ${a.join(", ")}.`),t.derived_PPI_indication){const l=[];t.derived_dual_antiplatelet_therapy&&l.push("dual antiplatelet therapy"),t.NSAID&&l.push("NSAID"),t.SSRI_or_SNRI&&l.push("SSRI/SNRI"),h.push(`PPI recommended (${l.join(", ")}).`)}else h.push("PPI not routinely indicated from current inputs.");if(t["interacting drugs"]){const l=[];t.derived_age_RF&&l.push("age ≥75"),t.derived_GFR_RF&&l.push("GFR <50"),t.weight_under_60&&l.push("weight ≤60kg"),l.length&&h.push(`Risk gates positive: ${l.join(", ")}.`)}return{text:b,tone:d,interactionNotes:h}}const x=document.getElementById("questionary"),q=document.getElementById("btnPrev"),$=document.getElementById("btnNext"),X=document.getElementById("btnSubmit"),G=document.getElementById("stepper"),Q=document.getElementById("progress-bar");let u=0;function O(n,e){switch(n){case 0:{if(["patient_name","age","patient_weight","patient_kreatinin","patient_gfr"].filter(d=>e[d]===void 0||e[d]===null||e[d]==="").length)return{ok:!1,message:"Please fill all patient fields."};if(!/^[^\s]+$/.test(String(e.patient_name)))return{ok:!1,message:"Patient name cannot contain whitespace."};const t=Number(e.age),c=Number(e.patient_weight),r=Number(e.patient_kreatinin),b=Number(e.patient_gfr);return t>=0&&t<=120?c>=0&&c<=300?r>=30&&r<=120?b>=0&&b<=120?{ok:!0}:{ok:!1,message:"GFR must be between 0 and 120."}:{ok:!1,message:"Kreatinin must be between 30 and 120 µmol/l."}:{ok:!1,message:"Weight must be between 0 and 300."}:{ok:!1,message:"Age must be between 0 and 120."}}case 1:return{ok:!0};default:return{ok:!0}}}function N(){const n=E(x),e=S[u];if(o[e]={...o[e],...n},u===2){const i=Number(o.patient?.age),s=Number(o.patient?.patient_gfr);o.contraindications.derived_ci_age=i<18,o.contraindications.ci_renal_failure=s<15,o.contraindications.sex=o.chadsvasc?.sex||o.contraindications.sex,o.contraindications.derived_absolute_contraindication=!!(o.contraindications.derived_ci_age||o.contraindications.ci_renal_failure||o.contraindications.ci_active_bleeding||o.contraindications.ci_endocarditis||o.contraindications.ci_gi_ulcus_active||o.contraindications.ci_liver_failure_child_c_or_coagulopathy||o.contraindications.sex==="F"&&o.contraindications.ci_pregnant_or_breastfeeding||o.contraindications.ci_drugs)}}function A(){x.innerHTML=H[u]();const n=x.firstElementChild,e=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;n&&!e&&(n.classList.remove("step-animate-in"),n.offsetWidth,n.classList.add("step-animate-in")),z(x,o[S[u]]||{}),q.disabled=u===0,$.hidden=u===S.length-1,X.hidden=u!==S.length-1,[...G.children].forEach((s,t)=>{s.classList.toggle("is-active",t===u),s.classList.toggle("is-done",t<u)});const i=u/(S.length-1)*100;if(Q.style.width=`${i}%`,u===1&&j(x,o,M),u===2&&V(x,o),u===3&&K(x,o),u===4){const s=document.getElementById("summary"),t=document.getElementById("recommendationBox"),c=document.getElementById("finalJson"),r=W(o);t.classList.remove("ok","warn"),t.classList.add(r.tone),t.innerHTML=`
      <strong>Recommendation</strong><br/>
      ${y(r.text)}
      ${r.interactionNotes.length?`<div class="badge">Notes</div> ${y(r.interactionNotes.join(" "))}`:""}
    `,s.innerHTML=U(o),c.textContent=JSON.stringify(o,null,2)}}q.addEventListener("click",()=>{N(),u=Math.max(0,u-1),A()});$.addEventListener("click",()=>{N();const{ok:n,message:e}=O(u,o[S[u]]);if(!n){alert(e||"Please complete required fields.");return}u=Math.min(S.length-1,u+1),A()});x.addEventListener("submit",n=>{n.preventDefault(),N();const{ok:e,message:i}=O(u,o[S[u]]);if(!e){alert(i||"Please complete required fields.");return}alert("Questionnaire finished. See the summary and JSON output below.")});G.addEventListener("click",n=>{const e=n.target.closest("li.step");if(!e)return;const i=Number(e.dataset.step);Number.isNaN(i)||i<=u&&(N(),u=i,A())});A();
