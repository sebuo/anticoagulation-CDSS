export default function Questionary(){
  const forms = [
    '/patient_information.html',
    '/chadsvasc.html',
    '/contraindications.html',
    '/interactions.html',
    '/treatment_recommendation.html'
  ];

  let index = 0;

  const root = document.createElement('div');
  root.className = 'card';

  const frame = document.createElement('iframe');
  frame.style.width = '100%';
  frame.style.minHeight = '600px';
  frame.style.border = '0';
  root.appendChild(frame);

  const nav = document.createElement('div');
  nav.style.marginTop = '10px';
  nav.innerHTML = `
    <button class="btn" id="prev">Previous</button>
    <button class="btn primary" id="next">Next</button>
  `;
  root.appendChild(nav);

  const prevBtn = nav.querySelector('#prev');
  const nextBtn = nav.querySelector('#next');

  function render(){
    frame.src = forms[index];
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === forms.length - 1;
    nextBtn.textContent = index === forms.length - 1 ? 'Done' : 'Next';
  }

  prevBtn.addEventListener('click', () => {
    if(index > 0){
      index--;
      render();
    }
  });

  nextBtn.addEventListener('click', () => {
    if(index < forms.length - 1){
      index++;
      render();
    }
  });

  render();
  return root;
}
