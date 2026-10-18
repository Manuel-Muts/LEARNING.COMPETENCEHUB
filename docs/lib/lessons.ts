export type LessonQuestion = {
  prompt: string;
  options: string[];
};

export type Lesson = {
  slug: string;
  subject: string;
  title: string;
  description: string;
  duration: string;
  questions: LessonQuestion[];
};

export const lessons: Record<string, Lesson> = {
  "math-numbers": {
    slug: "math-numbers",
    subject: "MATHEMATICS · GRADE 8",
    title: "Numbers & operations",
    description: "Warm up with a few questions on number operations.",
    duration: "About 5 minutes",
    questions: [
      {
        prompt: "What is the value of 3 × (8 + 4)?",
        options: ["28", "36", "24", "60"],
      },
      {
        prompt: "Which fraction is equivalent to 3/4?",
        options: ["6/10", "9/12", "12/20", "15/24"],
      },
      {
        prompt: "A book costs KSh 240. How much do 3 books cost?",
        options: ["KSh 480", "KSh 620", "KSh 720", "KSh 840"],
      },
    ],
  },
  "science-matter": {
    slug: "science-matter",
    subject: "SCIENCE · GRADE 8",
    title: "States of matter",
    description:
      "Let’s see what you remember about solids, liquids and gases.",
    duration: "About 5 minutes",
    questions: [
      {
        prompt: "Which state of matter has a fixed shape and a fixed volume?",
        options: ["A gas", "A solid", "A liquid", "Plasma"],
      },
      {
        prompt: "What happens to water when it reaches its boiling point?",
        options: [
          "It freezes into a solid",
          "It becomes a gas",
          "It turns into a different element",
          "It stops moving",
        ],
      },
      {
        prompt: "Which statement best describes the particles in a liquid?",
        options: [
          "They are tightly packed and cannot move",
          "They are far apart and move freely in every direction",
          "They are close together and can slide past one another",
          "They do not have any energy",
        ],
      },
      {
        prompt: "What is the change of state from a gas to a liquid called?",
        options: ["Melting", "Evaporation", "Condensation", "Sublimation"],
      },
      {
        prompt: "Why does a gas fill the entire container it is in?",
        options: [
          "Its particles are fixed in place",
          "Its particles move freely and spread out",
          "Its particles have no mass",
          "The container pulls the particles outward",
        ],
      },
    ],
  },
  "english-reading": {
    slug: "english-reading",
    subject: "ENGLISH · GRADE 8",
    title: "Reading for meaning",
    description: "Use clues in a sentence to understand what it means.",
    duration: "About 5 minutes",
    questions: [
      {
        prompt:
          "Read: “The farmer carefully planted seeds after the first rains.” What does carefully tell us?",
        options: [
          "The farmer planted in a hurry",
          "The farmer took care while planting",
          "The farmer planted before the rains",
          "The farmer planted large seeds",
        ],
      },
      {
        prompt:
          "Which word is closest in meaning to “enormous” in “An enormous tree shaded the path”?",
        options: ["Tiny", "Ancient", "Very large", "Very tall"],
      },
      {
        prompt:
          "“Although it was cloudy, the children went outside to play.” What does although show?",
        options: [
          "The children stayed indoors",
          "The cloudy weather did not stop them",
          "The children made the clouds",
          "It started raining while they played",
        ],
      },
    ],
  },
};
