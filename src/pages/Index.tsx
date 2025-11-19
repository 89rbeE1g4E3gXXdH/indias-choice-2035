import { useState } from "react";
import { GameIntro } from "@/components/GameIntro";
import { GameRound } from "@/components/GameRound";
import { GameResults } from "@/components/GameResults";
import { TntBlastTransition } from "@/components/TntBlastTransition";
import { Leaderboard } from "@/components/Leaderboard";

type GameStage = "intro" | "round1" | "round2" | "round3" | "round4" | "round5" | "round6" | "round7" | "round8" | "tnt-blast" | "results" | "leaderboard";

interface Choices {
  medicalTech: string;
  aerospace: string;
  aiRobotics: string;
  quantumComputing: string;
  biotechnology: string;
  greenEnergy: string;
  smartCities: string;
  education: string;
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
  },
  {
    number: 6,
    title: "GREEN ENERGY & SUSTAINABILITY",
    question: "🌱 How should India achieve carbon neutrality?",
    choices: [
      {
        icon: "☀️",
        title: "Solar Revolution",
        description: "Massive solar farms and rooftop installations",
        value: "solar-power"
      },
      {
        icon: "💨",
        title: "Wind & Hydro",
        description: "Offshore wind farms and hydroelectric dams",
        value: "wind-hydro"
      },
      {
        icon: "⚡",
        title: "Nuclear Fusion",
        description: "Clean nuclear energy and fusion reactors",
        value: "nuclear-fusion"
      }
    ]
  },
  {
    number: 7,
    title: "SMART CITIES & INFRASTRUCTURE",
    question: "🏙️ What should define India's smart cities?",
    choices: [
      {
        icon: "🚇",
        title: "Public Transport",
        description: "Metro networks, high-speed rail, electric buses",
        value: "public-transport"
      },
      {
        icon: "🏢",
        title: "Vertical Cities",
        description: "Skyscrapers with vertical farms and parks",
        value: "vertical-cities"
      },
      {
        icon: "🌐",
        title: "IoT Infrastructure",
        description: "Connected cities with smart sensors and AI",
        value: "iot-cities"
      }
    ]
  },
  {
    number: 8,
    title: "EDUCATION & SKILL DEVELOPMENT",
    question: "📚 How should India transform education?",
    choices: [
      {
        icon: "🎮",
        title: "Gamified Learning",
        description: "VR/AR classrooms and interactive education",
        value: "gamified-learning"
      },
      {
        icon: "🤖",
        title: "AI Tutors",
        description: "Personalized AI-powered learning assistants",
        value: "ai-tutors"
      },
      {
        icon: "💼",
        title: "Skill Academies",
        description: "Industry-focused practical training centers",
        value: "skill-academies"
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
    biotechnology: "",
    greenEnergy: "",
    smartCities: "",
    education: ""
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
    setStage("round6");
  };

  const handleRound6Choice = (choice: string) => {
    setChoices(prev => ({ ...prev, greenEnergy: choice }));
    setStage("round7");
  };

  const handleRound7Choice = (choice: string) => {
    setChoices(prev => ({ ...prev, smartCities: choice }));
    setStage("round8");
  };

  const handleRound8Choice = (choice: string) => {
    setChoices(prev => ({ ...prev, education: choice }));
    setStage("tnt-blast");
  };

  const handleTntBlastComplete = () => {
    setStage("results");
  };

  const handleReplay = () => {
    setChoices({
      medicalTech: "",
      aerospace: "",
      aiRobotics: "",
      quantumComputing: "",
      biotechnology: "",
      greenEnergy: "",
      smartCities: "",
      education: ""
    });
    setStage("intro");
  };

  const handleViewLeaderboard = () => {
    setStage("leaderboard");
  };

  return (
    <>
      {stage === "intro" && <GameIntro onStart={handleStart} />}
      {stage === "round1" && <GameRound round={rounds[0]} onChoice={handleRound1Choice} />}
      {stage === "round2" && <GameRound round={rounds[1]} onChoice={handleRound2Choice} />}
      {stage === "round3" && <GameRound round={rounds[2]} onChoice={handleRound3Choice} />}
      {stage === "round4" && <GameRound round={rounds[3]} onChoice={handleRound4Choice} />}
      {stage === "round5" && <GameRound round={rounds[4]} onChoice={handleRound5Choice} />}
      {stage === "round6" && <GameRound round={rounds[5]} onChoice={handleRound6Choice} />}
      {stage === "round7" && <GameRound round={rounds[6]} onChoice={handleRound7Choice} />}
      {stage === "round8" && <GameRound round={rounds[7]} onChoice={handleRound8Choice} />}
      {stage === "tnt-blast" && <TntBlastTransition onComplete={handleTntBlastComplete} />}
      {stage === "results" && <GameResults choices={choices} onReplay={handleReplay} onViewLeaderboard={handleViewLeaderboard} />}
      {stage === "leaderboard" && <Leaderboard onBack={handleReplay} />}
    </>
  );
};

export default Index;
