import type { JuniorComposition } from "./junior-compositions";

type Language = "English" | "Kiswahili";

const upperPrimaryCompositions: Record<
  string,
  Record<Language, JuniorComposition[]>
> = {
  "grade-4": {
    English: [
      {
        title: "The Day We Cleaned Our School",
        prompt: "Write a story about a time your class worked together to improve the school.",
        writingType: "Narrative",
        paragraphs: [
          "On Friday morning, our teacher asked us to help clean the school compound. We put on our gloves and listened carefully to the safety rules. I joined a group with my friends Amina and Brian.",
          "We collected papers and put them in a bin. Another group swept the classroom, while the gardening group watered the flowers. We worked together and finished before lunch.",
          "Our school looked neat and bright. I felt proud of our work. I learned that teamwork can make a big task easier.",
        ],
      },
      {
        title: "A Visit to the Market",
        prompt: "Describe what you saw, heard and did during a visit to a local market.",
        writingType: "Descriptive",
        paragraphs: [
          "Last Saturday, I went to the market with my aunt. The place was busy and colourful. Stalls were filled with tomatoes, bananas, green vegetables and baskets.",
          "I heard sellers calling to customers and people greeting one another. The smell of fresh fruit filled the air. My aunt showed me how to choose ripe mangoes. We bought some vegetables and greeted a friendly farmer.",
          "On our way home, I carried a small bag. I enjoyed seeing the different foods and meeting people. The market was a lively place.",
        ],
      },
      {
        title: "An Invitation to Our School Day",
        prompt: "Write a friendly letter inviting a cousin to your school's sports day.",
        writingType: "Friendly letter",
        paragraphs: [
          "P.O. Box 24,\nKisumu.\n12 June 2026.",
          "Dear Nia,\n\nHow are you? I am well and I hope you are too. I am writing to invite you to our school sports day on Friday, 19 June. It will begin at nine o'clock in the morning.",
          "There will be running races, songs and a football match. Please come with a hat and a bottle of water. I will be happy to see you. Give my greetings to everyone at home.\n\nYour cousin,\nAkinyi",
        ],
      },
    ],
    Kiswahili: [
      {
        title: "Siku Tuliyosafisha Shule",
        prompt: "Andika kisa kuhusu siku ambayo darasa lenu lilifanya kazi pamoja kuboresha shule.",
        writingType: "Kisa",
        paragraphs: [
          "Ijumaa asubuhi, mwalimu wetu alituomba tusafishe uwanja wa shule. Tulivaa glavu na kusikiliza maagizo ya usalama. Nilijiunga na kikundi cha Amina na Brian.",
          "Tulikusanya karatasi na kuziweka kwenye pipa. Kikundi kingine kilifagia darasa huku wanafunzi wengine wakimwagilia maua. Tulishirikiana na kumaliza kazi kabla ya chakula cha mchana.",
          "Shule yetu ilionekana safi na maridadi. Nilijivunia kazi tuliyofanya. Nilijifunza kuwa ushirikiano hurahisisha kazi.",
        ],
      },
      {
        title: "Ziara Sokoni",
        prompt: "Eleza mambo uliyoona, kusikia na kufanya ulipotembelea soko.",
        writingType: "Maelezo",
        paragraphs: [
          "Jumamosi iliyopita, nilikwenda sokoni pamoja na shangazi yangu. Soko lilikuwa na watu wengi na rangi mbalimbali. Meza zilikuwa zimejaa nyanya, ndizi, mboga na vikapu.",
          "Nilisikia wauzaji wakiwaita wateja na watu wakisalimiana. Kulikuwa na harufu nzuri ya matunda. Shangazi alinifundisha kuchagua maembe yaliyoiva. Tulinunua mboga na kumsalimia mkulima mmoja.",
          "Tulipokuwa tukirudi nyumbani, nilibeba mfuko mdogo. Nilifurahia kuona vyakula tofauti na kukutana na watu. Soko lilikuwa mahali penye shughuli nyingi.",
        ],
      },
      {
        title: "Mwaliko wa Siku ya Michezo",
        prompt: "Andika barua ya kirafiki ukimwalika binamu yako siku ya michezo shuleni.",
        writingType: "Barua ya kirafiki",
        paragraphs: [
          "S.L.P. 24,\nKisumu.\n12 Juni 2026.",
          "Ndugu Nia,\n\nHabari yako? Mimi ni mzima na ninatumaini nawe ni mzima. Ninakuandikia barua hii kukualika siku ya michezo shuleni kwetu Ijumaa, tarehe 19 Juni. Shughuli zitaanza saa tatu asubuhi.",
          "Kutakuwa na mashindano ya mbio, nyimbo na mchezo wa kandanda. Tafadhali njoo na kofia na chupa ya maji. Nitafurahi sana kukuona. Wasalimie wote nyumbani.\n\nBinamu yako,\nAkinyi",
        ],
      },
    ],
  },
  "grade-5": {
    English: [
      {
        title: "The Lost Water Bottle",
        prompt: "Write a story about finding something that belonged to another learner.",
        writingType: "Narrative",
        paragraphs: [
          "After break time, I found a blue water bottle under a desk. It had a name label, but the writing was smudged. I took it to our class teacher instead of keeping it.",
          "Our teacher asked the class if anyone had lost a bottle. A quiet learner called Peter raised his hand. He described a small sticker of a football on its side. We checked, and it was his.",
          "Peter thanked me and filled the bottle at the tap. I was glad it had been returned. I learned that honesty means doing the right thing even when nobody is watching.",
        ],
      },
      {
        title: "A Morning by the River",
        prompt: "Describe a safe visit to a river and the sights and sounds around it.",
        writingType: "Descriptive",
        paragraphs: [
          "Early one morning, my family visited a river with our guide. The water moved over smooth stones and sparkled in the sunlight. Tall trees along the bank made cool patches of shade.",
          "Small birds called from the branches. We watched butterflies settle on wild flowers and saw tiny fish near the shallow edge. Our guide reminded us to stay together and never enter the water without an adult.",
          "We sat on a dry rock and ate our packed fruit. Before leaving, we collected our litter and carried it away. The visit was peaceful, and I enjoyed observing nature safely.",
        ],
      },
      {
        title: "A Note to the Class Teacher",
        prompt: "Write a polite note asking your teacher for permission to borrow a book from the class library.",
        writingType: "Polite note",
        paragraphs: [
          "Monday, 8 June 2026",
          "Dear Teacher,\n\nMay I please borrow the book called “Stories from Kenya” from our class library? I would like to read it at home and return it on Thursday.",
          "I will take good care of the book and keep it dry. Please let me know if I may borrow it.\n\nThank you.\n\nYours respectfully,\nMusa",
        ],
      },
    ],
    Kiswahili: [
      {
        title: "Chupa ya Maji Iliyopotea",
        prompt: "Andika kisa kuhusu kupata kitu kilichomilikiwa na mwanafunzi mwingine.",
        writingType: "Kisa",
        paragraphs: [
          "Baada ya mapumziko, nilipata chupa ya maji ya bluu chini ya dawati. Kulikuwa na jina juu yake, lakini lilikuwa limefutika. Niliipeleka kwa mwalimu badala ya kuichukua.",
          "Mwalimu aliuliza kama kuna mtu aliyepoteza chupa. Mwanafunzi mmoja aitwaye Peter aliinua mkono. Alisema ilikuwa na picha ndogo ya mpira wa miguu. Tuliikagua na kugundua kuwa ilikuwa yake.",
          "Peter alimshukuru mwalimu na kujaza chupa yake maji. Nilifurahi kuona chupa yake imerudi. Nilijifunza kuwa uaminifu ni kufanya jambo jema hata wakati hakuna mtu anayetuona.",
        ],
      },
      {
        title: "Asubuhi Kando ya Mto",
        prompt: "Eleza ziara salama ya mtoni pamoja na mandhari na sauti ulizoziona.",
        writingType: "Maelezo",
        paragraphs: [
          "Asubuhi moja, familia yetu ilitembelea mto pamoja na kiongozi wetu. Maji yalitiririka juu ya mawe laini na kung'aa kwenye mwanga wa jua. Miti mirefu kando ya mto ilitoa kivuli kizuri.",
          "Ndege wadogo waliimba kutoka kwenye matawi. Tulitazama vipepeo wakitua kwenye maua na kuona samaki wadogo karibu na ufuo. Kiongozi alitukumbusha kubaki pamoja na kutoingia majini bila mtu mzima.",
          "Tuliketi juu ya jiwe kavu na kula matunda tuliyokuwa tumebeba. Kabla ya kuondoka, tulikusanya taka zetu. Ziara hiyo ilikuwa tulivu na nilifurahia kutazama mazingira kwa usalama.",
        ],
      },
      {
        title: "Ujumbe kwa Mwalimu",
        prompt: "Andika ujumbe wa heshima ukimwomba mwalimu ruhusa ya kuazima kitabu cha maktaba ya darasa.",
        writingType: "Ujumbe rasmi",
        paragraphs: [
          "Jumatatu, tarehe 8 Juni 2026",
          "Mwalimu mpendwa,\n\nNaomba ruhusa ya kuazima kitabu kiitwacho “Hadithi za Kenya” kutoka maktaba ya darasa. Ningependa kukisoma nyumbani na kukirudisha Alhamisi.",
          "Nitakitunza vizuri na kukiweka mahali pakavu. Tafadhali nijulishe kama ninaweza kukiazima.\n\nAsante.\n\nWako kwa heshima,\nMusa",
        ],
      },
    ],
  },
  "grade-6": {
    English: [
      {
        title: "The Seedlings We Saved",
        prompt: "Write a story about how your class solved a problem in the school garden.",
        writingType: "Narrative",
        paragraphs: [
          "Our class garden was full of healthy seedlings until a week without rain left the soil dry. Some leaves began to droop. We wanted to save the plants, so our class teacher helped us make a plan.",
          "We checked the water tank and discovered that a tap was leaking. Two learners reported it to the caretaker, while the rest of us carried small containers of water to the garden. We covered the soil with dry grass to slow down water loss and made a watering rota.",
          "The caretaker repaired the tap the next day. Soon, the seedlings stood upright again. Our garden taught us to observe a problem, work together and use water carefully.",
        ],
      },
      {
        title: "A Place I Enjoy Visiting",
        prompt: "Describe a place in your community that is important to you.",
        writingType: "Descriptive",
        paragraphs: [
          "The place I enjoy visiting most is the community library. It stands beside a row of jacaranda trees, a short walk from our market. The building is small, but its blue doors are easy to recognise.",
          "Inside, the room is quiet and cool. Shelves hold storybooks, maps and reference books. A large window lets in soft light, and a reading table stands in the middle. The librarian greets visitors and helps them find books.",
          "I visit after school to read or complete a project. The library gives learners a calm place to discover new ideas. I value it because everyone in the community is welcome to learn there.",
        ],
      },
      {
        title: "A Letter About Road Safety",
        prompt: "Write a formal letter to your local community leader suggesting ways to make the road near your school safer.",
        writingType: "Formal letter",
        paragraphs: [
          "P.O. Box 48,\nEldoret.\n12 June 2026.",
          "The Community Leader,\nP.O. Box 10,\nEldoret.\n\nDear Sir or Madam,\n\nRE: ROAD SAFETY NEAR OUR SCHOOL\n\nI am a Grade 6 learner at Green Valley School. I am writing to ask for support in making the road near our school safer. Many learners cross it when coming to school, and vehicles sometimes travel quickly.",
          "Could a pedestrian crossing and a clear school warning sign be placed near the gate? Drivers could also be reminded to slow down during school arrival and closing times. These steps would help learners and other road users.\n\nThank you for considering our request.\n\nYours faithfully,\nMusa Otieno",
        ],
      },
    ],
    Kiswahili: [
      {
        title: "Miche Tuliyookoa",
        prompt: "Andika kisa kuhusu jinsi darasa lenu lilivyotatua tatizo kwenye bustani ya shule.",
        writingType: "Kisa",
        paragraphs: [
          "Bustani ya darasa letu ilikuwa na miche yenye afya hadi wiki moja bila mvua ilipoacha udongo ukiwa mkavu. Majani mengine yalianza kunyauka. Tulitaka kuokoa mimea hiyo, kwa hiyo mwalimu alitusaidia kupanga kazi.",
          "Tulikagua tanki la maji na kugundua kuwa bomba lilikuwa likivuja. Wanafunzi wawili walimjulisha mhudumu, huku wengine wakibeba maji kwenye vyombo vidogo. Tulifunika udongo kwa nyasi kavu ili kuhifadhi unyevu na kupanga ratiba ya kumwagilia.",
          "Mhudumu alitengeneza bomba siku iliyofuata. Baadaye, miche ilisimama vizuri tena. Bustani ilitufundisha kutambua tatizo, kushirikiana na kutumia maji kwa uangalifu.",
        ],
      },
      {
        title: "Mahali Ninapopenda Kutembelea",
        prompt: "Eleza mahali katika jamii yenu palipo muhimu kwako.",
        writingType: "Maelezo",
        paragraphs: [
          "Mahali ninapopenda kutembelea zaidi ni maktaba ya jamii. Iko karibu na miti ya mivinje na ni umbali mfupi kutoka sokoni. Jengo hilo ni dogo, lakini milango yake ya bluu huonekana kwa urahisi.",
          "Ndani yake kuna utulivu na hewa nzuri. Rafu zina vitabu vya hadithi, ramani na vitabu vya marejeo. Dirisha kubwa huingiza mwanga, na meza ya kusomea iko katikati. Mkutubi huwapokea wageni na kuwasaidia kupata vitabu.",
          "Mimi huenda huko baada ya shule kusoma au kufanya mradi. Maktaba huwapa wanafunzi mahali tulivu pa kujifunza. Ninaithamini kwa sababu kila mtu katika jamii anakaribishwa.",
        ],
      },
      {
        title: "Barua Kuhusu Usalama Barabarani",
        prompt: "Andika barua rasmi kwa kiongozi wa jamii mkipendekeza njia za kufanya barabara iliyo karibu na shule iwe salama zaidi.",
        writingType: "Barua rasmi",
        paragraphs: [
          "S.L.P. 48,\nEldoret.\n12 Juni 2026.",
          "Kiongozi wa Jamii,\nS.L.P. 10,\nEldoret.\n\nNdugu Mheshimiwa,\n\nYAH: USALAMA BARABARANI KARIBU NA SHULE YETU\n\nMimi ni mwanafunzi wa Gredi ya 6 katika Shule ya Green Valley. Ninakuandikia kuomba usaidizi wa kufanya barabara iliyo karibu na shule yetu iwe salama zaidi. Wanafunzi wengi huvuka barabara hiyo wanapokuja shuleni, na wakati mwingine magari huenda kwa kasi.",
          "Tafadhali fikiria kuweka kivuko cha waenda kwa miguu na alama ya tahadhari karibu na lango. Madereva pia wanaweza kukumbushwa kupunguza mwendo wakati wa kuingia na kutoka kwa wanafunzi. Hatua hizi zitawasaidia wanafunzi na watumiaji wengine wa barabara.\n\nAsante kwa kuzingatia ombi letu.\n\nWako mwaminifu,\nMusa Otieno",
        ],
      },
    ],
  },
};

export function getUpperPrimaryCompositions(
  gradeId: string,
  subject: string,
): JuniorComposition[] | undefined {
  if (!["grade-4", "grade-5", "grade-6"].includes(gradeId)) {
    return undefined;
  }

  if (subject !== "English" && subject !== "Kiswahili") {
    return undefined;
  }

  return upperPrimaryCompositions[gradeId][subject];
}
