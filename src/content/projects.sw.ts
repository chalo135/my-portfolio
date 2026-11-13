import type { Project, ProjectStatus } from './projects'

// slug, title and technology[] are identical to the English file by design —
// they are URLs, project names and product names. The prose was translated by
// Claude and is listed in SWAHILI_COPY_REVIEW.md for Charles to check.

export const statusLabels: Record<ProjectStatus, string> = {
  building: 'Ninaijenga sasa',
  live: 'Iko hewani',
  client: 'Mradi wa mteja',
  finished: 'Imekamilika',
}

export const projectContent: Project[] = [
  {
    slug: 'salio',
    title: 'Salio',
    status: 'building',
    oneLiner:
      'Mfumo wa mauzo (POS) kwa maduka ya Kenya, wenye uhasibu wa pande mbili (double-entry) chini yake.',
    problem:
      'Maduka madogo huendesha mashine ya mauzo na daftari la hesabu kando, na viwili hivyo hutofautiana taratibu. Kusawazisha hesabu mwisho wa mwezi ndiko makosa na saa nyingi hupotelea.',
    context:
      'Ninaujenga kwa kuzingatia duka la familia la vipuri vya magari, kwa wamiliki ambao si wahasibu.',
    built: [
      'Kila mauzo ni muamala mmoja wa hifadhidata unaoandika risiti, mabadiliko ya stoo na ingizo la jarida lililosawazika kwa pamoja. Hakuna usawazishaji, kwa sababu kuna seti moja tu ya hesabu.',
      'Pesa huhifadhiwa kwa senti kamili, kamwe si kwa namba za desimali (floating-point).',
      'Mabadiliko ya stoo huongezwa tu, hayahaririwi, na ripoti hukokotolewa zinaposomwa, hazihifadhiwi.',
      'Kila jedwali limefungwa kwa biashara moja, hivyo usakinishaji mmoja unaweza kuhudumia maduka mengi.',
    ],
    hardPart: {
      title: 'Mlango mmoja wa kuingia kwenye leja',
      body: 'Ni kazi moja tu, PostJournal, inayoruhusiwa kuandika mistari ya jarida, na hukataa ingizo lolote ambalo debiti na krediti zake hazilingani. Niliiandika kwa mkono na kuifunika kwa majaribio ya vipimo (unit tests).',
    },
    technology: ['.NET 10', 'C#', 'ASP.NET Core', 'EF Core', 'PostgreSQL 16', 'Docker', 'xUnit'],
  },
  {
    slug: 'pharimz',
    title: 'Pharimz Creatives',
    status: 'live',
    oneLiner:
      'Duka la mtandaoni la biashara ya Kenya ya mavazi ya mtaani na chapa inayouza hoodie, jezi za mpira wa miguu na huduma za usanifu.',
    problem:
      'Biashara ilihitaji kupokea oda na malipo mtandaoni kwa shilingi, ikiwemo M-Pesa, ambayo ndiyo njia wateja wengi hulipa.',
    built: [
      'Duka, akaunti za wateja na malipo kwa M-Pesa STK Push, PayPal na kadi, kwa bei za KES.',
    ],
    hardPart: {
      title: 'Kuliimarisha baada ya uzinduzi',
      body: 'Niliziba mwanya ambapo kubadilisha kitambulisho kwenye ombi kungeweza kufichua oda ya mteja mwingine, nikathibitisha majibu ya malipo ya M-Pesa ili uthibitisho usiweze kughushiwa, na nikaimarisha usalama wa safu (row-level security) wa Supabase.',
    },
    technology: ['React', 'Vite', 'Node.js', 'Express', 'Supabase', 'M-Pesa Daraja'],
  },
  {
    slug: 'kahawa-smart',
    title: 'Kahawa Smart',
    status: 'finished',
    oneLiner: 'Utambuzi wa kutu ya majani ya kahawa kutoka kwenye picha, kwa wakulima wadogo wa Kenya.',
    problem:
      'Kutu ya majani ya kahawa huenea haraka, na mkulima mdogo mara nyingi hawezi kupata mtaalamu wa kuangalia jani kwa wakati.',
    context: 'Niliujenga kama mradi wangu wa maonyesho wa chuo kikuu.',
    built: [
      'Modeli ya TensorFlow inayotambua kutu ya majani ya kahawa kutoka kwenye picha ya jani.',
      'Chatbot inayojibu maswali ya ziada, ikitegemea mfumo wa kutafuta taarifa (RAG).',
    ],
    technology: ['TensorFlow', 'Python', 'FastAPI', 'JavaScript', 'GSAP', 'Groq'],
  },
]
