import { Redis } from '@upstash/redis/cloudflare'

export interface RedisEnv {
  UPSTASH_REDIS_REST_URL: string
  UPSTASH_REDIS_REST_TOKEN: string
}

export function createRedis(env: RedisEnv) {
  return Redis.fromEnv(env, {
    enableTelemetry: false,
    retry: false,
    signal: () => AbortSignal.timeout(5000),
  })
}
