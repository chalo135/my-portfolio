import type { PhilosophyContent } from './philosophy'

// `mark` is deliberately identical to the English file: the watermark is the
// identity layer, not translated copy, so "Ubora" stands behind the Quality
// pillar whichever language the visitor is reading.

export const philosophyContent: PhilosophyContent = {
  pillars: [
    {
      id: 'quality',
      title: 'Ubora',
      headline: 'Ubora haujadiliwi.',
      description:
        'Kila mstari wa msimbo, kila mwingiliano, kila uamuzi wa usanifu unaonyesha dhamira ya kujenga programu inayostahimili wakati. Ubora si hatua moja — ni msingi wenyewe.',
      mark: 'Ubora',
    },
    {
      id: 'craftsmanship',
      title: 'Ufundi',
      headline: 'Programu ni ufundi.',
      description:
        'Kama ufundi mwingine wowote wa hali ya juu, uhandisi wa programu unahitaji uvumilivu, usahihi, na fahari katika kazi. Ninaukabili kila mradi kwa nidhamu ya fundi na uangalifu wa mhandisi.',
      mark: 'Ufundi',
    },
    {
      id: 'scalability',
      title: 'Upanuzi',
      headline: 'Imejengwa kukua.',
      description:
        'Mifumo lazima ikue pamoja na mashirika inayohudumia. Ninabuni miundo inayopanuka kwa upana — kwa watumiaji, data, na utata — bila kuhitaji kuandikwa upya kabisa.',
      mark: 'Upanuzi',
    },
    {
      id: 'user-centered',
      title: 'Ubunifu Unaomlenga Mtumiaji',
      headline: 'Teknolojia inawahudumia watu.',
      description:
        'Usanifu mzuri kabisa hauna maana ikiwa matumizi yanawaangusha watumiaji wake. Ninatanguliza uwazi, ufikivu, na ubunifu unaoeleweka kwa urahisi katika kila kiolesura ninachojenga.',
      mark: 'Mtumiaji',
    },
    {
      id: 'performance',
      title: 'Kasi',
      headline: 'Kasi ni kipengele.',
      description:
        'Utendaji ni heshima kwa muda na rasilimali za mtumiaji. Ninaboresha kila safu — kutoka maswali ya hifadhidata hadi mizunguko ya uonyeshaji — ili kutoa matumizi yanayohisi ya papo hapo.',
      mark: 'Kasi',
    },
    {
      id: 'security',
      title: 'Usalama',
      headline: 'Uaminifu tangu mwanzo.',
      description:
        'Usalama unafumwa ndani ya usanifu tangu siku ya kwanza, hauongezwi tu kabla ya uzinduzi. Ninajenga mifumo inayolinda data, inayohifadhi faragha, na inayostahimili vitisho vinavyobadilika.',
      mark: 'Usalama',
    },
    {
      id: 'maintainability',
      title: 'Udumishaji',
      headline: 'Andika msimbo kwa ajili ya mhandisi ajaye.',
      description:
        'Msimbo unaosomeka, wenye maelezo mazuri, na uliopangwa kwa uangalifu huhakikisha mifumo inabaki rahisi kubadilishwa muda mrefu baada ya uzinduzi. Timu zijazo zirithi uwazi, si mkanganyiko.',
      mark: 'Udumishaji',
    },
    {
      id: 'innovation',
      title: 'Ubunifu',
      headline: 'Maendeleo yenye kusudi.',
      description:
        'Ubunifu si upya kwa ajili ya upya tu. Ninachukua teknolojia mpya zinaposuluhisha matatizo halisi, zinapoboresha matokeo, au zinapofungua uwezo ambao awali haukuwezekana.',
      mark: 'Ubunifu',
    },
  ],

  intro: {
    headline: 'Falsafa ya Uhandisi',
    subheadline: 'Kanuni zinazoongoza kila mfumo ninaoujenga.',
    description:
      'Uhandisi wa programu ni zaidi ya kuandika msimbo — ni sanaa yenye nidhamu ya kutatua matatizo tata kwa suluhisho maridadi na za kudumu. Kanuni hizi zinaeleza jinsi ninavyoukabili kila mradi, kutoka usanifu wa awali hadi uzinduzi wa mwisho.',
    mark: 'Njia',
  },
}
