'use client'

import { useEffect, useState } from 'react'
import { ageOn } from '@/content/about'

/**
 * The age in whole years. The server renders it for the build date; after
 * mount it is worked out again for today, so a stale build still reads right
 * and hydration matches.
 */
export default function AgeValue({ born, initial }: { born: string; initial: number }) {
  const [age, setAge] = useState(initial)
  useEffect(() => {
    const now = ageOn(born, new Date())
    if (Number.isFinite(now)) setAge(now)
  }, [born])
  return <>{age}</>
}
