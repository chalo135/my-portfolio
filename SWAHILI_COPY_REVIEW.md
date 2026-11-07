# Kiswahili copy — needs Charles's review

**The site is not done until you have read this file.** Everything below was
translated by Claude, not by a Kiswahili speaker. The code builds, the types
line up and both locales render — none of that says the copy is *right*.

Every string here is longer than roughly eight words. Short UI labels (Kazi,
Falsafa, Kuhusu, Funga, Juu …) came from the glossary in the brief and are not
repeated. Anything identical in both languages — slugs, years, `PostgreSQL`,
`M-Pesa Daraja`, Tailwind class strings, your name — was deliberately left
untranslated and is not listed.

To change something, edit the `src/content/*.sw.ts` file named in the row. The
`.en.ts` and `.sw.ts` files share one TypeScript interface, so if you delete a
key by accident the build fails rather than shipping a blank.

The `key` column is the leaf key only, so `description` and `lead` repeat across
rows; the English column is what identifies the string. Rows appear in the order
they occur in the file.

## Two that need a decision, not a correction

**1. `site.tagline` / `hero.headline` — the verb.**
English: *"I build the software Kenyan businesses run on."*
Shipped: *"Ninaunda programu zinazoendesha biashara za Kenya."*
The alternative is *"Ninajenga programu ambazo biashara za Kenya zinazitegemea."*
`Ninaunda … zinazoendesha` reads as *software that runs the businesses*, which
is the active sense of the English. `Ninajenga … zinazitegemea` reads as
*software the businesses depend on*, which is closer word-for-word but flatter.
Pick one — this is the first line of the site.

**2. `site.ethos` — an untranslatable pun.**
English: *"Software that has to balance at the end of the month."*
Shipped: *"Programu ambayo lazima ilingane mwishoni mwa mwezi."*
The English works because "balance" means both *stay upright* and *reconcile a
ledger*. Kiswahili `kulingana` only carries the accounting sense, so the joke is
gone and what is left is a slightly odd literal statement. This wants a
**rewrite, not a translation** — a different line that does its own work in
Kiswahili. Suggestion to react to: *"Hesabu lazima zikubaliane mwishoni mwa
mwezi."*

## Also worth a look

- `projects.*` is now your real projects (Salio, Pharimz Creatives, Kahawa Smart).
  Short labels such as the status words (`Ninaijenga sasa`, `Iko hewani`,
  `Mradi wa mteja`, `Imekamilika`) are not in the tables; check them too.
  Terms kept in English in brackets — double-entry, floating-point, unit tests,
  row-level security, RAG — are deliberate: there is no settled Kiswahili term.
- `experience.*` organizations are still `[Your Organization]` / `[Shirika Lako]`
  in both files, for the same reason.
- The philosophy watermarks (`Ubora`, `Ufundi`, `Upanuzi`, `Mtumiaji`, `Kasi`,
  `Usalama`, `Udumishaji`, `Ubunifu`, and `Njia` on the intro) are **identical in
  both locales** — they are the decorative identity layer, not translated copy.
  They replaced the nine dead kanji. `Njia` for `道` is the one that has to land:
  both mean *the way / the path*.
- `writing.*` article bodies keep the `## ` heading markers and blank-line block
  separation, because the renderer splits on them. If you rewrite a body, keep
  that structure.

---


## `src/content/site.sw.ts`

| key | English | Kiswahili |
| --- | --- | --- |
| `tagline` | I build the software Kenyan businesses run on. | Ninaunda programu zinazoendesha biashara za Kenya. |
| `description` | Full-stack engineer in Nairobi. I build multi-tenant ERP for small and mid-sized Kenyan businesses, M-Pesa Daraja payment integrations, and point-of-sale systems with real double-entry accounting underneath. | Mhandisi wa programu wa full-stack jijini Nairobi. Ninaunda mifumo ya ERP ya wapangaji wengi kwa biashara ndogo na za kati za Kenya, uunganishaji wa malipo wa M-Pesa Daraja, na mifumo ya mauzo yenye uhasibu kamili wa kuingiza mara mbili. |
| `ethos` | Software that has to balance at the end of the month. | Programu ambayo lazima ilingane mwishoni mwa mwezi. |
| `headline` | I build the software Kenyan businesses run on. | Ninaunda programu zinazoendesha biashara za Kenya. |
| `subhead` | Multi-tenant ERP for small and mid-sized businesses, M-Pesa Daraja payments, and a point of sale with double-entry accounting underneath it. Currently in Nairobi, open to remote. | Mifumo ya ERP ya wapangaji wengi kwa biashara ndogo na za kati, malipo ya M-Pesa Daraja, na mfumo wa mauzo wenye uhasibu wa kuingiza mara mbili chini yake. Kwa sasa niko Nairobi, na niko wazi kwa kazi ya mbali. |
| `lead` | Business software fails on the boring parts — a refund that never reconciles, a tenant that can read another tenant’s invoices. That is where I spend my time. | Programu za biashara hushindwa katika sehemu zinazochosha — marejesho ambayo hayalingani kamwe, mpangaji anayeweza kusoma ankara za mpangaji mwingine. Hapo ndipo ninapotumia muda wangu. |
| `lead` | TypeScript and Next.js on the front, Postgres and Supabase behind it, and the payments and accounting logic in between. I have also spent a fair amount of time closing IDOR holes and writing row-level security policies on a live e-commerce platform. | TypeScript na Next.js mbele, Postgres na Supabase nyuma yake, na mantiki ya malipo na uhasibu katikati. Pia nimetumia muda mwingi kuziba mianya ya IDOR na kuandika sera za usalama wa safu kwenye jukwaa la biashara mtandaoni lililo hewani. |
| `headline` | Tell me what you are trying to build. | Niambie unachotaka kujenga. |
| `lead` | Open to full-time roles and to contract work on payments, ERP, and anything that has to reconcile at the end of the month. Nairobi, or remote. | Niko wazi kwa nafasi za kudumu na kazi za mkataba kuhusu malipo, ERP, na chochote kinachopaswa kulingana mwishoni mwa mwezi. Nairobi, au kwa mbali. |


## `src/content/pages.sw.ts`

| key | English | Kiswahili |
| --- | --- | --- |
| `description` | I'm Charles Ndirangu. I work across the stack, mostly on the systems small and mid-sized Kenyan businesses actually run their day on. | Mimi ni Charles Ndirangu. Ninafanya kazi katika safu zote, hasa kwenye mifumo ambayo biashara ndogo na za kati za Kenya hutegemea kila siku. |
| `description` | Enterprise engineering capabilities across the full software stack. | Uwezo wa uhandisi wa kiwango cha kampuni katika safu nzima ya programu. |
| `description` | Get in touch about payments, ERP, and full-stack engineering work. | Wasiliana nami kuhusu malipo, ERP, na kazi ya uhandisi wa full-stack. |
| `description` | The principles that guide every system I build. | Kanuni zinazoongoza kila mfumo ninaoujenga. |
| `description` | Enterprise software products engineered with precision and craftsmanship. | Bidhaa za programu za kampuni zilizoundwa kwa usahihi na ufundi. |
| `description` | The tools and technologies used to build enterprise-grade software. | Zana na teknolojia zinazotumika kujenga programu za kiwango cha kampuni. |
| `description` | Thoughts on software engineering, architecture, AI, and building products. | Mawazo kuhusu uhandisi wa programu, usanifu, AI, na kujenga bidhaa. |
| `description` | Every project is treated as a product launch—designed, architected, and delivered with enterprise-grade standards. | Kila mradi hushughulikiwa kama uzinduzi wa bidhaa — umebuniwa, umeundwa, na umewasilishwa kwa viwango vya kampuni. |
| `description` | Exploring the craft of software engineering—architecture, performance, security, AI integration, and building products that matter. | Kuchunguza ufundi wa uhandisi wa programu — usanifu, utendaji, usalama, uunganishaji wa AI, na kujenga bidhaa zenye maana. |
| `description` | Deep expertise spanning frontend, backend, cloud, AI, security, and system design—delivered with enterprise standards. | Utaalamu wa kina unaojumuisha upande wa mbele, upande wa nyuma, wingu, AI, usalama, na ubunifu wa mifumo — kwa viwango vya kampuni. |
| `description` | Technology is a means, not an end. Every tool in this stack is selected for reliability, performance, and long-term maintainability. | Teknolojia ni njia, si lengo. Kila zana katika safu hii imechaguliwa kwa uaminifu, utendaji, na uwezo wa kudumishwa kwa muda mrefu. |
| `description` | Building software systems across enterprise, startup, and government contexts—with consistent focus on quality and impact. | Kujenga mifumo ya programu katika mazingira ya kampuni, biashara changa, na serikali — kwa mkazo wa kudumu kwenye ubora na athari. |
| `description` | Software Engineer specializing in enterprise-grade systems, full-stack development, and intelligent software architecture. | Mhandisi wa Programu aliyebobea katika mifumo ya kiwango cha kampuni, utengenezaji wa full-stack, na usanifu wa programu wenye akili. |
| `lead` | Open to enterprise engagements, remote positions, and ambitious product collaborations. | Niko wazi kwa kazi za kampuni, nafasi za mbali, na ushirikiano wa bidhaa zenye malengo makubwa. |
| `body` | The rest of the site still works. Try again, or head back to the start. | Sehemu nyingine za tovuti bado zinafanya kazi. Jaribu tena, au rudi mwanzo. |
| `walkthrough` | The code is private. I'm happy to walk you through it on a call. | Msimbo ni wa faragha. Nitafurahi kukuonyesha jinsi ulivyojengwa kwenye simu. |

## `src/content/about.sw.ts`

| key | English | Kiswahili |
| --- | --- | --- |
| `intro` | I'm Charles Ndirangu. I work across the stack, mostly on the systems small and mid-sized Kenyan businesses actually run their day on — stock, invoices, payments, and the accounting that has to agree with all three. | Mimi ni Charles Ndirangu. Ninafanya kazi katika safu zote, hasa kwenye mifumo ambayo biashara ndogo na za kati za Kenya hutegemea kila siku — bidhaa ghalani, ankara, malipo, na uhasibu unaopaswa kukubaliana na vyote vitatu. |
| `intro` | I came to engineering through the unglamorous end of it: fixing things that were already in production and already wrong. That is still the work I am best at. Most of what I build is not a greenfield product — it is a business that has outgrown its spreadsheets and needs software that will not quietly lose money. | Niliingia katika uhandisi kupitia upande usiovutia: kurekebisha vitu vilivyokuwa tayari hewani na tayari vimekosea. Hiyo bado ndiyo kazi ninayoifanya vizuri zaidi. Mengi ninayojenga si bidhaa mpya kabisa — ni biashara iliyozidi uwezo wa majedwali yake na inayohitaji programu ambayo haitapoteza pesa kimyakimya. |
| `value` | Full-stack · Payments · ERP · Application security | Full-stack · Malipo · ERP · Usalama wa programu |
| `value` | Open to full-time roles and contract work, remote or Nairobi | Niko wazi kwa nafasi za kudumu na kazi za mkataba, kwa mbali au Nairobi |


### `intro`

**English**

```
Right now that means multi-tenant ERP: one deployment, many businesses, and a hard requirement that no tenant can ever see another tenant’s data. It means M-Pesa Daraja integration, which is less about the happy path than about what you do with a callback that arrives twice, or arrives late, or never arrives at all. And it means a point of sale with real double-entry accounting behind it, so a refund at the till moves both sides of the ledger instead of leaving a number to be reconciled by hand at month end.
```

**Kiswahili**

```
Kwa sasa hiyo inamaanisha ERP ya wapangaji wengi: usakinishaji mmoja, biashara nyingi, na sharti kali kwamba hakuna mpangaji anayeweza kuona data ya mpangaji mwingine. Inamaanisha uunganishaji wa M-Pesa Daraja, ambao si suala la njia inayofanikiwa bali la unachofanya na jibu linalofika mara mbili, au linalochelewa, au lisilofika kabisa. Na inamaanisha mfumo wa mauzo wenye uhasibu halisi wa kuingiza mara mbili nyuma yake, ili marejesho kwenye kaunta yasogeze pande zote mbili za daftari badala ya kuacha namba ya kupatanishwa kwa mkono mwishoni mwa mwezi.
```

### `intro`

**English**

```
The security work found me the same way. On a live e-commerce platform I spent a long stretch closing IDOR holes — endpoints that trusted an ID in the URL — and writing the row-level security policies that should have been there first. That experience is why I now start with the permission model rather than bolting it on. I care about software that is still correct on the boring day, six months after launch, when nobody is watching it.
```

**Kiswahili**

```
Kazi ya usalama ilinipata kwa njia hiyohiyo. Kwenye jukwaa la biashara mtandaoni lililo hewani nilitumia muda mrefu kuziba mianya ya IDOR — sehemu za API zilizoamini kitambulisho kilichokuwa kwenye anwani ya tovuti — na kuandika sera za usalama wa safu ambazo zilipaswa kuwepo tangu mwanzo. Uzoefu huo ndio unaonifanya sasa nianze na muundo wa ruhusa badala ya kuuongeza baadaye. Ninajali programu ambayo bado iko sahihi siku ya kawaida, miezi sita baada ya uzinduzi, wakati hakuna anayeiangalia.
```

## `src/content/about-report.sw.ts`

The "Chalo in data" report on the About page. DAX, M code, table, column and
step names are deliberately left in English.

| key | English | Kiswahili |
| --- | --- | --- |
| `intro` | I'm Charles Ndirangu, Chalo to most people. I'm a software engineer in Nairobi, and I build the point-of-sale, M-Pesa and accounting software Kenyan businesses run on. | Mimi ni Charles Ndirangu, ila watu wengi huniita Chalo. Ni mhandisi wa programu jijini Nairobi, na ninaunda programu za mauzo, M-Pesa na uhasibu ambazo biashara za Kenya hutegemea. |
| `intro` | I also work in Power BI, so this section is a report about me. Click a status, a bar or a project to filter it. The data model, the DAX measures and the Power Query steps behind it are on the other pages. | Pia ninafanya kazi na Power BI, kwa hiyo sehemu hii ni ripoti kunihusu. Bofya hali, mstari wa chati au mradi ili kuichuja. Muundo wa data, vipimo vya DAX na hatua za Power Query zilizo nyuma yake viko kwenye kurasa nyingine. |
| `introWithPbix` | I'm Charles Ndirangu, Chalo to most people. I'm a software engineer in Nairobi, and I build the point-of-sale, M-Pesa and accounting software Kenyan businesses run on. | Mimi ni Charles Ndirangu, ila watu wengi huniita Chalo. Ni mhandisi wa programu jijini Nairobi, na ninaunda programu za mauzo, M-Pesa na uhasibu ambazo biashara za Kenya hutegemea. |
| `introWithPbix` | I also work in Power BI, so this section is a report about me. Click a status, a bar or a project to filter it. The data model, the DAX measures and the Power Query steps behind it are on the other pages, and you can download the .pbix and open it yourself. | Pia ninafanya kazi na Power BI, kwa hiyo sehemu hii ni ripoti kunihusu. Bofya hali, mstari wa chati au mradi ili kuichuja. Muundo wa data, vipimo vya DAX na hatua za Power Query zilizo nyuma yake viko kwenye kurasa nyingine, na unaweza kupakua faili la .pbix na kulifungua mwenyewe. |
| `measureNotes` | Counts through the bridge table, so both the status slicer and the technology bars can filter it. | Huhesabu kupitia jedwali la daraja, ili kichujio cha hali na mistari ya teknolojia viweze kukichuja. |
| `measureNotes` | KEEPFILTERS respects the slicer. Pick Building now and this drops to 0 instead of jumping back to every shipped project. | KEEPFILTERS huheshimu kichujio. Ukichagua Ninaijenga sasa, thamani hii inashuka hadi 0 badala ya kurudi kwenye kila mradi uliokamilika. |
| `measureNotes` | Feeds the bar chart tooltip. REMOVEFILTERS clears the technology filter for the bottom of the fraction only. | Hulisha maelezo ya chati ya mistari. REMOVEFILTERS huondoa kichujio cha teknolojia kwa sehemu ya chini ya sehemu tu. |
| `measureNotes` | Reads no table, so no filter can change it. It moves on by itself every month. | Haisomi jedwali lolote, kwa hiyo hakuna kichujio kinachoweza kuibadilisha. Inaongezeka yenyewe kila mwezi. |
| `measureNotes` | Jobs on the timeline that have no end date yet. | Kazi kwenye ratiba ambazo bado hazina tarehe ya mwisho. |
| `measureNotes` | A calculated table, marked as the date table. It runs from the first year on the timeline to the end of this year. | Jedwali lililokokotolewa, lililowekwa alama kama jedwali la tarehe. Linaanzia mwaka wa kwanza kwenye ratiba hadi mwisho wa mwaka huu. |
| `stepCaptions` | Opens the Projects sheet. The column names are still sitting in the first row. | Inafungua laha ya Projects. Majina ya safu wima bado yamekaa kwenye safu ya kwanza. |
| `stepCaptions` | Every column is set to text, so nothing gets guessed as a number or a date. | Kila safu wima inawekwa kuwa maandishi, ili hakuna kinachokisiwa kuwa namba au tarehe. |
| `stepCaptions` | The bridge table only needs the project key and the stack. | Jedwali la daraja linahitaji ufunguo wa mradi na teknolojia zake tu. |
| `stepCaptions` | One row per technology. Splitting on the comma leaves a space in front of every name after the first. | Safu moja kwa kila teknolojia. Kugawanya kwenye koma kunaacha nafasi mbele ya kila jina baada ya la kwanza. |
| `stepCaptions` | Trim removes those spaces, so " Vite" becomes "Vite" and matches DimTech. | Trim huondoa nafasi hizo, kwa hiyo " Vite" inakuwa "Vite" na inalingana na DimTech. |
| `stepCaptions` | Stack becomes TechKey, the column that relates to DimTech. | Stack inakuwa TechKey, safu wima inayohusiana na DimTech. |
| `stepCaptions` | A project can only list a technology once. There were none to remove here. | Mradi unaweza kutaja teknolojia mara moja tu. Hapakuwa na nakala za kuondoa hapa. |
| `modelAria` | Data model: DimProject and DimTech each filter FactProjectTech, DimDate filters FactTimeline on Start. | Muundo wa data: DimProject na DimTech kila moja huchuja FactProjectTech, DimDate huchuja FactTimeline kupitia Start. |
| `body` | A project uses many technologies and a technology turns up in many projects. Keeping one row per pair means the stack never has to live in a comma-separated column that a filter can't read. | Mradi mmoja hutumia teknolojia nyingi, na teknolojia moja hujitokeza katika miradi mingi. Kuweka safu moja kwa kila jozi kunamaanisha teknolojia hazihitaji kukaa kwenye safu wima iliyotenganishwa kwa koma ambayo kichujio hakiwezi kuisoma. |
| `body` | Every relationship filters from the dimension into the fact. The measures count rows in the bridge, so picking a technology area reaches the projects without a two-way relationship. | Kila uhusiano huchuja kutoka jedwali la vipimo kwenda jedwali la ukweli. Vipimo huhesabu safu kwenye daraja, kwa hiyo kuchagua eneo la teknolojia kunafikia miradi bila uhusiano wa pande mbili. |
| `body` | DimDate is a calculated table marked as the date table. It filters FactTimeline on Start, and MonthNo keeps months sorting in date order instead of alphabetically. | DimDate ni jedwali lililokokotolewa na kuwekwa alama kama jedwali la tarehe. Huchuja FactTimeline kupitia Start, na MonthNo huhakikisha miezi inapangwa kwa mpangilio wa tarehe badala ya alfabeti. |
| `daxContext` | Filter context right now: {filters}. The values below are calculated in it. | Muktadha wa kichujio sasa hivi: {filters}. Thamani zilizo hapa chini zimekokotolewa ndani yake. |
| `daxNoContext` | No filters right now. Set one on the Overview page and come back: the values below change with it. | Hakuna vichujio sasa hivi. Weka kimoja kwenye ukurasa wa Muhtasari kisha urudi: thamani zilizo hapa chini zitabadilika nacho. |
| `figureAlt` | The Chalo in data report open in Power BI Desktop, showing the Overview page with the status slicer, KPI cards, bar chart and project table. | Ripoti ya Chalo kwa data ikiwa wazi ndani ya Power BI Desktop, ikionyesha ukurasa wa Muhtasari wenye kichujio cha hali, kadi za KPI, chati ya mistari na jedwali la miradi. |

## `src/content/philosophy.sw.ts`

| key | English | Kiswahili |
| --- | --- | --- |
| `description` | Every line of code, every interaction, every architectural decision reflects a commitment to building software that stands the test of time. Quality is not a phase—it is the foundation. | Kila mstari wa msimbo, kila mwingiliano, kila uamuzi wa usanifu unaonyesha dhamira ya kujenga programu inayostahimili wakati. Ubora si hatua moja — ni msingi wenyewe. |
| `description` | Like any master craft, software engineering demands patience, precision, and pride in the work. I approach each project with the discipline of an artisan and the rigor of an engineer. | Kama ufundi mwingine wowote wa hali ya juu, uhandisi wa programu unahitaji uvumilivu, usahihi, na fahari katika kazi. Ninaukabili kila mradi kwa nidhamu ya fundi na uangalifu wa mhandisi. |
| `description` | Systems must evolve with the organizations they serve. I design architectures that scale horizontally—in users, data, and complexity—without requiring complete rewrites. | Mifumo lazima ikue pamoja na mashirika inayohudumia. Ninabuni miundo inayopanuka kwa upana — kwa watumiaji, data, na utata — bila kuhitaji kuandikwa upya kabisa. |
| `description` | The most elegant architecture means nothing if the experience fails its users. I prioritize clarity, accessibility, and intuitive design in every interface I build. | Usanifu mzuri kabisa hauna maana ikiwa matumizi yanawaangusha watumiaji wake. Ninatanguliza uwazi, ufikivu, na ubunifu unaoeleweka kwa urahisi katika kila kiolesura ninachojenga. |
| `description` | Performance is respect for the user's time and resources. I optimize at every layer—from database queries to render cycles—to deliver experiences that feel instantaneous. | Utendaji ni heshima kwa muda na rasilimali za mtumiaji. Ninaboresha kila safu — kutoka maswali ya hifadhidata hadi mizunguko ya uonyeshaji — ili kutoa matumizi yanayohisi ya papo hapo. |
| `description` | Security is woven into architecture from day one, not bolted on before launch. I build systems that protect data, preserve privacy, and withstand evolving threats. | Usalama unafumwa ndani ya usanifu tangu siku ya kwanza, hauongezwi tu kabla ya uzinduzi. Ninajenga mifumo inayolinda data, inayohifadhi faragha, na inayostahimili vitisho vinavyobadilika. |
| `description` | Readable, well-documented, and thoughtfully structured code ensures that systems remain adaptable long after initial deployment. Future teams should inherit clarity, not confusion. | Msimbo unaosomeka, wenye maelezo mazuri, na uliopangwa kwa uangalifu huhakikisha mifumo inabaki rahisi kubadilishwa muda mrefu baada ya uzinduzi. Timu zijazo zirithi uwazi, si mkanganyiko. |
| `description` | Innovation is not novelty for its own sake. I adopt new technologies when they solve real problems, improve outcomes, or unlock capabilities that were previously impossible. | Ubunifu si upya kwa ajili ya upya tu. Ninachukua teknolojia mpya zinaposuluhisha matatizo halisi, zinapoboresha matokeo, au zinapofungua uwezo ambao awali haukuwezekana. |
| `subheadline` | The principles that guide every system I build. | Kanuni zinazoongoza kila mfumo ninaoujenga. |
| `description` | Software engineering is more than writing code—it is the disciplined art of solving complex problems with elegant, durable solutions. These principles define how I approach every project, from initial architecture to final deployment. | Uhandisi wa programu ni zaidi ya kuandika msimbo — ni sanaa yenye nidhamu ya kutatua matatizo tata kwa suluhisho maridadi na za kudumu. Kanuni hizi zinaeleza jinsi ninavyoukabili kila mradi, kutoka usanifu wa awali hadi uzinduzi wa mwisho. |


## `src/content/capabilities.sw.ts`

| key | English | Kiswahili |
| --- | --- | --- |
| `description` | Crafting responsive, performant interfaces with modern frameworks and meticulous attention to user experience. | Kuunda violesura vinavyoitikia na vyenye kasi kwa kutumia mifumo ya kisasa na uangalifu mkubwa kwa matumizi ya mtumiaji. |
| `description` | Building robust server-side systems with clean architecture, efficient APIs, and reliable data handling. | Kujenga mifumo imara ya seva yenye usanifu safi, API zenye ufanisi, na ushughulikiaji wa data unaoaminika. |
| `description` | Designing and deploying scalable cloud architectures with infrastructure as code and automated operations. | Kubuni na kusambaza miundo ya wingu inayoweza kupanuka kwa kutumia miundombinu kama msimbo na uendeshaji wa kiotomatiki. |
| `description` | Integrating AI capabilities into production systems with responsible implementation and measurable outcomes. | Kuunganisha uwezo wa AI katika mifumo iliyo hewani kwa utekelezaji wenye uwajibikaji na matokeo yanayopimika. |
| `description` | Implementing security-first architectures with encryption, authentication, and compliance frameworks. | Kutekeleza miundo inayotanguliza usalama kwa kutumia usimbaji fiche, uthibitishaji, na mifumo ya kufuata kanuni. |
| `description` | Architecting distributed systems that balance performance, reliability, and maintainability at scale. | Kubuni mifumo iliyosambaa inayosawazisha utendaji, uaminifu, na udumishaji katika kiwango kikubwa. |
| `description` | Designing data models and query strategies optimized for performance, consistency, and growth. | Kubuni miundo ya data na mbinu za maswali zilizoboreshwa kwa utendaji, uthabiti, na ukuaji. |
| `description` | Profiling and optimizing systems across the stack to deliver fast, efficient user experiences. | Kupima na kuboresha mifumo katika safu zote ili kutoa matumizi ya haraka na yenye ufanisi. |
| `description` | Bridging design and engineering with pixel-perfect implementation and sophisticated motion design. | Kuunganisha ubunifu na uhandisi kwa utekelezaji sahihi kabisa na ubunifu wa mwendo wa hali ya juu. |


## `src/content/experience.sw.ts`

| key | English | Kiswahili |
| --- | --- | --- |
| `description` | Leading development of enterprise-grade software solutions with focus on scalability, security, and user experience. | Kuongoza utengenezaji wa suluhisho za programu za kiwango cha kampuni kwa mkazo wa upanuzi, usalama, na matumizi ya mtumiaji. |
| `description` | Architected and delivered production systems serving thousands of users | Nilibuni na kuwasilisha mifumo iliyo hewani inayohudumia maelfu ya watumiaji |
| `description` | Built and maintained full-stack applications across frontend, backend, and cloud infrastructure. | Nilijenga na kudumisha programu kamili katika upande wa mbele, upande wa nyuma, na miundombinu ya wingu. |
| `description` | Developed responsive web applications with React and Next.js | Nilitengeneza programu za wavuti zinazoitikia kwa React na Next.js |
| `description` | Designed RESTful and GraphQL APIs for client integrations | Nilibuni API za RESTful na GraphQL kwa uunganishaji wa wateja |
| `description` | Contributed to product development across the software lifecycle, from requirements to deployment. | Nilichangia katika utengenezaji wa bidhaa katika mzunguko mzima wa programu, kutoka mahitaji hadi usambazaji. |


## `src/content/projects.sw.ts`

| key | English | Kiswahili |
| --- | --- | --- |
| `oneLiner` | A point-of-sale system for Kenyan shops with real double-entry accounting underneath. | Mfumo wa mauzo (POS) kwa maduka ya Kenya, wenye uhasibu halisi wa pande mbili (double-entry) chini yake. |
| `problem` | Small shops run a till and a separate set of books, and the two drift apart. Month-end reconciliation is where the errors and the hours go. | Maduka madogo huendesha mashine ya mauzo na daftari la hesabu kando, na viwili hivyo hutofautiana taratibu. Kusawazisha hesabu mwisho wa mwezi ndiko makosa na saa nyingi hupotelea. |
| `context` | Shaped around a family spare-parts shop, for owners who aren't accountants. | Umebuniwa kwa kuzingatia duka la familia la vipuri vya magari, kwa wamiliki ambao si wahasibu. |
| `built` | Every sale is one database transaction that writes the receipt, the stock movement and a balanced journal entry together. There is no sync, because there is only one set of books. | Kila mauzo ni muamala mmoja wa hifadhidata unaoandika risiti, mabadiliko ya stoo na ingizo la jarida lililosawazika kwa pamoja. Hakuna usawazishaji, kwa sababu kuna seti moja tu ya hesabu. |
| `built` | Money is stored in whole cents, never as floating-point numbers. | Pesa huhifadhiwa kwa senti kamili, kamwe si kwa namba za desimali (floating-point). |
| `built` | Stock movements are append-only, and reports are calculated when they're read, never stored. | Mabadiliko ya stoo huongezwa tu, hayahaririwi, na ripoti hukokotolewa zinaposomwa, hazihifadhiwi. |
| `built` | Every table is scoped to a business, so one install can serve many shops. | Kila jedwali limefungwa kwa biashara moja, hivyo usakinishaji mmoja unaweza kuhudumia maduka mengi. |
| `body` | Only one function, PostJournal, is allowed to write journal lines, and it refuses any entry whose debits and credits don't balance. I wrote it by hand and covered it with unit tests. | Ni kazi moja tu, PostJournal, inayoruhusiwa kuandika mistari ya jarida, na hukataa ingizo lolote ambalo debiti na krediti zake hazilingani. Niliiandika kwa mkono na kuifunika kwa majaribio ya vipimo (unit tests). |
| `oneLiner` | An online shop for a Kenyan streetwear and branding business — hoodies, football jerseys and design services. | Duka la mtandaoni la biashara ya Kenya ya mavazi ya mtaani na chapa — hoodie, jezi za mpira wa miguu na huduma za usanifu. |
| `problem` | The business needed to take orders and payment online in shillings, including M-Pesa, which is how most customers pay. | Biashara ilihitaji kupokea oda na malipo mtandaoni kwa shilingi, ikiwemo M-Pesa, ambayo ndiyo njia wateja wengi hulipa. |
| `built` | Storefront, accounts and checkout with M-Pesa STK Push, PayPal and card payments, priced in KES. | Duka, akaunti za wateja na malipo kwa M-Pesa STK Push, PayPal na kadi, kwa bei za KES. |
| `body` | I closed a hole where changing an ID in a request could expose another customer’s order, verified M-Pesa payment callbacks so a confirmation can’t be faked, and tightened Supabase row-level security. | Niliziba mwanya ambapo kubadilisha kitambulisho kwenye ombi kungeweza kufichua oda ya mteja mwingine, nikathibitisha majibu ya malipo ya M-Pesa ili uthibitisho usiweze kughushiwa, na nikaimarisha usalama wa safu (row-level security) wa Supabase. |
| `oneLiner` | Coffee leaf disease detection for Kenyan smallholder farmers. | Utambuzi wa magonjwa ya majani ya kahawa kwa wakulima wadogo wa Kenya. |
| `problem` | Coffee leaf rust spreads fast, and a smallholder often can’t get an expert to look at a leaf in time. | Kutu ya majani ya kahawa huenea haraka, na mkulima mdogo mara nyingi hawezi kupata mtaalamu wa kuangalia jani kwa wakati. |
| `built` | A TensorFlow model that flags coffee leaf rust from a photo of a leaf. | Modeli ya TensorFlow inayotambua kutu ya majani ya kahawa kutoka kwenye picha ya jani. |
| `built` | A chatbot that answers follow-up questions, grounded in a retrieval (RAG) pipeline. | Chatbot inayojibu maswali ya ziada, ikitegemea mfumo wa kutafuta taarifa (RAG). |


## `src/content/writing.sw.ts`

| key | English | Kiswahili |
| --- | --- | --- |
| `excerpt` | Architectural patterns and practical strategies for designing systems that grow with your organization. | Mifumo ya usanifu na mbinu za vitendo za kubuni mifumo inayokua pamoja na shirika lako. |
| `excerpt` | How to integrate large language models into production systems responsibly and effectively. | Jinsi ya kuunganisha modeli kubwa za lugha katika mifumo iliyo hewani kwa uwajibikaji na ufanisi. |
| `excerpt` | Embedding security into your architecture rather than treating it as a final checklist item. | Kufuma usalama ndani ya usanifu wako badala ya kuuchukulia kama orodha ya mwisho ya kukagua. |
| `excerpt` | Concrete techniques for achieving exceptional performance in Next.js applications. | Mbinu madhubuti za kufikia utendaji wa hali ya juu katika programu za Next.js. |


### `content`

**English**

```
Scalability is not a feature you add—it is a property you design into your system from the beginning. After building and maintaining production systems at scale, several patterns consistently emerge as critical to long-term success.

## Start with Boundaries

Clear service boundaries prevent the monolith trap while avoiding the complexity of premature microservices. Define bounded contexts based on business capabilities, not technical layers.

## Design for Failure

Every external dependency will fail. Circuit breakers, retries with exponential backoff, and graceful degradation are not optional—they are foundational.

## Measure Everything

You cannot optimize what you cannot measure. Invest in observability early: structured logging, distributed tracing, and meaningful metrics dashboards.
```

**Kiswahili**

```
Upanuzi si kipengele unachoongeza — ni sifa unayoibuni ndani ya mfumo wako tangu mwanzo. Baada ya kujenga na kudumisha mifumo iliyo hewani kwa kiwango kikubwa, mifumo kadhaa hujitokeza mara kwa mara kama muhimu kwa mafanikio ya muda mrefu.

## Anza na Mipaka

Mipaka wazi ya huduma huzuia mtego wa mfumo mmoja mkubwa huku ikiepuka utata wa huduma ndogo za mapema mno. Weka mipaka kulingana na uwezo wa kibiashara, si safu za kiufundi.

## Buni kwa Kutegemea Hitilafu

Kila kitegemezi cha nje kitashindwa. Vizuizi vya mzunguko, majaribio upya yenye ucheleweshaji unaoongezeka, na kushuka kwa hadhi kwa upole si hiari — ni msingi.

## Pima Kila Kitu

Huwezi kuboresha usichoweza kupima. Wekeza mapema katika ufuatiliaji: kumbukumbu zilizopangwa, ufuatiliaji uliosambaa, na dashibodi za vipimo vyenye maana.
```

### `content`

**English**

```
Integrating AI into production applications requires more than calling an API. It demands thoughtful architecture around reliability, cost management, and user trust.

## RAG vs Fine-Tuning

Retrieval-Augmented Generation offers flexibility and transparency. Fine-tuning suits domain-specific language patterns. Most production systems benefit from RAG as a starting point.

## Guardrails Matter

Implement input validation, output filtering, and fallback behaviors. Users should never encounter raw model failures—they should experience graceful degradation.

## Cost Awareness

Token usage scales with users. Cache responses, batch requests, and use smaller models for classification tasks before routing to larger models for generation.
```

**Kiswahili**

```
Kuunganisha AI katika programu zilizo hewani kunahitaji zaidi ya kuita API. Kunahitaji usanifu wa makini kuhusu uaminifu, usimamizi wa gharama, na imani ya mtumiaji.

## RAG dhidi ya Kurekebisha Modeli

Uzalishaji Unaoongezwa na Utafutaji (RAG) hutoa unyumbufu na uwazi. Kurekebisha modeli kunafaa kwa mitindo ya lugha ya sekta maalum. Mifumo mingi iliyo hewani hunufaika na RAG kama hatua ya kuanzia.

## Vizuizi Ni Muhimu

Tekeleza uthibitishaji wa pembejeo, uchujaji wa matokeo, na tabia mbadala. Watumiaji hawapaswi kamwe kukutana na hitilafu mbichi za modeli — wanapaswa kupata kushuka kwa hadhi kwa upole.

## Uelewa wa Gharama

Matumizi ya tokeni hukua na idadi ya watumiaji. Hifadhi majibu, kusanya maombi pamoja, na tumia modeli ndogo kwa kazi za uainishaji kabla ya kuelekeza kwenye modeli kubwa kwa uzalishaji.
```

### `content`

**English**

```
Security cannot be bolted onto an application before launch. It must be woven into every architectural decision from day one.

## Authentication vs Authorization

Authentication verifies identity. Authorization determines access. Confusing the two leads to over-privileged accounts and authorization bypass vulnerabilities.

## Zero Trust Principles

Never trust, always verify. Every request—internal or external—should be authenticated and authorized regardless of network location.

## Encryption Everywhere

Data at rest, data in transit, and data in use (where feasible) should all be encrypted with modern algorithms and proper key management.
```

**Kiswahili**

```
Usalama hauwezi kuongezwa kwenye programu kabla ya uzinduzi. Lazima ufumwe ndani ya kila uamuzi wa usanifu tangu siku ya kwanza.

## Uthibitishaji dhidi ya Uidhinishaji

Uthibitishaji huthibitisha utambulisho. Uidhinishaji huamua ufikiaji. Kuchanganya haya mawili husababisha akaunti zenye ruhusa kupita kiasi na udhaifu wa kukwepa uidhinishaji.

## Kanuni za Zero Trust

Usiamini kamwe, thibitisha daima. Kila ombi — la ndani au la nje — linapaswa kuthibitishwa na kuidhinishwa bila kujali lilikotoka kwenye mtandao.

## Usimbaji Fiche Kila Mahali

Data iliyohifadhiwa, data inayosafiri, na data inayotumika (pale inapowezekana) zote zinapaswa kusimbwa kwa algoriti za kisasa na usimamizi sahihi wa funguo.
```

### `content`

**English**

```
Performance is a competitive advantage. In Next.js applications, performance optimization spans rendering strategy, bundle size, and runtime behavior.

## Choose Your Rendering Wisely

Static generation for content that rarely changes. Server-side rendering for personalized pages. Client-side for highly interactive components. Hybrid approaches often deliver the best results.

## Bundle Analysis

Regularly audit your bundle with @next/bundle-analyzer. Dynamic imports and route-based code splitting eliminate unnecessary JavaScript from initial loads.

## Image Optimization

Use next/image with proper sizing, modern formats, and priority loading for above-the-fold content. Images are often the largest performance bottleneck.
```

**Kiswahili**

```
Utendaji ni faida ya ushindani. Katika programu za Next.js, uboreshaji wa utendaji unahusisha mkakati wa uonyeshaji, ukubwa wa kifurushi, na tabia wakati wa utekelezaji.

## Chagua Njia ya Uonyeshaji kwa Busara

Uzalishaji tuli kwa maudhui yasiyobadilika mara kwa mara. Uonyeshaji upande wa seva kwa kurasa za kibinafsi. Upande wa mteja kwa vipengele vyenye mwingiliano mkubwa. Mbinu mchanganyiko mara nyingi hutoa matokeo bora.

## Uchambuzi wa Kifurushi

Kagua kifurushi chako mara kwa mara kwa @next/bundle-analyzer. Uingizaji wenye nguvu na ugawaji wa msimbo kwa njia huondoa JavaScript isiyohitajika kutoka upakiaji wa awali.

## Uboreshaji wa Picha

Tumia next/image kwa ukubwa sahihi, miundo ya kisasa, na upakiaji wa kipaumbele kwa maudhui yaliyo juu ya ukurasa. Picha mara nyingi ndizo kizuizi kikubwa zaidi cha utendaji.
```

### `content`

**English**

```
Remote engineering demands intentional communication, async-first workflows, and documentation culture that co-located teams often take for granted.

## Async by Default

Not every conversation needs a meeting. Write clear proposals, use threaded discussions, and reserve synchronous time for complex decisions.

## Documentation as Infrastructure

If it is not documented, it does not exist for remote team members. Treat documentation with the same rigor as code.

## Over-Communicate Context

Remote engineers lack hallway context. Share the "why" behind decisions, not just the "what." Context enables better autonomous decisions.
```

**Kiswahili**

```
Uhandisi wa mbali unahitaji mawasiliano ya makusudi, mitiririko inayotanguliza kutokuwa wa wakati mmoja, na utamaduni wa kuandika nyaraka ambao timu zilizo mahali pamoja mara nyingi huuchukulia kawaida.

## Kutokuwa wa Wakati Mmoja kwa Chaguo-msingi

Si kila mazungumzo yanahitaji mkutano. Andika mapendekezo wazi, tumia mijadala yenye nyuzi, na hifadhi muda wa pamoja kwa maamuzi tata.

## Nyaraka kama Miundombinu

Kama hakijaandikwa, hakipo kwa wanachama wa timu walio mbali. Shughulikia nyaraka kwa uangalifu uleule unaotumia kwa msimbo.

## Eleza Muktadha kwa Wingi

Wahandisi walio mbali hawana muktadha wa mazungumzo ya njiani. Shiriki "kwa nini" nyuma ya maamuzi, si "nini" tu. Muktadha huwezesha maamuzi bora ya kujitegemea.
```

---

## Sign-off

- [ ] Headline verb chosen (`site.tagline`, `hero.headline`)
- [ ] `site.ethos` rewritten rather than translated
- [ ] Navigation and button labels read naturally
- [ ] About-page narrative is in your voice
- [ ] Philosophy pillars read as principles, not as a dictionary
- [ ] Article bodies are accurate and keep their `## ` structure
- [ ] Watermark words approved


<!-- 85 strings, generated from the .en/.sw content files -->
