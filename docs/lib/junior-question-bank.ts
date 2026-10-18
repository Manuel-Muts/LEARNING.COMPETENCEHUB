export type PracticeQuestion = {
  prompt: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

const question = (
  prompt: string,
  options: string[],
  correctAnswerIndex: number,
  explanation: string,
): PracticeQuestion => ({ prompt, options, correctAnswerIndex, explanation });

const juniorQuestionBank: Record<string, Record<string, PracticeQuestion[]>> = {
  "grade-7": {
    Mathematics: [
      question(
        "Work out 2/3 + 1/6.",
        ["5/6", "3/9", "1/2"],
        0,
        "Write 2/3 as 4/6, then add: 4/6 + 1/6 = 5/6.",
      ),
      question(
        "A rectangular garden is 12 m long and 7 m wide. What is its area?",
        ["38 m²", "84 m²", "19 m²"],
        1,
        "The area of a rectangle is length × width: 12 × 7 = 84 m².",
      ),
    ],
    English: [
      question(
        "Choose the verb that completes the sentence: “Each of the learners ___ a workbook.”",
        ["has", "have", "are"],
        0,
        "“Each” is singular, so it takes the singular verb “has.”",
      ),
      question(
        "Amina planted seedlings and watered them every day. Two weeks later, they had new leaves. Which conclusion is supported by the passage?",
        [
          "The seedlings showed signs of growth.",
          "It rained every day for two weeks.",
          "All the seedlings had died.",
        ],
        0,
        "The new leaves are evidence that the seedlings were growing.",
      ),
    ],
    Kiswahili: [
      question(
        "Wingi wa nomino “mti” ni upi?",
        ["miti", "matu", "watu"],
        0,
        "Nomino “mti” hubadilika na kuwa “miti” katika wingi.",
      ),
      question(
        "Katika sentensi “Juma alifika mapema ili awasaidie wenzake,” kwa nini Juma alifika mapema?",
        [
          "Ili awasaidie wenzake.",
          "Ili aondoke shuleni.",
          "Ili achelewe darasani.",
        ],
        0,
        "Kiunganishi “ili” kinaonyesha kusudi: Juma alitaka kuwasaidia wenzake.",
      ),
    ],
    "Integrated Science": [
      question(
        "Wet clothes dry faster when spread out in the sun. Which process changes the water in the clothes into water vapour?",
        ["Evaporation", "Freezing", "Condensation"],
        0,
        "Heat gives liquid water energy to evaporate into water vapour.",
      ),
      question(
        "Which laboratory instrument is best for observing cells in a thin plant sample?",
        ["A microscope", "A spring balance", "A measuring cylinder"],
        0,
        "A microscope magnifies objects too small to see clearly with the unaided eye.",
      ),
    ],
    Agriculture: [
      question(
        "Which practice helps reduce soil erosion on a sloping farm?",
        ["Planting cover crops", "Removing all vegetation", "Ploughing straight down the slope"],
        0,
        "Cover crops protect soil from raindrop impact and slow surface runoff.",
      ),
      question(
        "Which conditions are needed for most seeds to germinate?",
        ["Water, air and suitable warmth", "Bright light and fertiliser only", "Dry soil and cold air"],
        0,
        "Most seeds need moisture, oxygen and a suitable temperature to begin germinating.",
      ),
    ],
    "Christian Religious Education": [
      question(
        "In the parable of the Good Samaritan, what lesson is shown by the Samaritan helping an injured stranger?",
        ["Show compassion to a person in need.", "Help only people from your own community.", "Ignore people you do not know."],
        0,
        "The Samaritan showed love of neighbour through practical compassion.",
      ),
      question(
        "Which action best shows care for creation at school?",
        ["Keeping the school compound clean.", "Wasting water at a leaking tap.", "Damaging young trees."],
        0,
        "Responsible care for the environment includes keeping shared spaces clean.",
      ),
    ],
    "Pre-Technical Studies": [
      question(
        "When measuring a line with a ruler, where should you place the start of the line?",
        ["At the zero mark", "At the one-centimetre mark", "At the end of the ruler"],
        0,
        "Starting at zero makes the ruler reading equal to the line's length.",
      ),
      question(
        "What is the safest way to hold a piece of wood while sawing it in a workshop?",
        ["Secure it with a clamp.", "Hold it in the path of the saw.", "Ask a classmate to hold it near the blade."],
        0,
        "A clamp holds the work securely and keeps hands away from the cutting edge.",
      ),
    ],
    "Creative Arts and Sports": [
      question(
        "Which two primary paint colours can be mixed to make orange?",
        ["Red and yellow", "Blue and yellow", "Red and blue"],
        0,
        "Mixing red and yellow pigments produces orange.",
      ),
      question(
        "Why should learners warm up before vigorous physical activity?",
        ["To prepare the body gradually for exercise.", "To replace all practice.", "To make drinking water unnecessary."],
        0,
        "A warm-up gradually prepares the body for more demanding movement.",
      ),
    ],
    "Social Studies": [
      question(
        "A map scale shows 1 cm represents 2 km. Two towns are 4 cm apart on the map. How far apart are they on the ground?",
        ["6 km", "8 km", "2 km"],
        1,
        "Multiply the map distance by the scale: 4 × 2 = 8 km.",
      ),
      question(
        "What information does a map key or legend provide?",
        ["The meaning of symbols on the map.", "The age of every person in the area.", "The exact weather next month."],
        0,
        "A map key explains what the map's symbols represent.",
      ),
    ],
  },
  "grade-8": {
    Mathematics: [
      question(
        "A class has boys and girls in the ratio 3:5. If there are 32 learners, how many are boys?",
        ["12", "20", "8"],
        0,
        "There are 3 + 5 = 8 equal parts. Each part is 32 ÷ 8 = 4, so there are 3 × 4 = 12 boys.",
      ),
      question(
        "Find 15% of KSh 200.",
        ["KSh 15", "KSh 30", "KSh 35"],
        1,
        "10% of 200 is 20 and 5% is 10, so 15% is KSh 30.",
      ),
    ],
    English: [
      question(
        "Choose the correct completion: “By the time the bus arrived, we ___ for an hour.”",
        ["had waited", "will wait", "are waiting"],
        0,
        "The past perfect “had waited” describes an action completed before another past event.",
      ),
      question(
        "Which sentence uses a simile?",
        ["The lake was as smooth as glass.", "The lake reflected the clouds.", "The lake is deep."],
        0,
        "A simile compares two things using “like” or “as.”",
      ),
    ],
    Kiswahili: [
      question(
        "Chagua kitenzi kilicho katika wakati uliopita: “Jana, wanafunzi ___ darasa.”",
        ["walisafisha", "wanasafisha", "watasafisha"],
        0,
        "Kiambishi “-li-” katika “walisafisha” kinaonyesha wakati uliopita.",
      ),
      question(
        "Methali “Umoja ni nguvu, utengano ni udhaifu” inatufundisha nini?",
        [
          "Ushirikiano husaidia watu kufanikiwa.",
          "Kila mtu afanye kazi peke yake.",
          "Kutofautiana ni njia pekee ya kutatua matatizo.",
        ],
        0,
        "Methali hii inasisitiza faida ya watu kushirikiana.",
      ),
    ],
    "Integrated Science": [
      question(
        "A stone has a mass of 120 g and a volume of 40 cm³. What is its density?",
        ["3 g/cm³", "80 g/cm³", "160 g/cm³"],
        0,
        "Density = mass ÷ volume = 120 ÷ 40 = 3 g/cm³.",
      ),
      question(
        "Two bulbs are connected in parallel to a battery. What is most likely to happen if one bulb is removed?",
        ["The other bulb can remain lit.", "Both bulbs must become brighter.", "The battery changes into a bulb."],
        0,
        "In a parallel circuit, each bulb has its own path, so removing one does not necessarily break the other's path.",
      ),
    ],
    Agriculture: [
      question(
        "Why do farmers add well-made compost to soil?",
        ["To add organic matter and improve soil structure.", "To stop all water entering the soil.", "To remove every soil organism."],
        0,
        "Compost adds organic matter, which can improve soil structure and fertility.",
      ),
      question(
        "Which practice helps prevent the spread of disease in a poultry flock?",
        ["Vaccinating birds as advised.", "Sharing dirty drinkers between flocks.", "Keeping sick birds with healthy birds."],
        0,
        "Following a suitable vaccination programme helps protect poultry from specific diseases.",
      ),
    ],
    "Christian Religious Education": [
      question(
        "A learner is asked to look after shared class materials. Which action best shows stewardship?",
        ["Use the materials carefully and return them.", "Keep the materials for personal use.", "Damage the materials after using them."],
        0,
        "Stewardship means taking responsible care of resources entrusted to you.",
      ),
      question(
        "Which response best demonstrates forgiveness after a classmate apologises for a mistake?",
        ["Accept the apology and work towards peace.", "Seek revenge later.", "Encourage others to keep arguing."],
        0,
        "Forgiveness helps restore relationships and supports peaceful coexistence.",
      ),
    ],
    "Pre-Technical Studies": [
      question(
        "Which tool is suitable for checking whether the edge of a wooden frame is at a right angle?",
        ["Try square", "Paintbrush", "Screwdriver"],
        0,
        "A try square is designed to check and mark right angles.",
      ),
      question(
        "A drawing uses a scale of 1:5. A part measures 40 mm on the drawing. What is its actual length?",
        ["8 mm", "45 mm", "200 mm"],
        2,
        "At a scale of 1:5, the actual length is five times the drawing length: 40 × 5 = 200 mm.",
      ),
    ],
    "Creative Arts and Sports": [
      question(
        "Which pair of colours can be mixed to make green paint?",
        ["Blue and yellow", "Red and yellow", "Black and white"],
        0,
        "Blue and yellow are mixed to make green in traditional pigment mixing.",
      ),
      question(
        "In music, what does rhythm organise?",
        ["The pattern of sounds and silences over time.", "The size of an instrument.", "The colour of a song."],
        0,
        "Rhythm is the pattern of beats, sounds and silences in music.",
      ),
    ],
    "Social Studies": [
      question(
        "A town has 600 people living in an area of 30 km². What is its population density?",
        ["20 people per km²", "200 people per km²", "630 people per km²"],
        0,
        "Population density = population ÷ area = 600 ÷ 30 = 20 people per km².",
      ),
      question(
        "What is one reason people use an atlas?",
        ["To locate places and compare maps of different regions.", "To measure the weight of crops.", "To predict the exact date of an earthquake."],
        0,
        "An atlas is a collection of maps used to locate and study places.",
      ),
    ],
  },
  "grade-9": {
    Mathematics: [
      question(
        "Solve 2x + 7 = 21.",
        ["x = 7", "x = 14", "x = 28"],
        0,
        "Subtract 7 from both sides to get 2x = 14, then divide by 2: x = 7.",
      ),
      question(
        "A fair six-sided die is rolled once. What is the probability of rolling an even number?",
        ["1/3", "1/2", "2/3"],
        1,
        "Three of the six outcomes (2, 4 and 6) are even, so the probability is 3/6 = 1/2.",
      ),
    ],
    English: [
      question(
        "Change to passive voice: “The team completed the project.”",
        [
          "The project was completed by the team.",
          "The project completed the team.",
          "The team was completed by the project.",
        ],
        0,
        "In the passive form, the object becomes the subject: “The project was completed …”.",
      ),
      question(
        "A report states that a school garden produced more vegetables after learners added compost. What would be the strongest evidence for this claim?",
        [
          "Recorded harvest amounts from before and after compost was added.",
          "A learner's guess about what might happen.",
          "The colour of the garden fence.",
        ],
        0,
        "Measured harvest records provide relevant evidence that can be compared.",
      ),
    ],
    Kiswahili: [
      question(
        "Chagua sentensi iliyo katika hali timilifu.",
        ["Asha amemaliza kazi yake.", "Asha anamaliza kazi yake.", "Asha atamaliza kazi yake."],
        0,
        "Kitenzi “amemaliza” kinaonyesha tendo lililokamilika na athari yake ipo sasa.",
      ),
      question(
        "Kauli “Maji ni uhai” inasisitiza nini?",
        [
          "Maji ni muhimu kwa maisha.",
          "Maji hayafai kutumiwa.",
          "Maisha hayawezi kuhusishwa na mazingira.",
        ],
        0,
        "Kauli hii inaonyesha umuhimu wa maji kwa viumbe na maisha.",
      ),
    ],
    "Integrated Science": [
      question(
        "A 6 V battery is connected to a 3 Ω resistor. What current flows through the resistor?",
        ["2 A", "3 A", "18 A"],
        0,
        "Using Ohm's law, current = voltage ÷ resistance = 6 ÷ 3 = 2 A.",
      ),
      question(
        "What may happen to the number of prey animals if their main predator is removed from an ecosystem?",
        ["Their population may increase at first.", "They all immediately become predators.", "The ecosystem can no longer contain plants."],
        0,
        "With fewer predators hunting them, prey numbers may rise, although other factors also affect populations.",
      ),
    ],
    Agriculture: [
      question(
        "Why can including a legume in a crop rotation help maintain soil fertility?",
        ["Legumes can add nitrogen to the soil through root-nodule bacteria.", "Legumes remove all minerals from the soil.", "Legumes prevent any crop from growing afterwards."],
        0,
        "Bacteria in legume root nodules help make nitrogen compounds available in the soil.",
      ),
      question(
        "Which approach is an example of integrated pest management?",
        ["Monitor pests and combine suitable cultural, biological and chemical controls.", "Spray every field every day without checking for pests.", "Ignore pest levels until the whole crop is lost."],
        0,
        "Integrated pest management monitors pests and combines appropriate methods to control them.",
      ),
    ],
    "Christian Religious Education": [
      question(
        "In the Beatitudes, which people are described as blessed because they work for peace?",
        ["Peacemakers", "Those who seek revenge", "Those who cause division"],
        0,
        "The Beatitudes teach that peacemakers are blessed and will be called children of God.",
      ),
      question(
        "You notice a friend looking at notes during a test. Which response best reflects honesty and responsibility?",
        ["Do not help them cheat and encourage them to follow the rules.", "Share your answers so they can finish quickly.", "Hide the notes for them."],
        0,
        "Honesty means acting truthfully and respecting fair assessment rules.",
      ),
    ],
    "Pre-Technical Studies": [
      question(
        "What should you do before replacing a lamp in a simple electrical circuit?",
        ["Switch off and disconnect the power source.", "Touch the bare wires to check for current.", "Pour water over the circuit."],
        0,
        "Disconnecting the power source reduces the risk of electric shock.",
      ),
      question(
        "A design solution does not meet one of its stated requirements. What is the best next step?",
        ["Test the solution, identify the shortfall and improve the design.", "Ignore the requirement and present it as successful.", "Discard all measurements and guess."],
        0,
        "Design is iterative: testing helps identify problems so the solution can be improved.",
      ),
    ],
    "Creative Arts and Sports": [
      question(
        "Which colour is complementary to red on a traditional colour wheel?",
        ["Green", "Orange", "Yellow"],
        0,
        "Red and green are opposite one another on a traditional colour wheel.",
      ),
      question(
        "During a team game, a player disagrees with an official's decision. What is the best response?",
        ["Respect the decision and continue playing fairly.", "Stop the game and insult the official.", "Change the score without telling anyone."],
        0,
        "Respecting officials and rules is part of fair play and sportsmanship.",
      ),
    ],
    "Social Studies": [
      question(
        "On a map with a scale of 1:50,000, two places are 3 cm apart. What is their ground distance?",
        ["1.5 km", "15 km", "150 km"],
        0,
        "3 cm × 50,000 = 150,000 cm, which is 1,500 m or 1.5 km.",
      ),
      question(
        "Which principle means that everyone, including leaders, must obey the law?",
        ["Rule of law", "Absolute power", "Censorship"],
        0,
        "The rule of law requires individuals and public officials to be governed by the law.",
      ),
    ],
  },
};

const additionalJuniorQuestions: Record<string, PracticeQuestion[]> = {
  Mathematics: [
    question("What is 18% of KSh 500?", ["KSh 90", "KSh 18", "KSh 250"], 0, "0.18 × 500 = KSh 90."),
    question("Simplify the ratio 24:36.", ["2:3", "3:2", "4:9"], 0, "Divide both parts by their greatest common factor, 12, to get 2:3."),
    question("A number is 7 less than 3 times 8. What is the number?", ["17", "31", "15"], 0, "Three times 8 is 24, and 24 − 7 = 17."),
    question("Find the perimeter of a square with sides of 9 cm.", ["36 cm", "81 cm", "18 cm"], 0, "A square has four equal sides, so its perimeter is 4 × 9 = 36 cm."),
    question("Which decimal is equal to 3/5?", ["0.6", "0.35", "1.5"], 0, "Divide 3 by 5 to get 0.6."),
    question("A matatu travels 150 km in 3 hours at a constant speed. What is its speed?", ["50 km/h", "45 km/h", "153 km/h"], 0, "Speed = distance ÷ time = 150 ÷ 3 = 50 km/h."),
    question("Solve x − 12 = 19.", ["31", "7", "−31"], 0, "Add 12 to both sides: x = 19 + 12 = 31."),
    question("What is the mean of 4, 6 and 11?", ["7", "6", "21"], 0, "The sum is 21; divide by 3 values to get a mean of 7."),
  ],
  English: [
    question("Choose the correct plural form of “goose.”", ["geese", "gooses", "goose's"], 0, "“Geese” is the irregular plural form of “goose.”"),
    question("Which word is an adverb in “The pupils worked quietly”?", ["quietly", "pupils", "worked"], 0, "“Quietly” describes how the pupils worked."),
    question("Choose the correctly punctuated sentence.", ["“We are ready,” said Akinyi.", "“We are ready” said, Akinyi.", "We are ready,” said Akinyi."], 0, "The spoken words are enclosed in quotation marks, with the comma before the closing mark."),
    question("Which word is closest in meaning to “brief”?", ["short", "distant", "heavy"], 0, "“Brief” means lasting a short time or using few words."),
    question("Complete the sentence: “Neither the teacher nor the learners ___ late.”", ["were", "was", "is"], 0, "With this neither/nor construction, the verb agrees with the nearer plural subject “learners.”"),
    question("What is the main purpose of a topic sentence in a paragraph?", ["To introduce its main idea.", "To list every source used.", "To give the paragraph a title only."], 0, "A topic sentence tells the reader the paragraph's central idea."),
    question("Which conjunction shows a reason: “We stayed indoors ___ it was raining”?", ["because", "although", "unless"], 0, "“Because” introduces the reason the learners stayed indoors."),
    question("Which sentence is in the future tense?", ["They will visit the library tomorrow.", "They visited the library yesterday.", "They visit the library daily."], 0, "The auxiliary “will” marks the future tense."),
  ],
  Kiswahili: [
    question("Wingi wa neno “jicho” ni upi?", ["macho", "majicho", "vijicho"], 0, "Wingi wa “jicho” ni “macho.”"),
    question("Chagua kinyume cha neno “refu.”", ["fupi", "ndefu", "kubwa"], 0, "Kinyume cha “refu” ni “fupi.”"),
    question("Katika sentensi “Watoto wanacheza nje,” nomino ni ipi?", ["Watoto", "wanacheza", "nje"], 0, "“Watoto” ni nomino inayowataja watu."),
    question("Kamilisha: “Mwalimu ___ wanafunzi somo.”", ["aliwafundisha", "tutawafundisha", "wanawafundisha"], 0, "“Aliwafundisha” ni kitenzi cha wakati uliopita kinacholingana na mwalimu mmoja."),
    question("Neno “polepole” lina maana gani katika “Tembea polepole”?", ["Kwa mwendo wa taratibu.", "Kwa sauti kubwa.", "Kwa haraka sana."], 0, "“Polepole” linaeleza mwendo wa taratibu."),
    question("Chagua kiwakilishi cha nafsi ya kwanza wingi.", ["sisi", "wao", "yeye"], 0, "“Sisi” ni kiwakilishi cha nafsi ya kwanza wingi."),
    question("Methali “Asiyesikia la mkuu huvunjika guu” inahimiza nini?", ["Kusikiliza ushauri mzuri.", "Kukataa kila ushauri.", "Kukimbia bila sababu."], 0, "Methali hii huonya kuhusu matokeo ya kupuuza ushauri."),
    question("Kamilisha: “Kitabu ___ mezani.”", ["kiko", "wako", "ziko"], 0, "“Kitabu” ni nomino ya ngeli ya ki-/vi-, hivyo kiwakilishi ni “kiko.”"),
  ],
  "Integrated Science": [
    question("Which gas do green plants take in during photosynthesis?", ["Carbon dioxide", "Oxygen", "Nitrogen"], 0, "Plants use carbon dioxide and water to make food during photosynthesis."),
    question("Which part of the human body pumps blood around the body?", ["Heart", "Lungs", "Stomach"], 0, "The heart contracts to pump blood through blood vessels."),
    question("What is the SI unit of force?", ["Newton", "Joule", "Metre"], 0, "Force is measured in newtons, named after Isaac Newton."),
    question("Which method can separate sand from water?", ["Filtration", "Evaporation of the sand", "Magnetism"], 0, "A filter traps insoluble sand while water passes through."),
    question("What is the main function of roots in most plants?", ["Absorb water and anchor the plant.", "Make seeds move.", "Produce sound."], 0, "Roots absorb water and minerals and help hold a plant in the soil."),
    question("Which change is a chemical change?", ["Iron rusting", "Ice melting", "Water boiling"], 0, "Rusting forms a new substance, iron oxide, so it is a chemical change."),
    question("Which planet is closest to the Sun?", ["Mercury", "Earth", "Jupiter"], 0, "Mercury is the innermost planet in the Solar System."),
    question("Why does a shadow form?", ["An object blocks light travelling to a surface.", "Sound bends around an object.", "The object produces darkness."], 0, "A shadow forms where an opaque object blocks light."),
  ],
  Agriculture: [
    question("Which tool is commonly used to loosen soil around growing crops?", ["Jembe", "Rake only", "Watering can"], 0, "A jembe is used for digging and loosening soil."),
    question("What does mulching do for a crop field?", ["Helps conserve soil moisture and suppress weeds.", "Removes all nutrients from soil.", "Prevents roots from growing."], 0, "Mulch covers the soil, reducing water loss and weed growth."),
    question("Which livestock is a ruminant?", ["Goat", "Chicken", "Rabbit"], 0, "Goats are ruminants; they have a multi-compartment stomach and chew cud."),
    question("Why should seeds be planted at a suitable spacing?", ["To reduce competition for light, water and nutrients.", "To stop every seed from germinating.", "To make the soil disappear."], 0, "Suitable spacing reduces competition and allows healthy crop growth."),
    question("Which material is suitable for making a compost heap?", ["Plant residues", "Plastic bottles", "Broken glass"], 0, "Plant residues are biodegradable and can decompose into compost."),
    question("What is the purpose of weeding a crop field?", ["To reduce competition from unwanted plants.", "To remove all crop plants.", "To prevent the crop receiving sunlight."], 0, "Weeds compete with crops for resources such as water, light and nutrients."),
    question("Which practice helps keep stored grain dry?", ["Store it in a dry, well-ventilated place.", "Mix it with wet soil.", "Leave it in an open container during rain."], 0, "Dry, ventilated storage lowers the risk of mould and spoilage."),
    question("What should a farmer do before applying a pesticide?", ["Read and follow the label and safety directions.", "Mix it with drinking water.", "Spray against the wind without protection."], 0, "The label gives instructions for safe use, dosage and protective equipment."),
  ],
  "Christian Religious Education": [
    question("Which value is shown when a learner returns a lost book to its owner?", ["Honesty", "Greed", "Impatience"], 0, "Returning something that is not yours demonstrates honesty."),
    question("What is one way learners can promote peace at school?", ["Listen respectfully and solve disagreements calmly.", "Spread rumours about classmates.", "Use threats to end discussions."], 0, "Respectful listening and calm discussion help resolve conflict peacefully."),
    question("In Christian teaching, why is caring for people in need important?", ["It expresses love and compassion.", "It guarantees a reward every time.", "It avoids all responsibility."], 0, "Helping people in need is an expression of love and compassion."),
    question("Which action shows respect for parents and guardians?", ["Listening and speaking to them respectfully.", "Damaging their belongings.", "Ignoring every reasonable request."], 0, "Respect includes considerate speech and responsible behaviour."),
    question("What does prayer commonly help believers do?", ["Communicate with God.", "Replace every act of kindness.", "Avoid learning about their faith."], 0, "Prayer is a way believers communicate with God."),
    question("Which action demonstrates forgiveness?", ["Letting go of resentment after a sincere apology.", "Planning to hurt the person later.", "Encouraging others to take revenge."], 0, "Forgiveness means choosing not to seek revenge and working towards restored relationships."),
    question("Why do Christians read the Bible?", ["To learn about their faith and guidance for life.", "To replace every school subject.", "To predict daily rainfall."], 0, "The Bible is a source of Christian teaching and guidance."),
    question("Which action shows responsible use of money?", ["Plan spending and save part of it.", "Spend everything without considering needs.", "Borrow without intending to repay."], 0, "Planning and saving are responsible ways to manage money."),
  ],
  "Pre-Technical Studies": [
    question("Which tool is used to tighten or loosen a screw with a slotted head?", ["Flat-head screwdriver", "Try square", "Paint scraper"], 0, "A flat-head screwdriver fits the slot in the screw head."),
    question("What does a safety sign showing an exclamation mark inside a triangle usually indicate?", ["A warning or hazard.", "A place to store food.", "The end of a measuring scale."], 0, "A triangular warning sign alerts people to a possible hazard."),
    question("Which unit is commonly used to measure the length of a classroom?", ["Metre", "Litre", "Kilogram"], 0, "Metres are units of length."),
    question("Why should tools be cleaned and stored after use?", ["To keep them safe and in good working condition.", "To make them harder to find.", "To damage their cutting edges."], 0, "Cleaning and proper storage help tools remain safe and usable."),
    question("Which material is a good electrical conductor?", ["Copper", "Rubber", "Dry wood"], 0, "Copper allows electric current to flow and is widely used in wiring."),
    question("What is the purpose of a design sketch?", ["To communicate an idea before making the product.", "To replace all measurements.", "To test the product's weight."], 0, "A sketch helps show the shape and features of a proposed design."),
    question("Which simple machine is a ramp?", ["An inclined plane", "A pulley", "A wheel and axle"], 0, "A ramp is an inclined plane that can reduce the effort needed to raise a load."),
    question("What should you do if a tool is damaged before a practical activity?", ["Report it and do not use it.", "Hide the damage and continue.", "Give it to another learner without warning."], 0, "Reporting damaged equipment helps prevent injury and allows repair."),
  ],
  "Creative Arts and Sports": [
    question("Which element of art describes how light or dark a colour appears?", ["Tone", "Texture", "Shape"], 0, "Tone describes the lightness or darkness of a colour."),
    question("What is a repeated beat in music called?", ["Pulse", "Portrait", "Palette"], 0, "The pulse is the steady beat underlying music."),
    question("Which activity is mainly an example of drama?", ["Performing a role in a short play.", "Measuring a football field.", "Mixing paint for a poster."], 0, "Drama involves acting or performing roles and situations."),
    question("Why is it important to drink water during physical activity?", ["To replace water lost through sweating.", "To make muscles stop working.", "To avoid taking rest breaks."], 0, "Drinking water helps replace fluid lost during exercise."),
    question("Which action helps prevent injury during a game?", ["Use suitable equipment and follow safety rules.", "Ignore the playing area hazards.", "Push other players to gain advantage."], 0, "Suitable equipment and rules help keep participants safer."),
    question("What is the foreground in a visual artwork?", ["The part that appears nearest to the viewer.", "The part that is always outside the paper.", "The artist's signature only."], 0, "The foreground is the area that appears closest to the viewer."),
    question("Which quality is important when singing in a group?", ["Listening to others and keeping together.", "Singing at a different speed on purpose.", "Ignoring the conductor or leader."], 0, "Listening helps singers stay in time and blend with the group."),
    question("What does fair play require during a competition?", ["Respect opponents, rules and officials.", "Change rules to favour your team.", "Refuse to accept every result."], 0, "Fair play means competing honestly and showing respect."),
  ],
  "Social Studies": [
    question("Which direction is opposite to east on a compass?", ["West", "North", "South"], 0, "West is opposite east on the compass rose."),
    question("What is a citizen's responsibility in a community?", ["Respect laws and contribute to community wellbeing.", "Damage public facilities.", "Prevent others from accessing services."], 0, "Responsible citizens follow laws and contribute positively to their community."),
    question("Which is a renewable source of energy?", ["Solar energy", "Coal", "Petroleum"], 0, "Sunlight is naturally replenished and is a renewable energy source."),
    question("Why are national parks important?", ["They protect wildlife and natural habitats.", "They remove the need to conserve water.", "They are used only for building factories."], 0, "National parks help conserve wildlife and ecosystems."),
    question("Which feature is commonly associated with a river's source?", ["The place where the river begins.", "The place where it enters the sea only.", "A symbol showing a town."], 0, "A river source is the place where the river begins."),
    question("What is one purpose of a constitution?", ["To set out how a country is governed and citizens' rights.", "To list every family in the country.", "To replace all community rules."], 0, "A constitution sets the framework of government and fundamental rights."),
    question("Which activity is part of conserving the environment?", ["Planting trees and protecting existing vegetation.", "Dumping waste into a stream.", "Burning every patch of grass."], 0, "Trees and vegetation support habitats and help protect soil and water."),
    question("What does a population census mainly collect?", ["Information about the number and characteristics of people.", "The height of every building.", "The amount of rain in each farm."], 0, "A census gathers information about a population and its characteristics."),
  ],
};

export function getJuniorQuestions(
  gradeId: string,
  subject: string,
): PracticeQuestion[] | undefined {
  const gradeQuestions = juniorQuestionBank[gradeId]?.[subject];
  const additionalQuestions = additionalJuniorQuestions[subject];
  if (!gradeQuestions || !additionalQuestions) {
    return undefined;
  }
  const gradeNumber = Number(gradeId.slice(-1));
  return [...gradeQuestions, ...additionalQuestions].map((item, index) => {
    const shift = (index + gradeNumber) % item.options.length;
    const options = [
      ...item.options.slice(shift),
      ...item.options.slice(0, shift),
    ];
    return {
      ...item,
      options,
      correctAnswerIndex:
        (item.correctAnswerIndex - shift + item.options.length) % item.options.length,
    };
  });
}
