addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const url = 'https://raw.githubusercontent.com/vfarid/cf-clean-ips/main/list.json'
const operatorNames = {
  'mtn': '		 in :  ALL IRC',
  'mkb': '		 in :  ALL MKB',
  'mkh': '		 in :  ALL MKB',
  'sht': '		 in :  ALL SHT',
  'shm': '		 in :  ALL SHT',
  'ask': '		 in :  ALL AND',
  'rsp': '		 in :  ALL RES',
  'afn': '		 in :  ALL AFR',
  'psm': '		 in :  ALL PIS',
  'arx': '		 in :  ALL ARA',
  'smt': '		 in :  ALL SAM',
  'fnv': '		 in :  ALL FAN',
  'dbn': '		 in :  ALL DID',
  'mci': '		 in :  ALL MCI',
  'rtl': '		 in :  ALL RTL',
  'hwb': '		 in :  ALL HWB',
  'ast': '		 in :  ALL AST',
  'prs': '		 in :  ALL PRS',
  'mbt': '		 in :  ALL MBT',
  'ztl': '		 in :  ALL ZTL',
  'apt': '		 in :  ALL APT',
  'fnp': '		 in :  ALL FNP',
  'sbn': '		 in :  ALL SAB',
  'ptk': '		 in :  ALL PET',
  'ryn': '		 in :  ALL RYN'
}

async function handleRequest(request) {
  try {
    const response = await fetch(url)
    const json = await response.json()

    const modifiedLines = json.ipv4.map(entry => {
      const operator = operatorNames[entry.operator.toLowerCase()] || entry.operator
      return entry.ip + ' ' + operator
    })

    const modifiedText = modifiedLines.join('\n')
    return new Response(modifiedText, {
      headers: { 'content-type': 'text/plain' },
    })
  } catch (error) {
    console.error(error)
    return new Response('An error occurred', { status: 500 })
  }
}
