export type JuniorComposition = {
  title: string;
  prompt: string;
  paragraphs: string[];
  writingType?: string;
  openingPhrase?: string;
};

type Language = "English" | "Kiswahili";

const compositions: Record<
  string,
  Record<Language, JuniorComposition[]>
> = {
  "grade-7": {
    English: [
      {
        title: "My First Day at Junior School",
        prompt: "Write a composition about your first day at a new school.",
        paragraphs: [
          "I woke up early on my first day at junior school. I was excited, but I also felt nervous because I did not know anyone. After breakfast, my mother wished me well and I set off with my new bag.",
          "At the school gate, a teacher welcomed me and showed me where to go. I met my class teacher, who introduced me to the other learners. During break time, two friendly classmates invited me to play with them. Soon, I began to feel at home.",
          "When I returned home, I told my family about my lessons and new friends. My first day had been better than I had expected. I went to bed feeling happy and ready to learn more the next day.",
        ],
      },
      {
        title: "A Helpful Neighbour",
        prompt: "Write about a time when you helped someone in your neighbourhood.",
        paragraphs: [
          "One Saturday morning, I was taking a basket of vegetables to my grandmother. On the way, I saw our elderly neighbour, Mama Achieng, carrying a heavy water container. She was walking slowly and looked tired.",
          "I greeted her politely and asked if I could help. She smiled and let me carry the container to her gate. I placed it safely beside her kitchen and then helped her pick up a few oranges that had fallen from her bag.",
          "Mama Achieng thanked me and offered me an orange. I accepted it gratefully, then continued to my grandmother's home. I felt proud because a small act of kindness had made someone's day easier. Since then, I have tried to notice when people around me need help.",
        ],
      },
      {
        title: "Planting Trees at School",
        prompt: "Describe a tree-planting activity at your school.",
        paragraphs: [
          "Last Friday, our school held a tree-planting day. We had learned that trees give us shade, provide homes for birds and help protect the soil. Each class was asked to plant and care for several young trees.",
          "Our teacher showed us how to dig a hole that was wide enough for a seedling. We loosened the soil, placed each tree upright and covered its roots carefully. Then we watered the seedlings and put small guards around them. Everyone took turns carrying water from the tank.",
          "Before we went home, our class made a timetable for watering the trees. I was pleased to take part in the activity. I hope that, with regular care, the seedlings will grow tall and make our school compound greener.",
        ],
      },
      {
        title: "The Day It Rained Heavily",
        prompt: "Write a story about a day when heavy rain changed your plans.",
        paragraphs: [
          "I had planned to visit my cousin on Saturday. The morning began brightly, so I packed a book and a snack before leaving home. Just as I reached the road, dark clouds gathered above us.",
          "A strong wind began to blow, and soon heavy rain fell. I hurried back to a nearby shop and waited under its roof. A younger child was there with no umbrella, so I shared mine when the rain became lighter. We walked together to the safer main road.",
          "By the time I reached home, my shoes were muddy and my visit had been postponed. I changed into dry clothes and helped my family move some things away from the leaking window. Although my plans had changed, I was glad that everyone stayed safe and dry.",
        ],
      },
      {
        title: "Keeping Our School Clean",
        prompt: "Explain how learners can keep their school clean.",
        paragraphs: [
          "A clean school is a pleasant and healthy place to learn. At the beginning of this term, our class noticed litter near the playground. Our teacher reminded us that keeping the school tidy is everyone's responsibility.",
          "We placed waste in the correct bins and swept our classroom each afternoon. The gardening group removed weeds, while other learners collected plastic bottles for recycling. We also learned not to waste water when washing our hands.",
          "After a few weeks, the compound looked much better. There was less litter, and the paths were easier to use. I learned that small actions make a big difference when everyone takes part. I will continue to care for our school and encourage my friends to do the same.",
        ],
      },
    ],
    Kiswahili: [
      {
        title: "Siku Yangu ya Kwanza katika Shule ya Upili ya Vijana",
        prompt: "Andika insha kuhusu siku yako ya kwanza katika shule mpya.",
        paragraphs: [
          "Nilipoamka asubuhi ya siku yangu ya kwanza katika shule mpya, nilikuwa na furaha na wasiwasi kidogo. Nilivaa sare yangu nadhifu, nikala kiamsha kinywa kisha nikabeba vitabu vyangu. Mama alinitakia heri kabla sijaondoka nyumbani.",
          "Nilipofika shuleni, mwalimu mmoja alinipokea na kunielekeza darasani. Mwalimu wa darasa alinitambulisha kwa wanafunzi wenzangu. Wakati wa mapumziko, Asha na Baraka walinialika nijiunge nao. Nilifurahi kwa sababu nilipata marafiki wapya.",
          "Niliporudi nyumbani, nilisimulia familia yangu kuhusu masomo na walimu. Siku hiyo ilikuwa nzuri kuliko nilivyotarajia. Nililala nikiwa na hamu ya kwenda shuleni tena siku iliyofuata.",
        ],
      },
      {
        title: "Kumsaidia Jirani",
        prompt: "Simulia wakati ulipomsaidia mtu katika mtaa wenu.",
        paragraphs: [
          "Jumamosi moja asubuhi, nilikuwa nikielekea dukani nilipomwona jirani yetu, Babu Juma, akibeba mfuko mzito wa mahindi. Alitembea polepole kwa sababu njia ilikuwa na mawe na mashimo.",
          "Nilimsalimu kwa heshima na kumuuliza kama angependa msaada. Alikubali, nami nikauchukua mfuko hadi nyumbani kwake. Njiani tulikutana na mtoto aliyekuwa amedondosha madaftari yake. Tulisimama na kumsaidia kuyakusanya.",
          "Babu Juma alinishukuru kwa msaada wangu. Nilifurahi kwa sababu nilikuwa nimefanya jambo jema. Nilijifunza kuwa hata msaada mdogo unaweza kumfurahisha mtu. Tangu siku hiyo, mimi hujitahidi kuwasaidia majirani ninapoweza.",
        ],
      },
      {
        title: "Kupanda Miti Shuleni",
        prompt: "Eleza shughuli ya upandaji miti iliyofanyika shuleni kwenu.",
        paragraphs: [
          "Jumatano iliyopita, shule yetu iliandaa siku ya kupanda miti. Mwalimu mkuu alitueleza kuwa miti hutupatia kivuli na husaidia kuhifadhi udongo. Kila darasa lilipangiwa sehemu yake ya kupanda miche.",
          "Mwalimu wetu alituonyesha jinsi ya kuchimba mashimo. Tulilegeza udongo, tukaweka miche kwa uangalifu na kufunika mizizi yake. Baadaye, tulimwagilia maji na kuweka vijiti kuilinda dhidi ya kukanyagwa. Kila mwanafunzi alishiriki katika kazi hiyo.",
          "Kabla ya kuondoka, tuliweka ratiba ya kumwagilia miche. Nilifurahi kuona juhudi za wanafunzi wote. Tukitunza miti hiyo vizuri, itakua na kuifanya shule yetu kuwa na mazingira mazuri na yenye afya.",
        ],
      },
      {
        title: "Mvua Kubwa Iliponyesha",
        prompt: "Andika kisa kuhusu siku ambayo mvua kubwa ilibadilisha mipango yako.",
        paragraphs: [
          "Jumapili moja nilipanga kumtembelea binamu yangu. Asubuhi kulikuwa na jua, kwa hiyo nilijiandaa mapema. Nilipokuwa karibu kufika kituoni, mawingu meusi yalitanda angani.",
          "Upepo ulivuma kwa nguvu na mvua kubwa ikaanza kunyesha. Nilikimbilia kwenye kibanda kilichokuwa karibu. Humo nilimkuta msichana mdogo aliyekuwa hana mwavuli. Mvua ilipopungua, tulitembea pamoja hadi barabara kuu.",
          "Nilipofika nyumbani, nguo zangu zilikuwa zimelowa na ziara yangu ikaahirishwa. Nilibadilisha nguo kisha nikamsaidia baba kufunga dirisha lililokuwa likivuja. Ingawa mipango yangu ilibadilika, nilifurahi kwa kuwa kila mtu alikuwa salama.",
        ],
      },
      {
        title: "Usafi wa Shule Yetu",
        prompt: "Eleza jinsi wanafunzi wanavyoweza kudumisha usafi shuleni.",
        paragraphs: [
          "Shule safi huwapa wanafunzi mazingira mazuri ya kusomea. Mwanzoni mwa muhula huu, darasa letu liligundua karatasi nyingi karibu na uwanja. Mwalimu alitukumbusha kuwa kila mwanafunzi ana wajibu wa kutunza shule.",
          "Tulikusanya taka na kuziweka kwenye mapipa yaliyofaa. Baadhi yetu tulifagia madarasa, huku wengine wakipalilia bustani. Pia tulijifunza kufunga bomba baada ya kutumia maji na kutotupa chupa za plastiki ovyo.",
          "Baada ya wiki chache, shule yetu ilionekana safi zaidi. Nilijifunza kuwa kazi ndogo huwa rahisi kila mtu anaposhiriki. Sasa ninajitahidi kutupa taka mahali panapofaa na kuwakumbusha wenzangu wafanye vivyo hivyo.",
        ],
      },
    ],
  },
  "grade-8": {
    English: [
      {
        title: "The Journey I Will Always Remember",
        prompt: "Narrate an interesting journey you took with your family or classmates.",
        paragraphs: [
          "During the August holiday, my family travelled to visit my aunt in Nakuru. We left home before sunrise because the journey was long. I sat by the window and watched the familiar buildings give way to open fields.",
          "Along the way, we stopped at a viewpoint overlooking the Great Rift Valley. The hills stretched far into the distance, and the morning light made the scene beautiful. My younger brother took photographs while my father explained how the valley had formed.",
          "Later, our bus stopped briefly because a herd of goats was crossing the road. We waited patiently and used the time to share snacks. When we arrived, my cousins welcomed us warmly.",
          "I enjoyed the visit, but the journey itself was just as memorable. I learned that travelling gives us a chance to appreciate our country's landscapes and spend time together.",
        ],
      },
      {
        title: "A Lesson in Honesty",
        prompt: "Write a story about a time when telling the truth was important.",
        paragraphs: [
          "One afternoon, I was helping to arrange books in our classroom. As I moved a desk, a flowerpot fell and broke. I froze for a moment because our class had been told to handle the decorations carefully.",
          "My friend suggested that we leave the pieces and say nothing. I knew that hiding the truth would make the situation worse. I went to find our teacher and explained exactly what had happened. I apologised and offered to help clean the floor.",
          "The teacher thanked me for being honest. She reminded us to be careful and asked me to help choose a safer place for the remaining pots. I felt relieved because I had told the truth.",
          "That day taught me that honesty takes courage, but it helps people trust one another. Since then, I have tried to accept responsibility for my mistakes.",
        ],
      },
      {
        title: "Saving Water in Our Community",
        prompt: "Describe how your community can conserve water.",
        paragraphs: [
          "Water is essential for people, animals and plants, yet many families in our area sometimes experience shortages. Last year, our environmental club decided to encourage everyone to use water wisely.",
          "We began by checking the school taps and reporting leaks to the caretaker. We also placed containers beneath a roof gutter to collect rainwater for watering the garden. During assembly, we demonstrated how turning off a tap while brushing our teeth could save water.",
          "Soon, several homes adopted similar habits. Some families repaired leaking pipes, while others reused water from washing vegetables on their plants. The changes were simple, but they reduced waste.",
          "I learned that conserving water is a shared responsibility. If each person uses only what is needed, our community will be better prepared for dry seasons.",
        ],
      },
      {
        title: "An Exciting School Match",
        prompt: "Write about a sports match that was exciting or meaningful to you.",
        paragraphs: [
          "Our school football team had trained for weeks before the inter-school match. On the day of the game, learners filled the field and cheered for both teams. I was playing as a defender, so I reminded myself to stay calm and work with my teammates.",
          "The first half ended without a goal. Early in the second half, the opposing team scored. We did not give up. Our captain encouraged us to pass the ball carefully and keep moving into open spaces.",
          "With only a few minutes left, our striker scored an equaliser. The crowd cheered loudly, and the match ended in a draw. Although we had not won, I was proud of how fairly both teams played.",
          "The match taught me that teamwork and persistence matter more than the final score. We congratulated our opponents and promised to keep practising.",
        ],
      },
      {
        title: "The Importance of Reading",
        prompt: "Explain how reading can benefit learners.",
        paragraphs: [
          "Reading is more than a school activity; it is a useful habit that can open many doors. When learners read stories, articles and reference books, they meet new ideas and learn words they can use in their own writing.",
          "I discovered this when our teacher started a weekly reading hour. At first, I chose short stories because they were easy to finish. Gradually, I began to read longer books and look up unfamiliar words. I also learned to predict what might happen next and to compare different characters.",
          "Reading has helped me understand instructions and express myself more clearly. It has also introduced me to places and experiences I have not seen in person.",
          "Learners can build this habit by reading a little every day and sharing books with friends. A good book can teach, entertain and inspire us at the same time.",
        ],
      },
    ],
    Kiswahili: [
      {
        title: "Safari Nisiyoweza Kuisahau",
        prompt: "Simulia safari ya kuvutia uliyosafiri na familia au wanafunzi wenzako.",
        paragraphs: [
          "Wakati wa likizo ya Agosti, familia yangu ilisafiri kwenda Nakuru kumtembelea shangazi. Tuliondoka mapema kabla ya jua kuchomoza. Nilikaa karibu na dirisha na kutazama mandhari yakibadilika tulipokuwa tukisonga mbele.",
          "Tulisimama mahali palipokuwa na mandhari nzuri ya Bonde la Ufa. Milima ilionekana kwa mbali na mwanga wa asubuhi uliifanya sehemu hiyo ipendeze. Baba alitueleza kuhusu bonde hilo huku mdogo wangu akipiga picha.",
          "Baadaye, gari lilisimama ili kundi la mbuzi livuke barabara. Tulingoja kwa subira na kula vitafunio vyetu. Tulipofika Nakuru, binamu zangu walitupokea kwa furaha.",
          "Nilifurahia ziara yetu, lakini safari yenyewe ilikuwa ya kukumbukwa pia. Nilijifunza kuwa kusafiri hutupa nafasi ya kuona uzuri wa nchi yetu na kuwa pamoja na familia.",
        ],
      },
      {
        title: "Funzo Kuhusu Uaminifu",
        prompt: "Andika kisa kuhusu wakati ulipohitaji kusema ukweli.",
        paragraphs: [
          "Siku moja alasiri, nilikuwa nikisaidia kupanga vitabu darasani. Niliposogeza dawati, chungu cha maua kilianguka na kuvunjika. Niliogopa kwa sababu tulikuwa tumeonywa kuvishika kwa uangalifu.",
          "Rafiki yangu alipendekeza tuondoke bila kumwambia mtu. Hata hivyo, nilijua kuwa kuficha ukweli kungeongeza tatizo. Nilimtafuta mwalimu na kumweleza kilichotokea. Niliomba msamaha na kujitolea kusafisha sakafu.",
          "Mwalimu alinishukuru kwa kusema ukweli. Alitukumbusha kuwa waangalifu na kuniomba nisaidie kutafuta mahali salama pa kuweka vyungu vilivyosalia. Nilihisi faraja kwa kuwa nilikuwa mkweli.",
          "Tukio hilo lilinifunza kuwa uaminifu huhitaji ujasiri, lakini hujenga kuaminiana. Tangu siku hiyo, ninapokosea, hujitahidi kukubali wajibu wangu.",
        ],
      },
      {
        title: "Kuhifadhi Maji Katika Jamii Yetu",
        prompt: "Eleza njia ambazo jamii yenu inaweza kutumia kuhifadhi maji.",
        paragraphs: [
          "Maji ni muhimu kwa binadamu, wanyama na mimea. Hata hivyo, wakati mwingine familia nyingi katika eneo letu hukosa maji ya kutosha. Mwaka uliopita, klabu yetu ya mazingira iliamua kuhamasisha watu watumie maji kwa uangalifu.",
          "Tulianza kwa kukagua mabomba ya shule na kumjulisha mtunzaji kuhusu yale yaliyokuwa yakivuja. Pia tuliweka mapipa chini ya mifereji ya paa ili kukusanya maji ya mvua kwa ajili ya bustani. Wakati wa mkutano, tulionyesha jinsi ya kufunga bomba tunapopiga mswaki.",
          "Baada ya muda, familia kadhaa zilianza kufuata mfano huo. Baadhi yao walitengeneza mabomba yaliyokuwa yakivuja na wengine walitumia tena maji ya kuoshea mboga kumwagilia mimea.",
          "Nilijifunza kuwa kuhifadhi maji ni wajibu wa kila mtu. Tukitumia kiasi tunachohitaji tu, jamii yetu itakuwa tayari zaidi kukabiliana na kiangazi.",
        ],
      },
      {
        title: "Mchezo wa Kusisimua Shuleni",
        prompt: "Andika kuhusu mchezo wa michezo uliokuwa wa kusisimua au muhimu kwako.",
        paragraphs: [
          "Timu yetu ya soka ilikuwa imefanya mazoezi kwa majuma kadhaa kabla ya mashindano ya shule. Siku ya mchezo, wanafunzi walijaa uwanjani na kuzishangilia timu zote mbili. Nilicheza kama beki na kujikumbusha nitulie na kushirikiana na wenzangu.",
          "Kipindi cha kwanza kiliisha bila timu yoyote kufunga. Mwanzoni mwa kipindi cha pili, wapinzani wetu walipata bao. Hatukukata tamaa. Nahodha wetu alitutia moyo tupige pasi kwa makini na tutafute nafasi wazi.",
          "Zikiwa zimebaki dakika chache, mshambuliaji wetu alifunga bao la kusawazisha. Watazamaji walishangilia kwa sauti kubwa na mchezo ukaisha kwa sare. Ingawa hatukushinda, nilijivunia jinsi timu zote zilivyocheza kwa haki.",
          "Mchezo huo ulinifundisha kuwa ushirikiano na kutokata tamaa ni muhimu kuliko matokeo. Tulipongezana na kuahidi kuendelea kufanya mazoezi.",
        ],
      },
      {
        title: "Umuhimu wa Kusoma",
        prompt: "Eleza faida za kusoma kwa wanafunzi.",
        paragraphs: [
          "Kusoma si shughuli ya darasani pekee; ni tabia inayoweza kutufungulia milango mingi. Wanafunzi wanaposoma hadithi, makala na vitabu vya marejeleo, hukutana na mawazo mapya na kujifunza msamiati wa kutumia katika maandishi yao.",
          "Nilitambua jambo hili mwalimu wetu alipoanzisha kipindi cha kusoma kila wiki. Mwanzoni nilichagua hadithi fupi kwa sababu nilimaliza haraka. Hatua kwa hatua, nilianza kusoma vitabu virefu na kutafuta maana ya maneno magumu.",
          "Kusoma kumenisaidia kuelewa maagizo na kujieleza kwa uwazi zaidi. Pia nimejifunza kuhusu maeneo na mambo ambayo sijayaona mwenyewe.",
          "Wanafunzi wanaweza kujenga tabia hii kwa kusoma kidogo kila siku na kubadilishana vitabu. Kitabu kizuri kinaweza kutuelimisha, kutuburudisha na kututia moyo.",
        ],
      },
    ],
  },
  "grade-9": {
    English: [
      {
        title: "A Challenge That Made Me Stronger",
        prompt: "Write about a challenge you faced and what you learned from it.",
        paragraphs: [
          "At the beginning of this year, I struggled to speak in front of my classmates. Whenever a teacher asked me to present, my hands became cold and I hurried through my words. I knew that avoiding every presentation would not help me improve.",
          "My English teacher encouraged me to practise with a small group first. I prepared a short talk about keeping our neighbourhood clean and read it aloud to my friends. They listened patiently and suggested that I speak more slowly and look up from my notes.",
          "A week later, I gave the same talk during assembly. I was still nervous, but I remembered to breathe, pause and face the audience. When I finished, my classmates applauded.",
          "That experience did not make every fear disappear, but it showed me that practice can build confidence. I now prepare carefully and welcome opportunities to speak. The challenge taught me to take small steps instead of giving up.",
        ],
      },
      {
        title: "A Community Project That Brought Us Together",
        prompt: "Describe a community project and explain how it helped people.",
        paragraphs: [
          "For a long time, the footpath leading to our local health centre became muddy whenever it rained. Patients and visitors often slipped, and some people had to take a longer route. The village elders therefore called a meeting to plan a community work day.",
          "On Saturday morning, families arrived with spades, wheelbarrows and stones. Older learners helped clear weeds, while adults filled the deepest muddy sections. A local builder showed us how to shape a gentle slope so that rainwater would drain away from the path.",
          "By afternoon, the route was safer and easier to use. The health workers thanked everyone, especially those who had carried water for the volunteers. We agreed to inspect the path after heavy rain and repair it when necessary.",
          "The project taught me that people can solve shared problems when they listen, plan and work together. Our contribution was simple, but it improved an important service for the whole community.",
        ],
      },
      {
        title: "The Day I Returned a Lost Wallet",
        prompt: "Write a narrative about finding something valuable and deciding what to do.",
        paragraphs: [
          "I was walking home from the library when I noticed a brown wallet beside a bus stop. I picked it up and looked around, but the owner was nowhere in sight. Inside, I saw some money, an identity card and a telephone number.",
          "For a moment, I wondered what I should do. I knew the wallet did not belong to me, so I took it to the nearby police post instead of keeping it. The officer checked the identity card and called the owner.",
          "A short while later, a worried woman arrived. She identified the wallet and thanked us for finding it. She explained that she needed the documents inside to travel the next morning. I felt relieved that they had been returned in time.",
          "As I continued home, I thought about how easily the situation could have ended differently. I learned that doing the right thing protects other people and allows us to respect ourselves.",
        ],
      },
      {
        title: "Preparing for a New Term",
        prompt: "Explain how learners can prepare well for a new school term.",
        paragraphs: [
          "A new school term brings fresh lessons, new responsibilities and another chance to improve. Good preparation does not begin on the first morning; it starts with simple plans made during the holiday.",
          "Before the term begins, learners can check their timetables and organise books by subject. They should also replace missing stationery and set aside a quiet place for reading. I use a weekly planner to divide large assignments into smaller tasks, which makes them easier to complete.",
          "Rest is important too. Going to bed at a regular time helps learners feel alert in class. It is also helpful to talk with a parent or teacher if there is a subject that feels difficult.",
          "When learners are organised, they spend less time searching for materials and more time learning. Careful preparation cannot prevent every problem, but it gives us a confident and sensible start to the term.",
        ],
      },
      {
        title: "Protecting the Environment for the Future",
        prompt: "Write an essay on how young people can protect the environment.",
        paragraphs: [
          "The environment provides the air, water, food and natural resources that people depend on. However, pollution, careless disposal of waste and the destruction of trees can damage it. Young people can help protect their surroundings through responsible daily choices.",
          "At school, learners can use bins correctly, reduce unnecessary plastic and take part in clean-up activities. They can plant indigenous trees and care for them instead of treating planting as a one-day event. At home, families can save water, switch off unused lights and separate materials that can be recycled.",
          "Sharing accurate information is also important. Learners can explain why a clean environment benefits everyone's health, while listening to the needs of their community. Lasting change is more likely when people work together rather than blame one another.",
          "No single action can solve every environmental problem. Nevertheless, consistent efforts by many people can protect local habitats and use resources wisely. By starting now, young people can help leave a healthier environment for future generations.",
        ],
      },
    ],
    Kiswahili: [
      {
        title: "Changamoto Iliyonifanya Niwe Imara",
        prompt: "Andika kuhusu changamoto uliyokumbana nayo na funzo ulilopata.",
        paragraphs: [
          "Mwanzoni mwa mwaka huu, nilikuwa naogopa kuzungumza mbele ya wanafunzi wenzangu. Mwalimu aliponiomba nitoe maelezo, mikono yangu ilitetemeka na niliharakisha maneno. Nilijua kuwa kukwepa kila nafasi ya kuzungumza hakungenisaidia kuboresha ujuzi wangu.",
          "Mwalimu wangu wa Kiswahili alinishauri nijizoeze kwanza mbele ya kikundi kidogo. Nilitayarisha hotuba fupi kuhusu kutunza mazingira ya mtaa wetu na kuisoma mbele ya marafiki. Walinisikiliza kwa makini na kunishauri nizungumze polepole.",
          "Wiki moja baadaye, nilitoa hotuba hiyo wakati wa mkutano wa shule. Bado nilikuwa na wasiwasi, lakini nilikumbuka kuvuta pumzi na kuwatazama wasikilizaji. Nilipomaliza, wanafunzi walinipigia makofi.",
          "Tukio hilo halikuondoa hofu zangu zote, lakini lilinionyesha kuwa mazoezi hujenga ujasiri. Sasa ninajiandaa vizuri na kukubali nafasi za kuzungumza. Nilijifunza kuchukua hatua ndogo badala ya kukata tamaa.",
        ],
      },
      {
        title: "Mradi wa Jamii Uliotuunganisha",
        prompt: "Eleza mradi wa jamii na jinsi ulivyowasaidia watu.",
        paragraphs: [
          "Kwa muda mrefu, njia ya kuelekea kituo cha afya katika eneo letu ilikuwa na matope mvua iliponyesha. Wagonjwa na wageni waliteleza mara kwa mara, na wengine walilazimika kutumia njia ndefu. Kwa hiyo, wazee wa kijiji waliitisha mkutano kupanga siku ya kazi ya pamoja.",
          "Jumamosi asubuhi, familia zilifika zikiwa na majembe na toroli. Wanafunzi wakubwa walisaidia kung'oa magugu, huku watu wazima wakijaza sehemu zenye matope mengi kwa mawe. Fundi mmoja alituonyesha jinsi ya kutengeneza mteremko ili maji ya mvua yapite pembeni mwa njia.",
          "Kufikia alasiri, njia ilikuwa salama na rahisi kutumia. Wafanyakazi wa kituo cha afya waliwashukuru wote walioshiriki. Tulikubaliana kuikagua njia baada ya mvua kubwa na kuitengeneza inapohitajika.",
          "Mradi huo ulinifundisha kuwa watu wanaweza kutatua matatizo ya pamoja wakisikilizana na kufanya kazi pamoja. Mchango wetu ulikuwa mdogo, lakini uliisaidia jamii nzima.",
        ],
      },
      {
        title: "Siku Niliporudisha Pochi Iliyopotea",
        prompt: "Simulia kuhusu kitu cha thamani ulichokipata na uamuzi uliochukua.",
        paragraphs: [
          "Nilikuwa nikirudi nyumbani kutoka maktaba nilipoona pochi ya kahawia kando ya kituo cha basi. Niliiokota na kutazama huku na huku, lakini mwenyewe hakuonekana. Ndani yake kulikuwa na pesa, kitambulisho na nambari ya simu.",
          "Kwa muda mfupi nilijiuliza nifanye nini. Nilijua kuwa pochi hiyo haikuwa yangu, kwa hiyo niliipeleka kwenye kituo cha polisi kilichokuwa karibu badala ya kuichukua. Afisa mmoja alisoma kitambulisho na kumpigia mwenye pochi.",
          "Muda mfupi baadaye, mwanamke mmoja aliyekuwa na wasiwasi alifika. Aliitambua pochi yake na akatushukuru kwa kuipata. Alisema alihitaji nyaraka zilizokuwa ndani yake ili kusafiri asubuhi iliyofuata. Nilifurahi kuwa vitu vyake vilikuwa vimemrudia kwa wakati.",
          "Nilipokuwa nikiendelea na safari yangu, nilifikiria jinsi jambo hilo lingeweza kuisha kwa njia tofauti. Nilijifunza kuwa kutenda lililo sawa huwasaidia wengine na kutufanya tujivunie maamuzi yetu.",
        ],
      },
      {
        title: "Kujitayarisha kwa Muhula Mpya",
        prompt: "Eleza jinsi wanafunzi wanavyoweza kujitayarisha vizuri kwa muhula mpya.",
        paragraphs: [
          "Muhula mpya huleta masomo mapya, majukumu mapya na nafasi nyingine ya kufanya maendeleo. Maandalizi mazuri hayaanzi asubuhi ya siku ya kwanza; huanza kwa kupanga mambo madogo wakati wa likizo.",
          "Kabla ya muhula kuanza, wanafunzi wanaweza kukagua ratiba na kupanga vitabu kulingana na masomo. Pia wanapaswa kutafuta vifaa vya kuandikia vilivyokosekana na kuweka mahali pa utulivu pa kusomea. Mimi hutumia ratiba ya wiki kugawanya kazi kubwa katika sehemu ndogo, hivyo huwa rahisi kuzikamilisha.",
          "Kupumzika ni muhimu pia. Kulala kwa wakati unaofaa huwasaidia wanafunzi kuwa makini darasani. Ni vizuri pia kumweleza mzazi au mwalimu ikiwa kuna somo linaloonekana kuwa gumu.",
          "Wanafunzi wanapojipanga, hutumia muda mwingi kujifunza badala ya kutafuta vifaa. Maandalizi hayawezi kuzuia kila tatizo, lakini hutuwezesha kuanza muhula kwa ujasiri.",
        ],
      },
      {
        title: "Kulinda Mazingira kwa Ajili ya Kesho",
        prompt: "Andika insha kuhusu jinsi vijana wanavyoweza kulinda mazingira.",
        paragraphs: [
          "Mazingira hutupatia hewa, maji, chakula na rasilimali nyingine muhimu. Hata hivyo, uchafuzi, utupaji wa taka ovyo na ukataji wa miti huharibu mazingira. Vijana wanaweza kusaidia kwa kufanya maamuzi yanayowajibika kila siku.",
          "Shuleni, wanafunzi wanaweza kutumia mapipa ya taka ipasavyo, kupunguza matumizi ya plastiki na kushiriki katika shughuli za usafi. Wanaweza kupanda miti ya asili na kuitunza badala ya kuchukulia upandaji miti kuwa shughuli ya siku moja. Nyumbani, familia zinaweza kuhifadhi maji na kutenganisha vitu vinavyoweza kurejelewa.",
          "Kuelimishana kwa kutumia habari sahihi ni muhimu pia. Wanafunzi wanaweza kueleza jinsi mazingira safi yanavyolinda afya ya kila mtu na pia kusikiliza mahitaji ya jamii. Mabadiliko ya kudumu hupatikana watu wanaposhirikiana badala ya kulaumiana.",
          "Hakuna hatua moja inayoweza kutatua matatizo yote ya mazingira. Hata hivyo, juhudi za mara kwa mara za watu wengi zinaweza kulinda makazi ya viumbe na kutumia rasilimali kwa busara. Tukianza sasa, tutasaidia kuiachia vizazi vijavyo mazingira bora zaidi.",
        ],
      },
    ],
  },
};

const continuations: Record<string, string[]> = {
  "My First Day at Junior School": [
    "One lesson that stood out was science. Our teacher asked us to observe a small plant and describe the parts we could see. I was surprised when several learners offered different answers, and the teacher explained how listening to one another helps us learn. At lunchtime, I shared my snack with a classmate who had forgotten hers. She thanked me, and we talked about our favourite games.",
    "Before the final bell, our teacher gave us a timetable and explained what we needed for the following day. I carefully copied it into my diary so that I would not forget anything. At home, I arranged my books and uniform for the morning. Although the new school felt large at first, the kind welcome helped me feel confident. I knew that each day would bring another opportunity to learn and make friends.",
  ],
  "A Helpful Neighbour": [
    "As we walked, Mama Achieng told me that she had gone to the market early and had bought the oranges for her grandchildren. I listened carefully and kept the container steady so that the water would not spill. At her gate, I asked whether she needed anything else. She said that she was fine and thanked me for noticing that she needed help.",
    "When I reached my grandmother's home, I told her what had happened. She praised me for being thoughtful, but she also reminded me always to ask an adult before helping with a task that might be unsafe. I understood her advice. Helping others is important, but we should use good judgement too. I returned home with a cheerful heart and a lesson I will remember.",
  ],
  "Planting Trees at School": [
    "The head teacher explained that planting a seedling was only the beginning. Without water and protection, a young tree could dry out or be damaged. Our class therefore divided into small groups. My group was given the responsibility of checking the seedlings near the library every Wednesday. We wrote our names on a chart and agreed to tell the teacher if any plant needed extra care.",
    "A month later, I noticed that tiny green leaves had appeared on one of the seedlings. I called my friends, and we celebrated its growth. We also removed weeds that were competing for water. The activity helped me understand that caring for the environment requires patience and teamwork. I hope the trees will provide shade for younger learners in the years ahead.",
  ],
  "The Day It Rained Heavily": [
    "While we waited, the shopkeeper brought a basin outside to catch water dripping from the roof. He explained that the rain had filled the nearby water tank after several dry weeks. The younger child told me that she was going to her aunt's house, which was only a short distance away. I made sure that we waited until the thunder had stopped before walking.",
    "At home, my family checked the drains around the house to make sure that water could flow away safely. My father showed me how leaves had blocked one channel, so we cleared it together. Later, I called my cousin and explained why I could not visit. We agreed to meet the next weekend. The unexpected rain had changed my plans, but it also gave me a chance to help my family and a younger neighbour.",
  ],
  "Keeping Our School Clean": [
    "Our class monitor suggested that we make signs reminding learners to put rubbish in the bins. We used clear words and pictures so that even younger pupils could understand them. The caretaker helped us place the signs near the playground, dining area and water point. During assembly, our teacher explained that litter can block drains and attract pests, so keeping the compound clean also protects our health.",
    "We checked our work every Friday and discussed what still needed attention. If a bin was full, we informed the caretaker instead of leaving rubbish beside it. The school became more welcoming, and visitors noticed the difference. I learned that cleanliness is not a task for one person or one day. It is a habit we practise together, wherever we are.",
  ],
  "Siku Yangu ya Kwanza katika Shule ya Upili ya Vijana": [
    "Kipindi cha kwanza kilikuwa cha Kiingereza. Mwalimu alituomba kila mmoja ajitambulishe na kutaja jambo analopenda kufanya. Niliposimama, sauti yangu ilikuwa ya chini, lakini wanafunzi wenzangu walinitia moyo. Baadaye tulitembelea maktaba na kujifunza jinsi ya kuazima vitabu. Nilichagua kitabu cha hadithi cha kusoma wakati wa mapumziko.",
    "Kabla ya kengele ya mwisho, tulipewa ratiba ya masomo na kuelekezwa mahali pa kuweka vitabu vyetu. Niliinakili ratiba hiyo kwenye daftari langu ili nisiisahau. Nilipofika nyumbani, nilimweleza mama kuhusu walimu na marafiki wapya. Nilijifunza kuwa mwanzo mpya unaweza kuleta wasiwasi, lakini kuwa na adabu na kuwa tayari kujifunza husaidia sana. Nilitarajia siku nyingine ya shule kwa hamu.",
  ],
  "Kumsaidia Jirani": [
    "Tulipokuwa tukitembea, Babu Juma aliniambia kuwa alikuwa ametoka sokoni na alikuwa amenunua mahindi kwa ajili ya familia yake. Nilihakikisha mfuko haukugonga mawe njiani. Tulipofika nyumbani kwake, nilimweka mfuko mahali pakavu. Kisha nilimsaidia mtoto aliyekuwa akikusanya madaftari yake kupanga vitabu hivyo katika begi lake.",
    "Babu Juma alinishukuru tena na kunieleza kuwa jirani mwema hujali watu wanaoishi karibu naye. Nilipofika dukani, nilimweleza mama kuhusu tukio hilo. Alifurahi lakini akanikumbusha kuwa ninaposaidia, ninapaswa kuchagua kazi salama na kumjulisha mtu mzima ikiwa kuna hatari. Nilielewa ushauri wake. Nilirejea nyumbani nikiwa na furaha kwa kuwa nilikuwa nimetumia muda wangu vizuri.",
  ],
  "Kupanda Miti Shuleni": [
    "Baada ya shughuli hiyo, mwalimu alitueleza kuwa kupanda mti pekee hakutoshi. Mche mchanga unahitaji maji, udongo mzuri na ulinzi dhidi ya kukanyagwa. Kwa hiyo, darasa letu liligawanywa katika vikundi vya kutunza miche. Kikundi changu kilipewa jukumu la kumwagilia miti iliyo karibu na maktaba kila Jumatano.",
    "Wiki kadhaa baadaye, majani madogo ya kijani yalianza kuonekana kwenye mche wetu. Tulifurahi sana, lakini tuliendelea kuupalilia na kuondoa magugu. Nilijifunza kuwa kutunza mazingira huhitaji uvumilivu na ushirikiano. Miti hiyo ikikua, itatoa kivuli na kufanya shule iwe nzuri zaidi. Nitashiriki kuitunza hadi iwe mikubwa.",
  ],
  "Mvua Kubwa Iliponyesha": [
    "Tulipokuwa tukisubiri, mmiliki wa kibanda alitueleza kuwa mvua ilikuwa imejaza tangi lake la kuvunia maji. Alituomba tusisimame karibu na mtaro kwa sababu maji yalikuwa yakitiririka kwa kasi. Tulifuata ushauri wake na kubaki mahali salama hadi radi ilipotulia. Msichana mdogo aliniambia kuwa alikuwa akienda kwa shangazi yake aliyeishi karibu.",
    "Nilipofika nyumbani, nilibadilisha nguo na kumsaidia baba kusafisha mifereji iliyokuwa imezibwa na majani. Tulihakikisha maji yanaweza kupita bila kuingia ndani ya nyumba. Baadaye nilimpigia binamu yangu na kumweleza kwa nini sikuweza kumtembelea. Tulipanga kukutana wiki iliyofuata. Siku hiyo ilinifundisha kuwa mipango inaweza kubadilika, lakini tunaweza kutumia muda wetu kusaidia familia na watu wengine.",
  ],
  "Usafi wa Shule Yetu": [
    "Mwangalizi wa darasa alipendekeza tuweke mabango yanayowakumbusha wanafunzi kutupa taka kwenye mapipa. Tulitumia maneno rahisi na michoro ili hata wanafunzi wadogo waelewe. Mwalimu alitueleza kuwa taka zinaweza kuziba mifereji na kuvutia wadudu. Kwa hiyo, usafi wa shule husaidia pia kulinda afya zetu.",
    "Kila Ijumaa tulikagua eneo letu na kuzungumza kuhusu kazi iliyobaki. Pipa lilipojaa, tulimjulisha mtunzaji badala ya kuacha taka pembeni. Shule ilipendeza zaidi na wageni waliona tofauti. Nilijifunza kuwa usafi si kazi ya mtu mmoja wala ya siku moja. Ni tabia tunayopaswa kuifuata shuleni, nyumbani na katika maeneo ya umma.",
  ],
  "The Journey I Will Always Remember": [
    "During the drive, my aunt called to ask where we were. She had prepared lunch, and my cousins were waiting at the gate. When we finally arrived, everyone helped carry our bags inside. After eating, my cousins and I compared the photographs we had taken. We laughed at one picture in which my brother had captured only the sky because the bus had moved just as he pressed the button.",
    "On our return journey, I wrote a few notes in my diary so that I would remember the places we had seen. I also thanked my parents for planning the trip. It was not only a chance to visit relatives; it helped me observe the landscape and learn from my father's explanations. Whenever I look at the photographs, I remember the conversations, the laughter and the beauty of the valley.",
  ],
  "A Lesson in Honesty": [
    "The next day, I used some of my pocket money to buy a small replacement pot. The teacher did not expect me to do this, but she thanked me for thinking about how to make things right. We moved the other pots to a wide shelf where they could not easily be knocked over. My friend later admitted that telling the truth had been the better choice.",
    "I realised that a mistake does not have to define a person. What matters is whether we admit it, apologise and try to repair any harm. If I had hidden what happened, someone else might have been blamed and the broken pieces could have caused an injury. Since then, I have tried to be honest even when I feel embarrassed. The trust of other people is worth more than avoiding a difficult conversation.",
  ],
  "Saving Water in Our Community": [
    "Our club also asked the school to repair a dripping tap near the kitchen. The caretaker replaced a worn washer, and the constant dripping stopped. We recorded how much water we collected from the roof after a storm and used it to water seedlings. This helped us see that small practical changes can make a real difference, especially when many people follow them.",
    "At the end of the term, we presented our work during assembly. Learners suggested other ideas, such as washing sports equipment in a basin rather than under a running tap. We wrote the suggestions on a noticeboard so everyone could try them. I learned that protecting water supplies is not only the responsibility of leaders. Each household and school can prevent waste and help ensure that there is enough water for everyone.",
  ],
  "An Exciting School Match": [
    "After the match, both teams lined up to shake hands. Our coach congratulated us for keeping our discipline even when the game became tense. He said that a good player respects the referee, teammates and opponents. We also discussed what we could improve, including passing accurately under pressure and communicating more clearly on the field.",
    "The following week, we returned to training with renewed energy. I practised receiving the ball and looking up before passing it. Our team became more organised, and our friendships grew stronger. The draw had felt disappointing at first, but it gave us useful lessons. I now understand that sport is not only about winning; it teaches fairness, self-control and how to encourage others.",
  ],
  "The Importance of Reading": [
    "Our reading group now meets once a week to discuss a book. Each learner shares a favourite character and explains what the character learned. Listening to different opinions has helped me notice details I might have missed. Sometimes we disagree, but we support our ideas with examples from the story. These conversations have made reading more enjoyable.",
    "I have also started carrying a small book when I travel, so I can read during free time instead of becoming bored. My younger sister sometimes asks me to read aloud to her, and she enjoys choosing the stories. Reading has improved my vocabulary, but it has also taught me patience and helped me imagine other people's experiences. I hope more learners will discover a kind of book that they enjoy.",
  ],
  "Safari Nisiyoweza Kuisahau": [
    "Shangazi alikuwa ametutayarishia chakula cha mchana, na binamu zangu walikuwa wakitusubiri mlangoni. Tulipowasili, kila mtu alitusaidia kubeba mizigo ndani ya nyumba. Baada ya kula, nilikaa na binamu zangu kutazama picha tulizopiga. Tulicheka sana tulipoona picha ambayo mdogo wangu alipiga anga tupu kwa sababu gari lilikuwa likisogea.",
    "Tulipokuwa tukirudi nyumbani, niliandika kumbukumbu chache kwenye daftari langu. Nilifanya hivyo ili nisiyasahau maeneo tuliyoyaona. Pia niliwashukuru wazazi wangu kwa kupanga safari hiyo. Haikuwa nafasi ya kuwatembelea jamaa pekee; ilinisaidia kutazama mandhari na kujifunza kutoka kwa maelezo ya baba. Kila ninapoona picha hizo, hukumbuka mazungumzo yetu na uzuri wa Bonde la Ufa.",
  ],
  "Funzo Kuhusu Uaminifu": [
    "Siku iliyofuata, nilinunua chungu kidogo kwa kutumia sehemu ya pesa zangu za matumizi. Mwalimu hakunitarajia kufanya hivyo, lakini alinishukuru kwa kutaka kurekebisha hali. Tuliviweka vyungu vilivyosalia kwenye rafu pana ambako havingeanguka kwa urahisi. Baadaye, rafiki yangu alikiri kuwa kusema ukweli kulikuwa uamuzi bora.",
    "Nilitambua kuwa kosa halimfanyi mtu kuwa mbaya. Jambo muhimu ni kulikubali, kuomba msamaha na kujaribu kurekebisha madhara. Kama ningeficha ukweli, mtu mwingine angeshtakiwa na vipande vya chungu vingeweza kumjeruhi mtu. Tangu wakati huo, ninajitahidi kuwa mkweli hata ninapoaibika. Kuaminika na watu ni bora kuliko kukwepa mazungumzo magumu.",
  ],
  "Kuhifadhi Maji Katika Jamii Yetu": [
    "Klabu yetu pia iliomba shule itengeneze bomba lililokuwa likivuja karibu na jiko. Mtunzaji alibadilisha kifaa kilichokuwa kimechakaa na maji yakakoma kudondoka. Tulipima maji tuliyokusanya kutoka kwenye paa baada ya mvua na kuyatumia kumwagilia miche. Tuliona kuwa hatua ndogo zinaweza kuleta mabadiliko makubwa watu wengi wanapozifuata.",
    "Mwishoni mwa muhula, tuliwasilisha kazi yetu wakati wa mkutano wa shule. Wanafunzi walipendekeza njia nyingine, kama kuosha vifaa vya michezo ndani ya beseni badala ya kuacha bomba likitiririka. Tuliandika mawazo hayo ubaoni ili kila mtu ayajaribu. Nilijifunza kuwa kuhifadhi maji si wajibu wa viongozi pekee. Kila familia na shule inaweza kuzuia matumizi mabaya na kuhakikisha maji yanapatikana kwa wote.",
  ],
  "Mchezo wa Kusisimua Shuleni": [
    "Baada ya mchezo, wachezaji wa timu zote mbili walipanga mstari na kupeana mikono. Kocha wetu alitusifu kwa kudumisha nidhamu hata mchezo ulipokuwa mkali. Alisema mchezaji mzuri humheshimu mwamuzi, wenzake na wapinzani. Pia tulijadili mambo tuliyopaswa kuboresha, kama kupiga pasi kwa usahihi na kuwasiliana vizuri uwanjani.",
    "Wiki iliyofuata, tulirudi mazoezini tukiwa na bidii mpya. Nilijifunza kupokea mpira na kutazama mbele kabla ya kupiga pasi. Timu yetu ilipangwa vizuri zaidi na urafiki wetu ukaimarika. Mwanzoni sare ilionekana kama jambo la kukatisha tamaa, lakini ilitupa mafunzo muhimu. Sasa ninaelewa kuwa michezo si ushindi pekee; hutufundisha haki, kujizuia na kutiana moyo.",
  ],
  "Umuhimu wa Kusoma": [
    "Kikundi chetu cha kusoma sasa hukutana mara moja kwa wiki kujadili kitabu. Kila mwanafunzi humtaja mhusika anayempenda na kueleza funzo alilopata. Kusikiliza maoni tofauti kumenisaidia kuona mambo ambayo huenda ningekosa. Wakati mwingine hatukubaliani, lakini tunatoa mifano kutoka kwenye hadithi ili kuunga mkono maoni yetu.",
    "Pia nimeanza kubeba kitabu kidogo ninaposafiri ili nisichoke wakati wa mapumziko. Dada yangu mdogo huniomba kumsomea kwa sauti, naye hufurahia kuchagua hadithi. Kusoma kumeboresha msamiati wangu, lakini pia kumenifundisha kuwa mvumilivu na kuwazia maisha ya watu wengine. Natumaini wanafunzi wengi zaidi watapata aina ya vitabu wanavyovipenda.",
  ],
  "A Challenge That Made Me Stronger": [
    "After the presentation, my teacher gave me one suggestion: I should pause briefly after an important point so that the audience could follow my ideas. I practised at home by speaking in front of a mirror and timing myself. My family listened and asked questions, which helped me prepare for the next presentation. Each practice session felt a little easier than the one before.",
    "A few months later, I volunteered to welcome visitors during a school event. I still felt nervous, but I no longer believed that nervousness meant I would fail. I prepared my words, breathed slowly and spoke clearly. The visitors thanked me, and I felt proud of my progress. I learned that confidence grows through preparation and repeated effort. A difficult task can become manageable when we ask for advice and keep trying.",
  ],
  "A Community Project That Brought Us Together": [
    "The elders also made sure that older residents and people with disabilities could share their views. They explained which parts of the path were most difficult to use. We adjusted the plan so that the surface would be firm and the slope would not be too steep. This reminded us that a useful community project should listen to the people who depend on it.",
    "A month later, we met again to inspect the route after several rainy days. One small section needed more stones, so volunteers repaired it before it became dangerous. The health centre continued to be easier to reach, especially for people carrying babies or walking with support. I was proud that our work had lasted beyond the first day. The project showed me how cooperation, careful planning and follow-up can turn a shared concern into a lasting improvement.",
  ],
  "The Day I Returned a Lost Wallet": [
    "The officer asked me where I had found the wallet and wrote down the details. I waited nearby because I wanted to make sure it reached its owner. While we waited, the woman called again and described a small family photograph inside one pocket. Her description matched what I had seen, so the officer knew that she was the rightful owner.",
    "Before leaving, she offered me a reward, but I politely declined. I explained that returning the wallet was the right thing to do. She thanked me and said that she would be more careful in future. On my way home, I felt lighter than I had when I first found it. The experience reminded me that honesty is a choice we make even when no one is watching.",
  ],
  "Preparing for a New Term": [
    "During the first week, learners should pay attention to new routines and ask questions when instructions are unclear. I keep a list of assignments and mark each one when it is completed. This prevents me from leaving everything until the last evening. I also plan short breaks between study sessions because concentrating for too long without resting can be difficult.",
    "At the end of each week, I review what I have learned and identify one area that needs more practice. If I do not understand a topic, I ask a classmate or teacher for help before the next lesson. These habits have made me more responsible for my learning. A successful term does not depend on being perfect; it depends on being prepared, consistent and willing to improve.",
  ],
  "Protecting the Environment for the Future": [
    "Communities can support these efforts by providing safe places to sort waste and by protecting public green spaces. Local leaders can organise clean-up days, but residents should help decide which areas need attention most. Schools can invite knowledgeable community members to explain local environmental challenges. When learners see practical examples, they are more likely to understand how their choices affect the places where they live.",
    "Young people should remember that environmental care is a long-term responsibility. A newly planted tree needs water, and a clean-up must be followed by better waste habits. We can measure progress by checking whether our surroundings remain cleaner and whether fewer resources are wasted. If we learn from mistakes and keep working together, our small actions will contribute to healthier homes, schools and natural habitats.",
  ],
  "Changamoto Iliyonifanya Niwe Imara": [
    "Baada ya hotuba, mwalimu alinipa ushauri mmoja: nilipaswa kusimama kidogo baada ya jambo muhimu ili wasikilizaji wafuatilie mawazo yangu. Nilifanya mazoezi nyumbani mbele ya kioo na kupima muda. Familia yangu ilinisikiliza kwa makini na kuniuliza maswali yaliyonisaidia kujiandaa. Kila zoezi lilionekana rahisi kuliko lililotangulia.",
    "Miezi michache baadaye, nilijitolea kuwakaribisha wageni katika shughuli ya shule. Bado nilikuwa na wasiwasi, lakini sikufikiri tena kuwa wasiwasi ulimaanisha ningeshindwa. Nilijiandaa, nikavuta pumzi polepole na kuzungumza kwa uwazi. Wageni walinishukuru nami nikajivunia maendeleo yangu. Nilijifunza kuwa ujasiri hujengwa kwa maandalizi na juhudi za mara kwa mara. Kazi ngumu huwa rahisi tunapoomba ushauri na kuendelea kujaribu.",
  ],
  "Mradi wa Jamii Uliotuunganisha": [
    "Wazee walihakikisha pia kuwa watu wenye umri mkubwa na wenye ulemavu walitoa maoni yao. Walieleza sehemu za njia zilizokuwa ngumu zaidi kutumia. Tulibadilisha mpango ili sakafu iwe imara na mteremko usiwe mkali sana. Jambo hilo lilitukumbusha kuwa mradi mzuri wa jamii husikiliza watu wanaoutegemea.",
    "Mwezi mmoja baadaye, tulikutana tena kukagua njia baada ya siku kadhaa za mvua. Sehemu moja ndogo ilihitaji mawe zaidi, kwa hiyo wajitolea waliirekebisha kabla haijawa hatari. Kituo cha afya kiliendelea kufikika kwa urahisi, hasa kwa watu waliokuwa wamebeba watoto. Nilijivunia kuwa kazi yetu ilikuwa imedumu. Mradi huo ulinionyesha kuwa ushirikiano, mipango mizuri na ufuatiliaji hubadilisha tatizo la pamoja kuwa maendeleo ya kudumu.",
  ],
  "Siku Niliporudisha Pochi Iliyopotea": [
    "Afisa aliniuliza mahali nilipoiona pochi na akaandika maelezo hayo. Nilibaki karibu kwa sababu nilitaka kuhakikisha imefika kwa mwenyewe. Tulipokuwa tukisubiri, mwanamke huyo alipiga simu tena na kueleza kuwa kulikuwa na picha ndogo ya familia ndani ya mfuko mmoja. Maelezo yake yalilingana na nilichokuwa nimeona, kwa hiyo afisa akajua kuwa ndiye mwenye pochi.",
    "Kabla ya kuondoka, alitaka kunizawadia, lakini nilikataa kwa heshima. Nilimweleza kuwa kurudisha pochi ndilo jambo lililofaa kufanya. Alinishukuru na kusema atakuwa mwangalifu zaidi. Nilipokuwa nikielekea nyumbani, nilihisi furaha. Tukio hilo lilinikumbusha kuwa tunachagua kuwa waaminifu hata wakati hakuna mtu anayetutazama.",
  ],
  "Kujitayarisha kwa Muhula Mpya": [
    "Katika wiki ya kwanza, wanafunzi wanapaswa kufuatilia ratiba mpya na kuuliza maswali maagizo yasipoeleweka. Mimi huandika kazi nilizopewa na kuweka alama ninapozikamilisha. Hilo hunizuia kuziacha zote hadi usiku wa mwisho. Pia hupanga mapumziko mafupi kati ya vipindi vya kusoma kwa sababu ni vigumu kukaza fikira kwa muda mrefu bila kupumzika.",
    "Mwisho wa kila wiki, mimi hupitia nilichojifunza na kutambua eneo linalohitaji mazoezi zaidi. Nisipoelewa mada fulani, humwomba mwenzangu au mwalimu anisaidie kabla ya somo linalofuata. Tabia hizi zimenifanya niwajibike zaidi katika masomo yangu. Muhula wenye mafanikio hautegemei kutokosea; hutegemea kujiandaa, kufanya juhudi mara kwa mara na kuwa tayari kujiboresha.",
  ],
  "Kulinda Mazingira kwa Ajili ya Kesho": [
    "Jamii zinaweza kusaidia juhudi hizi kwa kuweka mahali salama pa kutenganisha taka na kulinda maeneo ya kijani. Viongozi wanaweza kuandaa siku za usafi, lakini wakazi wanapaswa kusaidia kuamua maeneo yanayohitaji uangalifu zaidi. Shule zinaweza kuwaalika watu wenye maarifa kueleza changamoto za mazingira ya eneo lao. Wanafunzi wanapoona mifano halisi, huelewa vizuri jinsi maamuzi yao yanavyoathiri makazi yao.",
    "Vijana wanapaswa kukumbuka kuwa utunzaji wa mazingira ni jukumu la muda mrefu. Mti mpya unahitaji maji na usafi wa eneo unapaswa kufuatiwa na tabia bora za kutupa taka. Tunaweza kupima maendeleo kwa kuona kama mazingira yameendelea kuwa safi na kama rasilimali zinapotea kwa kiasi kidogo. Tukijifunza kutokana na makosa na kuendelea kushirikiana, juhudi zetu zitasaidia nyumba, shule na makazi ya viumbe kuwa na afya.",
  ],
};

const additionalCompositions: Record<
  string,
  Record<Language, JuniorComposition[]>
> = {
  "grade-7": {
    English: [
      {
        title: "The Missing Library Book",
        prompt: "Write a story about finding a book that a learner had lost.",
        paragraphs: [
          "On Tuesday afternoon, our class returned to the library after lunch. I noticed a book lying under a bench near the door. It had a library stamp, so I knew that someone had borrowed it and might be worried about losing it. I picked it up carefully and took it to our teacher.",
          "She checked the name written on the borrowing card. The book belonged to Peter, a quiet learner in the next class. We went to look for him, but he had already left for the school bus. The teacher placed the book safely in her office and told me that she would speak to him the following morning.",
          "When Peter arrived, he looked upset because he had been searching for the book at home. The teacher returned it and reminded him to check his desk and bag before leaving school. Peter thanked me for handing it in. I felt happy that the book had been found before it was damaged or lost.",
          "I learned that returning something that belongs to another person is the honest thing to do. Since then, I have checked the library shelves and classroom before leaving, and I encourage my friends to do the same.",
        ],
      },
      {
        title: "A Visit to the Local Market",
        prompt: "Describe a visit to a busy market and what you learned there.",
        paragraphs: [
          "During the school holiday, my aunt took me to the local market to buy vegetables. We left early because she wanted to choose fresh produce before the market became too crowded. As we approached, I heard people greeting one another and calling out the prices of their goods.",
          "The market was full of colour. Tomatoes, green vegetables, onions and ripe bananas were arranged in neat piles. My aunt compared prices before choosing what she needed. She greeted the traders politely and asked where some of the vegetables had been grown. One farmer explained that he had brought them from his small farm nearby.",
          "While my aunt paid, I helped her place the vegetables in a basket. I noticed that shoppers carried reusable bags, and several traders used paper rather than plastic wrapping. My aunt explained that planning a shopping list helped her avoid wasting food or money.",
          "On our way home, I thought about how much work goes into bringing food to a market. I learned to respect farmers and traders, compare prices carefully and buy only what we need. The visit was enjoyable and useful.",
        ],
      },
      {
        title: "The Lost Calf",
        prompt: "Write a story about helping to find a lost animal.",
        paragraphs: [
          "One evening, I was helping my uncle bring the cows home when he noticed that the youngest calf was missing. The other animals had reached the enclosure, but the small brown calf was nowhere in sight. My uncle asked me to stay near the gate while he checked the path.",
          "I remembered seeing the calf near a patch of tall grass earlier that afternoon. I told my uncle, and we followed its hoofprints along the edge of the field. We called softly and listened between the sounds of birds and people returning from their farms.",
          "After a few minutes, we heard a faint bleat from behind a group of bushes. The calf had wandered there and could not find the path back. My uncle approached slowly so that it would not become frightened. I held out a handful of grass, and the calf followed us to the enclosure.",
          "My uncle thanked me for remembering where I had last seen it. We checked the fence and closed a gap that had allowed the calf to wander away. I learned to observe carefully and to stay calm when a problem arises. The calf was safe, and we all felt relieved.",
        ],
      },
      {
        title: "My Favourite Family Tradition",
        prompt: "Write about a family tradition that is important to you.",
        paragraphs: [
          "Every December, my family spends a day preparing a meal together. We began this tradition when my grandmother said that sharing work in the kitchen would give everyone time to talk. My cousins and I look forward to the day because we learn recipes and hear stories from older members of the family.",
          "In the morning, we wash vegetables, sort beans and arrange the table. The adults handle the hot cooking pots, while the younger children help with safe tasks. My grandmother explains why she adds each ingredient and lets us taste the food when it is ready. Everyone has a responsibility, so no one is left to do all the work alone.",
          "After the meal, we sit together and talk about the year. We share things that made us proud and plans we hope to achieve. Sometimes we play a board game or sing songs before cleaning the kitchen as a team.",
          "This tradition matters to me because it brings our family closer. I have learned that traditions do not need to be expensive or complicated. Spending time, listening and helping one another can create memories that last for many years.",
        ],
      },
      {
        title: "Why We Should Care for School Gardens",
        prompt: "Explain how a school garden can benefit learners and the environment.",
        paragraphs: [
          "A school garden can make the compound more beautiful, but it also gives learners a place to practise useful skills. Our class started a small vegetable garden behind the science room. The teacher helped us choose a sunny site and explained that healthy soil, water and careful planning were needed.",
          "We prepared the ground, planted seeds in rows and labelled each section. Every group received a different task. Some learners watered the seedlings, while others removed weeds and checked for insects. As the plants grew, our teacher showed us how roots take in water and how leaves use sunlight.",
          "When the vegetables were ready, we harvested them carefully and shared some with the school kitchen. We used dry leaves to make compost rather than throwing them away. The garden therefore reduced waste and helped us understand where food comes from.",
          "I enjoyed seeing our work grow week by week. A school garden teaches responsibility, cooperation and respect for nature. If learners care for it regularly, it can support lessons and provide fresh food for the school community.",
        ],
      },
    ],
    Kiswahili: [
      {
        title: "Kitabu cha Maktaba Kilichopotea",
        prompt: "Andika kisa kuhusu kupata kitabu ambacho mwanafunzi alikuwa amepoteza.",
        paragraphs: [
          "Jumanne alasiri, darasa letu lilirudi maktabani baada ya chakula cha mchana. Niliona kitabu chini ya benchi karibu na mlango. Kilikuwa na muhuri wa maktaba, kwa hiyo nilijua kuwa mtu alikuwa amekiazima na huenda alikuwa na wasiwasi kwa kukipoteza. Nilikichukua kwa uangalifu na kumpelekea mwalimu.",
          "Mwalimu alikagua kadi ya mkopo wa kitabu na kuona jina la Peter, mwanafunzi wa darasa lililokuwa karibu. Tulimtafuta lakini tayari alikuwa ameondoka kwenda kwenye basi la shule. Mwalimu alikiweka kitabu ofisini kwake mahali salama na kusema angemtafuta Peter asubuhi iliyofuata.",
          "Peter alipofika siku iliyofuata, alionekana kuwa na huzuni kwa sababu alikuwa akikitafuta nyumbani. Mwalimu alimrudishia kitabu na kumkumbusha kukagua dawati na begi kabla ya kuondoka. Peter alinishukuru kwa kukipeleka kwa mwalimu. Nilifurahi kuwa kitabu kilikuwa kimepatikana kabla hakijaharibika.",
          "Nilijifunza kuwa kurudisha kitu cha mtu mwingine ndilo jambo la uaminifu. Tangu wakati huo, mimi hukagua rafu na darasa kabla ya kuondoka na kuwakumbusha rafiki zangu wafanye vivyo hivyo.",
        ],
      },
      {
        title: "Ziara Sokoni",
        prompt: "Eleza ziara katika soko lenye shughuli nyingi na funzo ulilopata.",
        paragraphs: [
          "Wakati wa likizo ya shule, shangazi yangu alinipeleka sokoni kununua mboga. Tuliondoka mapema ili achague vyakula vibichi kabla soko halijajaa sana. Tulipokaribia, nilisikia watu wakisalimiana na wauzaji wakitangaza bei za bidhaa zao.",
          "Soko lilikuwa na rangi nyingi. Nyanya, sukuma wiki, vitunguu na ndizi zilipangwa kwenye marundo nadhifu. Shangazi alilinganisha bei kabla ya kuchagua alichohitaji. Aliwasalimu wauzaji kwa heshima na kumuuliza mkulima mmoja mahali alipokuwa amepanda mboga zake.",
          "Shangazi alipokuwa akilipa, nilimsaidia kuweka mboga kwenye kikapu. Niliona wanunuzi wakitumia mifuko inayoweza kutumiwa tena na wauzaji kadhaa wakitumia karatasi badala ya plastiki. Shangazi alieleza kuwa orodha ya manunuzi humsaidia mtu kuepuka kupoteza chakula na pesa.",
          "Tulipokuwa tukirudi nyumbani, nilifikiria kazi inayofanywa kuleta chakula sokoni. Nilijifunza kuwaheshimu wakulima na wauzaji, kulinganisha bei na kununua tunachohitaji tu. Ziara hiyo ilinifurahisha na kunielimisha.",
        ],
      },
      {
        title: "Ndama Aliyepotea",
        prompt: "Andika kisa kuhusu kusaidia kutafuta mnyama aliyepotea.",
        paragraphs: [
          "Jioni moja, nilikuwa nikimsaidia mjomba wangu kuwarudisha ng'ombe zizini alipogundua kuwa ndama mdogo hakuwepo. Wanyama wengine walikuwa wamefika, lakini ndama wa kahawia hakuonekana. Mjomba aliniomba nibaki karibu na lango huku yeye akikagua njia.",
          "Nilikumbuka kuwa nilikuwa nimemwona ndama karibu na nyasi ndefu alasiri hiyo. Nilimweleza mjomba, kisha tukafuata nyayo zake kando ya shamba. Tulimwita kwa sauti ya upole na kusikiliza kati ya milio ya ndege na watu waliokuwa wakirudi mashambani.",
          "Baada ya muda, tulisikia mlio mdogo nyuma ya vichaka. Ndama alikuwa amepotea njia na hakuweza kurudi mwenyewe. Mjomba alimkaribia taratibu ili asimwogope. Nilimpa nyasi kidogo, naye akatufuata hadi zizini.",
          "Mjomba alinishukuru kwa kukumbuka mahali nilipomwona mara ya mwisho. Tulikagua uzio na kuziba tundu lililomwezesha kutoka. Nilijifunza kuwa makini na kutulia tatizo linapotokea. Ndama alikuwa salama nasi sote tukafurahi.",
        ],
      },
      {
        title: "Desturi Ninayoipenda ya Familia Yetu",
        prompt: "Andika kuhusu desturi ya familia iliyo muhimu kwako.",
        paragraphs: [
          "Kila mwezi wa Desemba, familia yetu hutenga siku moja ya kupika chakula pamoja. Tulianza desturi hii bibi aliposema kuwa kufanya kazi jikoni pamoja kungetupa muda wa kuzungumza. Binamu zangu na mimi huitazamia siku hiyo kwa sababu tunajifunza mapishi na kusikia hadithi za watu wazima.",
          "Asubuhi, tunaosha mboga, tunapanga maharagwe na kuweka meza. Watu wazima hushughulikia sufuria za moto, huku watoto wakipewa kazi salama. Bibi hueleza sababu za kuongeza kila kiungo na huturuhusu kuonja chakula kinapoiva. Kila mtu huwa na jukumu lake.",
          "Baada ya kula, tunakaa pamoja na kuzungumzia mwaka uliopita. Kila mmoja hueleza jambo lililomfurahisha na mipango yake. Wakati mwingine tunacheza mchezo au kuimba kabla ya kusafisha jikoni kwa pamoja.",
          "Desturi hii ni muhimu kwangu kwa sababu huiunganisha familia yetu. Nimejifunza kuwa desturi nzuri si lazima iwe ghali wala ngumu. Kutumia muda pamoja, kusikilizana na kusaidiana hutengeneza kumbukumbu nzuri.",
        ],
      },
      {
        title: "Kutunza Bustani ya Shule",
        prompt: "Eleza jinsi bustani ya shule inavyoweza kuwanufaisha wanafunzi na mazingira.",
        paragraphs: [
          "Bustani ya shule inaweza kupendezesha mazingira, lakini pia huwapa wanafunzi nafasi ya kujifunza ujuzi muhimu. Darasa letu lilianzisha bustani ndogo ya mboga nyuma ya chumba cha sayansi. Mwalimu alitusaidia kuchagua eneo lenye jua na akatueleza mahitaji ya udongo, maji na mipango mizuri.",
          "Tulitayarisha ardhi, tukapanda mbegu kwa mistari na kuweka lebo kwenye kila sehemu. Kila kikundi kilipewa jukumu tofauti. Baadhi ya wanafunzi walimwagilia miche, huku wengine wakipalilia na kukagua wadudu. Mimea ilipokua, mwalimu alituonyesha jinsi mizizi inavyofyonza maji na majani kutumia mwanga wa jua.",
          "Mboga zilipokomaa, tulizivuna kwa uangalifu na kupeleka baadhi jikoni. Tulitumia majani makavu kutengeneza mboji badala ya kuyatupa. Hivyo bustani ilipunguza taka na kutusaidia kuelewa chakula kinatoka wapi.",
          "Nilifurahia kuona kazi yetu ikikua kila wiki. Bustani ya shule hufundisha uwajibikaji, ushirikiano na kuheshimu mazingira. Wanafunzi wakiitunza mara kwa mara, itasaidia masomo na kutoa chakula kibichi kwa jamii ya shule.",
        ],
      },
    ],
  },
  "grade-8": {
    English: [
      {
        title: "The Day Our Class Solved a Problem",
        prompt: "Narrate how your class worked together to solve a problem at school.",
        paragraphs: [
          "At the start of the term, our class noticed that many learners arrived late after break. The queue at the drinking-water point was long, and some learners returned to class after the bell. Our teacher asked us to suggest a fair way to make the break more organised without stopping anyone from getting water.",
          "We discussed the problem in groups and listened to different ideas. One group suggested adding another container, while another proposed a simple queue system. We decided to ask the school caretaker whether a second tap could be opened. He showed us that one tap was blocked by dirt and could be cleaned safely.",
          "The caretaker repaired it, and our class made a sign reminding everyone to form two orderly lines. We took turns helping younger learners understand the system. Within a few days, the queue moved faster and fewer learners were late.",
          "The solution was simple, but it worked because we discussed the problem respectfully and included the people who could help. I learned that complaining alone does not improve a situation. Listening, sharing responsibility and following up can turn an everyday problem into a useful lesson in teamwork.",
        ],
      },
      {
        title: "An Unexpected Visitor",
        prompt: "Write a story about an unexpected visitor who taught you something.",
        paragraphs: [
          "One Saturday afternoon, I was revising at home when I heard a knock at the gate. A woman carrying a small toolbox introduced herself as a new neighbour. She had noticed that an elderly man nearby was struggling to repair a broken bicycle and wondered if anyone could help.",
          "My older sister and I went with her to see what had happened. The bicycle belonged to Mr Otieno, who used it to carry vegetables to the market. The chain had slipped off, and one brake was loose. Our visitor had repaired bicycles before, so she showed us how to hold the wheel steady while she fixed the chain.",
          "We passed her the tools and listened as she explained each step. She checked the brakes carefully before allowing Mr Otieno to test the bicycle. He thanked her and offered us some fresh fruit from his basket. Our neighbour accepted only a small piece and said that helping was enough.",
          "I had expected to spend the afternoon studying alone, but I learned a useful skill and met someone new. The visitor taught me that knowledge becomes more valuable when it is shared. I now greet her whenever we meet, and I remember her practical kindness.",
        ],
      },
      {
        title: "A School Trip to a Wildlife Sanctuary",
        prompt: "Describe a school trip that helped you understand the importance of wildlife.",
        paragraphs: [
          "Our class visited a wildlife sanctuary as part of our science and social studies lessons. Before the trip, our teacher explained the rules: we had to stay with our guide, keep a safe distance from animals and never throw food. I packed water, a notebook and a cap for the journey.",
          "At the entrance, a ranger welcomed us and explained how the sanctuary protected animals and their habitats. We saw antelopes grazing in the distance and watched birds near a wetland. The guide pointed out animal tracks in the soil and showed us how plants provided food and shelter. We spoke quietly so that we would not frighten the animals.",
          "The ranger also described the challenges wildlife faced, including litter, loss of habitat and illegal hunting. Our class asked questions about how local communities could protect the land. I was surprised to learn that keeping a wetland clean also helped people by protecting water sources.",
          "On the way back to school, I wrote down what I had observed. The visit made our lessons real and helped me understand that wildlife needs healthy habitats. I decided to avoid littering and to share what I had learned with my family.",
        ],
      },
      {
        title: "When I Learned to Manage My Time",
        prompt: "Write about a time when planning your time helped you succeed.",
        paragraphs: [
          "Last term, I had a science project, a reading assignment and a class test in the same week. At first, I thought I could complete everything the night before each deadline. I spent too long talking with friends after school, and by Wednesday I realised that I had not started my project.",
          "I felt worried, so I wrote down every task and its due date. I divided the project into smaller steps: research, notes, a diagram and a short presentation. I planned to work for thirty minutes each evening and take a short break afterwards. I also put my phone in another room so that I could concentrate.",
          "The first evening was difficult because I wanted to do something easier. However, once I finished gathering information, the next steps became clearer. I completed the project a day early, reviewed my notes for the test and still had time to read my assignment.",
          "My work was not perfect, but I felt prepared and calm. I learned that a simple timetable can prevent last-minute stress. Since then, I have tried to begin important tasks early and ask for help when I do not understand something.",
        ],
      },
      {
        title: "A Rainwater-Harvesting Project",
        prompt: "Explain how a rainwater-harvesting project can benefit a school.",
        paragraphs: [
          "Our school used to let rainwater flow from the classroom roofs into the drains. During a science lesson, our teacher asked us whether that water could be collected and used. We measured a safe space near the garden and proposed installing a covered storage tank with a gutter and a filter.",
          "The school management discussed the idea with parents and a local plumber. They explained that the tank needed a firm base, a secure lid and a tap that younger learners could use safely. The plumber showed us how a simple mesh filter could keep leaves out of the water. We helped clear the area, but adults completed the installation.",
          "When the next rain arrived, water flowed through the gutter and into the tank. We used it to water seedlings and wash the garden tools. A chart helped us record how much water was collected and remind learners to close the tap.",
          "The project did not replace all the school's water needs, but it reduced waste and gave us practical experience. It also taught us to plan carefully and follow safety advice. I hope other schools will consider collecting rainwater where it is suitable.",
        ],
      },
    ],
    Kiswahili: [
      {
        title: "Siku Darasa Letu Lilipotatua Tatizo",
        prompt: "Simulia jinsi darasa lenu lilivyoshirikiana kutatua tatizo shuleni.",
        paragraphs: [
          "Mwanzoni mwa muhula, darasa letu liligundua kuwa wanafunzi wengi walichelewa kurudi baada ya mapumziko. Foleni kwenye bomba la maji ilikuwa ndefu, na kengele ilipolia baadhi yetu tulikuwa bado tunasubiri. Mwalimu alituomba tutafute njia ya kufanya mapumziko yapangike vizuri bila kumzuia mtu kupata maji.",
          "Tulijadili tatizo katika vikundi na kusikiliza mawazo tofauti. Kikundi kimoja kilipendekeza kuweka chombo kingine cha maji, na kingine kikashauri foleni mbili. Tulimwomba mtunzaji achunguze kama bomba la pili lingeweza kutumika. Aligundua kuwa lilikuwa limezibwa na uchafu na angeweza kulisafisha kwa usalama.",
          "Mtunzaji alilitengeneza, kisha tukaweka bango lililowakumbusha wanafunzi kupanga mistari miwili. Tulisaidia wanafunzi wadogo kuelewa utaratibu huo. Baada ya siku chache, foleni ilisonga haraka na wanafunzi wachache walichelewa.",
          "Suluhisho lilikuwa rahisi, lakini lilifanikiwa kwa sababu tulijadiliana kwa heshima na kuwahusisha watu walioweza kusaidia. Nilijifunza kuwa kulalamika pekee hakutatui tatizo. Kusikilizana na kugawana wajibu kunaweza kutufundisha ushirikiano.",
        ],
      },
      {
        title: "Mgeni Asiyetarajiwa",
        prompt: "Andika kisa kuhusu mgeni asiyetarajiwa aliyekufundisha jambo.",
        paragraphs: [
          "Jumamosi moja alasiri, nilikuwa nikirudia masomo nyumbani niliposikia mtu akibisha langoni. Mwanamke mmoja alijitambulisha kuwa jirani mpya. Alikuwa na sanduku dogo la vifaa na akasema alikuwa amemwona mzee mmoja akijaribu kutengeneza baiskeli iliyoharibika.",
          "Dada yangu na mimi tulifuatana naye kwenda kumwona. Baiskeli hiyo ilikuwa ya Bwana Otieno, ambaye aliitumia kupeleka mboga sokoni. Mnyororo ulikuwa umetoka na breki moja ilikuwa imelegea. Jirani yetu alikuwa amewahi kutengeneza baiskeli, kwa hiyo alituonyesha jinsi ya kushikilia gurudumu huku akirudisha mnyororo.",
          "Tulimpa vifaa na kusikiliza maelezo yake. Alikagua breki vizuri kabla ya kumruhusu Bwana Otieno kuijaribu. Bwana Otieno alimshukuru na kutupatia matunda. Jirani yetu alichukua kipande kidogo tu na kusema kuwa kusaidia kulitosha.",
          "Nilitarajia kusoma peke yangu, lakini nilijifunza ujuzi mpya na kupata jirani mpya. Mgeni huyo alinifundisha kuwa maarifa huwa na thamani zaidi tunapoyashiriki. Sasa ninamsalimu kila tunapokutana.",
        ],
      },
      {
        title: "Ziara ya Shule Katika Hifadhi ya Wanyama",
        prompt: "Eleza ziara ya shule iliyokusaidia kuelewa umuhimu wa wanyama pori.",
        paragraphs: [
          "Darasa letu lilitembelea hifadhi ya wanyama kama sehemu ya masomo ya sayansi na kijamii. Kabla ya safari, mwalimu alitueleza kanuni: tulipaswa kubaki na kiongozi, kuwa mbali na wanyama na kutowapa chakula. Nilibeba maji, daftari na kofia.",
          "Mlangoni, mhifadhi alitukaribisha na kueleza jinsi hifadhi ilivyowalinda wanyama na makazi yao. Tuliona swala wakila kwa mbali na ndege karibu na ardhi oevu. Kiongozi alituonyesha nyayo kwenye udongo na kueleza jinsi mimea inavyowapa wanyama chakula na mahali pa kujificha. Tulizungumza kwa sauti ya chini ili tusiwaogopeshe.",
          "Mhifadhi alieleza changamoto zinazowakabili wanyama, kama taka, uharibifu wa makazi na uwindaji haramu. Tuliuliza jinsi jamii inavyoweza kulinda eneo hilo. Nilishangaa kujua kuwa kuhifadhi ardhi oevu safi husaidia pia kulinda vyanzo vya maji vya watu.",
          "Tulipokuwa tukirudi shuleni, niliandika mambo niliyoyaona. Ziara hiyo ilinisaidia kuelewa kuwa wanyama pori wanahitaji makazi yenye afya. Niliamua kuepuka kutupa taka ovyo na kushiriki mafunzo hayo na familia yangu.",
        ],
      },
      {
        title: "Nilipojifunza Kupanga Muda Wangu",
        prompt: "Andika kuhusu wakati ambapo kupanga muda kulikusaidia kufanikiwa.",
        paragraphs: [
          "Muhula uliopita, nilikuwa na mradi wa sayansi, kazi ya kusoma kitabu na mtihani katika wiki moja. Mwanzoni nilidhani ningekamilisha kila kitu usiku uliotangulia tarehe ya mwisho. Nilipoteza muda mwingi nikizungumza na marafiki baada ya shule, na kufikia Jumatano nilikuwa bado sijaanza mradi.",
          "Nilikuwa na wasiwasi, kwa hiyo niliandika kazi zote na tarehe zake. Niligawanya mradi katika hatua ndogo: kutafuta habari, kuandika madokezo, kuchora mchoro na kutayarisha maelezo mafupi. Nilipanga kufanya kazi kwa dakika thelathini kila jioni na kupumzika kwa muda mfupi baadaye. Pia niliweka simu chumba kingine.",
          "Jioni ya kwanza ilikuwa ngumu kwa sababu nilitaka kufanya jambo rahisi zaidi. Hata hivyo, nilipomaliza kutafuta habari, hatua zilizofuata zilikuwa wazi. Nilikamilisha mradi siku moja kabla ya muda, nikapitia madokezo ya mtihani na bado nikapata nafasi ya kusoma kitabu.",
          "Kazi yangu haikuwa kamilifu, lakini nilijihisi tayari na mtulivu. Nilijifunza kuwa ratiba rahisi huzuia wasiwasi wa dakika za mwisho. Sasa hujaribu kuanza kazi mapema na kuomba msaada nisipoelewa jambo.",
        ],
      },
      {
        title: "Mradi wa Kukusanya Maji ya Mvua",
        prompt: "Eleza jinsi mradi wa kukusanya maji ya mvua unavyoweza kuisaidia shule.",
        paragraphs: [
          "Shule yetu ilikuwa ikiruhusu maji ya mvua kutoka kwenye paa kutiririka hadi kwenye mifereji. Wakati wa somo la sayansi, mwalimu alituuliza kama maji hayo yangeweza kukusanywa na kutumiwa. Tulipima eneo salama karibu na bustani na kupendekeza tangi lenye kifuniko, mfereji na kichujio.",
          "Uongozi wa shule ulijadili wazo hilo na wazazi pamoja na fundi bomba wa eneo letu. Walieleza kuwa tangi lilihitaji msingi imara, kifuniko salama na bomba ambalo hata wanafunzi wadogo wangeweza kutumia. Fundi alituonyesha jinsi wavu unavyoweza kuzuia majani kuingia ndani. Watu wazima ndio waliokamilisha kazi ya kufunga tangi.",
          "Mvua iliyofuata ilipotokea, maji yalitiririka kwenye mfereji na kuingia tangini. Tuliyatumia kumwagilia miche na kuosha vifaa vya bustani. Tulitengeneza chati ya kurekodi maji yaliyokusanywa na kuwakumbusha wanafunzi kufunga bomba.",
          "Mradi huo haukutosheleza mahitaji yote ya shule, lakini ulipunguza upotevu wa maji na kutupa uzoefu wa vitendo. Pia ulitufundisha kupanga kwa makini na kufuata ushauri wa usalama. Natumaini shule nyingine zitafikiria kukusanya maji ya mvua panapofaa.",
        ],
      },
    ],
  },
  "grade-9": {
    English: [
      {
        title: "The Choice That Changed My Friendship",
        prompt: "Write a story about making a difficult choice that affected a friendship.",
        paragraphs: [
          "My closest friend, Kevin, and I had prepared for the same science competition. We had practised together, but on the morning of the event he told me that he had copied a diagram from another group's work. He asked me not to mention it because he was afraid of being disqualified.",
          "I felt caught between protecting my friend and being fair to the other learners. I told Kevin that we should speak to our teacher before presenting. At first, he became angry and accused me of trying to win. I explained that copying could cause bigger problems later and that we could still present our own ideas honestly.",
          "We spoke to the teacher, who listened and helped Kevin replace the copied diagram with a drawing he made himself. Our project was accepted, although we lost some preparation time. Kevin barely spoke to me that day, and I worried that our friendship was over.",
          "A week later, he thanked me for preventing him from taking credit for someone else's work. We discussed how we could give one another honest advice in future. I learned that a true friend does not simply agree with everything. Sometimes caring means speaking up respectfully, even when the conversation is difficult.",
        ],
      },
      {
        title: "A Day of Service in Our Community",
        prompt: "Describe a community service activity and reflect on its impact.",
        paragraphs: [
          "Our school organised a community service day at a nearby children's library. The building was useful, but its reading area had become untidy and several shelves needed repair. Before visiting, our teacher asked us to plan how we could help without disturbing the children who used the library.",
          "We divided into groups. Some learners sorted books by age and subject, while others wiped tables and arranged chairs. A small group worked with the librarian to label the shelves clearly. The adults repaired a loose shelf, and we carried books only after checking which ones were safe to move.",
          "In the afternoon, younger children arrived for a reading session. We took turns reading stories aloud and asking them what they thought might happen next. One girl told me she had never finished a story by herself before. She chose a short book and promised to return it the following week.",
          "The work was tiring, but the library felt more welcoming when we finished. I realised that service is most useful when we first ask what people actually need. Our visit did not solve every challenge, but it gave the children a cleaner space and reminded me that sharing time and knowledge can strengthen a community.",
        ],
      },
      {
        title: "The Storm That Tested Our Preparedness",
        prompt: "Narrate how your family or community responded to a severe storm.",
        paragraphs: [
          "The weather forecast warned that a strong storm would reach our area in the evening. My family listened to the announcement and checked the windows, roof and drainage channels. My mother charged the phone, while my father moved important documents and a torch to a safe place. We also filled clean containers with drinking water.",
          "After sunset, the rain became heavy and the wind shook the trees. We stayed indoors and kept away from the windows. Water began gathering near the gate, so my parents called a neighbour whose drain was blocked by branches. The adults cleared it from a safe position while I kept the younger children calm and followed the radio updates.",
          "The power went out for a short time, but the torch helped us move around safely. By morning, the rain had slowed. We checked on our neighbours and found that one family's fence had fallen. Several people worked together to move the broken pieces away from the path.",
          "No one was injured, and the prepared water and light were useful. The storm taught me that warnings should be taken seriously and that preparation is better than panic. It also showed how neighbours can support one another during difficult weather.",
        ],
      },
      {
        title: "How Technology Can Support Learning",
        prompt: "Write an essay explaining responsible ways learners can use technology for learning.",
        paragraphs: [
          "Digital technology can help learners find information, practise skills and communicate with teachers. A phone or computer can provide access to dictionaries, educational videos and online libraries. However, technology is most useful when learners have a clear purpose and use reliable sources.",
          "When I research a topic, I first write down the question I need to answer. I compare information from more than one trusted source and record where the facts came from. This helps me avoid copying work and notice when a website may be inaccurate. I also take breaks and keep my device away when I need to focus on reading or writing.",
          "Learners must protect their privacy online. They should not share passwords, personal details or photographs without permission. If a message or website makes them uncomfortable, they should speak to a trusted adult. Technology should support respectful communication rather than replace kindness.",
          "Used carefully, digital tools can make lessons more engaging and help learners study at their own pace. They cannot replace teachers, discussion or regular practice. By checking information, managing screen time and behaving responsibly, learners can benefit from technology while avoiding many of its risks.",
        ],
      },
      {
        title: "The Person Who Inspired Me",
        prompt: "Write about a person who has influenced you and explain what you learned from them.",
        paragraphs: [
          "The person who has influenced me most is my aunt, who works as a nurse at a local clinic. She does not talk about being important; instead, I see her preparing carefully and treating every patient with respect. When she visits our home after a long shift, she still asks how our studies are going.",
          "Last year, I accompanied her to a community health event where volunteers explained the importance of handwashing and regular check-ups. My aunt listened to people's questions without rushing them. When one child was afraid, she explained each step calmly and allowed the child's parent to stay nearby. I noticed that her knowledge mattered, but so did her patience.",
          "At home, she has taught me to plan my work and finish responsibilities before relaxing. She also admits when she does not know an answer and looks for reliable information. This has shown me that being knowledgeable does not mean pretending to be perfect.",
          "I hope to develop her honesty, discipline and care for others. I may choose a different career, but the way she serves people will continue to guide me. Her example has taught me that everyday actions can have a lasting influence.",
        ],
      },
    ],
    Kiswahili: [
      {
        title: "Uamuzi Uliobadilisha Urafiki Wangu",
        prompt: "Andika kisa kuhusu uamuzi mgumu ulioathiri urafiki wako.",
        paragraphs: [
          "Rafiki yangu wa karibu, Kevin, na mimi tulikuwa tumejiandaa kwa mashindano ya sayansi. Tulifanya mazoezi pamoja, lakini asubuhi ya mashindano aliniambia kuwa alikuwa ameinakili michoro ya kikundi kingine. Aliniomba nisitaje jambo hilo kwa sababu aliogopa kuondolewa kwenye mashindano.",
          "Nilijikuta kati ya kumlinda rafiki yangu na kutenda haki kwa wanafunzi wengine. Nilimwambia kuwa tunapaswa kuzungumza na mwalimu kabla ya kuwasilisha kazi. Mwanzoni alikasirika na kusema nilitaka kushinda. Nilimweleza kuwa kunakili kungeleta matatizo makubwa baadaye na bado tungeweza kuwasilisha mawazo yetu wenyewe kwa uaminifu.",
          "Tulizungumza na mwalimu, naye akamsaidia Kevin kubadilisha mchoro huo na kuchora wake mwenyewe. Kazi yetu ilikubaliwa ingawa tulipoteza muda wa maandalizi. Kevin hakuzungumza nami sana siku hiyo, nami nikawa na wasiwasi kuwa urafiki wetu ulikuwa umeisha.",
          "Wiki moja baadaye, alinishukuru kwa kumzuia asichukue sifa za kazi ya mtu mwingine. Tulizungumza kuhusu namna ya kushauriana kwa uaminifu siku zijazo. Nilijifunza kuwa rafiki wa kweli hakubaliani na kila jambo. Wakati mwingine kujali kunamaanisha kuzungumza kwa heshima hata mazungumzo yanapokuwa magumu.",
        ],
      },
      {
        title: "Siku ya Kutoa Huduma kwa Jamii",
        prompt: "Eleza shughuli ya huduma kwa jamii na athari yake.",
        paragraphs: [
          "Shule yetu iliandaa siku ya kutoa huduma katika maktaba ya watoto iliyo karibu. Jengo hilo lilikuwa na manufaa, lakini sehemu ya kusomea ilikuwa imechafuka na rafu kadhaa zilihitaji kupangwa. Kabla ya kwenda, mwalimu alituomba tupange namna ya kusaidia bila kuwasumbua watoto waliotumia maktaba.",
          "Tuligawanyika katika vikundi. Baadhi ya wanafunzi walipanga vitabu kulingana na umri na somo, huku wengine wakifuta meza na kupanga viti. Kikundi kidogo kilifanya kazi na msimamizi kuweka lebo zilizo wazi kwenye rafu. Watu wazima walirekebisha rafu iliyolegea.",
          "Alasiri, watoto wadogo walifika kwa kipindi cha kusoma. Tulibadilishana zamu ya kuwasomea hadithi na kuwauliza walifikiri nini kingetokea baadaye. Msichana mmoja aliniambia kuwa hakuwa amewahi kumaliza hadithi peke yake. Alichagua kitabu kifupi na kuahidi kukirudisha wiki iliyofuata.",
          "Kazi ilikuwa ya kuchosha, lakini tulipomaliza maktaba ilipendeza zaidi. Nilitambua kuwa huduma huwa na manufaa zaidi tunapouliza kwanza watu wanahitaji nini. Ziara yetu haikutatua kila tatizo, lakini iliwaachia watoto sehemu safi ya kusoma na kunikumbusha kuwa kushiriki muda na maarifa huimarisha jamii.",
        ],
      },
      {
        title: "Dhoruba Iliyojaribu Maandalizi Yetu",
        prompt: "Simulia jinsi familia au jamii yenu ilivyokabiliana na dhoruba kali.",
        paragraphs: [
          "Taarifa ya hali ya hewa ilionya kuwa dhoruba kali ingefika eneo letu jioni. Familia yangu ilisikiliza na kukagua madirisha, paa na mifereji. Mama alichaji simu, huku baba akiweka nyaraka muhimu na tochi mahali salama. Pia tulijaza vyombo safi kwa maji ya kunywa.",
          "Baada ya jua kutua, mvua ilinyesha kwa nguvu na upepo ukatikisa miti. Tulibaki ndani na kukaa mbali na madirisha. Maji yalianza kukusanyika karibu na lango, kwa hiyo wazazi wangu walimpigia simu jirani ambaye mtaro wake ulikuwa umezibwa na matawi. Watu wazima waliyatoa wakiwa mahali salama, nami niliwasaidia watoto wadogo watulie na kusikiliza taarifa za redio.",
          "Umeme ulikatika kwa muda mfupi, lakini tochi ilitusaidia kutembea kwa usalama. Asubuhi mvua ilipungua. Tulikagua hali ya majirani na kuona uzio wa familia moja ukiwa umeanguka. Watu kadhaa walishirikiana kuondoa vipande vilivyozuia njia.",
          "Hakuna aliyeumia, na maji pamoja na mwanga tuliokuwa tumejiandalia vilitusaidia. Dhoruba hiyo ilinifundisha kuchukua tahadhari kwa uzito na kuelewa kuwa maandalizi ni bora kuliko hofu. Pia ilionyesha jinsi majirani wanavyoweza kusaidiana wakati wa hali ngumu.",
        ],
      },
      {
        title: "Jinsi Teknolojia Inavyoweza Kusaidia Masomo",
        prompt: "Andika insha kuhusu njia bora za wanafunzi kutumia teknolojia kujifunza.",
        paragraphs: [
          "Teknolojia ya kidijitali inaweza kuwasaidia wanafunzi kupata habari, kufanya mazoezi na kuwasiliana na walimu. Simu au kompyuta inaweza kutoa kamusi, video za elimu na maktaba za mtandaoni. Hata hivyo, teknolojia huwa na manufaa zaidi mwanafunzi anapokuwa na lengo wazi na kutumia vyanzo vya kuaminika.",
          "Ninapotafiti mada, kwanza huandika swali ninalohitaji kujibu. Hulinganisha habari kutoka vyanzo zaidi ya kimoja na kurekodi mahali ukweli ulipotoka. Hilo hunisaidia kuepuka kunakili kazi na kutambua tovuti zisizo sahihi. Pia hupumzika na kuweka kifaa kando ninapohitaji kukaza fikira.",
          "Wanafunzi wanapaswa kulinda faragha yao wanapotumia mtandao. Hawafai kushiriki nywila, maelezo ya kibinafsi au picha bila ruhusa. Ujumbe au tovuti inapowatia wasiwasi, wanapaswa kumweleza mtu mzima wanayemwamini. Teknolojia inapaswa kutusaidia kuwasiliana kwa heshima.",
          "Zikitumiwa kwa uangalifu, vifaa vya kidijitali huifanya elimu ivutie na kuwasaidia wanafunzi kujifunza kwa mwendo wao. Haziwezi kuchukua nafasi ya walimu, majadiliano wala mazoezi. Kwa kukagua habari, kudhibiti muda wa skrini na kuwajibika, wanafunzi wanaweza kunufaika na teknolojia na kuepuka hatari zake.",
        ],
      },
      {
        title: "Mtu Aliyenitia Moyo",
        prompt: "Andika kuhusu mtu aliyekuathiri na ueleze mambo uliyojifunza kutoka kwake.",
        paragraphs: [
          "Mtu aliyeniathiri zaidi ni shangazi yangu anayefanya kazi kama muuguzi katika zahanati ya eneo letu. Hajisifu kuwa mtu muhimu; badala yake, humwona akijiandaa kwa makini na kumtendea kila mgonjwa kwa heshima. Anapotembelea nyumbani baada ya zamu ndefu, bado hutuuliza masomo yetu yanaendeleaje.",
          "Mwaka jana, nilifuatana naye kwenye shughuli ya afya ya jamii ambako wajitolea walieleza umuhimu wa kunawa mikono na kuchunguzwa afya mara kwa mara. Shangazi alisikiliza maswali ya watu bila kuwaharakisha. Mtoto mmoja alipokuwa na hofu, alimweleza kila hatua kwa utulivu na kumruhusu mzazi wake abaki karibu. Niliona kuwa maarifa yake yalikuwa muhimu, lakini uvumilivu wake pia.",
          "Nyumbani, amenifundisha kupanga kazi zangu na kutimiza wajibu kabla ya kupumzika. Pia hukiri asipojua jibu na hutafuta habari za kuaminika. Jambo hilo limenionyesha kuwa kuwa na maarifa hakumaanishi kujifanya mkamilifu.",
          "Ningependa kujifunza uaminifu, nidhamu na kujali wengine kama yeye. Huenda nikachagua kazi tofauti, lakini namna anavyowahudumia watu itaendelea kuniongoza. Mfano wake umenifundisha kuwa matendo ya kila siku yanaweza kuwa na athari ya kudumu.",
        ],
      },
    ],
  },
};

const genreCompositions: Record<
  string,
  Record<Language, JuniorComposition[]>
> = {
  "grade-7": {
    English: [
      {
        title: "Speech: Keeping Our School Clean",
        writingType: "Speech",
        prompt: "Write a short speech to your school assembly about keeping the school clean.",
        paragraphs: [
          "Good morning, respected head teacher, teachers and fellow learners.",
          "I am here to speak about keeping our school clean. A clean school is a healthy and welcoming place where we can learn well. When we throw litter on the ground, it can block drains, attract pests and make our compound unpleasant.",
          "Each of us can help. We should put rubbish in the correct bins, keep our classrooms tidy and avoid wasting water. If we see a full bin or a broken tap, we should report it to a teacher or the caretaker. We can also take turns caring for our gardens and picking up litter safely.",
          "Let us remember that cleanliness is everyone's responsibility. Small actions, repeated every day, can make our school a better place. I encourage each learner to begin with their own habits.",
          "Thank you for listening.",
        ],
      },
      {
        title: "Letter to My Cousin About My New School",
        writingType: "Informal letter",
        prompt: "Write a letter to your cousin telling them about your new school.",
        paragraphs: [
          "12 October 2026\nNairobi",
          "Dear Amina,",
          "How are you and everyone at home? I hope you are well. I am writing to tell you about my new junior school. I was nervous on my first day because I did not know anyone, but the teachers welcomed me warmly.",
          "My class teacher introduced me to the learners, and I have already made two friends. The science room is interesting, and I enjoy reading in the library during break. We also have a timetable that helps us prepare for each lesson. I am learning to organise my books the night before school.",
          "I miss spending time with you, so I hope you can visit during the next holiday. Please write back and tell me how your term is going.",
          "Your cousin,\nMaya",
        ],
      },
    ],
    Kiswahili: [
      {
        title: "Hotuba: Usafi wa Shule Yetu",
        writingType: "Hotuba",
        prompt: "Andika hotuba utakayotoa kwenye mkutano wa shule kuhusu kudumisha usafi.",
        paragraphs: [
          "Mwalimu mkuu, walimu na wanafunzi wenzangu, hamjambo?",
          "Nimesimama mbele yenu kuzungumzia umuhimu wa kudumisha usafi shuleni. Shule safi huwa mahali pazuri pa kusomea na hutusaidia kulinda afya zetu. Taka zinapotupwa ovyo zinaweza kuziba mifereji, kuvutia wadudu na kufanya mazingira yetu yachafuke.",
          "Kila mmoja wetu ana wajibu wa kusaidia. Tuweke taka kwenye mapipa yanayofaa, tufagie madarasa yetu na tuepuke kupoteza maji. Tukiona bomba linavuja au pipa limejaa, tumjulishe mwalimu au mtunzaji. Pia tunaweza kushirikiana kutunza bustani za shule.",
          "Wanafunzi wenzangu, usafi si kazi ya mtu mmoja. Tukianza na tabia zetu na kushirikiana kila siku, shule yetu itakuwa bora zaidi. Nawahimiza nyote tushiriki katika kuitunza.",
          "Asanteni kwa kunisikiliza.",
        ],
      },
      {
        title: "Barua kwa Binamu Yangu Kuhusu Shule Mpya",
        writingType: "Barua ya kirafiki",
        prompt: "Mwandikie binamu yako barua ukimweleza kuhusu shule yako mpya.",
        paragraphs: [
          "12 Oktoba 2026\nNairobi",
          "Mpendwa Amina,",
          "Habari yako na watu wa nyumbani? Natumaini mnaendelea vizuri. Nakuandikia barua hii kukueleza kuhusu shule yangu mpya. Siku ya kwanza nilikuwa na wasiwasi kwa sababu sikumjua mtu yeyote, lakini walimu walinipokea vizuri.",
          "Mwalimu wa darasa alinitambulisha kwa wanafunzi wenzangu, nami nimepata marafiki wawili. Chumba cha sayansi kinavutia na ninafurahia kusoma maktabani wakati wa mapumziko. Ratiba yetu hunisaidia kujiandaa kwa kila somo. Pia ninajifunza kupanga vitabu vyangu usiku kabla ya kwenda shuleni.",
          "Ninakukosa, kwa hiyo natumaini utakuja kututembelea wakati wa likizo ijayo. Tafadhali nijibu na uniambie muhula wako unaendeleaje.",
          "Binamu yako,\nMaya",
        ],
      },
    ],
  },
  "grade-8": {
    English: [
      {
        title: "Speech: Every Learner Can Help Save Water",
        writingType: "Speech",
        prompt: "Prepare a speech for your school assembly on saving water.",
        paragraphs: [
          "Good morning, head teacher, teachers and fellow learners.",
          "Today I would like to speak about saving water. We use water to drink, cook, clean and grow food. Yet some communities experience shortages, especially during dry seasons. We should not waste a resource that people, animals and plants all need.",
          "At school, we can close taps properly and report leaks as soon as we notice them. We can use a basin instead of leaving water running when washing equipment. Where it is safe, rainwater can be collected for watering gardens. At home, we can take only the water we need and reuse suitable water on plants.",
          "Saving water does not require one person to make a huge change. It requires many people to make careful choices every day. Let us check our habits and encourage our families to do the same.",
          "Thank you for your attention.",
        ],
      },
      {
        title: "Letter to the Head Teacher About the Library",
        writingType: "Formal letter",
        prompt: "Write a formal letter to your head teacher suggesting ways to improve the school library.",
        paragraphs: [
          "12 October 2026\nGrade 8\nCompetenceHub Junior School",
          "The Head Teacher\nCompetenceHub Junior School",
          "Dear Sir/Madam,",
          "RE: SUGGESTIONS FOR IMPROVING THE SCHOOL LIBRARY",
          "I am writing on behalf of several Grade 8 learners to suggest a few ways of making our library more useful. Many learners enjoy reading there, but some shelves are difficult to follow and the room becomes noisy during break time.",
          "We kindly request clear labels for the shelves and a simple borrowing record that learners can understand. A weekly quiet-reading period could also give each class a chance to use the library. If possible, learners could donate clean books that are still in good condition.",
          "We would be pleased to help arrange the books under the librarian's guidance. Thank you for considering our suggestions. We hope they will encourage more learners to read.",
          "Yours faithfully,\nMaya Achieng\nGrade 8 Class Representative",
        ],
      },
    ],
    Kiswahili: [
      {
        title: "Hotuba: Kila Mwanafunzi Anaweza Kuhifadhi Maji",
        writingType: "Hotuba",
        prompt: "Andaa hotuba ya mkutano wa shule kuhusu kuhifadhi maji.",
        paragraphs: [
          "Mwalimu mkuu, walimu na wanafunzi wenzangu, hamjambo?",
          "Leo ningependa kuzungumzia kuhifadhi maji. Tunatumia maji kunywa, kupika, kusafisha na kukuza mimea. Hata hivyo, jamii nyingine hukumbwa na uhaba wa maji, hasa wakati wa kiangazi. Hatupaswi kupoteza rasilimali ambayo watu, wanyama na mimea wanaihitaji.",
          "Shuleni tunaweza kufunga mabomba vizuri na kuripoti yanayovuja. Tunaweza kutumia beseni badala ya kuacha maji yakitiririka tunapoosha vifaa. Mahali panapofaa, tunaweza kukusanya maji ya mvua kwa ajili ya bustani. Nyumbani, tutumie kiasi tunachohitaji na kutumia tena maji yanayofaa kumwagilia mimea.",
          "Kuhifadhi maji hakuhitaji mtu mmoja kufanya jambo kubwa sana. Kunahitaji watu wengi kufanya maamuzi ya busara kila siku. Tuchunguze tabia zetu na kuzihimiza familia zetu kufanya vivyo hivyo.",
          "Asanteni kwa kunisikiliza.",
        ],
      },
      {
        title: "Barua Rasmi kwa Mkuu wa Shule Kuhusu Maktaba",
        writingType: "Barua rasmi",
        prompt: "Mwandikie mkuu wa shule barua rasmi ukipendekeza namna ya kuboresha maktaba.",
        paragraphs: [
          "12 Oktoba 2026\nDarasa la Nane\nShule ya Vijana ya CompetenceHub",
          "Mkuu wa Shule\nShule ya Vijana ya CompetenceHub",
          "Ndugu Mkuu wa Shule,",
          "YAH: MAPENDEKEZO YA KUBORESHA MAKTABA YA SHULE",
          "Ninakuandikia kwa niaba ya wanafunzi kadhaa wa Darasa la Nane kutoa mapendekezo ya kuifanya maktaba yetu iwe na manufaa zaidi. Wanafunzi wengi hupenda kusoma humo, lakini baadhi ya rafu ni vigumu kufuata na chumba huwa na kelele wakati wa mapumziko.",
          "Tunaomba lebo zilizo wazi ziwekwe kwenye rafu na daftari rahisi la kuandika vitabu vinavyoazimwa. Kipindi cha kusoma kwa utulivu kila wiki kingewezesha kila darasa kutumia maktaba. Ikiwezekana, wanafunzi wanaweza kuchangia vitabu safi vilivyo katika hali nzuri.",
          "Tungefurahi kusaidia kupanga vitabu chini ya mwongozo wa msimamizi wa maktaba. Asante kwa kuyazingatia mapendekezo yetu. Tunatumaini yatawahimiza wanafunzi wengi zaidi kusoma.",
          "Wako mwaminifu,\nMaya Achieng\nMwakilishi wa Darasa la Nane",
        ],
      },
    ],
  },
  "grade-9": {
    English: [
      {
        title: "Speech: Young People Can Protect the Environment",
        writingType: "Speech",
        prompt: "Write a speech for a youth meeting explaining how young people can protect the environment.",
        paragraphs: [
          "Good afternoon, community leaders, teachers and fellow young people.",
          "I am grateful for the opportunity to speak about protecting our environment. The land, water, trees and wildlife around us support our health and livelihoods. When we litter, waste water or destroy habitats, the effects reach our whole community.",
          "Young people can begin with practical actions. We can sort waste, avoid unnecessary plastic and keep drains clear. We can plant indigenous trees and care for them until they are established. At school, we can start an environmental club that checks the compound, shares reliable information and works with adults on safe projects.",
          "We should also listen to people who understand local challenges. A project is more successful when residents help plan it and take responsibility for maintaining it. We do not have to wait until we are older to contribute; we can act responsibly now and invite others to join us.",
          "Let us protect the places that future generations will depend on. Thank you for listening.",
        ],
      },
      {
        title: "Formal Letter Requesting an Environmental Club",
        writingType: "Formal letter",
        prompt: "Write a formal letter to your head teacher requesting permission to start an environmental club.",
        paragraphs: [
          "12 October 2026\nGrade 9\nCompetenceHub Junior School",
          "The Head Teacher\nCompetenceHub Junior School",
          "Dear Sir/Madam,",
          "RE: REQUEST TO ESTABLISH A SCHOOL ENVIRONMENTAL CLUB",
          "I am writing to request permission to establish an environmental club for interested learners. Several of us would like to help keep the school compound clean, care for indigenous trees and learn responsible ways to manage waste.",
          "The club could meet twice a month under the guidance of a teacher. Our proposed activities include checking that litter is placed in the correct bins, recording which seedlings need care and preparing short information displays. We would seek approval before organising any activity and would follow the school's safety rules.",
          "We believe the club would support practical learning and encourage learners to take responsibility for their surroundings. I would be grateful if you considered our request. We are ready to discuss the plan and make any changes you recommend.",
          "Yours faithfully,\nMaya Achieng\nGrade 9 Learner",
        ],
      },
    ],
    Kiswahili: [
      {
        title: "Hotuba: Vijana Wanaweza Kulinda Mazingira",
        writingType: "Hotuba",
        prompt: "Andika hotuba ya mkutano wa vijana ukieleza jinsi vijana wanavyoweza kulinda mazingira.",
        paragraphs: [
          "Viongozi wa jamii, walimu na vijana wenzangu, hamjambo?",
          "Nashukuru kwa nafasi hii ya kuzungumzia kulinda mazingira. Ardhi, maji, miti na wanyama hutegemeza afya na maisha yetu. Tunapotupa taka ovyo, kupoteza maji au kuharibu makazi ya viumbe, madhara huikumba jamii nzima.",
          "Vijana wanaweza kuanza kwa hatua zinazowezekana. Tunaweza kutenganisha taka, kuepuka plastiki isiyo ya lazima na kuweka mifereji wazi. Tunaweza kupanda miti ya asili na kuitunza hadi iimarike. Shuleni, tunaweza kuanzisha klabu ya mazingira itakayokagua usafi, kutoa habari sahihi na kushirikiana na watu wazima katika miradi salama.",
          "Tunapaswa pia kuwasikiliza watu wanaofahamu changamoto za eneo letu. Mradi hufanikiwa zaidi wakazi wanaposhiriki kupanga na kuutunza. Hatuhitaji kusubiri hadi tuwe watu wazima ili kuchangia; tunaweza kuwajibika sasa na kuwaalika wengine washiriki.",
          "Tuyalinde mazingira ambayo vizazi vijavyo vitayahitaji. Asanteni kwa kunisikiliza.",
        ],
      },
      {
        title: "Barua Rasmi ya Kuomba Klabu ya Mazingira",
        writingType: "Barua rasmi",
        prompt: "Mwandikie mkuu wa shule barua rasmi ukiomba ruhusa ya kuanzisha klabu ya mazingira.",
        paragraphs: [
          "12 Oktoba 2026\nDarasa la Tisa\nShule ya Vijana ya CompetenceHub",
          "Mkuu wa Shule\nShule ya Vijana ya CompetenceHub",
          "Ndugu Mkuu wa Shule,",
          "YAH: OMBI LA KUANZISHA KLABU YA MAZINGIRA SHULENI",
          "Ninakuandikia kuomba ruhusa ya kuanzisha klabu ya mazingira kwa wanafunzi wanaopenda kushiriki. Baadhi yetu tungependa kusaidia kudumisha usafi wa shule, kutunza miti ya asili na kujifunza njia bora za kudhibiti taka.",
          "Klabu inaweza kukutana mara mbili kwa mwezi chini ya mwongozo wa mwalimu. Shughuli zinazopendekezwa ni kukagua kama taka zimewekwa kwenye mapipa yanayofaa, kuandika miche inayohitaji kutunzwa na kuandaa mabango mafupi ya elimu. Tutaomba idhini kabla ya kupanga shughuli yoyote na tutafuata kanuni za usalama za shule.",
          "Tunaamini klabu hii itasaidia masomo ya vitendo na kuwahimiza wanafunzi kuwajibika kwa mazingira yao. Nitashukuru ukizingatia ombi letu. Tuko tayari kujadili mpango huu na kufanya marekebisho utakayopendekeza.",
          "Wako mwaminifu,\nMaya Achieng\nMwanafunzi wa Darasa la Tisa",
        ],
      },
    ],
  },
};

const replacedTitles: Record<string, Record<Language, string[]>> = {
  "grade-7": {
    English: ["A Helpful Neighbour", "Keeping Our School Clean"],
    Kiswahili: ["Kumsaidia Jirani", "Usafi wa Shule Yetu"],
  },
  "grade-8": {
    English: ["Saving Water in Our Community", "The Importance of Reading"],
    Kiswahili: ["Kuhifadhi Maji Katika Jamii Yetu", "Umuhimu wa Kusoma"],
  },
  "grade-9": {
    English: ["Protecting the Environment for the Future", "The Person Who Inspired Me"],
    Kiswahili: ["Kulinda Mazingira kwa Ajili ya Kesho", "Mtu Aliyenitia Moyo"],
  },
};

const continuationPrompts: Record<string, { openingPhrase: string; prompt: string }> = {
  "The Day It Rained Heavily": {
    openingPhrase: "I had planned to visit my cousin on Saturday.",
    prompt: "Continue the story from this opening sentence.",
  },
  "Mvua Kubwa Iliponyesha": {
    openingPhrase: "Jumapili moja nilipanga kumtembelea binamu yangu.",
    prompt: "Endeleza kisa kuanzia sentensi hii ya mwanzo.",
  },
  "The Journey I Will Always Remember": {
    openingPhrase: "During the August holiday, my family travelled to visit my aunt in Nakuru.",
    prompt: "Continue the story from this opening sentence.",
  },
  "Safari Nisiyoweza Kuisahau": {
    openingPhrase: "Wakati wa likizo ya Agosti, familia yangu ilisafiri kwenda Nakuru kumtembelea shangazi.",
    prompt: "Endeleza kisa kuanzia sentensi hii ya mwanzo.",
  },
  "The Day I Returned a Lost Wallet": {
    openingPhrase: "I was walking home from the library when I noticed a brown wallet beside a bus stop.",
    prompt: "Continue the story from this opening sentence.",
  },
  "Siku Niliporudisha Pochi Iliyopotea": {
    openingPhrase: "Nilikuwa nikirudi nyumbani kutoka maktaba nilipoona pochi ya kahawia kando ya kituo cha basi.",
    prompt: "Endeleza kisa kuanzia sentensi hii ya mwanzo.",
  },
};

const finalParagraphs: Record<string, string> = {
  "Siku Yangu ya Kwanza katika Shule ya Upili ya Vijana": "Jioni hiyo, niliweka sare yangu na vitabu mahali nilipoweza kuvipata kwa urahisi. Mama alinishauri niendelee kuwa mwenye bidii na kuuliza maswali ninapohitaji msaada. Nilishukuru kwa mwanzo huo mzuri na niliamua kuwakaribisha wanafunzi wapya siku nyingine kama nilivyokaribishwa.",
  "Kumsaidia Jirani": "Tukio hilo lilinifanya nifikirie jinsi tunavyoweza kuimarisha ujirani wetu. Kusalimiana, kusikilizana na kusaidiana katika kazi salama hujenga uaminifu. Nilipomwona Babu Juma siku iliyofuata, nilimsalimia na kumuuliza hali yake. Alitabasamu, nami nikafurahi kuona kuwa urafiki wetu ulikuwa umeanza.",
  "Kupanda Miti Shuleni": "Mwalimu alitushauri tuandike kwenye daftari jinsi miche ilivyobadilika kila wiki. Tulirekodi urefu wake na kutaja majani mapya tuliyoona. Daftari hilo lilitusaidia kufuatilia maendeleo na kutambua mche ulipohitaji maji zaidi. Nilijivunia kushiriki katika mradi uliounganisha sayansi na utunzaji wa mazingira.",
  "Mvua Kubwa Iliponyesha": "Tulipoona kuwa hali ilikuwa salama, tulikagua watoto na wazee katika nyumba zilizo karibu. Jirani mmoja alitushukuru kwa kumsaidia kuondoa matawi kwenye njia. Nilielewa kuwa wakati wa dharura, ni muhimu kufuata maelekezo ya watu wazima na kuwajulisha wengine kuhusu hatari bila kujihatarisha.",
  "Usafi wa Shule Yetu": "Mwalimu alitushauri tuanze na tabia zetu wenyewe badala ya kulaumu wengine. Nilianza kubeba chupa yangu inayoweza kutumiwa tena na kukusanya karatasi zilizokuwa karibu na dawati langu. Rafiki zangu walipoona mfano huo, baadhi yao pia walifanya hivyo. Hatua hizo ndogo ziliifanya kazi yetu iwe rahisi na shule ikaendelea kuwa safi.",
  "Funzo Kuhusu Uaminifu": "Baada ya tukio hilo, mwalimu alitumia nafasi hiyo kuzungumza kuhusu kutunza vifaa vya darasa. Tulikubaliana kurudisha vitabu mahali pake na kutembea kwa uangalifu karibu na mapambo. Sasa ninapokosea, nakumbuka kuwa kukiri mapema husaidia kutafuta suluhisho na kuzuia mtu mwingine asipate lawama zisizomhusu.",
  "Umuhimu wa Kusoma": "Ninapomaliza kitabu, huandika kichwa chake na jambo moja jipya nililojifunza. Baada ya miezi kadhaa, daftari hilo limejaa majina ya vitabu tofauti. Linaonyesha jinsi nilivyoendelea kutoka hadithi fupi hadi vitabu virefu zaidi. Kusoma kwa utaratibu kumenipa ujasiri wa kuchunguza mada ambazo sikuzijua hapo awali.",
  "A Visit to the Local Market": "Nilipofika nyumbani, nilimsaidia shangazi kupanga vyakula kwenye vikapu tofauti. Tulitenganisha mboga zilizohitaji kutumiwa mapema na zile ambazo zingedumu kwa muda. Nilimweleza kuhusu mkulima niliyekutana naye, naye akasema kuwa ni vizuri kujua mahali chakula kinapotoka. Ziara hiyo ilinifanya niheshimu zaidi kazi ya watu wa sokoni.",
  "The Lost Calf": "Tulipofika zizini, mjomba aliandika kwenye daftari saa ambayo ndama alikuwa amerudi. Alisema taarifa hiyo ingemsaidia kutambua kama mnyama mwingine angepotea tena. Tulimpa ndama maji na kuhakikisha amepumzika. Nilipoondoka shambani, nilifurahi kuwa tulikuwa tumetumia kumbukumbu na ushirikiano kutatua tatizo.",
  "My Favourite Family Tradition": "Mwaka huu, nilipendekeza tuongeze shughuli ya kila mmoja kumshukuru mwanafamilia aliyemsaidia. Kila mtu alitaja jambo alilothamini, na tulicheka tulipokumbuka matukio ya zamani. Bibi alisema kuwa desturi hudumu watu wanaposhiriki kwa furaha. Nilielewa kwa nini siku hii imeendelea kuwa muhimu kwa familia yetu.",
  "Why We Should Care for School Gardens": "Mwaka uliofuata, wanafunzi wadogo walituuliza jinsi ya kuanza bustani yao. Tulionyesha namna ya kuweka mbegu kwenye mistari na kueleza kwa nini miche inahitaji kumwagiliwa kwa uangalifu. Niliwaambia pia kuwa mimea mingine hukua polepole, kwa hiyo hawakupaswa kukata tamaa. Bustani ilitufundisha kuwa matokeo mazuri huhitaji muda na uangalizi.",
  "Kitabu cha Maktaba Kilichopotea": "Baadaye, Peter aliniambia kuwa kitabu hicho kilikuwa na hadithi aliyopenda sana na alikuwa amehofia kulipia gharama ya kukipoteza. Tulikiweka kwenye rafu yake na kuandika jina lake kwenye daftari la maktaba. Nilifurahi kwamba nilikuwa nimechukua hatua sahihi. Tangu wakati huo, mimi hupeleka mara moja vitu ninavyopata kwa mwalimu au msimamizi.",
  "Ziara Sokoni": "Tuliporudi nyumbani, shangazi alinieleza jinsi alivyohesabu gharama ya bidhaa ili asitumie pesa nyingi. Nilimsaidia kupanga mboga kulingana na muda ambao zingedumu. Nilielewa kuwa soko ni mahali pa biashara, lakini pia ni mahali ambapo watu hushirikiana na kujifunza kuhusu chakula. Nilifurahia kuwa sehemu ya shughuli hiyo ya kawaida. Nilianza pia kutambua kuwa kupanga mapema hutusaidia kununua kiasi kinachofaa na kupunguza chakula kinachoweza kuharibika. Siku iliyofuata, nilimweleza rafiki yangu kuhusu ziara hiyo na mambo niliyojifunza.",
  "Ndama Aliyepotea": "Tulipomrudisha ndama, tuliangalia tena uzio wote ili kuhakikisha kuwa hakukuwa na sehemu nyingine iliyoharibika. Mjomba aliniambia ni muhimu kuzuia tatizo lisijirudie badala ya kulitatua mara moja tu. Nilimsaidia kuweka alama kwenye eneo lililohitaji matengenezo. Tangu siku hiyo, mimi hukagua wanyama kwa makini tunapowarudisha zizini. Asubuhi iliyofuata, nilimwona ndama akila karibu na mama yake. Nilifurahi kuwa alikuwa ametulia. Mjomba alinitaka niendelee kuwa makini na kuwajulisha watu wazima ninapoona hatari shambani.",
  "Desturi Ninayoipenda ya Familia Yetu": "Mwaka huu, nilisaidia kuandaa meza na kumfundisha binamu yangu mdogo kukunja leso. Alifurahi alipoweza kufanya hivyo mwenyewe. Niliona kuwa desturi hiyo hutupa nafasi ya kujifunza kutoka kwa wengine na kupitisha ujuzi kwa watoto wadogo. Ninatumaini tutaendelea kukutana na kuunda kumbukumbu mpya kila mwaka. Binamu yangu aliniomba nimfundishe mapishi ya bibi wakati mwingine. Niliahidi kumsaidia kwa sababu kushiriki ujuzi wetu ni sehemu nzuri ya desturi hiyo.",
  "Kutunza Bustani ya Shule": "Tulipomaliza kuvuna, mwalimu alitusaidia kuhesabu kiasi cha mboga tulichopata na kukilinganisha na idadi ya miche tuliyopanda. Tulijadili kilichofanikiwa na mambo ambayo tungebadilisha msimu ujao. Kila mwanafunzi alitoa wazo moja. Nilijifunza kuwa kutathmini kazi yetu hutusaidia kupanga vizuri zaidi na kufanya bustani iwe na manufaa kwa muda mrefu. Mwalimu alituhimiza kuendelea kutunza bustani hata wakati wa likizo.",
  "The Day Our Class Solved a Problem": "At the end of the month, we asked the caretaker whether the new arrangement was still working. He said that the second tap was flowing well and that learners were returning to class on time. Our teacher thanked the class for checking the result instead of assuming the problem had disappeared. I learned that a good solution includes listening, action and follow-up.",
  "A School Trip to a Wildlife Sanctuary": "When we returned, our class made a poster showing ways to protect wildlife. We included reminders not to litter, to respect protected areas and to report injured animals to trained adults. The ranger later visited our school and answered more questions. The trip continued to influence our lessons because we could connect what we read in class with the animals and habitats we had observed.",
  "When I Learned to Manage My Time": "I still use the timetable when several deadlines are close together. I review it each Sunday and change it if an unexpected responsibility appears. Planning does not mean that every minute must be busy; it helps me leave time for rest as well as study. I have become more dependable because I know what needs to be done and when I should begin.",
  "A Rainwater-Harvesting Project": "At the end of the rainy season, we checked the tank and cleaned the filter with the caretaker's guidance. We also made sure that the lid remained closed so that the water stayed clean and children could not fall inside. The project taught us that collecting water is useful only when it is maintained safely. We planned to inspect the system regularly in future.",
  "How Technology Can Support Learning": "My class has agreed to use devices during study periods only for the task our teacher has set. We discuss our findings with one another instead of forwarding information without checking it. This routine has helped us stay focused and learn from different sources. Technology works best when it is combined with curiosity, careful thinking and guidance from a responsible adult.",
  "The Person Who Inspired Me": "I once asked my aunt how she kept working carefully when she was tired. She said that she focused on the person in front of her and asked colleagues for help when necessary. Her answer reminded me that caring for others does not mean ignoring one's own limits. I admire her not because she never feels tired, but because she remains thoughtful and responsible.",
  "Siku Darasa Letu Lilipotatua Tatizo": "Mwalimu wetu alitusifu kwa kukagua kama mpango ulikuwa ukifanya kazi. Nilielewa kuwa suluhisho zuri huhitaji pia ufuatiliaji ili kuhakikisha linasaidia kila mtu. Tangu wakati huo, ninapokutana na tatizo la pamoja, hujaribu kusikiliza maoni tofauti na kufikiria hatua ambayo tunaweza kuifuatilia. Tuliporudi darasani, tulikubaliana kuendelea kuzingatia muda wa mapumziko na kuwaacha wanafunzi wote wapate maji. Kila mmoja alijivunia mchango wake, na ushirikiano wetu ulithaminiwa. Mwalimu alitusifu mbele ya wanafunzi wengine.",
  "Mgeni Asiyetarajiwa": "Niliporudi nyumbani, nilimweleza baba kuhusu ukarabati na namna jirani alivyotuelekeza. Alifurahi kuwa tulikuwa tumejifunza kwa kumtazama mtu mwenye uzoefu na kufanya kazi kwa usalama. Jioni hiyo, nilimshukuru jirani yetu kwa kutufundisha. Nilielewa kuwa kuuliza maswali na kushirikiana hutusaidia kupata ujuzi mpya. Wiki iliyofuata, jirani alituonyesha namna ya kutunza vifaa ili vidumu kwa muda mrefu. Nilijaribu kumsaidia, nami nikazidi kuelewa hatua alizotumia.",
  "Uamuzi Uliobadilisha Urafiki Wangu": "Baadaye, Kevin aliniomba tuanze kupanga mradi wetu wa pili mapema. Tulikubaliana kugawana kazi na kuandika wazi ni nani aliyefanya kila sehemu. Tulipowasilisha kazi hiyo, tulitaja vyanzo tulivyotumia na kujibu maswali kwa uaminifu. Urafiki wetu uliimarika kwa sababu tulikuwa tumejifunza kuaminiana na kuzungumza wazi. Nilifurahi kuwa tulitatua tofauti yetu bila kuacha urafiki wetu.",
  "Siku ya Kutoa Huduma kwa Jamii": "Msimamizi wa maktaba alitualika kurudi mwezi uliofuata. Tulifurahi kuona vitabu vilipangwa vizuri na watoto wakisoma kwa utulivu. Msichana niliyekutana naye aliniambia kuwa alikuwa amemaliza kitabu chake cha kwanza. Nilijivunia maendeleo yake. Ziara hiyo ilinifundisha kuwa huduma yenye maana huendelea hata baada ya siku ya shughuli kuisha.",
  "Dhoruba Iliyojaribu Maandalizi Yetu": "Siku chache baadaye, viongozi wa eneo hilo walitukumbusha kuacha mifereji wazi na kutoruhusu watoto kucheza karibu na maji yanayotiririka. Familia yetu ilibadilisha mahali pa kuhifadhi tochi ili ipatikane haraka. Nilijifunza kuwa maandalizi si tendo la mara moja. Kukagua mahitaji na kushirikiana na majirani hutusaidia kupunguza madhara ya dhoruba nyingine.",
  "Jinsi Teknolojia Inavyoweza Kusaidia Masomo": "Mwalimu wetu hutukumbusha kuwa si kila jambo linalochapishwa mtandaoni ni la kweli. Kwa hiyo, tunakagua tarehe ya taarifa, mwandishi na chanzo kabla ya kuitumia katika kazi. Nikikuta ujumbe unaotaka maelezo yangu ya siri, sitaujibu na nitamweleza mtu mzima ninayemwamini. Tabia hizo hunisaidia kutumia vifaa kwa busara na usalama.",
  "Mtu Aliyenitia Moyo": "Shangazi yangu hanilazimishi kufuata njia yake, lakini huniuliza ninataka kusaidia watu kwa namna gani. Swali hilo limenifanya nitafakari kuhusu vipaji na malengo yangu. Nimeanza kujitolea kuwasaidia wanafunzi wadogo wanapokuwa na ugumu wa kusoma. Kila mara ninapofanya hivyo, nakumbuka kuwa mfano mzuri unaweza kumtia mtu mwingine moyo.",
};

export function getJuniorCompositions(
  gradeId: string,
  subject: string,
): JuniorComposition[] | undefined {
  if (subject !== "English" && subject !== "Kiswahili") {
    return undefined;
  }

  const gradeCompositions = compositions[gradeId]?.[subject];
  const newCompositions = additionalCompositions[gradeId]?.[subject];
  const genreSamples = genreCompositions[gradeId]?.[subject];
  const titlesToReplace = replacedTitles[gradeId]?.[subject];
  if (!gradeCompositions || !newCompositions || !genreSamples || !titlesToReplace) {
    return undefined;
  }

  const regularSamples = [
    ...gradeCompositions.map((composition) => ({
      ...composition,
      paragraphs: [
        ...composition.paragraphs,
        ...(continuations[composition.title] ?? []),
        ...(finalParagraphs[composition.title]
          ? [finalParagraphs[composition.title]]
          : []),
      ],
    })),
    ...newCompositions.map((composition) => ({
      ...composition,
      paragraphs: [
        ...composition.paragraphs,
        ...(finalParagraphs[composition.title]
          ? [finalParagraphs[composition.title]]
          : []),
      ],
    })),
  ];

  return [
    ...regularSamples
      .filter((composition) => !titlesToReplace.includes(composition.title))
      .map((composition) => {
        const continuation = continuationPrompts[composition.title];
        const paragraphs = [...composition.paragraphs];
        if (continuation && paragraphs[0].startsWith(continuation.openingPhrase)) {
          paragraphs[0] = paragraphs[0]
            .slice(continuation.openingPhrase.length)
            .trim();
        }

        return {
          ...composition,
          prompt: continuation?.prompt ?? composition.prompt,
          openingPhrase: continuation?.openingPhrase,
          writingType: continuation
            ? subject === "English" ? "Story continuation" : "Kuendeleza kisa"
            : getWritingType(composition.prompt, subject),
          paragraphs,
        };
      }),
    ...genreSamples,
  ];
}

function getWritingType(prompt: string, subject: Language): string {
  if (subject === "English") {
    if (/^write a story|^narrate/i.test(prompt)) return "Narrative composition";
    if (/^describe/i.test(prompt)) return "Descriptive composition";
    if (/^explain|^write an essay/i.test(prompt)) return "Informative composition";
    return "Personal composition";
  }

  if (/^simulia|^andika kisa/i.test(prompt)) return "Insha ya masimulizi";
  if (/^eleza/i.test(prompt)) return "Insha ya maelezo";
  if (/^andika insha/i.test(prompt)) return "Insha ya hoja";
  return "Insha ya masimulizi";
}
