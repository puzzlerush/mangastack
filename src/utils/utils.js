export const htmlDecode = (string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(string, 'text/html');
  return doc.documentElement.textContent;
}