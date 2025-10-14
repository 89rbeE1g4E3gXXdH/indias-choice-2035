import { Award, Zap, Star, Trophy, Target } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof Award;
  tier: "gold" | "silver" | "bronze";
  unlocked: boolean;
}

interface AchievementBadgeProps {
  achievement: Achievement;
}

export const AchievementBadge = ({ achievement }: AchievementBadgeProps) => {
  const Icon = achievement.icon;
  
  const tierColors = {
    gold: "from-achievement-gold/20 to-achievement-gold/5 border-achievement-gold/40",
    silver: "from-achievement-silver/20 to-achievement-silver/5 border-achievement-silver/40",
    bronze: "from-achievement-bronze/20 to-achievement-bronze/5 border-achievement-bronze/40",
  };

  const iconColors = {
    gold: "text-achievement-gold",
    silver: "text-achievement-silver",
    bronze: "text-achievement-bronze",
  };

  return (
    <div
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-300
        bg-gradient-to-br ${tierColors[achievement.tier]}
        ${achievement.unlocked ? 'animate-bounce-in shadow-achievement' : 'opacity-50 grayscale'}
      `}
    >
      {achievement.unlocked && (
        <div className="absolute -top-2 -right-2 animate-float">
          <div className="bg-primary rounded-full p-1">
            <Star className="w-4 h-4 text-primary-foreground fill-current" />
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-8 h-8 ${achievement.unlocked ? iconColors[achievement.tier] : 'text-muted-foreground'}`} />
        <h3 className="font-bold text-foreground">{achievement.title}</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">{achievement.description}</p>
    </div>
  );
};

export const calculateAchievements = (choices: {
  medicalTech: string;
  aerospace: string;
  aiRobotics: string;
  quantumComputing: string;
  biotechnology: string;
}): Achievement[] => {
  const noEmptyChoices = !Object.values(choices).includes('no_choice');
  const allChoicesMade = Object.values(choices).every(choice => choice !== '');
  const hasAIFocus = choices.medicalTech === 'ai-diagnostics' || choices.aiRobotics === 'ai-research';
  const hasSpaceFocus = choices.aerospace === 'deep-space' || choices.aerospace === 'commercial-space';
  const hasHealthFocus = choices.medicalTech !== 'no_choice' && choices.biotechnology !== 'no_choice';

  return [
    {
      id: 'decisive',
      title: 'Decisive Leader',
      description: 'Made all choices before time ran out',
      icon: Zap,
      tier: 'gold',
      unlocked: noEmptyChoices,
    },
    {
      id: 'visionary',
      title: 'Tech Visionary',
      description: 'Completed all 5 technology rounds',
      icon: Trophy,
      tier: 'gold',
      unlocked: allChoicesMade,
    },
    {
      id: 'ai_pioneer',
      title: 'AI Pioneer',
      description: 'Focused on artificial intelligence advancement',
      icon: Award,
      tier: 'silver',
      unlocked: hasAIFocus,
    },
    {
      id: 'space_explorer',
      title: 'Space Explorer',
      description: 'Prioritized space technology',
      icon: Target,
      tier: 'silver',
      unlocked: hasSpaceFocus,
    },
    {
      id: 'health_champion',
      title: 'Healthcare Champion',
      description: 'Invested in medical and biotech sectors',
      icon: Award,
      tier: 'bronze',
      unlocked: hasHealthFocus,
    },
  ];
};
