addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = "https://raw.githubusercontent.com/coldwater-10/clash_rules/main/List%20of%20clean%20IPs.txt";
  const response = await fetch(url);

  if (response.ok) {
    const text = await response.text();
    const words = text.match(/\b[a-z]+\b/gi);
    const targetWords = ['in ', 'ANTY', 'PLUS', 'ALL', 'MCI', 'IRC', 'ENG', 'SHT', 'SAB', 'MKB', 'IPV6', 'RES', 'FA', 'RTL', 'TEST', 'IRCF', 'MBT', 'AFR', 'AND', 'APT', 'DID', 'ARA', 'SAM', 'PRS', 'ZTL', 'AST', 'HWB', 'FNP', 'RYN', 'PIS', 'PET', 'SMT', 'FAN'];

    const wordCount = {};

    words.forEach(word => {
      if (targetWords.includes(word)) {
        if (word in wordCount) {
          wordCount[word] += 1;
        } else {
          wordCount[word] = 1;
        }
      }
    });

    let output = 'The number of IPs and domains of each abbreviation:\n';

    const sortedWords = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);

    sortedWords.forEach(([word, count]) => {
      output += `${word} : ${count}\n`;
    });

    output += '\n';

    return new Response(output);
  } else {
    return new Response(`Error ${response.status}`);
  }
}
