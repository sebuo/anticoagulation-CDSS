import { router } from './router.js';
import { getState, initState } from './state.js';

// init global state (from localStorage if present)
initState();

// simple client-side router init
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// expose state for debugging
window.__STATE__ = getState();
