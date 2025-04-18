import { Hono } from 'hono'

import { ai_chat } from '../service/ai_chat'

const app = new Hono()

app.get('/', (c) => {
    return c.text('this is ai page!')
})

app.get('/chat', async (c) => {
    const response = await ai_chat()
    return c.json({ message: response })
})

export default app