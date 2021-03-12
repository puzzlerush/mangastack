export const htmlDecode = (string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(string, 'text/html');
  return doc.documentElement.textContent;
};

export const toQueryString = (params) => {
  let str = [];
  for (const key in params) {
    str.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
  }
  return str.join('&');
};