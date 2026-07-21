import { Box, useAppSnackbar } from "@/components/zaui";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useMusicQuery } from "@/hooks/useMusicQuery";

import { MusicToggle } from "./MusicToggle";

export function MusicPlayerHost() {
  const { coupleData } = useCoupleData();
  const musicQuery = useMusicQuery(coupleData?.couple.id);
  const musicUrl = musicQuery.data ?? null;
  const player = useMusicPlayer(musicUrl);
  const snackbar = useAppSnackbar();
  if (!musicUrl) return null;

  const toggle = async () => {
    const success = await player.toggle();
    if (success) return;

    snackbar.showError("Không thể phát nhạc nền. Vui lòng thử tệp khác.");
  };

  return (
    <Box className="fixed bottom-[max(18px,env(safe-area-inset-bottom))] right-4 z-30">
      <MusicToggle
        label={getButtonLabel(player.playing, player.error)}
        onToggle={() => void toggle()}
        playing={player.playing}
      />
    </Box>
  );
}

function getButtonLabel(playing: boolean, error: boolean) {
  if (error) return "Thử phát lại nhạc nền";
  if (!playing) return "Phát nhạc nền";

  return "Dừng nhạc nền";
}
