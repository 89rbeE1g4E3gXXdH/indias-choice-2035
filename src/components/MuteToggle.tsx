import { Volume2, VolumeX } from "lucide-react";
import { useAudioContext } from "@/contexts/AudioContext";
import { Button } from "@/components/ui/button";

export const MuteToggle = () => {
  const { isMuted, toggleMute } = useAudioContext();

  return (
    <Button
      onClick={toggleMute}
      variant="ghost"
      size="icon"
      className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border border-border hover:bg-muted"
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <VolumeX className="h-5 w-5 text-muted-foreground" />
      ) : (
        <Volume2 className="h-5 w-5 text-primary" />
      )}
    </Button>
  );
};
