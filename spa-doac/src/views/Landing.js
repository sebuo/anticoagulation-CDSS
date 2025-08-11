export default function Landing(){
  const root = document.createElement('div');
  root.className = 'card';
  root.innerHTML = `
    <h1>Decision Support for DOAC in Atrial Fibrillation</h1>
    <p class="notice warn">Prototype for heart fibrillation CDSS</p>
    <div class="bpmn-wrap">
      <img id="diagramImg" src="/public/diagram.svg" alt="Workflow diagram" style="width:100%;height:auto;display:block" />
    </div>
    <div style="margin-top:14px">
      <a class="btn" href="#/docs">Open Documentation</a>
      <a class="btn primary" href="#/questionary">Start Questionnaire</a>
    </div>
  `;

  const img = root.querySelector('#diagramImg');
  img.addEventListener('error', () => {
    const wrap = document.createElement('div');
    wrap.className = 'notice danger';
    wrap.textContent = 'diagram.svg not found in /public. Export your diagram as SVG and place it at /public/diagram.svg';
    root.querySelector('.bpmn-wrap').replaceChildren(wrap);
  });

  return root;
}
