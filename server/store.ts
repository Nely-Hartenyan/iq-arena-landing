import { randomUUID, timingSafeEqual } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { get, list, put } from '@vercel/blob'

export interface StoredRegistration {
  id: string
  createdAt: string
  team: string
  members: [string, string, string, string]
  origin: 'college' | 'school'
  faculty: string
  school: string
  contact: string
}

const filePath = resolve(process.cwd(), 'data/registrations.json')
const blobPrefix = 'registrations/'

function text(value: unknown, max = 200): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max) return null
  return trimmed
}

export function parseRegistration(input: unknown): StoredRegistration | null {
  if (!input || typeof input !== 'object') return null
  const record = input as Record<string, unknown>
  const team = text(record.team)
  const contact = text(record.contact)
  const origin = record.origin === 'college' || record.origin === 'school' ? record.origin : null
  const members = Array.isArray(record.members) ? record.members.map((name) => text(name)) : []
  const faculty = text(record.faculty) ?? ''
  const school = text(record.school) ?? ''
  if (!team || !contact || !origin || members.length !== 4 || members.some((name) => !name)) return null
  if (origin === 'college' && !faculty) return null
  if (origin === 'school' && !school) return null

  return {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    team,
    members: members as [string, string, string, string],
    origin,
    faculty: origin === 'college' ? faculty : '',
    school: origin === 'school' ? school : '',
    contact,
  }
}

export function adminAllowed(key: string | undefined): boolean {
  const secret = process.env.REGISTRATIONS_SECRET
  if (!secret || !key) return false
  const given = Buffer.from(key)
  const expected = Buffer.from(secret)
  if (given.length !== expected.length) return false
  return timingSafeEqual(given, expected)
}

function useBlob() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return true
  if (process.env.VERCEL) throw new Error('blob-missing')
  return false
}

function readFileStore(): StoredRegistration[] {
  if (!existsSync(filePath)) return []
  const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as unknown
  return Array.isArray(parsed) ? (parsed as StoredRegistration[]) : []
}

function writeFileStore(entries: StoredRegistration[]) {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, `${JSON.stringify(entries, null, 2)}\n`)
}

async function readBlobText(pathname: string): Promise<string | null> {
  const result = await get(pathname, { access: 'private', useCache: false })
  if (!result || result.statusCode !== 200 || !result.stream) return null
  return new Response(result.stream).text()
}

async function listFromBlob(): Promise<StoredRegistration[]> {
  const pathnames: string[] = []
  let cursor: string | undefined
  do {
    const page = await list({ prefix: blobPrefix, cursor, limit: 1000 })
    pathnames.push(...page.blobs.map((blob) => blob.pathname))
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)

  const entries: StoredRegistration[] = []
  for (let index = 0; index < pathnames.length; index += 20) {
    const group = pathnames.slice(index, index + 20)
    const parsed = await Promise.all(
      group.map(async (pathname) => {
        const raw = await readBlobText(pathname)
        if (!raw) return null
        try {
          return JSON.parse(raw) as StoredRegistration
        } catch {
          return null
        }
      }),
    )
    for (const entry of parsed) {
      if (entry) entries.push(entry)
    }
  }
  return entries
}

export async function listRegistrations(): Promise<StoredRegistration[]> {
  const entries = useBlob() ? await listFromBlob() : readFileStore()
  return entries.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function createRegistration(input: unknown): Promise<{ status: number; body: unknown }> {
  const registration = parseRegistration(input)
  if (!registration) return { status: 400, body: { error: 'invalid' } }

  try {
    if (useBlob()) {
      await put(`${blobPrefix}${registration.id}.json`, JSON.stringify(registration), {
        access: 'private',
        addRandomSuffix: false,
        contentType: 'application/json',
      })
    } else {
      const entries = readFileStore()
      entries.push(registration)
      writeFileStore(entries)
    }
  } catch {
    return { status: 500, body: { error: 'store' } }
  }

  return { status: 201, body: { ok: true } }
}
