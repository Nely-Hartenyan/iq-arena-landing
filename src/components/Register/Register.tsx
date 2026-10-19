import { useState, type FormEvent } from 'react'
import { sendRegistration, type Origin, type Registration } from '../../lib/register'
import styles from './Register.module.css'

const emptyMembers: Registration['members'] = ['', '', '', '']

interface FormValues {
  team: string
  members: Registration['members']
  origin: Origin | ''
  faculty: string
  school: string
  contact: string
}

const initialValues: FormValues = {
  team: '',
  members: emptyMembers,
  origin: '',
  faculty: '',
  school: '',
  contact: '',
}

type FieldErrors = Partial<Record<'team' | 'members' | 'origin' | 'faculty' | 'school' | 'contact', string>>

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.team.trim()) errors.team = 'Գրեք թիմի անունը'
  if (values.members.some((name) => !name.trim())) errors.members = 'Գրեք չորս մասնակիցների անունները'
  if (!values.origin) errors.origin = 'Ընտրեք՝ քոլեջից եք, թե դպրոցից'
  if (values.origin === 'college' && !values.faculty.trim()) errors.faculty = 'Գրեք ֆակուլտետը'
  if (values.origin === 'school' && !values.school.trim()) errors.school = 'Գրեք դպրոցի անվանումը'
  if (!values.contact.trim()) errors.contact = 'Գրեք, թե ինչպես կապվել'
  return errors
}

export function Register() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const updateMember = (index: number, name: string) => {
    setValues((current) => {
      const members = [...current.members] as Registration['members']
      members[index] = name
      return { ...current, members }
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || !values.origin) return

    setStatus('sending')
    try {
      await sendRegistration({
        team: values.team.trim(),
        members: values.members.map((name) => name.trim()) as Registration['members'],
        origin: values.origin,
        faculty: values.faculty.trim(),
        school: values.school.trim(),
        contact: values.contact.trim(),
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <section className={styles.section} id="register">
        <div className={styles.success}>
          <p className={styles.kicker}>Գրանցում</p>
          <h2>Թիմը գրանցված է</h2>
          <p>Հայտը պահված է։ Կազմակերպիչները կկապվեն ձեզ հետ։</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section} id="register">
      <div className={styles.head}>
        <p className={styles.kicker}>Գրանցում</p>
        <h2>Գրանցեք թիմը</h2>
        <p>Թիմի անուն, չորս մասնակից և որտեղից եք՝ քոլեջից, թե դպրոցից։</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.field}>
          <span>Թիմի անուն</span>
          <input
            value={values.team}
            aria-invalid={errors.team ? true : undefined}
            onChange={(event) => setValues((current) => ({ ...current, team: event.target.value }))}
          />
          {errors.team && <small>{errors.team}</small>}
        </label>

        <fieldset className={styles.members}>
          <legend>Մասնակիցներ</legend>
          <div className={styles.memberGrid}>
            {values.members.map((name, index) => (
              <label key={index} className={styles.field}>
                <span>Մասնակից {index + 1}</span>
                <input
                  value={name}
                  aria-invalid={errors.members ? true : undefined}
                  onChange={(event) => updateMember(index, event.target.value)}
                />
              </label>
            ))}
          </div>
          {errors.members && <small className={styles.error}>{errors.members}</small>}
        </fieldset>

        <fieldset className={styles.origin}>
          <legend>Որտեղի՞ց եք</legend>
          <div className={styles.choices}>
            <label data-checked={values.origin === 'college'}>
              <input
                type="radio"
                name="origin"
                checked={values.origin === 'college'}
                onChange={() => setValues((current) => ({ ...current, origin: 'college', school: '' }))}
              />
              <strong>Քոլեջից</strong>
              <span>European College of Armenia</span>
            </label>
            <label data-checked={values.origin === 'school'}>
              <input
                type="radio"
                name="origin"
                checked={values.origin === 'school'}
                onChange={() => setValues((current) => ({ ...current, origin: 'school', faculty: '' }))}
              />
              <strong>Դպրոցից</strong>
              <span>Այլ դպրոց</span>
            </label>
          </div>
          {errors.origin && <small className={styles.error}>{errors.origin}</small>}
        </fieldset>

        {values.origin === 'college' && (
          <label className={styles.field}>
            <span>Ֆակուլտետ</span>
            <input
              value={values.faculty}
              aria-invalid={errors.faculty ? true : undefined}
              onChange={(event) => setValues((current) => ({ ...current, faculty: event.target.value }))}
            />
            {errors.faculty && <small>{errors.faculty}</small>}
          </label>
        )}

        {values.origin === 'school' && (
          <label className={styles.field}>
            <span>Դպրոցի անվանումը</span>
            <input
              value={values.school}
              aria-invalid={errors.school ? true : undefined}
              onChange={(event) => setValues((current) => ({ ...current, school: event.target.value }))}
            />
            {errors.school && <small>{errors.school}</small>}
          </label>
        )}

        <label className={styles.field}>
          <span>Ինչպե՞ս կարող ենք կապվել ձեզ հետ</span>
          <input
            placeholder="Հեռախոս, էլ. փոստ կամ այլ կապ"
            value={values.contact}
            aria-invalid={errors.contact ? true : undefined}
            onChange={(event) => setValues((current) => ({ ...current, contact: event.target.value }))}
          />
          {errors.contact && <small>{errors.contact}</small>}
        </label>

        {status === 'error' && (
          <p className={styles.formError} role="alert">
            Չհաջողվեց պահել հայտը։ Թարմացրեք էջը և փորձեք կրկին։
          </p>
        )}

        <button className={styles.submit} type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Պահվում է…' : 'Գրանցել թիմը'}
        </button>
      </form>
    </section>
  )
}
