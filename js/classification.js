// Deterministic Article 4 exposure classification — no API call, runs entirely client-side.
const LITRIX_QUESTIONS = [
  {
    id: "size",
    label: "How many people work at your company?",
    options: [
      { value: "micro", label: "1–9 (micro)", points: 0 },
      { value: "small", label: "10–49 (small)", points: 1 },
      { value: "medium", label: "50–249 (medium)", points: 2 },
      { value: "large", label: "250+ (large)", points: 3 }
    ]
  },
  {
    id: "sector",
    label: "Which best describes your sector?",
    options: [
      { value: "general", label: "General business / other", points: 0 },
      { value: "education", label: "Education", points: 1 },
      { value: "hr_recruitment", label: "HR / recruitment services", points: 2 },
      { value: "financial", label: "Financial services", points: 2 },
      { value: "legal", label: "Legal services", points: 2 },
      { value: "healthcare", label: "Healthcare", points: 3 },
      { value: "public_critical", label: "Public sector / critical infrastructure", points: 3 }
    ]
  },
  {
    id: "usage",
    label: "How does your company currently use AI?",
    options: [
      { value: "none", label: "We don't currently use AI tools", points: 0 },
      { value: "off_the_shelf", label: "Off-the-shelf AI tools (chatbots, writing assistants, etc.)", points: 1 },
      { value: "custom_build", label: "We build or customize our own AI systems", points: 2 },
      { value: "people_decisions", label: "AI helps make decisions about people (hiring, credit, eligibility)", points: 3 }
    ]
  },
  {
    id: "role",
    label: "What's your role?",
    options: [
      { value: "founder", label: "Founder / executive", points: 0 },
      { value: "hr", label: "HR / people", points: 0 },
      { value: "it", label: "IT / engineering", points: 0 },
      { value: "compliance", label: "Compliance / legal", points: 0 },
      { value: "other", label: "Other staff", points: 0 }
    ]
  },
  {
    id: "people_affecting",
    label: "Do any AI systems you use make or influence decisions about customers or the public (approval, pricing, eligibility, screening)?",
    options: [
      { value: "no", label: "No", points: 0 },
      { value: "not_sure", label: "Not sure", points: 1 },
      { value: "yes", label: "Yes", points: 3 }
    ]
  },
  {
    id: "training_documented",
    label: "Has your company already documented or delivered AI training to staff?",
    options: [
      { value: "yes", label: "Yes, documented", points: 0 },
      { value: "informal", label: "Informally, no documentation", points: 1 },
      { value: "none", label: "No training at all", points: 2 }
    ]
  }
];

// Thresholds are a starting point tuned for MVP launch, not legal advice — revisit as enforcement guidance clarifies.
function litrixClassify(answers) {
  let score = 0;
  const optionLabels = {};
  for (const q of LITRIX_QUESTIONS) {
    const chosen = q.options.find((o) => o.value === answers[q.id]);
    if (chosen) {
      score += chosen.points;
      optionLabels[q.id] = chosen.label;
    }
  }

  let tier, tierLabel;
  if (score >= 10) {
    tier = "elevated";
    tierLabel = "Elevated exposure";
  } else if (score >= 5) {
    tier = "moderate";
    tierLabel = "Moderate exposure";
  } else {
    tier = "low";
    tierLabel = "Low exposure";
  }

  return { score, tier, tierLabel, answers, optionLabels, classifiedAt: new Date().toISOString() };
}
