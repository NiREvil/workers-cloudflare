addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
  const response = await fetch('https://raw.githubusercontent.com/cslev/encrypted_dns_resolvers/main/doh_resolvers_data_20230510.json');
  const data = await response.json();
  let output = '';
  for (const [key, value] of Object.entries(data)) {
    output += `${value.uri}\n`;
  }
  return new Response(output, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
