import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge (v2) already treats any `text-*` / `bg-*` word as a colour,
 * so the colour tokens need nothing. It does not know the custom shadow keys
 * in tailwind.config.ts; registering them lets a later shadow class override
 * an earlier one.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [{ shadow: ['sheet', 'sticky', 'postcard', 'card', 'disc'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
