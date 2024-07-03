/**
* Time is 17:41 UTC, Wednesday, 3 July 2024 by NiREvil
* This code retrieves v2ray sub-links data from multiple links
* - merges them
* - without making any changes.
*/

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Define an array of subscription URLs
  const subscriptionUrls = [
      'https://raw.githubusercontent.com/sahar-km/Freedom/main/-/-/Arm64/-/V8A.txt',
      'https://raw.githubusercontent.com/sahar-km/hetzner/main/-/-/Armeabi/-/V7A.txt',
      'https://raw.githubusercontent.com/NiREvil/vless/main/sub/SSTime'
      // Add more URLs as needed
  ];

  // Fetch data from all subscription links concurrently
  const validResponses = await Promise.all(
      subscriptionUrls.map(async (url) => {
          const response = await fetch(url);
          if (response.status === 200) {
              return response.text();
          }
          return null; // Ignore failed requests
      })
  );

  // Filter out null values (failed requests) and merge the responses
  const mergedData = validResponses.filter(Boolean).join('\r\n');

  // Create a response with the merged data
  return new Response(mergedData, {
      status: 200,
  });
}
