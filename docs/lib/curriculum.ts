export type Grade = {
  id: string;
  label: string;
  band: string;
  subjects: string[];
};

export type SampleQuestion = {
  prompt: string;
  options: string[];
};

type GradeBand = Grade["band"];

const earlyYearsSubjects = [
  "Language",
  "Numberwork",
  "Environmental Activities",
  "Psychomotor",
  "Literacy",
  "Kiswahili",
  "Creative Arts",
  "Christian Religious Education",
  "English",
  "Mathematics",
];

const lowerPrimarySubjects = [
  "Mathematics",
  "Kiswahili",
  "English",
  "Environmental Activities",
  "Social Studies",
  "Christian Religious Education",
  "Creative Arts and Sports",
];

const upperPrimarySubjects = [
  "Mathematics",
  "English",
  "Kiswahili",
  "Science and Technology",
  "Integrated Science",
  "Social Studies",
  "Christian Religious Education",
  "Creative Arts and Sports",
];

const juniorSchoolSubjects = [
  "Mathematics",
  "English",
  "Kiswahili",
  "Integrated Science",
  "Agriculture",
  "Christian Religious Education",
  "Pre-Technical Studies",
  "Creative Arts and Sports",
  "Social Studies",
];

export const grades: Grade[] = [
  { id: "pg", label: "Play Group", band: "Early years", subjects: earlyYearsSubjects },
  { id: "pp1", label: "PP1", band: "Early years", subjects: earlyYearsSubjects },
  { id: "pp2", label: "PP2", band: "Early years", subjects: earlyYearsSubjects },
  ...[1, 2, 3].map((number) => ({
    id: `grade-${number}`,
    label: `Grade ${number}`,
    band: "Lower primary",
    subjects: lowerPrimarySubjects,
  })),
  ...[4, 5, 6].map((number) => ({
    id: `grade-${number}`,
    label: `Grade ${number}`,
    band: "Upper primary",
    subjects: upperPrimarySubjects,
  })),
  ...[7, 8, 9].map((number) => ({
    id: `grade-${number}`,
    label: `Grade ${number}`,
    band: "Junior school",
    subjects: juniorSchoolSubjects,
  })),
];

export function slugifyCurriculumLabel(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function findGrade(id: string): Grade | undefined {
  return grades.find((grade) => grade.id === id);
}

const sampleQuestions: Record<string, Record<GradeBand, SampleQuestion>> = {
  Language: {
    "Early years": { prompt: "Which one is a way we can share our ideas?", options: ["Speaking", "Sleeping", "Running"] },
    "Lower primary": { prompt: "Which sentence is a polite way to ask for help?", options: ["Help me now!", "Please help me, thank you.", "You must help."] },
    "Upper primary": { prompt: "Which word best completes the sentence: “The children ___ reading quietly.”", options: ["is", "are", "was"] },
  },
  Numberwork: {
    "Early years": { prompt: "How many counters are there? ● ● ●", options: ["2", "3", "4"] },
    "Lower primary": { prompt: "What is 28 + 15?", options: ["33", "43", "53"] },
    "Upper primary": { prompt: "What is the value of the digit 6 in 3,642?", options: ["6", "60", "600"] },
  },
  "Environmental Activities": {
    "Early years": { prompt: "What does a young plant need to grow?", options: ["Water", "Plastic", "Smoke"] },
    "Lower primary": { prompt: "Which action helps keep the school compound clean?", options: ["Putting litter in a bin", "Dropping wrappers", "Pouring water on the path"] },
    "Upper primary": { prompt: "Which action can help conserve water at home?", options: ["Leaving a tap running", "Repairing a leaking tap", "Washing one item at a time under a running tap"] },
  },
  Psychomotor: {
    "Early years": { prompt: "Which action uses your body to move from one place to another?", options: ["Hopping", "Listening", "Drawing"] },
    "Lower primary": { prompt: "Which activity helps practise balance?", options: ["Walking along a line", "Reading quietly", "Sorting books"] },
    "Upper primary": { prompt: "What should you do before a vigorous physical activity?", options: ["Warm up", "Skip all movement", "Hold your breath"] },
  },
  Literacy: {
    "Early years": { prompt: "Which letter does the word “sun” begin with?", options: ["S", "M", "T"] },
    "Lower primary": { prompt: "Which group of words makes a complete sentence?", options: ["The small bird", "Birds can fly.", "Can the"] },
    "Upper primary": { prompt: "A story says, “Musa carried an umbrella and his clothes stayed dry.” What can you infer?", options: ["It may have been raining.", "Musa was swimming.", "The umbrella was at home."] },
  },
  Kiswahili: {
    "Early years": { prompt: "Ni salamu gani ya asubuhi?", options: ["Habari za asubuhi", "Usiku mwema", "Kwaheri"] },
    "Lower primary": { prompt: "Chagua wingi wa neno “kitabu”.", options: ["vitabu", "mitabu", "kitabus"] },
    "Upper primary": { prompt: "Kamilisha sentensi: “Wanafunzi ___ darasani.”", options: ["anasoma", "wanasoma", "nilisoma"] },
  },
  "Creative Arts": {
    "Early years": { prompt: "Which tool can you use to draw a picture?", options: ["Crayon", "Spoon", "Cup"] },
    "Lower primary": { prompt: "Which two colours can be mixed to make green paint?", options: ["Blue and yellow", "Red and blue", "Black and white"] },
    "Upper primary": { prompt: "Why might an artist make a quick sketch before a final artwork?", options: ["To plan the composition", "To make the artwork heavier", "To avoid choosing materials"] },
  },
  "Christian Religious Education": {
    "Early years": { prompt: "Which action shows kindness to a friend?", options: ["Sharing", "Pushing", "Hiding their things"] },
    "Lower primary": { prompt: "Which action shows care for a neighbour?", options: ["Helping someone in need", "Laughing when they are hurt", "Refusing to listen"] },
    "Upper primary": { prompt: "Which value is shown by telling the truth even when it is difficult?", options: ["Honesty", "Selfishness", "Carelessness"] },
  },
  English: {
    "Early years": { prompt: "Which word rhymes with “cat”?", options: ["Hat", "Cup", "Sun"] },
    "Lower primary": { prompt: "Choose the correct word: “Yesterday, we ___ to school.”", options: ["walk", "walked", "walking"] },
    "Upper primary": { prompt: "Which word is closest in meaning to “enormous”?", options: ["Tiny", "Very large", "Quiet"] },
  },
  Mathematics: {
    "Early years": { prompt: "How many fingers are on one hand?", options: ["3", "5", "8"] },
    "Lower primary": { prompt: "What is 36 + 27?", options: ["53", "63", "73"] },
    "Upper primary": { prompt: "What is 3/4 + 1/8?", options: ["4/12", "5/8", "7/8"] },
  },
  "Social Studies": {
    "Early years": { prompt: "Who helps keep learners safe at school?", options: ["A teacher", "A toy", "A tree"] },
    "Lower primary": { prompt: "Which is a feature you might find on a map?", options: ["A key or legend", "A cooking recipe", "A musical note"] },
    "Upper primary": { prompt: "Why do communities use symbols on maps?", options: ["To represent places and features", "To show the weather every day", "To replace all place names"] },
  },
  "Creative Arts and Sports": {
    "Early years": { prompt: "Which action is part of a game?", options: ["Throwing a soft ball", "Sleeping in class", "Leaving toys on the floor"] },
    "Lower primary": { prompt: "What should you do before using shared sports equipment?", options: ["Check it is safe", "Throw it at a friend", "Hide it from the group"] },
    "Upper primary": { prompt: "Which action shows fair play during a team game?", options: ["Respecting the rules", "Changing the score secretly", "Blaming teammates"] },
  },
  "Science and Technology": {
    "Early years": { prompt: "Which object gives us light during the day?", options: ["The Sun", "A stone", "A shoe"] },
    "Lower primary": { prompt: "Which material is attracted to a magnet?", options: ["Iron", "Paper", "Wood"] },
    "Upper primary": { prompt: "Which part of a simple electric circuit provides energy?", options: ["A cell or battery", "An open switch", "A plastic ruler"] },
  },
  "Integrated Science": {
    "Early years": { prompt: "Which body part helps you hear sounds?", options: ["Ears", "Elbows", "Knees"] },
    "Lower primary": { prompt: "Which of these is a source of light?", options: ["The Sun", "A book", "A cup"] },
    "Upper primary": { prompt: "What do green plants use sunlight for?", options: ["Making their own food", "Making soil disappear", "Turning water into stone"] },
  },
  Agriculture: {
    "Early years": { prompt: "What can a farmer plant in soil?", options: ["A seed", "A shoe", "A cup"] },
    "Lower primary": { prompt: "Why do crops need water?", options: ["To support their growth", "To make their roots disappear", "To turn leaves into soil"] },
    "Upper primary": { prompt: "Which practice can help protect soil from erosion?", options: ["Planting ground cover", "Removing all vegetation", "Leaving bare slopes exposed"] },
  },
  "Pre-Technical Studies": {
    "Early years": { prompt: "Which tool is safest for cutting paper in class?", options: ["Child-safe scissors with help", "A sharp kitchen knife", "A broken glass piece"] },
    "Lower primary": { prompt: "What should you do before making a simple object?", options: ["Plan what you will make", "Use tools without asking", "Throw away all materials"] },
    "Upper primary": { prompt: "Which item is useful for measuring a straight line?", options: ["A ruler", "A paintbrush", "A sponge"] },
  },
};

export function getSampleQuestion(grade: Grade, subject: string): SampleQuestion | undefined {
  return sampleQuestions[subject]?.[grade.band];
}
