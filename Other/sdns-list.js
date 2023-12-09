addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
  const response = await fetch('https://raw.githubusercontent.com/DNSCrypt/dnscrypt-resolvers/master/v3/public-resolvers.md');
  const text = await response.text();
  const lines = text.split('\n');
  const resolvers = [];

  for (let line of lines) {
    if (line.startsWith('sdns:')) {
      resolvers.push(line.trim());
    }
  }

  const output = resolvers.join('\n');

  return new Response(output, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
