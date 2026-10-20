import type { PracticeQuestion } from "./junior-question-bank";

const question = (
  prompt: string,
  options: string[],
  correctAnswerIndex: number,
  explanation: string,
): PracticeQuestion => ({ prompt, options, correctAnswerIndex, explanation });

const upperPrimaryQuestionBank: Record<string, PracticeQuestion[]> = {
  Mathematics: [
    question("What is the value of the digit 7 in 47,286?", ["700", "7,000", "70"], 1, "The 7 is in the thousands place, so its value is 7,000."),
    question("Work out 3/4 + 1/8.", ["7/8", "4/12", "5/8"], 0, "Convert 3/4 to 6/8, then add 6/8 + 1/8 = 7/8."),
    question("A school buys 8 boxes of pencils. Each box has 24 pencils. How many pencils are there altogether?", ["192", "184", "32"], 0, "Multiply the number of boxes by the pencils in each box: 8 × 24 = 192."),
    question("A water tank holds 250 litres. How many millilitres is this?", ["25,000 mL", "250,000 mL", "2,500 mL"], 1, "One litre is 1,000 millilitres, so 250 × 1,000 = 250,000 mL."),
    question("A rectangle is 9 cm long and 6 cm wide. What is its perimeter?", ["54 cm", "30 cm", "15 cm"], 1, "Perimeter = 2 × (length + width) = 2 × (9 + 6) = 30 cm."),
    question("What is 15% of KSh 800?", ["KSh 120", "KSh 80", "KSh 150"], 0, "10% of 800 is 80 and 5% is 40, so 15% is KSh 120."),
    question("A bus travels 180 km in 3 hours. What is its average speed?", ["60 km/h", "90 km/h", "540 km/h"], 0, "Average speed = distance ÷ time = 180 ÷ 3 = 60 km/h."),
    question("Find the mean of 6, 8, 10 and 12.", ["9", "8", "36"], 0, "Add the values to get 36, then divide by 4: the mean is 9."),
    question("An angle measuring 125° is what type of angle?", ["Acute", "Obtuse", "Right"], 1, "An obtuse angle is greater than 90° and less than 180°."),
    question("A farmer packs 156 oranges equally into 12 crates. How many oranges go in each crate?", ["13", "12", "14"], 0, "156 ÷ 12 = 13 oranges in each crate."),
  ],
  English: [
    question("Choose the verb that completes the sentence: “Neither the pupils nor the teacher ___ ready.”", ["were", "was", "are"], 1, "The verb agrees with the nearer subject, “teacher,” which is singular: “was.”"),
    question("Which word is an adverb in “The careful learner answered confidently”?", ["careful", "learner", "confidently"], 2, "“Confidently” describes how the learner answered."),
    question("Choose the correctly punctuated sentence.", ["“Please close the gate,” said Wanjiku.", "“Please close the gate” said, Wanjiku.", "Please close the gate,” said Wanjiku."], 0, "Direct speech is enclosed in quotation marks, with a comma before the closing quotation mark."),
    question("Which word is closest in meaning to “generous”?", ["Willing to give and share", "Quick to become angry", "Afraid of trying"], 0, "A generous person is willing to give or share with others."),
    question("Which sentence is in the present perfect tense?", ["Musa has finished his homework.", "Musa finishes his homework.", "Musa will finish his homework."], 0, "“Has finished” is the present perfect form."),
    question("Choose the conjunction that shows contrast: “We continued the match ___ it began to rain.”", ["because", "although", "unless"], 1, "“Although” introduces a contrast between the rain and continuing the match."),
    question("What is the main purpose of a topic sentence?", ["To introduce the main idea of a paragraph", "To list every word in a paragraph", "To give the writer's name"], 0, "A topic sentence introduces the central idea developed in the paragraph."),
    question("Change to passive voice: “The class planted the trees.”", ["The trees were planted by the class.", "The trees planted the class.", "The class was planted by the trees."], 0, "In passive voice, the object becomes the subject: “The trees were planted …”."),
    question("Which word is a synonym for “observe”?", ["Notice", "Forget", "Disturb"], 0, "To observe is to watch or notice something carefully."),
    question("Which sentence correctly shows that the books belong to several girls?", ["The girls' books are on the table.", "The girls book's are on the table.", "The girl's book are on the table."], 0, "The plural noun “girls” takes an apostrophe after the s to show that the books belong to them."),
  ],
  Kiswahili: [
    question("Wingi wa neno “jicho” ni upi?", ["Macho", "Majicho", "Vijicho"], 0, "Wingi wa “jicho” ni “macho.”"),
    question("Chagua kinyume cha neno “jasiri.”", ["Mwoga", "Shujaa", "Imara"], 0, "“Mwoga” ni kinyume cha “jasiri.”"),
    question("Katika sentensi “Watoto walicheza uwanjani,” kitenzi ni kipi?", ["Watoto", "walicheza", "uwanjani"], 1, "“Walicheza” linaonyesha kitendo kilichofanywa na watoto."),
    question("Kamilisha sentensi: “Kesho sisi ___ sokoni.”", ["tutaenda", "tulienda", "tunaenda jana"], 0, "Kiambishi “-ta-” katika “tutaenda” kinaonyesha wakati ujao."),
    question("Neno “polepole” katika “Tembea polepole” ni aina gani ya neno?", ["Kielezi", "Nomino", "Kiwakilishi"], 0, "“Polepole” linaeleza jinsi kitendo cha kutembea kinavyofanyika, kwa hiyo ni kielezi."),
    question("Chagua kiwakilishi cha nafsi ya pili wingi.", ["Ninyi", "Sisi", "Yeye"], 0, "“Ninyi” ni kiwakilishi cha nafsi ya pili wingi."),
    question("Methali “Haraka haraka haina baraka” inatufundisha nini?", ["Tusifanye mambo kwa pupa.", "Tukimbie kila wakati.", "Tusiwasaidie wengine."], 0, "Methali hii huonya kuwa kufanya mambo kwa pupa kunaweza kuleta makosa."),
    question("Kamilisha: “Viti ___ darasani.”", ["viko", "yuko", "ziko"], 0, "“Viti” ni wingi wa ngeli ya ki-/vi-, hivyo tunasema “viko.”"),
    question("Chagua neno lenye maana sawa na “furaha.”", ["Shangwe", "Huzuni", "Hasira"], 0, "“Shangwe” lina maana inayokaribiana na furaha."),
    question("Katika sentensi “Asha alimwandikia rafiki yake barua,” nani aliandika barua?", ["Asha", "Rafiki yake", "Barua"], 0, "Asha ndiye mtendaji wa kitendo cha kuandika."),
  ],
  "Science and Technology": [
    question("Which part of a flowering plant absorbs most water from the soil?", ["Roots", "Petals", "Fruit"], 0, "Roots absorb water and minerals from the soil."),
    question("Which material is a good conductor of electricity?", ["Copper", "Rubber", "Dry wood"], 0, "Copper allows electric current to pass through it and is used in electrical wires."),
    question("What is the main function of a switch in a simple circuit?", ["To open or close the circuit", "To make the wires longer", "To store water"], 0, "A switch controls whether the circuit is complete and current can flow."),
    question("Which change of state happens when liquid water becomes water vapour?", ["Evaporation", "Freezing", "Condensation"], 0, "Evaporation changes liquid water into water vapour."),
    question("Which organ pumps blood around the human body?", ["Heart", "Lungs", "Stomach"], 0, "The heart pumps blood through blood vessels around the body."),
    question("Which practice helps prevent the spread of communicable diseases?", ["Washing hands with soap", "Sharing unwashed cups", "Leaving rubbish uncovered"], 0, "Handwashing removes germs and helps reduce the spread of infection."),
    question("A learner wants to compare how quickly two materials absorb water. What should be kept the same for a fair test?", ["The amount of water used", "The names of the materials", "The result expected"], 0, "Keeping the amount of water the same makes the comparison fair."),
    question("Which simple machine is a seesaw an example of?", ["Lever", "Pulley", "Wheel and axle"], 0, "A seesaw is a lever that turns around a fixed point called a fulcrum."),
    question("Why does a shadow form behind an opaque object?", ["The object blocks light.", "The object makes its own darkness.", "Sound cannot pass through it."], 0, "An opaque object blocks light, leaving a shaded area behind it."),
    question("Which device changes electrical energy into sound energy?", ["Loudspeaker", "Torch bulb", "Solar panel"], 0, "A loudspeaker uses electrical energy to produce sound."),
  ],
  "Integrated Science": [
    question("Which gas do green plants take in during photosynthesis?", ["Carbon dioxide", "Oxygen", "Hydrogen"], 0, "Plants use carbon dioxide and water to make food during photosynthesis."),
    question("Which method separates insoluble sand from water?", ["Filtration", "Magnetism", "Freezing"], 0, "A filter traps insoluble sand while water passes through."),
    question("What is the main source of energy for the water cycle?", ["The Sun", "The Moon", "The soil"], 0, "The Sun heats water and drives evaporation in the water cycle."),
    question("Which nutrient is mainly needed for growth and repair of body tissues?", ["Protein", "Fibre", "Water"], 0, "Proteins help the body grow and repair tissues."),
    question("What force pulls objects towards the Earth?", ["Gravity", "Friction", "Magnetism"], 0, "Gravity attracts objects towards the Earth."),
    question("Which practice can reduce soil erosion on a slope?", ["Planting grass and trees", "Removing all vegetation", "Leaving the soil bare"], 0, "Plant roots hold soil together and vegetation slows moving water."),
    question("What happens to a bulb when a switch opens a simple circuit?", ["It goes off.", "It becomes a battery.", "It always gets brighter."], 0, "An open switch breaks the circuit, stopping current from flowing."),
    question("Which of these is a renewable source of energy?", ["Wind", "Coal", "Petroleum"], 0, "Wind is naturally replenished and is a renewable energy source."),
    question("Why should a thermometer be read at eye level?", ["To avoid reading errors from the viewing angle", "To make the liquid warmer", "To change the temperature"], 0, "Reading at eye level helps avoid parallax error."),
    question("Which planet is known as the Red Planet?", ["Mars", "Venus", "Saturn"], 0, "Iron-rich dust gives Mars its reddish appearance."),
  ],
  "Social Studies": [
    question("What does a map key explain?", ["The meaning of symbols used on a map", "The population of every town", "The weather next year"], 0, "A map key or legend explains what the map's symbols represent."),
    question("A map scale shows that 1 cm represents 5 km. What ground distance does 4 cm represent?", ["20 km", "9 km", "4 km"], 0, "Multiply the map distance by the scale: 4 × 5 = 20 km."),
    question("Which direction is opposite east on a compass?", ["West", "North", "South"], 0, "West is opposite east on a compass."),
    question("Which is an example of a natural resource?", ["River water", "A plastic chair", "A paved road"], 0, "River water occurs in nature and is a natural resource."),
    question("Why do communities have rules and laws?", ["To guide behaviour and protect people's rights", "To stop people working together", "To make services unavailable"], 0, "Rules and laws help maintain order and protect people in a community."),
    question("Which service is mainly provided by a county government in Kenya?", ["County health services", "Printing Kenyan currency", "Defending the country's borders"], 0, "County governments are responsible for county health services."),
    question("What is one benefit of people from different communities living peacefully together?", ["They can share ideas and cooperate.", "They must give up all their traditions.", "They cannot solve local problems."], 0, "Peaceful coexistence supports cooperation and exchange of ideas."),
    question("Which activity is most likely to cause soil erosion?", ["Cutting down vegetation on a steep slope", "Planting trees on a hillside", "Making terraces on a farm"], 0, "Removing vegetation leaves soil exposed to wind and running water."),
    question("What is the main purpose of a population census?", ["To collect information about the people living in a country", "To measure every road", "To record the names of all wild animals"], 0, "A census gathers information about a country's population."),
    question("Which action shows responsible citizenship?", ["Taking part in keeping the community clean", "Damaging public property", "Ignoring community safety rules"], 0, "Responsible citizens contribute to the wellbeing of their community."),
  ],
  "Christian Religious Education": [
    question("Which value is shown when a learner returns a lost pencil to its owner?", ["Honesty", "Jealousy", "Pride"], 0, "Returning something that belongs to another person shows honesty."),
    question("In the parable of the Good Samaritan, what did the Samaritan show the injured man?", ["Compassion", "Greed", "Unkindness"], 0, "The Samaritan cared for a stranger in need, showing compassion."),
    question("Which action is an example of caring for God's creation?", ["Planting and caring for trees", "Dumping waste in a river", "Wasting clean water"], 0, "Caring for plants and keeping the environment clean are ways to care for creation."),
    question("What is one way Christians use the Bible?", ["To learn about their faith and guidance for life", "To replace all school subjects", "To predict the exact weather"], 0, "The Bible contains Christian teachings and guidance."),
    question("Which action helps promote peace after a disagreement?", ["Listening and apologising when appropriate", "Spreading rumours", "Encouraging revenge"], 0, "Listening and apologising can help people resolve disagreements peacefully."),
    question("What does forgiveness encourage people to do?", ["Let go of resentment and seek peace", "Plan to take revenge", "Continue to hurt one another"], 0, "Forgiveness means choosing not to seek revenge and working towards peace."),
    question("Which action shows respect for other people's property?", ["Asking permission before borrowing an item", "Taking an item without asking", "Damaging a borrowed item"], 0, "Asking permission shows respect for the owner's rights."),
    question("Why do Christians pray?", ["To communicate with God", "To avoid helping others", "To replace all learning"], 0, "Prayer is a way Christians communicate with God."),
    question("Which action shows responsibility at school?", ["Completing an agreed class duty", "Blaming others for every mistake", "Leaving shared materials scattered"], 0, "Completing an agreed duty shows responsibility."),
    question("How can learners show kindness to a new classmate?", ["Welcome them and offer help", "Ignore them", "Make fun of their questions"], 0, "Welcoming and helping a new learner is a practical act of kindness."),
  ],
  "Creative Arts and Sports": [
    question("Which two primary paint colours can be mixed to make orange?", ["Red and yellow", "Blue and yellow", "Blue and red"], 0, "Mixing red and yellow pigments produces orange."),
    question("Why might an artist make a sketch before creating a final picture?", ["To plan the arrangement of the artwork", "To make the paper heavier", "To avoid choosing colours"], 0, "A sketch helps an artist plan the composition before completing the artwork."),
    question("What does rhythm describe in music?", ["The pattern of sounds and beats over time", "The size of the audience", "The colour of an instrument"], 0, "Rhythm is the pattern of beats, sounds and silences in music."),
    question("What should learners do before vigorous physical activity?", ["Warm up gradually", "Hold their breath", "Skip all movement"], 0, "A warm-up prepares the body gradually for more demanding movement."),
    question("Which action demonstrates fair play in a team game?", ["Respecting the rules and other players", "Changing the score secretly", "Blaming teammates for every mistake"], 0, "Fair play means following rules and showing respect to everyone involved."),
    question("Which item is suitable for safely cleaning a paintbrush after watercolour painting?", ["Clean water", "Cooking oil", "Dry sand"], 0, "Water is used to rinse water-based paint from brushes."),
    question("Why should sports equipment be checked before use?", ["To identify damage that could cause injury", "To make the game longer", "To change the rules"], 0, "Checking equipment helps identify hazards before an activity starts."),
    question("Which movement skill is used when a player sends a ball to a teammate?", ["Passing", "Sleeping", "Balancing a book"], 0, "Passing sends the ball from one player to another."),
    question("What is the purpose of a cool-down after exercise?", ["To help the body return gradually to resting condition", "To make the body stop breathing", "To replace drinking water"], 0, "A cool-down helps the body return gradually to its resting state."),
    question("Which material can be reused to make a simple percussion instrument?", ["A clean tin with secured edges", "A sharp piece of glass", "A leaking chemical container"], 0, "A clean, safe reused container can be turned into a percussion instrument."),
  ],
};

export function getUpperPrimaryQuestions(
  gradeId: string,
  subject: string,
): PracticeQuestion[] | undefined {
  if (!["grade-4", "grade-5", "grade-6"].includes(gradeId)) {
    return undefined;
  }

  const questions = upperPrimaryQuestionBank[subject];
  if (!questions) {
    return undefined;
  }

  const gradeNumber = Number(gradeId.slice(-1));
  return questions.map((item, index) => {
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
