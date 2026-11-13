import { Postmark } from '@/components/bench/drawings'
import type { ContactCopy } from '@/content/contact'
import NairobiStamp from './NairobiStamp'

const line = 'border-b border-fg/30 pb-1'

/** The right half of the postcard: stamp, postmark and the address. */
export default function AddressSide({
  name,
  email,
  copy,
}: {
  name: string
  email: string
  copy: Pick<ContactCopy, 'address' | 'stamp'>
}) {
  return (
    <div className="relative min-h-[380px] border-t-2 border-dashed border-fg/25 p-6 min-[480px]:p-9 min-[900px]:flex-[1_1_340px] min-[900px]:border-l-2 min-[900px]:border-t-0">
      <NairobiStamp
        city={copy.stamp.city}
        zone={copy.stamp.zone}
        label={copy.stamp.label}
        labelPending={copy.stamp.labelPending}
      />
      <Postmark width={96} height={96} className="absolute right-[120px] top-[96px] opacity-55" />

      {/* 180px from the top of the side, padding included. */}
      <address className="mt-[156px] flex flex-col gap-3 not-italic min-[480px]:mt-[144px]">
        <span className="text-[13px] text-fg-muted">{copy.address.to}</span>
        <span className={`${line} font-hand text-[34px] font-bold leading-tight`}>{name}</span>
        <span className={`${line} font-hand text-[30px] leading-tight`}>{copy.address.location}</span>
        <span className={`${line} font-hand text-[22px] leading-tight [overflow-wrap:anywhere] min-[480px]:text-[26px]`}>
          {email}
        </span>
      </address>
    </div>
  )
}
