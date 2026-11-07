import type { ExperienceEntry } from './experience'

// Placeholders are carried across unchanged. `period` is digits and an en dash,
// so it is identical in both locales; only "Present" is translated.

export const experienceContent: ExperienceEntry[] = [
  {
    id: 'exp-1',
    role: 'Mhandisi Mkuu wa Programu',
    organization: '[Shirika Lako]',
    period: '2024 — Sasa',
    description:
      'Kuongoza utengenezaji wa suluhisho za programu za kiwango cha kampuni kwa mkazo wa upanuzi, usalama, na matumizi ya mtumiaji.',
    highlights: [
      'Nilibuni na kuwasilisha mifumo iliyo hewani inayohudumia maelfu ya watumiaji',
      'Niliweka viwango vya uhandisi na taratibu za kukagua msimbo',
      'Niliwafunza wanachama wa timu mbinu za kisasa za utengenezaji',
    ],
  },
  {
    id: 'exp-2',
    role: 'Mhandisi wa Full-Stack',
    organization: '[Shirika la Awali]',
    period: '2022 — 2024',
    description:
      'Nilijenga na kudumisha programu kamili katika upande wa mbele, upande wa nyuma, na miundombinu ya wingu.',
    highlights: [
      'Nilitengeneza programu za wavuti zinazoitikia kwa React na Next.js',
      'Nilibuni API za RESTful na GraphQL kwa uunganishaji wa wateja',
      'Nilitekeleza mifereji ya CI/CD iliyopunguza muda wa usambazaji kwa kiasi kikubwa',
    ],
  },
  {
    id: 'exp-3',
    role: 'Mtengenezaji wa Programu',
    organization: '[Shirika la Mapema]',
    period: '2020 — 2022',
    description:
      'Nilichangia katika utengenezaji wa bidhaa katika mzunguko mzima wa programu, kutoka mahitaji hadi usambazaji.',
    highlights: [
      'Nilishirikiana na timu za taaluma mbalimbali katika kuwasilisha vipengele',
      'Niliboresha utendaji wa programu na maswali ya hifadhidata',
      'Nilishiriki katika michakato ya utengenezaji wa agile',
    ],
  },
]
