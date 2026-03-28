
const lanIp = process.env.NEXT_PUBLIC_LAN_IP || '127.0.0.1'
const HOST = `http://${lanIp}:3005` // 真实的 NestJS 后端 (内部 SSR 访问)

export async function get(url: string) {
  console.log('Fetching URL:', `${HOST}${url}`)
  const res = await fetch(`${HOST}${url}`, { cache: 'no-store' })
  const data = await res.json()
  console.log('Fetch response data:', data)
  return data
}

export async function post(url: string, body: any) {
  const res = await fetch(`${HOST}${url}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  const data = res.json()
  return data
}