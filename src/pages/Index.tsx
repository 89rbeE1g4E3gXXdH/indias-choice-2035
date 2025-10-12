import { useState } from "react";
import { GameIntro } from "@/components/GameIntro";
import { GameRound } from "@/components/GameRound";
import { GameResults } from "@/components/GameResults";

type GameStage = "intro" | "round1" | "round2" | "round3" | "results";

interface Choices {
  education: string;
  sustainability: string;
  economy: string;
}

const rounds = [
  {
    number: 1,
    title: "EDUCATION REFORMS",
    question: "🎓 What kind of education system should India focus on?",
    choices: [
      {
        icon: "🧠",
        title: "Skill-Based Learning",
        description: "Practical skills, internships, real-world knowledge",
        value: "skill-based"
      },
      {
        icon: "📚",
        title: "Traditional Academics",
        description: "Emphasis on history, literature, core subjects",
        value: "traditional"
      },
      {
        icon: "💻",
        title: "Tech & Innovation Driven",
        description: "AI, Robotics, Coding from early classes",
        value: "tech-driven"
      }
    ]
  },
  {
    number: 2,
    title: "SUSTAINABILITY & ENVIRONMENT",
    question: "🌿 How should India approach environmental policies?",
    choices: [
      {
        icon: "☀️",
        title: "Green Energy Revolution",
        description: "Solar, wind, hydro power scaling nationwide",
        value: "green-energy"
      },
      {
        icon: "🚯",
        title: "Strict Environmental Laws",
        description: "Hefty fines, pollution control, tree planting",
        value: "strict-laws"
      },
      {
        icon: "♻️",
        title: "Grassroots Movements",
        description: "Community-driven eco programs",
        value: "grassroots"
      }
    ]
  },
  {
    number: 3,
    title: "ECONOMIC GROWTH STRATEGY",
    question: "📈 What economic path should India follow?",
    choices: [
      {
        icon: "🏭",
        title: "Industrial Expansion",
        description: "Mega factories, export-led growth",
        value: "industrial"
      },
      {
        icon: "🧑‍💻",
        title: "Digital Economy Focus",
        description: "Remote work, startups, global tech hub",
        value: "digital"
      },
      {
        icon: "🧘",
        title: "Inclusive & Balanced Growth",
        description: "Rural jobs, healthcare, social equity",
        value: "inclusive"
      }
    ]
  }
];

const Index = () => {
  const [stage, setStage] = useState<GameStage>("intro");
  const [choices, setChoices] = useState<Choices>({
    education: "",
    sustainability: "",
    economy: ""
  });

  const handleStart = () => {
    setStage("round1");
  };

  const handleRound1Choice = (choice: string) => {
    setChoices(prev => ({ ...prev, education: choice }));
    setStage("round2");
  };

  const handleRound2Choice = (choice: string) => {
    setChoices(prev => ({ ...prev, sustainability: choice }));
    setStage("round3");
  };

  const handleRound3Choice = (choice: string) => {
    setChoices(prev => ({ ...prev, economy: choice }));
    setStage("results");
  };

  const handleReplay = () => {
    setChoices({ education: "", sustainability: "", economy: "" });
    setStage("intro");
  };

  return (
    <>
      {stage === "intro" && <GameIntro onStart={handleStart} />}
      {stage === "round1" && <GameRound round={rounds[0]} onChoice={handleRound1Choice} />}
      {stage === "round2" && <GameRound round={rounds[1]} onChoice={handleRound2Choice} />}
      {stage === "round3" && <GameRound round={rounds[2]} onChoice={handleRound3Choice} />}
      {stage === "results" && <GameResults choices={choices} onReplay={handleReplay} />}
    </>
  );
};

export default Index;
