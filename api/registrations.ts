import type { IncomingMessage, ServerResponse } from 'node:http'
import { adminAllowed, createRegistration, listRegistrations } from '../server/store.ts'

function header(request: IncomingMessage, name: string) {
  const value = request.headers[name]
  return Array.isArray(value) ? value[0] : value
}

function sendJson(response: ServerResponse, status: number, payload: unknown) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

export default async function handler(
  request: IncomingMessage & { body?: unknown },
  response: ServerResponse,
) {
  if (request.method === 'GET') {
    if (!adminAllowed(header(request, 'x-admin-key'))) {
      sendJson(response, 401, { error: 'unauthorized' })
      return
    }
    sendJson(response, 200, await listRegistrations())
    return
  }

  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'method' })
    return
  }

  const result = await createRegistration(request.body)
  sendJson(response, result.status, result.body)
}
