async function handleRequest(request) {
  const url = 'https://raw.githubusercontent.com/hossein-mohseni/CF-Web/main/domains.json';
  const response = await fetch(url);
  const json = await response.json();
  const data = json.data.filter(item => item.ipv4 !== null);

  const regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/; // IPv4 regex

  const result = data
    .filter(item => regex.test(item.ipv4)) // Filter out non-IPv4 addresses
    .map(item => `${item.ipv4}\t     in : PLUS ALL`)
    .join('\n');

  return new Response(result, {
    headers: { 'content-type': 'text/plain' },
  });
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});