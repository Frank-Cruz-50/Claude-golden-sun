/** Measures a line; defaults to character count. The UI passes a pixel-width measure. */
export type Measure = (line: string) => number;
const byChars: Measure = (line) => line.length;

/** Word-wraps text so no line measures more than `maxWidth`. */
export function wrapText(text: string, maxWidth: number, measure: Measure = byChars): string[] {
  if (maxWidth < 1) throw new Error('maxWidth must be at least 1');
  const fits = (line: string) => measure(line) <= maxWidth;
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (let word of paragraph.split(/\s+/).filter(Boolean)) {
      while (!fits(word)) {
        if (line) {
          lines.push(line);
          line = '';
        }
        let cut = word.length - 1;
        while (cut > 1 && !fits(word.slice(0, cut))) cut--;
        lines.push(word.slice(0, cut));
        word = word.slice(cut);
      }
      if (!line) line = word;
      else if (fits(line + ' ' + word)) line += ' ' + word;
      else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines;
}

/** Splits text into text-box pages of at most `linesPerPage` wrapped lines. */
export function paginate(text: string, maxWidth: number, linesPerPage: number, measure: Measure = byChars): string[] {
  const lines = wrapText(text, maxWidth, measure);
  const pages: string[] = [];
  for (let i = 0; i < lines.length; i += linesPerPage) pages.push(lines.slice(i, i + linesPerPage).join('\n'));
  return pages;
}

/** Replaces {name} placeholders. Unknown keys are left untouched. */
export function formatText(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}
