import { recommendations } from '../rules.js';

export default function Treatment(){
  const { s, drugs, flags, notes } = recommendations();
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `
    <h2>Treatment Recommendation (Prototype)</h2>
    <div class="grid">
      <div>
        <h3>Result</h3>
        <ul>${drugs.map(d => `<li>• ${d}</li>`).join('') || '<li>No drug recommendation.</li>'}</ul>
        <div>${flags.map(f => `<div class="notice danger">${f}</div>`).join('')}</div>
        <div>${notes.map(n => `<div class="notice">${n}</div>`).join('')}</div>
      </div>
      <div>
        <h3>Key Inputs</h3>
        <div class="kv">
          <div>Age group</div><div>${s.age_group||'–'}</div>
          <div>Sex</div><div>${s.sex||'–'}</div>
          <div>GFR</div><div>${s.GFR||'–'}</div>
          <div>Creatinine</div><div>${s.Kreatinin||'–'}</div>
          <div>Weight ≤60kg</div><div>${s.weight_under_60?'Yes':'No'}</div>
          <div>ASA / Clopidogrel</div><div>${s.Aspirin?'ASA ':''}${s.Clopidogrel?'Clopi':'' || 'No'}</div>
          <div>CHADS-VASc</div><div>${s.CHADSVASC_score}</div>
          <div>HAS-BLED</div><div>${s.HASBLED_score}</div>
        </div>
      </div>
    </div>
    <p class="notice warn">This is a simplified mapping of your provided logic. Clinical validation required before any real use.</p>
  `;
  return el;
}
