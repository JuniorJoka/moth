/* eslint-disable function-paren-newline */
import { useEffect } from 'react';
import { MuseMeta } from '../../shared/types/moth';
import AudioPlayer from '../lib/audioPlayer';
import useMuseStore, { MuseState, PlayerActions, PlayState } from '../store/Muse';

const selector = (
  state: MuseState,
): [MuseMeta, AudioPlayer, (action: PlayerActions) => Promise<void>, PlayState] => [
  state.activeMuse as MuseMeta,
  state.player as AudioPlayer,
  state.emit,
  state.playState,
];

const useMuseControls = (): [MuseMeta, AudioPlayer, (action: PlayerActions) => Promise<void>] => {
  const [active, player, emit, playState] = useMuseStore(selector);

  useEffect(() => {
    if (active) {
      player.setSrc(active.source);
    }

    if (playState === PlayState.playing) {
      emit(PlayerActions.playPause);
    }
  }, [active]);

  return [active, player, emit];
};

export default useMuseControls;
