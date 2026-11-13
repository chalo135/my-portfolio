import type { AboutReportCopy } from './about-report'

const introOpening =
  "I'm Charles Ndirangu, Chalo to most people, a software engineer in Nairobi. I'm building Salio, a point-of-sale system with double-entry accounting. On Pharimz Creatives, a live online shop with M-Pesa checkout, I closed a hole that could expose another customer's order."
const introReport =
  'I also work in Power BI, so this section is a report about me. Click a status, a bar or a project to filter it. The data model, the DAX measures and the Power Query steps behind it are on the other pages'

export const aboutReportCopy: AboutReportCopy = {
  intro: [introOpening, `${introReport}.`],
  introWithPbix: [
    introOpening,
    `${introReport}, and you can download the .pbix and open it yourself.`,
  ],

  kinds: {
    salio: 'Point of sale',
    pharimz: 'Online shop',
    'kahawa-smart': 'Leaf rust detection',
  },

  areaLabels: {
    Frontend: 'Frontend',
    Backend: 'Backend',
    Database: 'Database',
    'AI and ML': 'AI and ML',
    Payments: 'Payments',
    'DevOps and testing': 'DevOps and testing',
  },

  // Rows whose dates are still unconfirmed have them left out, so they are not
  // drawn. Fill a date in and the lane or marker appears.
  timeline: [
    {
      lane: 'BSc Computer Technology',
      sub: 'Multimedia University of Kenya',
      type: 'Education',
    },
    {
      lane: 'Operations, family business',
      sub: 'Plumbing and bio-digesters, about 12 large clients',
      type: 'Work',
      start: '2023-05-01',
    },
    {
      lane: 'Freelance software developer',
      sub: 'Since April 2025',
      type: 'Work',
      start: '2025-04-01',
    },
    { lane: 'Network support attachment, Fiberlink', type: 'Attachment' },
    // September 2026; the day isn't known and isn't shown (the legend reads the month).
    { lane: 'Customer service certificate, Griffin Global Bootcamp', type: 'Certificate', end: '2026-09-30' },
    // Finished in 2026. Earlier data had it due in November 2026; only the month
    // is shown. Charles: correct the month if it finished earlier.
    { lane: 'ALX Data and AI Literacy', type: 'Certificate', end: '2026-11-01' },
  ],

  profile: [
    { field: 'Name', value: 'Charles Ndirangu Mwangi' },
    { field: 'Goes by', value: 'Chalo' },
    { field: 'Based in', value: 'Nairobi and Nyeri, Kenya' },
    { field: 'Age' },
    { field: 'Sex' },
    { field: 'Height' },
    { field: 'Weight' },
    { field: 'Degree', value: 'BSc Computer Technology, Multimedia University of Kenya, graduated 2026' },
    { field: 'KCSE', value: 'Mean grade A, 80 of 84 points' },
    { field: 'KCSE maths', value: 'Top 4% of candidates nationally' },
  ],

  measureNotes: [
    'Counts through the bridge table, so both the status slicer and the technology bars can filter it.',
    'KEEPFILTERS respects the slicer. Pick Building now and this drops to 0 instead of jumping back to every shipped project.',
    'Same pattern as Shipped, for work in progress.',
    'Distinct tools in the current filter context.',
    'Feeds the bar chart tooltip. REMOVEFILTERS clears the technology filter for the bottom of the fraction only.',
    'Reads no table, so no filter can change it. It moves on by itself every month.',
    'Jobs on the timeline that have no end date yet.',
    'A calculated table, marked as the date table. It runs from the first year on the timeline to the end of this year.',
  ],

  stepCaptions: [
    'Connects to the workbook. One row per sheet.',
    'Opens the Projects sheet. The column names are still sitting in the first row.',
    'The first row becomes the column names.',
    'Every column is set to text, so nothing gets guessed as a number or a date.',
    'The bridge table only needs the project key and the stack.',
    'One row per technology. Splitting on the comma leaves a space in front of every name after the first.',
    'Trim removes those spaces, so " Vite" becomes "Vite" and matches DimTech.',
    'Stack becomes TechKey, the column that relates to DimTech.',
    'A project can only list a technology once. There were none to remove here.',
  ],

  ui: {
    heading: 'About me',
    reportTitle: 'Chalo in data',
    refreshed: 'Refreshed',
    download: 'Download the .pbix',
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    tabsLabel: 'Report pages',
    tabs: {
      overview: 'Overview',
      model: 'Data model',
      dax: 'DAX measures',
      powerQuery: 'Power Query',
    },
    slicerLabel: 'Status',
    all: 'All',
    noFilters: 'No filters set.',
    filtersSentence: 'Filters: {filters}.',
    statusIs: 'status is {v}',
    areaIs: 'area is {v}',
    projectIs: 'project is {v}',
    clearFilters: 'Clear filters',
    kpis: {
      projects: { label: 'Projects', sub: 'in the data' },
      shipped: { label: 'Shipped', sub: 'live or finished' },
      building: { label: 'Building now', sub: 'in progress' },
      technologies: { label: 'Technologies', sub: 'distinct tools used' },
      months: { label: 'Months freelancing', sub: 'since April 2025' },
    },
    barsTitle: 'Projects by technology area',
    barAria: '{area}: {n} of {total} projects',
    barTip: '{n} of {total} projects, {pct}',
    tableTitle: 'Projects',
    columns: { project: 'Project', status: 'Status', kind: 'Kind', stack: 'Stack' },
    total: 'Total',
    totalProjects: '{n} projects',
    timelineTitle: 'Career timeline',
    today: 'Today',
    now: 'now',
    certificates: 'Certificates',
    expected: 'expected',
    specTitle: 'Spec sheet',
    blank: '(Blank)',
    rows: '{n} rows',
    modelAria:
      'Data model: DimProject and DimTech each filter FactProjectTech, DimDate filters FactTimeline on Start.',
    measuresBox: 'Measures',
    keyMarker: 'key',
    modelNotes: [
      {
        title: 'Why a bridge table.',
        body: "A project uses many technologies and a technology turns up in many projects. Keeping one row per pair means the stack never has to live in a comma-separated column that a filter can't read.",
      },
      {
        title: 'One-way filters only.',
        body: 'Every relationship filters from the dimension into the fact. The measures count rows in the bridge, so picking a technology area reaches the projects without a two-way relationship.',
      },
      {
        title: 'A proper date table.',
        body: 'DimDate is a calculated table marked as the date table. It filters FactTimeline on Start, and MonthNo keeps months sorting in date order instead of alphabetically.',
      },
    ],
    daxContext: 'Filter context right now: {filters}. The values below are calculated in it.',
    daxNoContext:
      'No filters right now. Set one on the Overview page and come back: the values below change with it.',
    backToOverview: 'Back to Overview',
    stepsTitle: 'Applied steps',
    queryName: 'Query: FactProjectTech',
    previewTitle: 'The table at this step',
    previewNote: 'Showing the Pharimz Creatives row only.',
    mCodeTitle: 'M code',
    figureCaption: 'The same report in Power BI Desktop.',
    figureAlt:
      'The Chalo in data report open in Power BI Desktop, showing the Overview page with the status slicer, KPI cards, bar chart and project table.',
  },
}
