addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = 'https://raw.githubusercontent.com/vfarid/cf-clean-ips/main/list.json'
  const response = await fetch(url)
  const data = await response.json()

  const uniqueIps = new Set();
  for (const ipv4 of data.ipv4) {
    uniqueIps.add(ipv4.ip);
  }

  const output = Array.from(uniqueIps).map(ip => `0 - 0 - ${ip}`).join('\n');
  return new Response(output, {
    headers: { 'content-type': 'text/plain' },
  })
}