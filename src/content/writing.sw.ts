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
    title: 'Kujenga Mifumo Inayopanuka: Mafunzo Kutoka Kwenye Uzalishaji',
    excerpt:
      'Mifumo ya usanifu na mbinu za vitendo za kubuni mifumo inayokua pamoja na shirika lako.',
    category: 'Ubunifu wa Mifumo',
    date: '2025-11-15',
    readTime: '8 min',
    content: `Upanuzi si kipengele unachoongeza — ni sifa unayoibuni ndani ya mfumo wako tangu mwanzo. Baada ya kujenga na kudumisha mifumo iliyo hewani kwa kiwango kikubwa, mifumo kadhaa hujitokeza mara kwa mara kama muhimu kwa mafanikio ya muda mrefu.

## Anza na Mipaka

Mipaka wazi ya huduma huzuia mtego wa mfumo mmoja mkubwa huku ikiepuka utata wa huduma ndogo za mapema mno. Weka mipaka kulingana na uwezo wa kibiashara, si safu za kiufundi.

## Buni kwa Kutegemea Hitilafu

Kila kitegemezi cha nje kitashindwa. Vizuizi vya mzunguko, majaribio upya yenye ucheleweshaji unaoongezeka, na kushuka kwa hadhi kwa upole si hiari — ni msingi.

## Pima Kila Kitu

Huwezi kuboresha usichoweza kupima. Wekeza mapema katika ufuatiliaji: kumbukumbu zilizopangwa, ufuatiliaji uliosambaa, na dashibodi za vipimo vyenye maana.`,
  },
  {
    slug: 'ai-integration-patterns',
    title: 'Mifumo ya Kuunganisha AI kwa Programu Zilizo Hewani',
    excerpt:
      'Jinsi ya kuunganisha modeli kubwa za lugha katika mifumo iliyo hewani kwa uwajibikaji na ufanisi.',
    category: 'AI',
    date: '2025-10-02',
    readTime: '10 min',
    content: `Kuunganisha AI katika programu zilizo hewani kunahitaji zaidi ya kuita API. Kunahitaji usanifu wa makini kuhusu uaminifu, usimamizi wa gharama, na imani ya mtumiaji.

## RAG dhidi ya Kurekebisha Modeli

Uzalishaji Unaoongezwa na Utafutaji (RAG) hutoa unyumbufu na uwazi. Kurekebisha modeli kunafaa kwa mitindo ya lugha ya sekta maalum. Mifumo mingi iliyo hewani hunufaika na RAG kama hatua ya kuanzia.

## Vizuizi Ni Muhimu

Tekeleza uthibitishaji wa pembejeo, uchujaji wa matokeo, na tabia mbadala. Watumiaji hawapaswi kamwe kukutana na hitilafu mbichi za modeli — wanapaswa kupata kushuka kwa hadhi kwa upole.

## Uelewa wa Gharama

Matumizi ya tokeni hukua na idadi ya watumiaji. Hifadhi majibu, kusanya maombi pamoja, na tumia modeli ndogo kwa kazi za uainishaji kabla ya kuelekeza kwenye modeli kubwa kwa uzalishaji.`,
  },
  {
    slug: 'security-first-architecture',
    title: 'Usanifu Unaotanguliza Usalama kwa Programu za Kisasa',
    excerpt:
      'Kufuma usalama ndani ya usanifu wako badala ya kuuchukulia kama orodha ya mwisho ya kukagua.',
    category: 'Usalama wa Mtandao',
    date: '2025-08-20',
    readTime: '7 min',
    content: `Usalama hauwezi kuongezwa kwenye programu kabla ya uzinduzi. Lazima ufumwe ndani ya kila uamuzi wa usanifu tangu siku ya kwanza.

## Uthibitishaji dhidi ya Uidhinishaji

Uthibitishaji huthibitisha utambulisho. Uidhinishaji huamua ufikiaji. Kuchanganya haya mawili husababisha akaunti zenye ruhusa kupita kiasi na udhaifu wa kukwepa uidhinishaji.

## Kanuni za Zero Trust

Usiamini kamwe, thibitisha daima. Kila ombi — la ndani au la nje — linapaswa kuthibitishwa na kuidhinishwa bila kujali lilikotoka kwenye mtandao.

## Usimbaji Fiche Kila Mahali

Data iliyohifadhiwa, data inayosafiri, na data inayotumika (pale inapowezekana) zote zinapaswa kusimbwa kwa algoriti za kisasa na usimamizi sahihi wa funguo.`,
  },
  {
    slug: 'nextjs-performance-guide',
    title: 'Utendaji wa Next.js: Mwongozo wa Kiuhandisi wa Vitendo',
    excerpt:
      'Mbinu madhubuti za kufikia utendaji wa hali ya juu katika programu za Next.js.',
    category: 'Next.js',
    date: '2025-07-10',
    readTime: '9 min',
    content: `Utendaji ni faida ya ushindani. Katika programu za Next.js, uboreshaji wa utendaji unahusisha mkakati wa uonyeshaji, ukubwa wa kifurushi, na tabia wakati wa utekelezaji.

## Chagua Njia ya Uonyeshaji kwa Busara

Uzalishaji tuli kwa maudhui yasiyobadilika mara kwa mara. Uonyeshaji upande wa seva kwa kurasa za kibinafsi. Upande wa mteja kwa vipengele vyenye mwingiliano mkubwa. Mbinu mchanganyiko mara nyingi hutoa matokeo bora.

## Uchambuzi wa Kifurushi

Kagua kifurushi chako mara kwa mara kwa @next/bundle-analyzer. Uingizaji wenye nguvu na ugawaji wa msimbo kwa njia huondoa JavaScript isiyohitajika kutoka upakiaji wa awali.

## Uboreshaji wa Picha

Tumia next/image kwa ukubwa sahihi, miundo ya kisasa, na upakiaji wa kipaumbele kwa maudhui yaliyo juu ya ukurasa. Picha mara nyingi ndizo kizuizi kikubwa zaidi cha utendaji.`,
  },
  {
    slug: 'remote-engineering-excellence',
    title: 'Ubora wa Uhandisi wa Mbali',
    excerpt: 'Kujenga mbinu bora za uhandisi katika timu zilizosambaa.',
    category: 'Uhandisi wa Mbali',
    date: '2025-05-28',
    readTime: '6 min',
    content: `Uhandisi wa mbali unahitaji mawasiliano ya makusudi, mitiririko inayotanguliza kutokuwa wa wakati mmoja, na utamaduni wa kuandika nyaraka ambao timu zilizo mahali pamoja mara nyingi huuchukulia kawaida.

## Kutokuwa wa Wakati Mmoja kwa Chaguo-msingi

Si kila mazungumzo yanahitaji mkutano. Andika mapendekezo wazi, tumia mijadala yenye nyuzi, na hifadhi muda wa pamoja kwa maamuzi tata.

## Nyaraka kama Miundombinu

Kama hakijaandikwa, hakipo kwa wanachama wa timu walio mbali. Shughulikia nyaraka kwa uangalifu uleule unaotumia kwa msimbo.

## Eleza Muktadha kwa Wingi

Wahandisi walio mbali hawana muktadha wa mazungumzo ya njiani. Shiriki "kwa nini" nyuma ya maamuzi, si "nini" tu. Muktadha huwezesha maamuzi bora ya kujitegemea.`,
  },
]
