const maxConfigItems = 600
const maxPerType = 300
const includeOriginalConfigs = 0

const subLinks = [
]
const cnfLinks = [
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/EternityAir.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/EternityAir.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/EternityAir.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/EternityAir.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/EternityAir.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/EternityAir.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/EternityAir.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/EternityAir.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/EternityAir.txt",
  "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/EternityAir.txt"
]
const cleanIPLink = "https://raw.githubusercontent.com/coldwater-10/clash_rules/main/List%20of%20clean%20IPs.txt"
const operatorList = ["AST", "HWB", "IRC", "MBT", "MCI", "MKB", "PRS", "RTL", "SHT", "ZTL", "PIS", "DAT", "SAB", "ASR", "FAN", "ZTL", "SFR", "DID", "LAY", "MAH", "TAK", "PET", "AND", "RES", "AFR", "ARA", "SAM", "APT", "ALL", "PLUS", "TEST", "ENG", "FA", "IPV6", "IRCF", "ANTY"]
const addressList = ["discord.com", "cloudflare.com", "nginx.com", "cdnjs.com", "vimeo.com", "networksolutions.com"]
const fpList = ["chrome", "chrome", "chrome", "firefox", "safari", "edge", "ios", "android", "360", "qq", "random", "random"]
const alpnList = ["http/1.1", "h2,http/1.1", "h2,http/1.1", "h2,http/1.1"]
var cleanIPs = []

export default {
  async fetch(request) {
    var url = new URL(request.url)
    var pathParts = url.pathname.replace(/^\/|\/$/g, "").split("/")
    var type = pathParts[0].toLowerCase()
    if (["sub", "clash"].includes(type)) {
      if (pathParts[1] !== undefined) {
        var operator = pathParts[1].toUpperCase()
        if (operatorList.includes(operator)) {
          cleanIPs = await fetch(cleanIPLink).then(r => r.text()).then(t => t.split("\n"))
          cleanIPs = cleanIPs.filter(line => (line.search(operator) > 0))
          cleanIPs = cleanIPs.map(line => line.split(" ")[0].trim())
        } else {
          cleanIPs = [operator.toLowerCase()]
        }
      }

      var configList = []
      for (var subLink of subLinks) {
        try {
          configList = configList.concat(await fetch(subLink).then(r => r.text()).then(a => atob(a)).then(t => t.split("\n")))
        } catch (e) { }
      }
      for (var cnfLink of cnfLinks) {
        try {
          configList = configList.concat(await fetch(cnfLink).then(r => r.text()).then(t => t.split("\n")))
        } catch (e) { }
      }
      
      var vmessConfigList = configList.filter(cnf => (cnf.search("vmess://") == 0))
      var trojanConfigList = configList.filter(cnf => (cnf.search("trojan://") == 0))
      var ssConfigList = configList.filter(cnf => (cnf.search("ss://") == 0))
      var mergedConfigList = []
      
      if (type == "sub") {
        if (includeOriginalConfigs) {
          mergedConfigList = mergedConfigList.concat(getMultipleRandomElements(vmessConfigList, maxPerType))
        }
        mergedConfigList = mergedConfigList.concat(
          getMultipleRandomElements(
            vmessConfigList.map(decodeVmess).map(cnf => mixConfig(cnf, url, "vmess")).filter(cnf => (!!cnf && cnf.id)).map(encodeVmess).filter(cnf => !!cnf),
            maxPerType
          )
        )

        if (includeOriginalConfigs) {
          mergedConfigList = mergedConfigList.concat(getMultipleRandomElements(trojanConfigList, maxPerType))
          mergedConfigList = mergedConfigList.concat(getMultipleRandomElements(ssConfigList, maxPerType))
        }

        return new Response(btoa(getMultipleRandomElements(mergedConfigList, maxConfigItems).join("\n")));
      } else { // clash
        if (includeOriginalConfigs) {
          mergedConfigList = mergedConfigList.concat(
            getMultipleRandomElements(
              vmessConfigList.map(decodeVmess).filter(cnf => (cnf && cnf.id)).map(cnf => toClash(cnf, "vmess")).filter(cnf => (cnf && cnf.uuid)),
              maxPerType
            )
          )
        }
        mergedConfigList = mergedConfigList.concat(
          getMultipleRandomElements(
            vmessConfigList.map(decodeVmess).map(cnf => mixConfig(cnf, url, "vmess")).filter(cnf => (cnf && cnf.id)).map(cnf => toClash(cnf, "vmess")),
            maxPerType
          )
        )
        return new Response(toYaml(mergedConfigList));
      }
    } else {
      var url = new URL(request.url)
      var newUrl = new URL("https://" + url.pathname.replace(/^\/|\/$/g, ""))
      return fetch(new Request(newUrl, request));
    }
  }
}

function encodeVmess(conf) {
  try {
    return "vmess://" + btoa(JSON.stringify(conf))
  } catch {
    return null
  }
}

function decodeVmess(conf) {
  try {
    return JSON.parse(atob(conf.substr(8)))
  } catch {
    return {}
  }
}

function mixConfig(conf, url, protocol) {
  try {
    if (conf.tls != "tls") {
      return {}
    }
    var addr = conf.sni
    if (!addr) {
      if (conf.add && !isIp(conf.add)) {
        addr = conf.add
      } else if (conf.host && !isIp(conf.host)) {
        addr = conf.host
      }
    }
    if (!addr) {
      return conf
    }
    conf.name = (conf.name ? conf.name : conf.ps) + '-👷'
    conf.sni = url.hostname
    if (cleanIPs.length) {
      conf.add = cleanIPs[Math.floor(Math.random() * cleanIPs.length)]
    } else {
      conf.add = addressList[Math.floor(Math.random() * addressList.length)]
    }
    
    if (protocol == "vmess") {
      conf.sni = url.hostname
      conf.host = url.hostname
      if (conf.path == undefined) {
        conf.path = ""
      }
      conf.path = "/" + addr + ":" + conf.port + "/" + conf.path.replace(/^\//g, "")
      conf.fp = fpList[Math.floor(Math.random() * fpList.length)]
      conf.alpn = alpnList[Math.floor(Math.random() * alpnList.length)]
      conf.port = 443
    }
    return conf
  } catch (e) {
    return {}
  }
}

function getMultipleRandomElements(arr, num) {
  var shuffled = arr //[...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, num)
}

function isIp(str) {
  try {
    if (str == "" || str == undefined) return false
    if (!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){2}\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-4])$/.test(str)) {
      return false
    }
    var ls = str.split('.')
    if (ls == null || ls.length != 4 || ls[3] == "0" || parseInt(ls[3]) === 0) {
      return false
    }
    return true
  } catch (e) { }
  return false
}

let proxyCount = 1;

function toClash(conf, protocol) {
  const regexUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  
  var config = {};
  
  try {
    config = {
      name: conf.name ? conf.name : conf.ps,
      type: protocol,
      server: conf.add,
      port: conf.port,
      uuid: conf.id,
      alterId: 0,
      tls: true,
      cipher: conf.cipher ? conf.cipher : "auto",
      "skip-cert-verify": true,
      servername: conf.sni,
      network: conf.net,
      "ws-opts": {
        path: conf.path,
        headers: {
          host: conf.host
        }
      }
    };

    config.name = config.name.replace(/[^\u0000-\u007F\u0600-\u06FF\[\]\/\\:|@\(\).,#$%&*+=;~{}"'\-_?<>\^]+/gu, '') + "ip:" + conf.add + "-🔢" + "-" + proxyCount++;

const flags = {
  'RELAY': '🏁 ',
  'AF': '🇦🇫 ',
  'AX': '🇦🇽 ',
  'AL': '🇦🇱 ',
  'DZ': '🇩🇿 ',
  'AS': '🇦🇸 ',
  'AD': '🇦🇩 ',
  'AO': '🇦🇴 ',
  'AI': '🇦🇮 ',
  'AQ': '🇦🇶 ',
  'AG': '🇦🇬 ',
  'AR': '🇦🇷 ',
  'AM': '🇦🇲 ',
  'AW': '🇦🇼 ',
  'AU': '🇦🇺 ',
  'AT': '🇦🇹 ',
  'AZ': '🇦🇿 ',
  'BS': '🇧🇸 ',
  'BH': '🇧🇭 ',
  'BD': '🇧🇩 ',
  'BB': '🇧🇧 ',
  'BY': '🇧🇾 ',
  'BE': '🇧🇪 ',
  'BZ': '🇧🇿 ',
  'BJ': '🇧🇯 ',
  'BM': '🇧🇲 ',
  'BT': '🇧🇹 ',
  'BO': '🇧🇴 ',
  'BQ': '🇧🇶 ',
  'BA': '🇧🇦 ',
  'BW': '🇧🇼 ',
  'BV': '🇧🇻 ',
  'BR': '🇧🇷 ',
  'IO': '🇮🇴 ',
  'BN': '🇧🇳 ',
  'BG': '🇧🇬 ',
  'BF': '🇧🇫 ',
  'BI': '🇧🇮 ',
  'KH': '🇰🇭 ',
  'CM': '🇨🇲 ',
  'CA': '🇨🇦 ',
  'CV': '🇨🇻 ',
  'KY': '🇰🇾 ',
  'CF': '🇨🇫 ',
  'TD': '🇹🇩 ',
  'CL': '🇨🇱 ',
  'CN': '🇨🇳 ',
  'CX': '🇨🇽 ',
  'CC': '🇨🇨 ',
  'CO': '🇨🇴 ',
  'KM': '🇰🇲 ',
  'CG': '🇨🇬 ',
  'CD': '🇨🇩 ',
  'CK': '🇨🇰 ',
  'CR': '🇨🇷 ',
  'CI': '🇨🇮 ',
  'HR': '🇭🇷 ',
  'CU': '🇨🇺 ',
  'CW': '🇨🇼 ',
  'CY': '🇨🇾 ',
  'CZ': '🇨🇿 ',
  'DK': '🇩🇰 ',
  'DJ': '🇩🇯 ',
  'DM': '🇩🇲 ',
  'DO': '🇩🇴 ',
  'EC': '🇪🇨 ',
  'EG': '🇪🇬 ',
  'SV': '🇸🇻 ',
  'GQ': '🇬🇶 ',
  'ER': '🇪🇷 ',
  'EE': '🇪🇪 ',
  'ET': '🇪🇹 ',
  'FK': '🇫🇰 ',
  'FO': '🇫🇴 ',
  'FJ': '🇫🇯 ',
  'FI': '🇫🇮 ',
  'FR': '🇫🇷 ',
  'GF': '🇬🇫 ',
  'PF': '🇵🇫 ',
  'TF': '🇹🇫 ',
  'GA': '🇬🇦 ',
  'GM': '🇬🇲 ',
  'GE': '🇬🇪 ',
  'DE': '🇩🇪 ',
  'GH': '🇬🇭 ',
  'GI': '🇬🇮 ',
  'GR': '🇬🇷 ',
  'GL': '🇬🇱 ',
  'GD': '🇬🇩 ',
  'GP': '🇬🇵 ',
  'GU': '🇬🇺 ',
  'GT': '🇬🇹 ',
  'GG': '🇬🇬 ',
  'GN': '🇬🇳 ',
  'GW': '🇬🇼 ',
  'GY': '🇬🇾 ',
  'HT': '🇭🇹 ',
  'HM': '🇭🇲 ',
  'VA': '🇻🇦 ',
  'HN': '🇭🇳 ',
  'HK': '🇭🇰 ',
  'HU': '🇭🇺 ',
  'IS': '🇮🇸 ',
  'IN': '🇮🇳 ',
  'ID': '🇮🇩 ',
  'IR': '🇮🇷 ',
  'IQ': '🇮🇶 ',
  'IE': '🇮🇪 ',
  'IM': '🇮🇲 ',
  'IL': '🇮🇱 ',
  'IT': '🇮🇹 ',
  'JM': '🇯🇲 ',
  'JP': '🇯🇵 ',
  'JE': '🇯🇪 ',
  'JO': '🇯🇴 ',
  'KZ': '🇰🇿 ',
  'KE': '🇰🇪 ',
  'KI': '🇰🇮 ',
  'KP': '🇰🇵 ',
  'KR': '🇰🇷 ',
  'KW': '🇰🇼 ',
  'KG': '🇰🇬 ',
  'LA': '🇱🇦 ',
  'LV': '🇱🇻 ',
  'LB': '🇱🇧 ',
  'LS': '🇱🇸 ',
  'LR': '🇱🇷 ',
  'LY': '🇱🇾 ',
  'LI': '🇱🇮 ',
  'LT': '🇱🇹 ',
  'LU': '🇱🇺 ',
  'MO': '🇲🇴 ',
  'MK': '🇲🇰 ',
  'MG': '🇲🇬 ',
  'MW': '🇲🇼 ',
  'MY': '🇲🇾 ',
  'MV': '🇲🇻 ',
  'ML': '🇲🇱 ',
  'MT': '🇲🇹 ',
  'MH': '🇲🇭 ',
  'MQ': '🇲🇶 ',
  'MR': '🇲🇷 ',
  'MU': '🇲🇺 ',
  'YT': '🇾🇹 ',
  'MX': '🇲🇽 ',
  'FM': '🇫🇲 ',
  'MD': '🇲🇩 ',
  'MC': '🇲🇨 ',
  'MN': '🇲🇳 ',
  'ME': '🇲🇪 ',
  'MS': '🇲🇸 ',
  'MA': '🇲🇦 ',
  'MZ': '🇲🇿 ',
  'MM': '🇲🇲 ',
  'NA': '🇳🇦 ',
  'NR': '🇳🇷 ',
  'NP': '🇳🇵 ',
  'NL': '🇳🇱 ',
  'NC': '🇳🇨 ',
  'NZ': '🇳🇿 ',
  'NI': '🇳🇮 ',
  'NE': '🇳🇪 ',
  'NG': '🇳🇬 ',
  'NU': '🇳🇺 ',
  'NF': '🇳🇫 ',
  'MP': '🇲🇵 ',
  'NO': '🇳🇴 ',
  'OM': '🇴🇲 ',
  'PK': '🇵🇰 ',
  'PW': '🇵🇼 ',
  'PS': '🇵🇸 ',
  'PA': '🇵🇦 ',
  'PG': '🇵🇬 ',
  'PY': '🇵🇾 ',
  'PE': '🇵🇪 ',
  'PH': '🇵🇭 ',
  'PN': '🇵🇳 ',
  'PL': '🇵🇱 ',
  'PT': '🇵🇹 ',
  'PR': '🇵🇷 ',
  'QA': '🇶🇦 ',
  'RE': '🇷🇪 ',
  'RO': '🇷🇴 ',
  'RU': '🇷🇺 ',
  'RW': '🇷🇼 ',
  'BL': '🇧🇱 ',
  'SH': '🇸🇭 ',
  'KN': '🇰🇳 ',
  'LC': '🇱🇨 ',
  'MF': '🇲🇫 ',
  'PM': '🇵🇲 ',
  'VC': '🇻🇨 ',
  'WS': '🇼🇸 ',
  'SM': '🇸🇲 ',
  'ST': '🇸🇹 ',
  'SA': '🇸🇦 ',
  'SN': '🇸🇳 ',
  'RS': '🇷🇸 ',
  'SC': '🇸🇨 ',
  'SL': '🇸🇱 ',
  'SG': '🇸🇬 ',
  'SX': '🇸🇽 ',
  'SK': '🇸🇰 ',
  'SI': '🇸🇮 ',
  'SB': '🇸🇧 ',
  'SO': '🇸🇴 ',
  'ZA': '🇿🇦 ',
  'GS': '🇬🇸 ',
  'SS': '🇸🇸 ',
  'ES': '🇪🇸 ',
  'LK': '🇱🇰 ',
  'SD': '🇸🇩 ',
  'SR': '🇸🇷 ',
  'SJ': '🇸🇯 ',
  'SZ': '🇸🇿 ',
  'SE': '🇸🇪 ',
  'CH': '🇨🇭 ',
  'SY': '🇸🇾 ',
  'TW': '🇹🇼 ',
  'TJ': '🇹🇯 ',
  'TZ': '🇹🇿 ',
  'TH': '🇹🇭 ',
  'TL': '🇹🇱 ',
  'TG': '🇹🇬 ',
  'TK': '🇹🇰 ',
  'TO': '🇹🇴 ',
  'TT': '🇹🇹 ',
  'TN': '🇹🇳 ',
  'TR': '🇹🇷 ',
  'TM': '🇹🇲 ',
  'TC': '🇹🇨 ',
  'TV': '🇹🇻 ',
  'UG': '🇺🇬 ',
  'UA': '🇺🇦 ',
  'AE': '🇦🇪 ',
  'GB': '🇬🇧 ',
  'UM': '🇺🇲 ',
  'US': '🇺🇸 ',
  'UY': '🇺🇾 ',
  'UZ': '🇺🇿 ',
  'VU': '🇻🇺 ',
  'VE': '🇻🇪 ',
  'VN': '🇻🇳 ',
  'VG': '🇻🇬 ',
  'VI': '🇻🇮 ',
  'WF': '🇼🇫 ',
  'EH': '🇪🇭 ',
  'YE': '🇾🇪 ',
  'ZM': '🇿🇲 ',
  'ZW': '🇿🇼 ',
}

for (const [countryCode, flag] of Object.entries(flags)) {
  if (config.name.includes(countryCode)) {
    config.name = flag + config.name;
    break; 
  }
}

    if (!regexUUID.test(config.uuid)) {
      return {};
    }
    
    return config;
  } catch (e) {
    return {};
  }
}

function toYaml(configList) {
  var yaml = 
`
global-client-fingerprint: chrome
port: 7890
socks-port: 7891
redir-port: 7892
mixed-port: 7893
tproxy-port: 7895
allow-lan: true
tcp-concurrent: true
enable-process: true
find-process-mode: always
ipv6: true
log-level: info
cfw-latency-timeout: 6000
cfw-latency-url: https://api.v2fly.org/checkConnection.svgz
cfw-proxies-order: latency
external-controller: 0.0.0.0:9090
secret: ''
bind-address: '*'
#hosts:
  # '+.workers.dev': 185.59.218.86
unified-delay: true
experimental:
  ignore-resolve-fail: true
  sniff-tls-sni: true
  tracing: true
profile:
  store-selected: true
  store-fake-ip: true
dns:
  enable: true
  ipv6: true
  use-host: true
  enhanced-mode: fake-ip
  listen: 0.0.0.0:7874
  nameserver:
    - https://cloudflare-dns.com/dns-query
    - 'https://1.1.1.1/dns-query#en0'
    - https://1.1.1.1/dns-query
    - https://dns.google/dns-query
    - https://dns.quad9.net/dns-query
    - https://dns.nextdns.io
    - https://doh.opendns.com/dns-query
    - https://dns.adguard.com/dns-query
    - https://dns.surfshark.com/dns-query
    - https://8.8.8.8/dns-query
    - https://9.9.9.9/dns-query
    - https://doh.cleanbrowsing.org/doh/security-filter/
    - https://resolver2.dns.watch/dns-query 
    - https://doh-de.blahdns.com/dns-query
    - https://freedns.controld.com/p2
    - https://dns.dnswarden.com/adblock
    - https://adblock.doh.mullvad.net/dns-query
    - https://basic.rethinkdns.com/dns-query
    - tls://1.0.0.1:853
    - tls://1.1.1.1:853
    - tls://dns.google:853
    - 162.159.36.1
    - 162.159.46.1
    - https://dns.aa.net.uk/dns-query
    - https://rubyfish.cn/dns-query
    - https://nsc.torgues.net/dns-query
    - https://xmission-slc-1.edge.nextdns.io/dns-query
    - https://Doh1.B-Cdn.net/dns-query
    - https://dns.melalandia.tk/dns-query
    - https://jp-kix2.doh.sb/
    - https://dns.gi.co.id/dns-query
    - https://dns.controld.com/
    - https://xtom-osa-1.edge.nextdns.io/dns-query
    - https://170.176.145.150/
    - https://ipv4-zepto-mci-1.edge.nextdns.io/dns-query
    - https://res-acst3.absolight.net/
    - https://zepto-sto-1.edge.nextdns.io
    - https://xtom-osa-1.edge.nextdns.io/
    - https://ipv4-zepto-mci-1.edge.nextdns.io/
    - https://nsc.torgues.net/
    - https://zepto-sto-1.edge.nextdns.io/
    - https://doh.dns.sb/dns-query
    - tls://dns.rubyfish.cn:853
    - 'tls://8.8.8.8#en0'
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter:
    - '*.lan'
    - '*.localdomain'
    - '*.example'
    - '*.invalid'
    - '*.localhost'
    - '*.test'
    - '*.local'
    - '*.home.arpa'
    - time.*.com
    - time.*.gov
    - time.*.edu.cn
    - time.*.apple.com
    - time1.*.com
    - time2.*.com
    - time3.*.com
    - time4.*.com
    - time5.*.com
    - time6.*.com
    - time7.*.com
    - ntp.*.com
    - ntp1.*.com
    - ntp2.*.com
    - ntp3.*.com
    - ntp4.*.com
    - ntp5.*.com
    - ntp6.*.com
    - ntp7.*.com
    - '*.time.edu.cn'
    - '*.ntp.org.cn'
    - +.pool.ntp.org
    - time1.cloud.tencent.com
    - music.163.com
    - '*.music.163.com'
    - '*.126.net'
    - musicapi.taihe.com
    - music.taihe.com
    - songsearch.kugou.com
    - trackercdn.kugou.com
    - '*.kuwo.cn'
    - api-jooxtt.sanook.com
    - api.joox.com
    - joox.com
    - y.qq.com
    - '*.y.qq.com'
    - streamoc.music.tc.qq.com
    - mobileoc.music.tc.qq.com
    - isure.stream.qqmusic.qq.com
    - dl.stream.qqmusic.qq.com
    - aqqmusic.tc.qq.com
    - amobile.music.tc.qq.com
    - '*.xiami.com'
    - '*.music.migu.cn'
    - music.migu.cn
    - '*.msftconnecttest.com'
    - '*.msftncsi.com'
    - msftconnecttest.com
    - msftncsi.com
    - localhost.ptlogin2.qq.com
    - localhost.sec.qq.com
    - +.srv.nintendo.net
    - +.stun.playstation.net
    - xbox.*.microsoft.com
    - xnotify.xboxlive.com
    - +.battlenet.com.cn
    - +.wotgame.cn
    - +.wggames.cn
    - +.wowsgame.cn
    - +.wargaming.net
    - proxy.golang.org
    - stun.*.*
    - stun.*.*.*
    - +.stun.*.*
    - +.stun.*.*.*
    - +.stun.*.*.*.*
    - heartbeat.belkin.com
    - '*.linksys.com'
    - '*.linksyssmartwifi.com'
    - '*.router.asus.com'
    - mesu.apple.com
    - swscan.apple.com
    - swquery.apple.com
    - swdownload.apple.com
    - swcdn.apple.com
    - swdist.apple.com
    - lens.l.google.com
    - stun.l.google.com
    - +.nflxvideo.net
    - '*.square-enix.com'
    - '*.finalfantasyxiv.com'
    - '*.ffxiv.com'
    - '*.mcdn.bilivideo.cn'
    - +.media.dssott.com
    
sniffer:
  enable: true
  sniff:
    http: { ports: [1-442, 444-8442, 8444-65535], override-destination: true }
    tls: { ports: [1-79, 81-8079, 8081-65535], override-destination: true }
  force-domain:
      - "+.v2ex.com"
      - www.google.com
      - google.com
  skip-domain:
      - Mijia Cloud
      - dlg.io.mi.com
  sniffing:
    - tls
    - http
  port-whitelist:
    - "80"
    - "443"

tun:
  enable: true
  prefer-h3: true
  listen: 0.0.0.0:53
  stack: gvisor
  dns-hijack:
     - "any:53"
     - "tcp://any:53"
  auto-redir: true
  auto-route: true
  auto-detect-interface: true

rule-providers:
  Purification_ip:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/coldwater-10/clash_rules/main/Purification%20app%20ip.yaml
    interval: 432000
    path: ./ruleset/Purificationip.yaml
  ads_ip:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/coldwater-10/clash_rules/main/ads%20ip.yaml
    interval: 432000
    path: ./ruleset/adsip.yaml
  Purification:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/coldwater-10/clash_rules/main/Purification%20app.yaml
    interval: 432000
    path: ./ruleset/Purification.yaml
  category_public_tracker:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/category-public-tracker.yaml
    interval: 432000
    path: ./ruleset/category_public_tracker.yaml
  Global:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/coldwater-10/clash_rules/main/Global%20tracking.yaml
    interval: 432000
    path: ./ruleset/Global.yaml
  category_ads_all:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/category-ads-all.yaml
    interval: 432000
    path: ./ruleset/category_ads_all.yaml
  iran_ads:
    type: http
    behavior: domain
    url: https://github.com/bootmortis/iran-hosted-domains/releases/latest/download/clash_rules_ads.yaml
    interval: 432000
    path: ./ruleset/iran_ads.yaml
  PersianBlocker:
    type: http
    behavior: domain
    url: "https://github.com/MasterKia/iran-hosted-domains/releases/latest/download/clash_rules_ads.yaml"
    path: ./ruleset/PersianBlocker.yaml
    interval: 432000
  add:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/coldwater-10/clash_rules/main/add.yaml
    interval: 432000
    path: ./ruleset/add.yaml
  MoreAd:
    type: http
    behavior: domain
    url: https://howdy.id/download/rules/clash.txt
    interval: 86400
    path: ./providers/rule-provider_clash.yaml
  AntiAd:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-clash.yaml
    interval: 432000
    path: ./ruleset/AntiAd.yaml
  GoodbyeAds:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/coldwater-10/clash_rules/main/GoodbyeAds.yaml
    interval: 432000
    path: ./ruleset/add.yaml
  blocked:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/coldwater-10/clash_rules/main/blocked-sites.yml
    interval: 432000
    path: ./ruleset/blocked.yaml
  category_porn:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/category-porn.yaml
    interval: 432000
    path: ./ruleset/category_porn.yaml
  facebook:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/facebook.yaml
    interval: 432000
    path: ./ruleset/facebook.yaml
  youtube:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/youtube.yaml
    interval: 432000
    path: ./ruleset/youtube.yaml
  instagram:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/instagram.yaml
    interval: 432000
    path: ./ruleset/instagram.yaml
  spotify:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/spotify.yaml
    interval: 432000
    path: ./ruleset/spotify.yaml
  twitter:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/twitter.yaml
    interval: 432000
    path: ./ruleset/twitter.yaml
  telegram:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/telegram.yaml
    interval: 432000
    path: ./ruleset/telegram.yaml
  openai:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/openai.yaml
    interval: 432000
    path: ./ruleset/openai.yaml
  whatsapp:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/whatsapp.yaml
    interval: 432000
    path: ./ruleset/whatsapp.yaml
  tiktok:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/tiktok.yaml
    interval: 432000
    path: ./ruleset/tiktok.yaml
  twitch:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/twitch.yaml
    interval: 432000
    path: ./ruleset/twitch.yaml
  censor:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/coldwater-10/clash_rules/main/censor.yaml
    interval: 432000
    path: ./ruleset/tahrim.yaml
  local_ips:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/local-ips.yaml
    interval: 432000
    path: ./ruleset/local_ips.yaml
  private:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/private.yaml
    interval: 432000
    path: ./ruleset/private.yaml
  category_ir:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/coldwater-10/V2rayDomains2Clash/generated/category-ir.yaml
    interval: 432000
    path: ./ruleset/category_ir.yaml
  iran:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/coldwater-10/clash_rules/main/iran.yaml
    interval: 432000
    path: ./ruleset/iran.yaml
  iran_other:
    type: http
    behavior: domain
    url: https://github.com/bootmortis/iran-hosted-domains/releases/latest/download/clash_rules_other.yaml
    interval: 432000
    path: ./ruleset/iran_other.yaml
  steam:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/coldwater-10/clash_rules/main/steam.yaml
    interval: 432000
    path: ./ruleset/steam.yaml
  tahrim:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/coldwater-10/clash_rules/main/tahrim.yaml
    interval: 432000
    path: ./ruleset/tahrim.yaml
  ir:
    type: http
    format: yaml
    behavior: domain
    url: "https://github.com/chocolate4u/Iran-clash-rules/releases/latest/download/ir.yaml"
    path: ./ruleset/ir.yaml
    interval: 86400
  ads:
    type: http
    format: yaml
    behavior: domain
    url: "https://github.com/chocolate4u/Iran-clash-rules/releases/latest/download/category-ads-all.yaml"
    path: ./ruleset/ads.yaml
    interval: 86400
  malware:
    type: http
    format: yaml
    behavior: domain
    url: "https://github.com/chocolate4u/Iran-clash-rules/releases/latest/download/malware.yaml"
    path: ./ruleset/malware.yaml
    interval: 86400
  phishing:
    type: http
    format: yaml
    behavior: domain
    url: "https://github.com/chocolate4u/Iran-clash-rules/releases/latest/download/phishing.yaml"
    path: ./ruleset/phishing.yaml
    interval: 86400
  cryptominers:
    type: http
    format: yaml
    behavior: domain
    url: "https://github.com/chocolate4u/Iran-clash-rules/releases/latest/download/cryptominers.yaml"
    path: ./ruleset/cryptominers.yaml
    interval: 86400
  apps:
    type: http
    format: yaml
    behavior: classical
    url: "https://github.com/chocolate4u/Iran-clash-rules/releases/latest/download/apps.yaml"
    path: ./ruleset/apps.yaml
    interval: 86400
  ircidr:
    type: http
    format: yaml
    behavior: ipcidr
    url: "https://github.com/chocolate4u/Iran-clash-rules/releases/latest/download/ircidr.yaml"
    path: ./ruleset/ircidr.yaml
    interval: 86400

proxies:
${configList.map(cnf => "  - " + JSON.stringify(cnf)).join("\n")}

proxy-groups:

  - name: 🔀 نوع انتخاب پروکسی
    type: select
    proxies:
      - خودکار (بهترین پینگ) 🤖
      - دستی 🤏🏻
      - ⛔ قطع اینترنت
      - 🛡️ بدون فیلترشکن

  - name: 📶 انتخاب نوع اتصال
    type: select
    proxies:
      - 🌐 همه سایتا
      - 🔐 فقط سایتای فیلتر شده

  - name: دستی 🤏🏻
    type: select
    proxies:
${configList.map(cnf => "      - " + cnf.name.trim()).join("\n")}

  - name: خودکار (بهترین پینگ) 🤖
    type: url-test
    url: https://api.v2fly.org/checkConnection.svgz
    interval: 600
    tolerance: 180
    proxies:
${configList.map(cnf => "      - " + cnf.name.trim()).join("\n")}

  - name: 🇮🇷 سایتای ایرانی
    type: select
    proxies:
      - 🛡️ بدون فیلترشکن
      - 🚫 اجازه ندادن
      - 🔀 نوع انتخاب پروکسی

  - name: 🏴‍☠️ سایتای تحریمی
    type: select
    proxies:
      - 🔀 نوع انتخاب پروکسی
      - 🛡️ بدون فیلترشکن
      - 🚫 اجازه ندادن

  - name: 🤬 سایتای سانسوری
    type: select
    proxies:
      - 🚫 اجازه ندادن
      - 🔀 نوع انتخاب پروکسی
      - 🛡️ بدون فیلترشکن

  - name: ⚠️ سایتای مخرب
    type: select
    proxies:
      - 🚫 اجازه ندادن
      - 🔀 نوع انتخاب پروکسی
      - 🛡️ بدون فیلترشکن

  - name: 🆎 تبلیغات
    type: select
    proxies:
      - 🚫 اجازه ندادن
      - 🛡️ بدون فیلترشکن
      - 🔀 نوع انتخاب پروکسی

  - name: 🍃 تصفیه برنامه
    type: select
    proxies:
      - 🚫 اجازه ندادن
      - 🛡️ بدون فیلترشکن
      - 🔀 نوع انتخاب پروکسی

  - name: 🛑 رهگیری جهانی
    type: select
    proxies:
      - 🚫 اجازه ندادن
      - 🛡️ بدون فیلترشکن
      - 🔀 نوع انتخاب پروکسی

  - name: 🎮 استیم
    type: select
    proxies:
      - 🛡️ بدون فیلترشکن
      - 🚫 اجازه ندادن
      - 🔀 نوع انتخاب پروکسی

  - name: 🛡️ بدون فیلترشکن
    type: select
    proxies:
      - DIRECT

  - name: ⛔ قطع اینترنت
    type: select
    proxies:
      - REJECT

  - name: 🚫 اجازه ندادن
    type: select
    proxies:
      - REJECT

  - name: 🔐 فقط سایتای فیلتر شده
    type: select
    proxies:
      - DIRECT

  - name: 🌐 همه سایتا
    type: select
    proxies:
      - 🔀 نوع انتخاب پروکسی

rules:
  - RULE-SET,Purification_ip,🍃 تصفیه برنامه,no-resolve
  - RULE-SET,Purification,🍃 تصفیه برنامه
  - RULE-SET,category_public_tracker,🛑 رهگیری جهانی
  - RULE-SET,Global,🛑 رهگیری جهانی
  - RULE-SET,malware,⚠️ سایتای مخرب
  - RULE-SET,phishing,⚠️ سایتای مخرب
  - RULE-SET,cryptominers,⚠️ سایتای مخرب
  - RULE-SET,category_ads_all,🆎 تبلیغات
  - RULE-SET,ads,🆎 تبلیغات
  - RULE-SET,iran_ads,🆎 تبلیغات
  - RULE-SET,PersianBlocker,🆎 تبلیغات
  - RULE-SET,ads_ip,🆎 تبلیغات,no-resolve
  - RULE-SET,add,🆎 تبلیغات
  - RULE-SET,MoreAd,🆎 تبلیغات
  - RULE-SET,AntiAd,🆎 تبلیغات
  - RULE-SET,GoodbyeAds,🆎 تبلیغات
  - RULE-SET,blocked,🔀 نوع انتخاب پروکسی
  - RULE-SET,censor,🤬 سایتای سانسوری
  - RULE-SET,local_ips,🛡️ بدون فیلترشکن
  - RULE-SET,private,🛡️ بدون فیلترشکن
  - RULE-SET,ircidr,🇮🇷 سایتای ایرانی
  - GEOIP,IR,🇮🇷 سایتای ایرانی
  - RULE-SET,category_ir,🇮🇷 سایتای ایرانی
  - RULE-SET,iran,🇮🇷 سایتای ایرانی
  - RULE-SET,iran_other,🇮🇷 سایتای ایرانی
  - RULE-SET,ir,🇮🇷 سایتای ایرانی
  - RULE-SET,apps,🇮🇷 سایتای ایرانی
  - RULE-SET,steam,🎮 استیم
  - RULE-SET,tahrim,🏴‍☠️ سایتای تحریمی
  - RULE-SET,category_porn,🔀 نوع انتخاب پروکسی
  - RULE-SET,facebook,🔀 نوع انتخاب پروکسی
  - RULE-SET,youtube,🔀 نوع انتخاب پروکسی
  - RULE-SET,instagram,🔀 نوع انتخاب پروکسی
  - RULE-SET,spotify,🔀 نوع انتخاب پروکسی
  - RULE-SET,twitter,🔀 نوع انتخاب پروکسی
  - RULE-SET,telegram,🔀 نوع انتخاب پروکسی
  - RULE-SET,openai,🔀 نوع انتخاب پروکسی
  - RULE-SET,whatsapp,🔀 نوع انتخاب پروکسی
  - RULE-SET,tiktok,🔀 نوع انتخاب پروکسی
  - RULE-SET,twitch,🔀 نوع انتخاب پروکسی
  - MATCH,📶 انتخاب نوع اتصال
`
return yaml;
}
