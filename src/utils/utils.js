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

export const generateMetaKeywordsTitle = (title) => {
  const keywords = [
    title,
    `${title} manga`,
    `Read ${title} online`,
    `${title} online`,
    `${title} online for free`,
    `Read ${title} chapters for free`,
    `${title} series`,
    `${title} chapters`,
    `${title} scans`,
    `${title} kissmanga`,
    `${title} mangadex`,
  ];
  return keywords.join(', ');
};

export const getProxyImageUrl = (imageUrl) =>
  `/image/${encodeURIComponent(imageUrl)}`;
