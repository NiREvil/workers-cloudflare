addEventListener('fetch', event => {
event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
// بارگیری داده‌ها از لینک‌های مورد نظر
const list1_response = await fetch("https://raw.githubusercontent.com/coldwater-10/clash_rules/main/List%20of%20clean%20IPs.txt")
const list2_response = await fetch("https://cf-clean-ips.vpnclashfa.workers.dev")

// تجزیه و تحلیل رشته‌های JSON از لینک‌های بالا
const list1 = {}
const list1_text = await list1_response.text()
list1_text.match(/\d+.\d+.\d+.\d+/g).forEach(ip => list1[ip] = true)

const list2 = {}
const list2_text = await list2_response.text()
list2_text.match(/(\d+.\d+.\d+.\d+)\s+(.+)/g).forEach(match => {
const [ip, description] = match.split(/\s+/)
list2[ip] = description
})

// تعیین ای‌پی‌های تکراری در دو لیست و نمایش ای‌پی‌های غیر تکراری
const duplicates = {}
const result = []
for (const [ip, description] of Object.entries(list2)) {
if (list1[ip] && !duplicates[ip]) {
duplicates[ip] = true
} else if (!duplicates[ip]) {
result.push(ip)
duplicates[ip] = true
}
}

return new Response(result.join('\n'), { status: 200 })
}
