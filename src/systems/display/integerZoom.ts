/**
 * Largest whole-number zoom at which a base resolution still fits inside the
 * available area. Never returns less than 1.
 */
export function computeIntegerZoom(
  availableWidth: number,
  availableHeight: number,
  baseWidth: number,
  baseHeight: number,
): number {
  if (baseWidth <= 0 || baseHeight <= 0) return 1;
  const zoom = Math.floor(Math.min(availableWidth / baseWidth, availableHeight / baseHeight));
  return Math.max(1, zoom);
}
