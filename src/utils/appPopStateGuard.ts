let suppressPopState = false;

export function suppressNextAppPopState() {
  suppressPopState = true;
  window.setTimeout(() => {
    suppressPopState = false;
  }, 150);
}

export function shouldSuppressAppPopState() {
  return suppressPopState;
}
