export default async (request) => {
  const url = new URL(request.url);
  const splat = url.pathname.replace('/image/', '');

  if (!splat) {
    return new Response('Missing image path', { status: 400 });
  }

  const imageUrl = `https://uploads.mangadex.org/${splat}`;

  const response = await fetch(imageUrl, {
    headers: {
      Referer: 'https://mangadex.org',
      'User-Agent': 'Mozilla/5.0',
    },
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
