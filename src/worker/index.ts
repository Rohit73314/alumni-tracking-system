// src/worker/index.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello from Hono on Cloudflare Workers!')
})

export default app