export async function register() {
  // Fix broken localStorage global created by Node.js --localstorage-file flag
  // Node.js v25+ creates a localStorage object with non-function methods when
  // --localstorage-file is provided without a valid path
  if (typeof globalThis.localStorage !== 'undefined') {
    if (typeof globalThis.localStorage.getItem !== 'function') {
      // Remove the broken localStorage so code falls back properly
      // @ts-expect-error - intentionally deleting broken global
      delete globalThis.localStorage
    }
  }
}
