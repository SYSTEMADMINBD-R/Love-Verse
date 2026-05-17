export type Poem = {
  id: string;
  title: string;
  lines: string[];
  mood: string;
};

export const poems: Poem[] = [
  {
    id: "midnight-confession",
    title: "Midnight Confession",
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
    ]
  },
  {
    id: "amber-light",
    title: "Amber Light",
    mood: "tender",
    lines: [
      "In the amber light of morning,",
      "before the world demands our names,",
      "we are just shadows tangled in sheets.",
      "I watch you breathe.",
      "A steady rhythm.",
      "A quiet anchor.",
      "I need nothing else but this."
    ]
  },
  {
    id: "the-burning",
    title: "The Burning",
    mood: "passion",
    lines: [
      "Do not ask me to be reasonable.",
      "Reason is for ledgers and cold mornings.",
      "I want the fire.",
      "I want the reckless, sweeping tide.",
      "I want to drown in the dark gravity of your eyes,",
      "until I forget the sound of my own voice."
    ]
  },
  {
    id: "afterglow",
    title: "Afterglow",
    mood: "devotion",
    lines: [
      "They say time erodes all things,",
      "turning mountains into dust.",
      "But I have known you for a thousand lifetimes,",
      "and my heart still stutters",
      "when you say my name."
    ]
  },
  {
    id: "velvet-dark",
    title: "The Velvet Dark",
    mood: "longing",
    lines: [
      "I reached for you in the velvet dark,",
      "my fingers grasping empty air.",
      "A phantom touch, a lingering ghost.",
      "The room is too large now.",
      "The silence is too loud.",
      "Come back.",
      "Bring the morning with you."
    ]
  },
  {
    id: "quiet-storm",
    title: "Quiet Storm",
    mood: "passion",
    lines: [
      "There is a storm in you,",
      "tucked behind that gentle smile.",
      "I have seen the lightning in your glance,",
      "felt the thunder in your touch.",
      "Let it rain.",
      "I am not afraid of getting wet."
    ]
  },
  {
    id: "sanctuary",
    title: "Sanctuary",
    mood: "devotion",
    lines: [
      "You are the quiet room",
      "at the end of a long, loud hallway.",
      "The door closes,",
      "the noise stops.",
      "There is only you,",
      "and the sudden, profound realization",
      "that I am finally home."
    ]
  },
  {
    id: "echoes",
    title: "Echoes",
    mood: "heartbreak",
    lines: [
      "The teacup is still on the table.",
      "The chair is still pulled out.",
      "Everything is exactly as you left it,",
      "except the air has turned to glass,",
      "and my lungs have forgotten how to pull it in."
    ]
  },
  {
    id: "slow-dance",
    title: "The Slow Dance",
    mood: "tender",
    lines: [
      "No music playing,",
      "just the hum of the refrigerator",
      "and the rain on the window.",
      "But we sway anyway,",
      "two tired souls holding each other upright.",
      "It is the most beautiful waltz",
      "I have ever known."
    ]
  }
];
