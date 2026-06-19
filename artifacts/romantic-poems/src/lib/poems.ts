export type Poem = {
  id: string;
  title: string;
  bnTitle?: string;
  lines: string[];
  bnLines?: string[];
  mood: string;
};

export const poems: Poem[] = [
  {
    id: "midnight-confession",
    title: "Midnight Confession",
    bnTitle: "মধ্যরাতের স্বীকারোক্তি",
    mood: "longing",
    lines: [
      "The city sleeps, but I am awake,",
      "counting the miles between my breath and yours.",
      "The moon is a thin sliver of silver,",
      "sharp enough to cut the dark,",
      "but it does not bleed.",
      "Only I do, in quiet, invisible ways,",
      "every time I remember the exact weight",
      "of your hand resting in mine."
    ],
    bnLines: [
      "শহর ঘুমিয়ে পড়ে, কিন্তু আমি জেগে আছি,",
      "তোমার শ্বাসের সাথে আমার দূরত্ব মাপছি।",
      "চাঁদ এক টুকরো রুপালি কাস্তে,",
      "অন্ধকার কাটার মতো ধারালো,",
      "কিন্তু সে রক্ত ঝরায় না।",
      "শুধু আমি ঝরাই, নিঃশব্দে, অদৃশ্যভাবে,",
      "যতবার মনে পড়ে",
      "তোমার হাতের ঠিক সেই ভার।"
    ]
  },
  {
    id: "amber-light",
    title: "Amber Light",
    bnTitle: "অ্যাম্বার আলো",
    mood: "tender",
    lines: [
      "In the amber light of morning,",
      "before the world demands our names,",
      "we are just shadows tangled in sheets.",
      "I watch you breathe.",
      "A steady rhythm.",
      "A quiet anchor.",
      "I need nothing else but this."
    ],
    bnLines: [
      "সকালের অ্যাম্বার আলোয়,",
      "পৃথিবী আমাদের নাম ডাকার আগে,",
      "আমরা শুধু চাদরে জড়ানো দুটি ছায়া।",
      "আমি তোমার শ্বাস দেখি।",
      "একটি স্থির ছন্দ।",
      "একটি নিরাপদ নোঙর।",
      "এর বাইরে আর কিছু চাই না।"
    ]
  },
  {
    id: "the-burning",
    title: "The Burning",
    bnTitle: "দহন",
    mood: "passion",
    lines: [
      "Do not ask me to be reasonable.",
      "Reason is for ledgers and cold mornings.",
      "I want the fire.",
      "I want the reckless, sweeping tide.",
      "I want to drown in the dark gravity of your eyes,",
      "until I forget the sound of my own voice."
    ],
    bnLines: [
      "আমাকে যুক্তিযুক্ত হতে বলো না।",
      "যুক্তি হিসাবের খাতা আর ঠান্ডা সকালের জন্য।",
      "আমি আগুন চাই।",
      "আমি চাই উদ্দাম, সর্বগ্রাসী জোয়ার।",
      "তোমার চোখের গভীর মাধ্যাকর্ষণে ডুবে যেতে চাই,",
      "যতক্ষণ না আমি নিজের কণ্ঠস্বর ভুলে যাই।"
    ]
  },
  {
    id: "afterglow",
    title: "Afterglow",
    bnTitle: "পরবর্তী আভা",
    mood: "devotion",
    lines: [
      "They say time erodes all things,",
      "turning mountains into dust.",
      "But I have known you for a thousand lifetimes,",
      "and my heart still stutters",
      "when you say my name."
    ],
    bnLines: [
      "তারা বলে সময় সব কিছু ক্ষয় করে,",
      "পর্বতকে ধুলোয় পরিণত করে।",
      "কিন্তু আমি তোমাকে হাজার জীবন ধরে জেনেছি,",
      "আর তবুও তুমি যখন আমার নাম ধরো",
      "আমার হৃদয় থমকে যায়।"
    ]
  },
  {
    id: "velvet-dark",
    title: "The Velvet Dark",
    bnTitle: "মখমল অন্ধকার",
    mood: "longing",
    lines: [
      "I reached for you in the velvet dark,",
      "my fingers grasping empty air.",
      "A phantom touch, a lingering ghost.",
      "The room is too large now.",
      "The silence is too loud.",
      "Come back.",
      "Bring the morning with you."
    ],
    bnLines: [
      "মখমল অন্ধকারে তোমার দিকে হাত বাড়িয়েছিলাম,",
      "আমার আঙুলগুলো শূন্য বাতাস ধরেছে।",
      "একটি অশরীরী স্পর্শ, একটি দীর্ঘস্থায়ী ছায়া।",
      "ঘরটা এখন অনেক বড়।",
      "নীরবতা অনেক জোরে।",
      "ফিরে এসো।",
      "সঙ্গে করে সকাল নিয়ে এসো।"
    ]
  },
  {
    id: "quiet-storm",
    title: "Quiet Storm",
    bnTitle: "নীরব ঝড়",
    mood: "passion",
    lines: [
      "There is a storm in you,",
      "tucked behind that gentle smile.",
      "I have seen the lightning in your glance,",
      "felt the thunder in your touch.",
      "Let it rain.",
      "I am not afraid of getting wet."
    ],
    bnLines: [
      "তোমার ভেতরে একটি ঝড় আছে,",
      "সেই মৃদু হাসির পেছনে লুকিয়ে।",
      "তোমার দৃষ্টিতে বিদ্যুৎ দেখেছি,",
      "তোমার স্পর্শে বজ্রপাত অনুভব করেছি।",
      "বৃষ্টি নামাও।",
      "ভিজতে আমার ভয় নেই।"
    ]
  },
  {
    id: "sanctuary",
    title: "Sanctuary",
    bnTitle: "আশ্রয়",
    mood: "devotion",
    lines: [
      "You are the quiet room",
      "at the end of a long, loud hallway.",
      "The door closes,",
      "the noise stops.",
      "There is only you,",
      "and the sudden, profound realization",
      "that I am finally home."
    ],
    bnLines: [
      "তুমি সেই নিরিবিলি ঘর",
      "দীর্ঘ, কোলাহলপূর্ণ করিডোরের শেষে।",
      "দরজা বন্ধ হয়,",
      "গোলমাল থামে।",
      "শুধু তুমি আছো,",
      "আর হঠাৎ গভীর উপলব্ধি",
      "যে আমি অবশেষে ঘরে এসেছি।"
    ]
  },
  {
    id: "echoes",
    title: "Echoes",
    bnTitle: "প্রতিধ্বনি",
    mood: "heartbreak",
    lines: [
      "The teacup is still on the table.",
      "The chair is still pulled out.",
      "Everything is exactly as you left it,",
      "except the air has turned to glass,",
      "and my lungs have forgotten how to pull it in."
    ],
    bnLines: [
      "চায়ের কাপটা এখনো টেবিলে।",
      "চেয়ারটা এখনো টেনে বের করা।",
      "সব কিছু ঠিক যেভাবে রেখে গেছো,",
      "শুধু বাতাসটা কাচে পরিণত হয়েছে,",
      "আর আমার ফুসফুস ভুলে গেছে কীভাবে তা টেনে নিতে হয়।"
    ]
  },
  {
    id: "slow-dance",
    title: "The Slow Dance",
    bnTitle: "ধীর নৃত্য",
    mood: "tender",
    lines: [
      "No music playing,",
      "just the hum of the refrigerator",
      "and the rain on the window.",
      "But we sway anyway,",
      "two tired souls holding each other upright.",
      "It is the most beautiful waltz",
      "I have ever known."
    ],
    bnLines: [
      "কোনো সঙ্গীত বাজছে না,",
      "শুধু রেফ্রিজারেটরের গুনগুন",
      "আর জানালায় বৃষ্টির শব্দ।",
      "তবুও আমরা দুলতে থাকি,",
      "দুটি ক্লান্ত আত্মা একে অপরকে সোজা ধরে রেখে।",
      "এটাই সবচেয়ে সুন্দর ওয়ালৎজ",
      "যা আমি কখনো জেনেছি।"
    ]
  }
];
