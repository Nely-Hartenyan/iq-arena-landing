export type Origin = 'college' | 'school'

export interface Registration {
  team: string
  members: [string, string, string, string]
  origin: Origin
  faculty: string
  school: string
  contact: string
}

export async function sendRegistration(registration: Registration): Promise<void> {
  const response = await fetch('/api/registrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registration),
  })

  if (!response.ok) throw new Error('send-failed')
}
