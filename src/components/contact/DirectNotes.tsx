import StickyNote from '@/components/bench/StickyNote'
import { contact } from '@/content/site'
import { directLinks, type ContactCopy } from '@/content/contact'
import CopyEmailButton from './CopyEmailButton'

/** `Or reach me directly`: one sticky note per contact detail that exists. */
export default function DirectNotes({ copy }: { copy: ContactCopy['direct'] }) {
  const links = directLinks()
  if (links.length === 0) return null

  return (
    <section aria-labelledby="reach-directly" className="mt-[90px]">
      <h2 id="reach-directly" className="mb-[26px] text-[32px] font-bold leading-tight">
        {copy.heading}
      </h2>
      <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[22px] p-0">
        {links.map((link) => (
          <StickyNote
            key={link.kind}
            as="li"
            color={link.color}
            tilt={link.tilt}
            className="flex flex-col gap-[6px] px-[18px] pb-4 pt-[18px]"
          >
            <span className="text-[12px] uppercase tracking-[0.08em]">{copy[link.kind]}</span>
            <a
              href={link.href}
              className="flex min-h-[44px] items-center text-[18px] font-medium underline decoration-paper-ink/40 underline-offset-4 [overflow-wrap:anywhere] hover:text-accent"
            >
              {link.text}
            </a>
            {link.kind === 'email' && (
              <CopyEmailButton email={contact.email} label={copy.copy} copiedLabel={copy.copied} />
            )}
          </StickyNote>
        ))}
      </ul>
    </section>
  )
}
