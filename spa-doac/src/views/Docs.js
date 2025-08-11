import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default function Docs(){
  const el = document.createElement('div');
  el.className = 'card';

  const tabs = document.createElement('div');
  tabs.innerHTML = `
    <div class="row">
      <button class="btn" data-tab="rules">Rule Logic</button>
      <button class="btn" data-tab="datadict">Data Dictionary</button>
    </div>
    <div id="docBody" style="margin-top:10px"></div>
  `;
  el.appendChild(tabs);

  async function load(tab) {
    const body = el.querySelector('#docBody');
    body.innerHTML = '<div class="badge">Loading…</div>';
    try {
      if (tab === 'datadict') {
        const res = await fetch('/public/data_dict.json');
        const json = await res.json();
        const html = `
          <h2>Data Dictionary</h2>
          <div class="kv">${json.map(row => `
            <div><strong>${row['Field Name']}</strong><div class="badge">${row['Data Type']}</div></div>
            <div>${row.Description}<div class="muted">Allowed: ${row['Allowed Values']}</div></div>
          `).join('')}</div>`;
        body.innerHTML = html;
      } else {
        const txt = await (await fetch('/public/rule_logik.txt')).text();
        const md = DOMPurify.sanitize(marked.parse('````\n'+txt+'\n````'));
        body.innerHTML = `<h2>Rule Logic (source)</h2>${md}`;
      }
    } catch (e) {
      body.innerHTML = '<div class="notice danger">Failed to load documentation.</div>';
    }
  }

  el.addEventListener('click', e => {
    if (e.target.matches('button[data-tab]')) {
      load(e.target.dataset.tab);
    }
  });

  // default tab
  load('rules');
  return el;
}
