export function now() {
  return new Date();
}

export function timestamp(referenceDate) {
  if (referenceDate) {
    return referenceDate.getTime();
  }

  return now().getTime();
}
