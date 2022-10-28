export function now() {
  return new Date();
}

export function timestamp(referenceDate) {
  return (referenceDate || now()).getTime();
}

