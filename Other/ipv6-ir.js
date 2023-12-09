async function handleRequest(request) {
  const url = 'https://raw.githubusercontent.com/hossein-mohseni/CF-Web/main/domains.json';
  const response = await fetch(url);
  const json = await response.json();
  const data = json.data.filter(item => item.ipv6 !== null);
  
  const result = data
    .filter(item => item.is_ir)
    .filter(item => item.ipv6 !== 'Null')
    .map(item => `${item.ipv6}\tin : IPV6`)
    .join('\n');
  
  return new Response(result, {
    headers: { 'content-type': 'text/plain' },
  });
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});