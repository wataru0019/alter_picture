import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

const port = 3000
console.log(`Server running at http://localhost:${port}`)

serve({
    fetch: app.fetch,
    port: port
})