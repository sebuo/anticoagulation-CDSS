export function escapeHtml(str){
  if(str == null) return '';
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}

export function deriveAgeGroupFromNumeric(age){
  if(age == null || Number.isNaN(Number(age))) return null;
  const a = Number(age);
  if(a < 18) return '<18';
  if(a <= 64) return '18-64';
  if(a <= 74) return '65-74';
  if(a < 80) return '75-79';
  return '>=80';
}

export function serializeForm(formEl){
  const fd = new FormData(formEl); const obj = {};
  for(const [k, v] of fd.entries()){ obj[k] = v; }
  formEl.querySelectorAll('input[type="checkbox"][name]').forEach(cb => { obj[cb.name] = cb.checked; });
  formEl.querySelectorAll('input[type="number"][name]').forEach(inp => {
    const name = inp.name; if(obj[name] === '' || obj[name] == null) return; const num = Number(obj[name]); obj[name] = Number.isNaN(num) ? obj[name] : num;
  });
  return obj;
}

export function hydrateForm(formEl, data){
  Object.entries(data || {}).forEach(([k,v]) => {
    const el = formEl.querySelector(`[name="${CSS.escape(k)}"]`);
    if(!el) return;
    if(el.type === 'checkbox'){ el.checked = Boolean(v); }
    else { el.value = v; }
  });
}