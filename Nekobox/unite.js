/**
* Time is: 26 Dec 2023 16:37 UTC
* Cloudflare Worker to Merged Subscription URLs
*
* Released by NiREvil
*/
// @ts-ignore

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Define an array of subscription URLs
  const subscriptionUrls = [
      // تعداد لینک ها اصلا مهم نیست
      'https://raw.githubusercontent.com/NiREvil/vless/main/sub/freedom',
      'https://raw.githubusercontent.com/NiREvil/vless/main/sub/catnip.txt';
      'https://raw.githubusercontent.com/yebekhe/TelegramV2rayCollector/main/sub/normal/mix',
      'https://raw.githubusercontent.com/barry-far/V2ray-Configs/main/Sub1.txt',
      'https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/EternityAir.txt',
      'https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt',
      'https://raw.githubusercontent.com/NiREvil/vless/main/sub/hz',
      'https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/EternityAir.txt',
      'https://raw.githubusercontent.com/yebekhe/TelegramV2rayCollector/main/sub/normal/donated',
      // Add more URLs as needed
  ];

  // Fetch data from all URLs concurrently and store in an array
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
