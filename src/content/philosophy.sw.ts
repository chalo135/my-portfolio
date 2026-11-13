import type { PhilosophyContent } from './philosophy'

// `mark` is deliberately identical to the English file: the watermark is the
// identity layer, not translated copy, so "Ubora" stands behind the Quality
// pillar whichever language the visitor is reading.

export const philosophyContent: PhilosophyContent = {
  pillars: [
    {
      id: 'quality',
      title: 'Ubora',
      headline: 'Hesabu lazima ziwiane.',
      description:
        'Katika Salio, ni kitendakazi kimoja tu, PostJournal, kinachoweza kuandika mistari ya jarida. Kinakataa ingizo lolote ambalo debiti na krediti zake haziwiani, na nimekiandikia unit tests.',
      mark: 'Ubora',
    },
    {
      id: 'craftsmanship',
      title: 'Kumaliza kazi',
      headline: 'Ninamaliza kazi ipasavyo.',
      description:
        'Ninaijali kazi na ninaifikisha mwisho. Mifano iko kwenye kanuni nyingine za ukurasa huu.',
      mark: 'Ufundi',
    },
    {
      id: 'scalability',
      title: 'Upanuzi',
      headline: 'Usakinishaji mmoja, maduka mengi.',
      description:
        'Kila jedwali katika Salio linahusishwa na biashara moja, hivyo usakinishaji mmoja unaweza kuhudumia maduka mengi.',
      mark: 'Upanuzi',
    },
    {
      id: 'user-centered',
      title: 'Ubunifu Unaomlenga Mtumiaji',
      headline: 'Imejengwa kwa ajili ya wenye maduka na wateja wao.',
      description:
        'Ninajenga Salio kwa ajili ya wenye maduka ambao si wahasibu. Kwenye Pharimz Creatives, malipo hufanywa kwa M-Pesa STK Push, kwa sababu hivyo ndivyo wateja wengi wanavyolipa.',
      mark: 'Mtumiaji',
    },
    {
      id: 'performance',
      title: 'Kasi',
      headline: 'Iwe na kasi.',
      description: 'Bado sina kazi ya utendaji iliyopimwa ya kuonyesha.',
      mark: 'Kasi',
    },
    {
      id: 'security',
      title: 'Usalama',
      headline: 'Oda na malipo vimelindwa.',
      description:
        'Kwenye Pharimz Creatives nilifunga mwanya ambapo kubadilisha ID kwenye ombi kungeweza kufichua oda ya mteja mwingine. Nilithibitisha callbacks za M-Pesa ili malipo yasiweze kughushiwa, na nikaimarisha row-level security ya Supabase.',
      mark: 'Usalama',
    },
    {
      id: 'maintainability',
      title: 'Udumishaji',
      headline: 'Stoku huongezwa tu, pesa kwa senti kamili.',
      description:
        'Katika Salio, mienendo ya stoku huongezwa tu, haibadilishwi (append-only), na ripoti hukokotolewa zinaposomwa, hazihifadhiwi kamwe. Pesa huhifadhiwa kwa senti kamili, kamwe si kwa namba za floating-point.',
      mark: 'Udumishaji',
    },
    {
      id: 'innovation',
      title: 'Zana mpya',
      headline: 'Modeli inayotambua kutu ya majani.',
      description:
        'Kwa Kahawa Smart, mradi wangu wa chuo kikuu, nilijenga modeli ya TensorFlow inayotambua kutu ya majani ya kahawa kutoka kwenye picha ya jani, na chatbot inayotegemea RAG pipeline.',
      mark: 'Ubunifu',
    },
  ],

  intro: {
    headline: 'Falsafa ya Uhandisi',
    subheadline: 'Nyingi kati ya hizi zinaonyesha kitu nilichojenga.',
    description:
      'Mifano inatoka Salio, mfumo wa mauzo (point of sale) ninaoujenga kwa C#; Pharimz Creatives, duka la mtandaoni lililo hewani; na Kahawa Smart, mradi wangu wa chuo kikuu.',
    mark: 'Njia',
  },
}
