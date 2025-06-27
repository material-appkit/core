export function intersection(r1, r2) {
  const intersectionX1 = Math.max(r1.x, r2.x);
  const intersectionX2 = Math.min(r1.x + r1.width, r2.x + r2.width);
  if (intersectionX2 < intersectionX1) {
    return null;
  }

  const intersectionY1 = Math.max(r1.y, r2.y);
  const intersectionY2 = Math.min(r1.y + r1.height, r2.y + r2.height);
  if (intersectionY2 < intersectionY1) {
    return null;
  }

  return {
    x: intersectionX1,
    y: intersectionY1,
    width: intersectionX2 - intersectionX1,
    height: intersectionY2 - intersectionY1,
  };
}


export function containsPoint(rect, point) {
  const x = point.x - rect.left;
  const y = point.y - rect.top;
  return (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height);
}


export function containsRect(rect, otherRect) {
  return !(
    rect.right < otherRect.left ||
    rect.left > otherRect.right ||
    rect.bottom < otherRect.top ||
    rect.top > otherRect.bottom
  );
}
