async function handleRequest(request) {
  const url = 'https://raw.githubusercontent.com/hossein-mohseni/CF-Web/main/domains.json';
  const response = await fetch(url);
  const json = await response.json();
  const data = json.data;
  
  const result = data
    .filter(item => item.is_ir)
    .map(item => `${item.ipv4}\t     in : PLUS ALL`)
    .join('\n');
  
  return new Response(result, {
    headers: { 'content-type': 'text/plain' },
  });
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});