export const initGCEScript = `
window.__gcse = {
  parsetags: 'explicit',
  initializationCallback: function() {
    window.__gcseReady = true;

    if (window.__needGCSEGo) {
      google.search.cse.element.go();
    }
  },
};`;

export function initGCE() {
  if (window.__gcseReady) {
    google.search.cse.element.go();
  } else {
    window.__needGCSEGo = true;
  }
}
