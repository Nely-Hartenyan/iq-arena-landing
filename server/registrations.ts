import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect, Plugin } from 'vite'
import { adminAllowed, createRegistration, listRegistrations } from './store.ts'

function sendJson(response: ServerResponse, status: number, payload: unknown) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

function header(request: IncomingMessage, name: string) {
  const value = request.headers[name]
  return Array.isArray(value) ? value[0] : value
}

function readBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolveBody, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    request.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > 10_000) {
        reject(new Error('too-large'))
        request.destroy()
        return
      }
      chunks.push(chunk)
    })
    request.on('end', () => resolveBody(Buffer.concat(chunks).toString('utf8')))
    request.on('error', reject)
  })
}

async function handleApi(request: IncomingMessage, response: ServerResponse) {
  const url = request.url?.split('?')[0]
  if (url !== '/api/registrations') return false

  if (request.method === 'GET') {
    if (!adminAllowed(header(request, 'x-admin-key'))) {
      sendJson(response, 401, { error: 'unauthorized' })
      return true
    }
    sendJson(response, 200, await listRegistrations())
    return true
  }

  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'method' })
    return true
  }

  let input: unknown
  try {
    input = JSON.parse(await readBody(request))
  } catch {
    sendJson(response, 400, { error: 'invalid' })
    return true
  }
  const result = await createRegistration(input)
  sendJson(response, result.status, result.body)
  return true
}

function attach(middlewares: Connect.Server) {
  middlewares.use(async (request, response, next) => {
    try {
      if (await handleApi(request, response)) return
      const path = request.url?.split('?')[0]
      if (path === '/registrations') request.url = '/registrations.html'
      next()
    } catch (error) {
      next(error as Error)
    }
  })
}

export function registrationsApi(): Plugin {
  return {
    name: 'registrations-api',
    configureServer(server) {
      attach(server.middlewares)
    },
    configurePreviewServer(server) {
      attach(server.middlewares)
    },
  }
}
