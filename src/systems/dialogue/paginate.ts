/** Word-wraps text to a fixed character width (the UI uses a monospace font). */
export function wrapText(text: string, maxChars: number): string[] {
  if (maxChars < 1) throw new Error('maxChars must be at least 1');
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (let word of paragraph.split(/\s+/).filter(Boolean)) {
      while (word.length > maxChars) {
        if (line) {
          lines.push(line);
          line = '';
        }
        lines.push(word.slice(0, maxChars));
        word = word.slice(maxChars);
      }
      if (!line) line = word;
      else if (line.length + 1 + word.length <= maxChars) line += ' ' + word;
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
export function paginate(text: string, maxChars: number, linesPerPage: number): string[] {
  const lines = wrapText(text, maxChars);
  const pages: string[] = [];
  for (let i = 0; i < lines.length; i += linesPerPage) pages.push(lines.slice(i, i + linesPerPage).join('\n'));
  return pages;
}

/** Replaces {name} placeholders. Unknown keys are left untouched. */
export function formatText(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}
