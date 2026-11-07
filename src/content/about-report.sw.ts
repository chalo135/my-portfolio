import type { AboutReportCopy } from './about-report'

// Translated by Claude, not a Kiswahili speaker; every long string is listed in
// SWAHILI_COPY_REVIEW.md. DAX, M code, table, column and step names stay in
// English on purpose: they are identifiers in the .pbix.

const introOpening =
  'Mimi ni Charles Ndirangu, ila watu wengi huniita Chalo. Ni mhandisi wa programu jijini Nairobi, na ninaunda programu za mauzo, M-Pesa na uhasibu ambazo biashara za Kenya hutegemea.'
const introReport =
  'Pia ninafanya kazi na Power BI, kwa hiyo sehemu hii ni ripoti kunihusu. Bofya hali, mstari wa chati au mradi ili kuichuja. Muundo wa data, vipimo vya DAX na hatua za Power Query zilizo nyuma yake viko kwenye kurasa nyingine'

export const aboutReportCopy: AboutReportCopy = {
  intro: [introOpening, `${introReport}.`],
  introWithPbix: [
    introOpening,
    `${introReport}, na unaweza kupakua faili la .pbix na kulifungua mwenyewe.`,
  ],

  kinds: {
    salio: 'Bidhaa',
    pharimz: 'Duka la mtandaoni',
    'kahawa-smart': 'Programu ya AI',
  },

  areaLabels: {
    Frontend: 'Frontend',
    Backend: 'Backend',
    Database: 'Hifadhidata',
    'AI and ML': 'AI na ML',
    Payments: 'Malipo',
    'DevOps and testing': 'DevOps na majaribio',
  },

  timeline: [
    {
      lane: 'BSc ya Teknolojia ya Kompyuta',
      sub: 'Multimedia University of Kenya',
      type: 'Education',
    },
    {
      lane: 'Uendeshaji, biashara ya familia',
      sub: 'Mabomba na mitambo ya biogesi, takriban wateja wakubwa 12',
      type: 'Work',
      start: '2023-05-01',
    },
    {
      lane: 'Msanidi programu huru',
      sub: 'Tangu Aprili 2025',
      type: 'Work',
      start: '2025-04-01',
    },
    { lane: 'Mafunzo kazini ya usaidizi wa mtandao, Fiberlink', type: 'Attachment' },
    { lane: 'Cheti cha usaidizi kwa wateja', type: 'Certificate' },
    { lane: 'ALX Data and AI Literacy', type: 'Certificate', end: '2026-11-30', expected: true },
  ],

  profile: [
    { field: 'Jina', value: 'Charles Ndirangu Mwangi' },
    { field: 'Hujulikana kama', value: 'Chalo' },
    { field: 'Anaishi', value: 'Nairobi na Nyeri, Kenya' },
    { field: 'Umri' },
    { field: 'Jinsia' },
    { field: 'Urefu' },
    { field: 'Uzito' },
    { field: 'Shahada', value: 'BSc ya Teknolojia ya Kompyuta, Multimedia University of Kenya' },
    { field: 'KCSE', value: 'Wastani wa alama A, pointi 80 kati ya 84' },
    { field: 'Hisabati ya KCSE', value: 'Asilimia 4 ya juu ya watahiniwa kitaifa' },
  ],

  measureNotes: [
    'Huhesabu kupitia jedwali la daraja, ili kichujio cha hali na mistari ya teknolojia viweze kukichuja.',
    'KEEPFILTERS huheshimu kichujio. Ukichagua Ninaijenga sasa, thamani hii inashuka hadi 0 badala ya kurudi kwenye kila mradi uliokamilika.',
    'Mtindo uleule wa Shipped, kwa kazi inayoendelea.',
    'Zana tofauti katika muktadha wa kichujio wa sasa.',
    'Hulisha maelezo ya chati ya mistari. REMOVEFILTERS huondoa kichujio cha teknolojia kwa sehemu ya chini ya sehemu tu.',
    'Haisomi jedwali lolote, kwa hiyo hakuna kichujio kinachoweza kuibadilisha. Inaongezeka yenyewe kila mwezi.',
    'Kazi kwenye ratiba ambazo bado hazina tarehe ya mwisho.',
    'Jedwali lililokokotolewa, lililowekwa alama kama jedwali la tarehe. Linaanzia mwaka wa kwanza kwenye ratiba hadi mwisho wa mwaka huu.',
  ],

  stepCaptions: [
    'Inaunganisha na kitabu cha kazi. Safu moja kwa kila laha.',
    'Inafungua laha ya Projects. Majina ya safu wima bado yamekaa kwenye safu ya kwanza.',
    'Safu ya kwanza inakuwa majina ya safu wima.',
    'Kila safu wima inawekwa kuwa maandishi, ili hakuna kinachokisiwa kuwa namba au tarehe.',
    'Jedwali la daraja linahitaji ufunguo wa mradi na teknolojia zake tu.',
    'Safu moja kwa kila teknolojia. Kugawanya kwenye koma kunaacha nafasi mbele ya kila jina baada ya la kwanza.',
    'Trim huondoa nafasi hizo, kwa hiyo " Vite" inakuwa "Vite" na inalingana na DimTech.',
    'Stack inakuwa TechKey, safu wima inayohusiana na DimTech.',
    'Mradi unaweza kutaja teknolojia mara moja tu. Hapakuwa na nakala za kuondoa hapa.',
  ],

  ui: {
    heading: 'Kunihusu',
    reportTitle: 'Chalo kwa data',
    refreshed: 'Imesasishwa',
    download: 'Pakua faili la .pbix',
    monthsShort: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
    tabsLabel: 'Kurasa za ripoti',
    tabs: {
      overview: 'Muhtasari',
      model: 'Muundo wa data',
      dax: 'Vipimo vya DAX',
      powerQuery: 'Power Query',
    },
    slicerLabel: 'Hali',
    all: 'Zote',
    noFilters: 'Hakuna vichujio.',
    filtersSentence: 'Vichujio: {filters}.',
    statusIs: 'hali ni {v}',
    areaIs: 'eneo ni {v}',
    projectIs: 'mradi ni {v}',
    clearFilters: 'Ondoa vichujio',
    kpis: {
      projects: { label: 'Miradi', sub: 'kwenye data' },
      shipped: { label: 'Zilizokamilika', sub: 'iko hewani au imekamilika' },
      building: { label: 'Ninaijenga sasa', sub: 'inaendelea' },
      technologies: { label: 'Teknolojia', sub: 'zana tofauti zilizotumika' },
      months: { label: 'Miezi ya kazi huru', sub: 'tangu Aprili 2025' },
    },
    barsTitle: 'Miradi kwa eneo la teknolojia',
    barAria: '{area}: miradi {n} kati ya {total}',
    barTip: 'Miradi {n} kati ya {total}, {pct}',
    tableTitle: 'Miradi',
    columns: { project: 'Mradi', status: 'Hali', kind: 'Aina', stack: 'Teknolojia' },
    total: 'Jumla',
    totalProjects: 'miradi {n}',
    timelineTitle: 'Ratiba ya kazi na masomo',
    today: 'Leo',
    now: 'sasa',
    certificates: 'Vyeti',
    expected: 'kinatarajiwa',
    specTitle: 'Taarifa binafsi',
    blank: '(Tupu)',
    rows: 'safu {n}',
    modelAria:
      'Muundo wa data: DimProject na DimTech kila moja huchuja FactProjectTech, DimDate huchuja FactTimeline kupitia Start.',
    measuresBox: 'Vipimo',
    keyMarker: 'ufunguo',
    modelNotes: [
      {
        title: 'Kwa nini jedwali la daraja.',
        body: 'Mradi mmoja hutumia teknolojia nyingi, na teknolojia moja hujitokeza katika miradi mingi. Kuweka safu moja kwa kila jozi kunamaanisha teknolojia hazihitaji kukaa kwenye safu wima iliyotenganishwa kwa koma ambayo kichujio hakiwezi kuisoma.',
      },
      {
        title: 'Vichujio vya upande mmoja tu.',
        body: 'Kila uhusiano huchuja kutoka jedwali la vipimo kwenda jedwali la ukweli. Vipimo huhesabu safu kwenye daraja, kwa hiyo kuchagua eneo la teknolojia kunafikia miradi bila uhusiano wa pande mbili.',
      },
      {
        title: 'Jedwali halisi la tarehe.',
        body: 'DimDate ni jedwali lililokokotolewa na kuwekwa alama kama jedwali la tarehe. Huchuja FactTimeline kupitia Start, na MonthNo huhakikisha miezi inapangwa kwa mpangilio wa tarehe badala ya alfabeti.',
      },
    ],
    daxContext: 'Muktadha wa kichujio sasa hivi: {filters}. Thamani zilizo hapa chini zimekokotolewa ndani yake.',
    daxNoContext:
      'Hakuna vichujio sasa hivi. Weka kimoja kwenye ukurasa wa Muhtasari kisha urudi: thamani zilizo hapa chini zitabadilika nacho.',
    backToOverview: 'Rudi kwenye Muhtasari',
    stepsTitle: 'Hatua zilizotumika',
    queryName: 'Hoja: FactProjectTech',
    previewTitle: 'Jedwali katika hatua hii',
    previewNote: 'Inaonyesha safu ya Pharimz Creatives pekee.',
    mCodeTitle: 'Msimbo wa M',
    figureCaption: 'Ripoti hiyohiyo ndani ya Power BI Desktop.',
    figureAlt:
      'Ripoti ya Chalo kwa data ikiwa wazi ndani ya Power BI Desktop, ikionyesha ukurasa wa Muhtasari wenye kichujio cha hali, kadi za KPI, chati ya mistari na jedwali la miradi.',
  },
}
