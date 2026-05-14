/**
 * The new Saudi Riyal currency glyph from the
 * @abdulrysr/saudi-riyal-new-symbol-font package is mapped to U+00EA.
 * Render it inside a `.saudi-riyal` span so the custom font is applied.
 */
export const SAR_SYMBOL_CHAR = "ê";
export const SAR_SYMBOL_ARIA = "ريال سعودي";

/**
 * Format a numeric SAR amount as Arabic digits followed by the
 * SAR symbol character (rendered with the symbol font on screen).
 */
export function formatSAREstimate(amount: number): string {
  return `${amount.toLocaleString("ar-SA")} ${SAR_SYMBOL_CHAR}`;
}

/**
 * Turn a stored estimate ("٥٬١٠٠ ê") into a plain-text variant suitable
 * for CSVs / clipboards / screen readers where the custom font is unavailable.
 */
export function estimateToPlainText(value: string): string {
  return value.replace(new RegExp(SAR_SYMBOL_CHAR, "g"), SAR_SYMBOL_ARIA);
}
