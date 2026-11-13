import type { WritingPost } from './writing'

// Full article translations. The block structure is load-bearing: the renderer
// splits on a blank line and treats a block starting with '## ' as a heading,
// so those markers are preserved exactly.
//
// slug, date and readTime are identical to the English file — a stable URL, an
// ISO date formatted per locale at render time, and a duration in digits.
// Every article body here is pending review; see SWAHILI_COPY_REVIEW.md.

export const writingContent: WritingPost[] = [
  {
    slug: 'building-scalable-systems',
    title: 'Jinsi ninavyoweka hesabu za Salio zikiwa sawa',
    excerpt:
      'Kanuni za muundo katika Salio, mfumo wangu wa mauzo (point-of-sale), zinazozuia kaunta ya mauzo na hesabu zisitofautiane.',
    category: 'Ubunifu wa Mifumo',
    date: '2025-11-15',
    readTime: '1 min',
    content: `Salio ni mfumo wa mauzo (point-of-sale) ninaoujenga kwa ajili ya maduka ya Kenya, wenye uhasibu wa double-entry chini yake. Ninaujenga kwa kuzingatia duka la familia la vipuri, kwa ajili ya wenye maduka ambao si wahasibu. Bado haujakamilika. Hizi ndizo kanuni zake. Kanuni kama hizi ni ngumu kuziongeza baada ya data kuwepo.

## Teknolojia

C# kwenye .NET 10, pamoja na ASP.NET Core na EF Core, juu ya PostgreSQL 16. Ninajifunza C# kwa kuujenga.

## Muamala mmoja kwa kila uuzaji

Kila uuzaji ni muamala mmoja wa database. Unaandika risiti, ingizo la stoki na ingizo la jarida lililosawazishwa kwa pamoja, au hauandiki chochote. Hakuna usawazishaji kati ya kaunta na vitabu vya hesabu, kwa sababu kuna seti moja tu ya vitabu.

## Mlango mmoja wa kuingia kwenye leja

Ni kitendakazi kimoja tu, PostJournal, kinachoruhusiwa kuandika mistari ya jarida. Kinakataa ingizo lolote ambalo debit na credit zake hazilingani. Nilikiandika kwa mkono na kukiwekea unit tests.

## Pesa kwa senti kamili

Pesa huhifadhiwa kwa senti kamili, kamwe si kama namba za floating-point. Namba ya floating-point haiwezi kushika kwa usahihi sehemu nyingi za desimali za shilingi, kwa hivyo safu ndefu ya namba hizo huacha kujumlika kuwa jumla sahihi. Senti kamili hujumlika sawa kila mara.

## Hakuna kinachohifadhiwa kinachoweza kupitwa na wakati

Maingizo ya stoki huongezwa tu na hayahaririwi, kwa hivyo marekebisho ni ingizo jipya, si kubadilisha ingizo la zamani. Ripoti hukokotolewa zinaposomwa, kamwe hazihifadhiwi.

## Usakinishaji mmoja, maduka mengi

Kila jedwali limewekewa mipaka ya biashara moja, kwa hivyo usakinishaji mmoja unaweza kuhudumia maduka mengi.`,
  },
  {
    slug: 'ai-integration-patterns',
    title: 'Kujenga Kahawa Smart',
    excerpt:
      'Modeli inayogundua kutu ya majani ya kahawa kutoka kwenye picha, na chatbot inayotegemea mfumo wa RAG. Mradi wangu wa maonyesho wa chuo kikuu.',
    category: 'AI',
    date: '2025-10-02',
    readTime: '1 min',
    content: `Kahawa Smart ulikuwa mradi wangu wa maonyesho wa chuo kikuu. Kutu ya majani ya kahawa huenea haraka, na mkulima mdogo mara nyingi hawezi kupata mtaalamu wa kukagua jani kwa wakati.

## Modeli

Nilijenga modeli kwa TensorFlow. Ipe picha ya jani la kahawa nayo itaonyesha kama lina kutu ya majani. Inatafuta ugonjwa huo mmoja tu, si kila ugonjwa unaoweza kushambulia mmea wa kahawa.

## Chatbot

Chatbot inajibu maswali ya ziada. Niliiegemeza kwenye mfumo wa utafutaji (RAG), kwa hivyo majibu yake yanatokana na maandishi yaliyotafutwa badala ya modeli ya lugha peke yake.

## Teknolojia

TensorFlow, Python, FastAPI, Groq, JavaScript na GSAP.`,
  },
  {
    slug: 'security-first-architecture',
    title: 'Kuimarisha usalama wa duka lililo hewani',
    excerpt:
      'Nilichorekebisha kwenye duka la Pharimz Creatives baada ya kuzinduliwa, kuanzia na ombi lililoweza kumwonyesha mteja mmoja oda ya mteja mwingine.',
    category: 'Usalama',
    date: '2025-08-20',
    readTime: '1 min',
    content: `Pharimz Creatives ni duka la mtandaoni la biashara ya Kenya ya mavazi ya streetwear na chapa. Linapokea oda na malipo kwa shilingi, ikiwemo M-Pesa. Baada ya kuanza kufanya kazi hewani, nilirudi nikaimarisha usalama wake.

## Oda ya mteja mwingine

Niligundua mwanya ambapo kubadilisha ID kwenye ombi kungeweza kufichua oda ya mteja mwingine. Kuwa umeingia kwenye akaunti hakutoshi. Seva lazima ihakikishe kuwa oda ni ya mtu anayeiomba. Niliziba mwanya huo.

## Callbacks za M-Pesa

Malipo yanatumia M-Pesa STK Push, na M-Pesa huthibitisha kila malipo kwa callback. Nilizihakiki callbacks hizo ili uthibitisho usiweze kughushiwa.

## Row-level security

Data ya duka iko kwenye Supabase. Niliimarisha row-level security yake, yaani sheria ndani ya database zinazoamua ni safu zipi kila mtumiaji anaweza kufikia.

## Ambacho ningebadilisha

Haya yote yalifanyika baada ya uzinduzi. Kwenye duka linalofuata, nitakagua nani anamiliki kila rekodi kabla mteja wa kwanza hajafika.`,
  },
  {
    slug: 'nextjs-performance-guide',
    title: 'Maelezo kuhusu utendaji wa Next.js',
    excerpt: 'Maelezo ya jumla kuhusu mahali ukurasa wa Next.js unaweza kupoteza kasi.',
    category: 'Next.js',
    date: '2025-07-10',
    readTime: '1 min',
    content: `Haya ni maelezo ya jumla, si matokeo ya mradi wangu.

## Uonyeshaji

Ukurasa usiobadilika mara kwa mara unaweza kutengenezwa mara moja wakati wa build. Ukurasa unaotofautiana kwa kila mtumiaji lazima uonyeshwe kwa kila ombi.

## JavaScript inayotumwa kwa kivinjari

@next/bundle-analyzer huonyesha kinachoishia kwenye bundle. Dynamic imports huzuia msimbo usiohitajika kwenye upakiaji wa kwanza usiingie humo.

## Picha

next/image hutoa picha yenye ukubwa unaofaa skrini. Prop ya priority hupakia kwanza picha kuu iliyo juu ya ukurasa.`,
  },
  {
    slug: 'remote-engineering-excellence',
    title: 'Maelezo kuhusu kazi ya mbali',
    excerpt: 'Maelezo ya jumla kuhusu kuandika mambo pale timu inapofanya kazi kutoka maeneo tofauti.',
    category: 'Kazi ya mbali',
    date: '2025-05-28',
    readTime: '1 min',
    content: `Haya ni maelezo ya jumla, si mafunzo kutoka kwa timu niliyowahi kufanya nayo kazi.

## Iandike

Pendekezo lililoandikwa linaweza kusomwa wakati wowote mtu anapoingia mtandaoni. Mkutano hauwezi. Mikutano inafaa kubakizwa kwa maamuzi yanayohitaji majadiliano ya kwenda na kurudi.

## Eleza sababu

Mwenzako wa timu ambaye hakuwepo anahitaji sababu ya uamuzi pamoja na uamuzi wenyewe.`,
  },
]
