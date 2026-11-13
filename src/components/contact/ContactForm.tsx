'use client'

import { useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import Paper from '@/components/bench/Paper'
import Pill, { pillClasses } from '@/components/bench/Pill'
import { fill, mailtoUrl, topics, type ContactCopy, type Topic } from '@/content/contact'
import { cn } from '@/lib/utils'

const fieldClasses =
  'w-full rounded-none border-0 border-b-2 border-fg/35 bg-transparent px-[2px] py-[10px] text-[17px] text-paper-ink placeholder:text-fg-muted transition-colors duration-150 focus:border-accent focus:outline-none focus-visible:outline-none'

/**
 * The postcard. A form that posts nowhere: on a valid submit it opens the
 * visitor's email app through a mailto: URL. `children` is the address side.
 */
export default function ContactForm({
  email,
  copy,
  children,
}: {
  email: string
  copy: ContactCopy['form']
  children?: ReactNode
}) {
  const id = useId()
  const nameId = `${id}-name`
  const messageId = `${id}-message`
  const nameRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [topic, setTopic] = useState<Topic>(topics[0])
  const [errors, setErrors] = useState({ name: false, message: false })

  function onName(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
    if (errors.name) setErrors((prev) => ({ ...prev, name: false }))
  }

  function onMessage(e: ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value)
    if (errors.message) setErrors((prev) => ({ ...prev, message: false }))
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const cleanName = name.trim()
    const cleanMessage = message.trim()
    const next = { name: !cleanName, message: !cleanMessage }
    setErrors(next)
    if (next.name) {
      nameRef.current?.focus()
      return
    }
    if (next.message) {
      messageRef.current?.focus()
      return
    }
    const subject = fill(copy.subjects[topic], { name: cleanName })
    window.location.href = mailtoUrl(email, subject, cleanMessage, cleanName)
  }

  return (
    <Paper
      as="form"
      tilt={-0.8}
      noValidate
      onSubmit={onSubmit}
      className="flex flex-col shadow-postcard min-[900px]:flex-row"
    >
      {/* Message side */}
      <div className="flex flex-col gap-6 px-6 pb-7 pt-8 min-[480px]:px-9 min-[480px]:pb-8 min-[480px]:pt-9 min-[900px]:flex-[1_1_460px]">
        <div className="flex flex-col">
          <label htmlFor={nameId} className="text-[14px] font-bold">
            {copy.nameLabel}
          </label>
          <input
            ref={nameRef}
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            placeholder={copy.namePlaceholder}
            value={name}
            onChange={onName}
            aria-invalid={errors.name || undefined}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            className={fieldClasses}
          />
          {errors.name && (
            <p id={`${nameId}-error`} role="alert" className="mt-2 text-[14px] text-accent">
              {copy.nameError}
            </p>
          )}
        </div>

        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-3 p-0 text-[14px] font-bold">{copy.topicLegend}</legend>
          <div className="flex flex-wrap gap-[10px]">
            {topics.map((t) => (
              <label
                key={t}
                className={cn(
                  pillClasses(topic === t ? 'active' : 'default'),
                  'cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-fg'
                )}
              >
                <input
                  type="radio"
                  name="topic"
                  value={t}
                  checked={topic === t}
                  onChange={() => setTopic(t)}
                  className="sr-only focus-visible:outline-none"
                />
                {copy.topics[t]}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col">
          <label htmlFor={messageId} className="text-[14px] font-bold">
            {copy.messageLabel}
          </label>
          <textarea
            ref={messageRef}
            id={messageId}
            name="message"
            rows={4}
            placeholder={copy.messagePlaceholder}
            value={message}
            onChange={onMessage}
            aria-invalid={errors.message || undefined}
            aria-describedby={errors.message ? `${messageId}-error` : undefined}
            className={cn(fieldClasses, 'min-h-[110px] resize-y')}
          />
          {errors.message && (
            <p id={`${messageId}-error`} role="alert" className="mt-2 text-[14px] text-accent">
              {copy.messageError}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-3">
          <Pill type="submit" variant="primary" className="min-h-[52px] px-[26px] text-[16px]">
            {copy.submit}
          </Pill>
          <p className="text-[14px] text-fg-muted">{copy.helper}</p>
        </div>
      </div>

      {children}
    </Paper>
  )
}
