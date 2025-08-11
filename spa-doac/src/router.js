import Landing from './views/Landing.js';
import Docs from './views/Docs.js';
import Questionary from './views/Questionary.js';
import Treatment from './views/Treatment.js';

const routes = {
  '/': Landing,
  '/docs': Docs,
  '/questionary': Questionary,
  '/treatment': Treatment
};

export function router() {
  const path = location.hash.replace('#', '') || '/';
  const View = routes[path] || Landing;
  const root = document.getElementById('app');
  // mount
  root.innerHTML = '';
  const el = View();
  root.appendChild(el);
}
