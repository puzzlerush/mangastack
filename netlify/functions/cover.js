const https = require('https');

exports.handler = async (event) => {
  const splat = decodeURIComponent(event.queryStringParameters?.splat || '');
  const url = `https://uploads.mangadex.org/${splat}`;

  return new Promise((resolve) => {
    https
      .get(
        url,
        {
          headers: {
            Referer: 'https://mangadex.org',
            'User-Agent': 'Mozilla/5.0',
          },
        },
        (res) => {
          const chunks = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              headers: {
                'Content-Type': res.headers['content-type'] || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400',
              },
              body: Buffer.concat(chunks).toString('base64'),
              isBase64Encoded: true,
            });
          });
        }
      )
      .on('error', () => resolve({ statusCode: 500, body: 'Error fetching image' }));
  });
};
