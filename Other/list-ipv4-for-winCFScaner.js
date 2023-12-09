addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = "https://raw.githubusercontent.com/coldwater-10/clash_rules/main/List%20of%20clean%20IPs.txt";
  const response = await fetch(url);
  const text = await response.text();

  const ipv4Regex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
  const ipv4Addresses = text.match(ipv4Regex) || [];

  const formattedAddresses = ipv4Addresses.map(ip => "0 - 0 - " + ip);

  return new Response(formattedAddresses.join("\n"), {
    headers: { "content-type": "text/plain" }
  });
}
