import { useState } from "react";
import { GameIntro } from "@/components/GameIntro";
import { GameRound } from "@/components/GameRound";
import { GameResults } from "@/components/GameResults";

type GameStage = "intro" | "round1" | "round2" | "round3" | "round4" | "round5" | "results";

interface Choices {
  medicalTech: string;
  aerospace: string;
  aiRobotics: string;
  quantumComputing: string;
  biotechnology: string;
}

const rounds = [
  {
    number: 1,
    title: "MEDICAL TECHNOLOGY",
    question: "🏥 How should India revolutionize healthcare technology?",
    choices: [
      {
        icon: "🤖",
        title: "AI-Powered Diagnostics",
        description: "Machine learning for disease detection and treatment",
        value: "ai-diagnostics"
      },
      {
        icon: "🧬",
        title: "Genetic Medicine",
        description: "Personalized treatments and gene therapy",
        value: "genetic-medicine"
      },
      {
        icon: "📱",
        title: "Telemedicine Network",
        description: "Remote healthcare access for rural areas",
        value: "telemedicine"
      }
    ]
  },
  {
    number: 2,
    title: "AEROSPACE & SPACE TECH",
    question: "🚀 What should be India's space exploration priority?",
    choices: [
      {
        icon: "🛰️",
        title: "Satellite Network",
        description: "Communication, GPS, and monitoring systems",
        value: "satellite-network"
      },
      {
        icon: "🌙",
        title: "Moon & Mars Missions",
        description: "Deep space exploration and colonization",
        value: "deep-space"
      },
      {
        icon: "✈️",
        title: "Commercial Space Travel",
        description: "Space tourism and private sector partnerships",
        value: "commercial-space"
      }
    ]
  },
  {
    number: 3,
    title: "AI & ROBOTICS",
    question: "🤖 How should India integrate AI and robotics?",
    choices: [
      {
        icon: "🏭",
        title: "Industrial Automation",
        description: "Smart factories and robotic manufacturing",
        value: "industrial-ai"
      },
      {
        icon: "🏠",
        title: "Consumer AI Products",
        description: "Smart homes, personal assistants, daily tech",
        value: "consumer-ai"
      },
      {
        icon: "🔬",
        title: "Research & Development",
        description: "AI labs, machine learning innovation centers",
        value: "ai-research"
      }
    ]
  },
  {
    number: 4,
    title: "QUANTUM COMPUTING",
    question: "⚛️ Where should India invest in quantum technology?",
    choices: [
      {
        icon: "🔐",
        title: "Quantum Cryptography",
        description: "Unhackable security and data protection",
        value: "quantum-security"
      },
      {
        icon: "💊",
        title: "Drug Discovery",
        description: "Quantum simulations for medicine development",
        value: "quantum-medicine"
      },
      {
        icon: "🌐",
        title: "Quantum Internet",
        description: "Next-gen communication infrastructure",
        value: "quantum-internet"
      }
    ]
  },
  {
    number: 5,
    title: "BIOTECHNOLOGY",
    question: "🧬 What biotech frontier should India lead?",
    choices: [
      {
        icon: "🌾",
        title: "Agricultural Biotech",
        description: "Climate-resistant crops and food security",
        value: "agri-biotech"
      },
      {
        icon: "💉",
        title: "Vaccine Development",
        description: "Rapid response to pandemics and diseases",
        value: "vaccine-dev"
      },
      {
        icon: "♻️",
        title: "Bio-Based Materials",
        description: "Sustainable plastics and biodegradable products",
        value: "bio-materials"
      }
    ]
  }
];

const Index = () => {
  const [stage, setStage] = useState<GameStage>("intro");
  const [choices, setChoices] = useState<Choices>({
    medicalTech: "",
    aerospace: "",
    aiRobotics: "",
    quantumComputing: "",
    biotechnology: ""
  });

  const handleStart = () => {
    setStage("round1");
  };

  const handleRound1Choice = (choice: string) => {
    setChoices(prev => ({ ...prev, medicalTech: choice }));
    setStage("round2");
  };

  const handleRound2Choice = (choice: string) => {
    setChoices(prev => ({ ...prev, aerospace: choice }));
    setStage("round3");
  };

  const handleRound3Choice = (choice: string) => {
    setChoices(prev => ({ ...prev, aiRobotics: choice }));
    setStage("round4");
  };

  const handleRound4Choice = (choice: string) => {
    setChoices(prev => ({ ...prev, quantumComputing: choice }));
    setStage("round5");
  };

  const handleRound5Choice = (choice: string) => {
    setChoices(prev => ({ ...prev, biotechnology: choice }));
    setStage("results");
  };

  const handleReplay = () => {
    setChoices({
      medicalTech: "",
      aerospace: "",
      aiRobotics: "",
      quantumComputing: "",
      biotechnology: ""
    });
    setStage("intro");
  };

  return (
    <>
      {stage === "intro" && <GameIntro onStart={handleStart} />}
      {stage === "round1" && <GameRound round={rounds[0]} onChoice={handleRound1Choice} />}
      {stage === "round2" && <GameRound round={rounds[1]} onChoice={handleRound2Choice} />}
      {stage === "round3" && <GameRound round={rounds[2]} onChoice={handleRound3Choice} />}
      {stage === "round4" && <GameRound round={rounds[3]} onChoice={handleRound4Choice} />}
      {stage === "round5" && <GameRound round={rounds[4]} onChoice={handleRound5Choice} />}
      {stage === "results" && <GameResults choices={choices} onReplay={handleReplay} />}
    </>
  );
};

export default Index;
