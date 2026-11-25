import { Ratelimit } from '@upstash/ratelimit'
import { createRedis } from './lib/redis.ts'

const emailPattern = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/
const encoder = new TextEncoder()
const maxBodyBytes = 1024

function json(status, body, headers) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } })
}

async function readEmail(request) {
  let bytes = 0
  const boundedBody = request.body.pipeThrough(new TransformStream({
    transform(chunk, controller) {
      bytes += chunk.byteLength
      if (bytes > maxBodyBytes) throw new RangeError('Signup body too large')
      controller.enqueue(chunk)
    },
  }))
  const body = await new Response(boundedBody).json()
  return typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
}

async function rateLimitIdentifier(request, secret) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(ip))
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

async function joinWaitlist(request, env, context, origin) {
  if (request.method !== 'POST') return json(405, { ok: false }, { Allow: 'POST' })

  const requestOrigin = request.headers.get('Origin')
  if (requestOrigin && requestOrigin !== origin) return json(403, { ok: false })

  const contentType = request.headers.get('Content-Type')?.split(';', 1)[0].trim().toLowerCase()
  if (contentType !== 'application/json' || !request.body) return json(415, { ok: false })

  const invalidEmail = { ok: false, message: 'Enter a valid email address.' }
  let email
  try {
    email = await readEmail(request)
  } catch (error) {
    return error instanceof RangeError ? json(413, { ok: false }) : json(400, invalidEmail)
  }
  if (email.length > 254 || !emailPattern.test(email)) return json(400, invalidEmail)

  const unavailable = { ok: false, message: 'Signups are temporarily unavailable. Please try again later.' }
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return json(503, unavailable)

  try {
    const redis = createRedis(env)
    const rateLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(6, '10 m'),
      prefix: 'monolog:waitlist:ratelimit',
      timeout: 0,
    })
    const identifier = await rateLimitIdentifier(request, env.UPSTASH_REDIS_REST_TOKEN)
    const { success, reset, pending } = await rateLimit.limit(identifier)
    context.waitUntil(pending)
    if (!success) {
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
      return json(429, { ok: false, message: 'Too many signup attempts. Please try again in a few minutes.' }, {
        'Retry-After': String(retryAfter),
      })
    }

    await redis.zadd('monolog:waitlist:emails', { nx: true }, { score: Date.now(), member: email })
    return json(200, { ok: true })
  } catch {
    console.error('Monolog waitlist could not reach Redis')
    return json(503, unavailable)
  }
}

export default {
  fetch(request, env, context) {
    const url = new URL(request.url)
    if (url.pathname === '/api/waitlist') return joinWaitlist(request, env, context, url.origin)
    return env.ASSETS.fetch(request)
  },
}
