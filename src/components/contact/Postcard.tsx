import BenchObject from '@/components/bench/BenchObject'
import { contact } from '@/content/site'
import type { ContactCopy } from '@/content/contact'
import AddressSide from './AddressSide'
import ContactForm from './ContactForm'

/** The postcard form with a pen lying across its top-right corner. */
export default function Postcard({ name, copy }: { name: string; copy: ContactCopy }) {
  return (
    <div className="relative">
      <ContactForm email={contact.email} copy={copy.form}>
        <AddressSide name={name} email={contact.email} copy={copy} />
      </ContactForm>
      {/* Pulled in a little on phones so it doesn't cause sideways scroll. */}
      <BenchObject
        name="pen"
        width={220}
        height={20}
        tilt={-28}
        // Hidden under 640px: there it would lie across the intro text.
        className="pointer-events-none right-[-24px] top-[-40px] z-10 max-sm:hidden"
      />
    </div>
  )
}
