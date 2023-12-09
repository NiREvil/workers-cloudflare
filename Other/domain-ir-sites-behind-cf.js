addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch('https://raw.githubusercontent.com/hossein-mohseni/CF-Web/main/domains.json');
  const data = await response.json();
  let output = '';
  data.data.forEach(entry => {
    if (entry.is_ir) {
      output += `${entry.domain}\t\t\t in :  PLUS FA\n`;
    }
  });
  return new Response(output, {
    headers: { 'Content-Type': 'text/plain' },
  });
}