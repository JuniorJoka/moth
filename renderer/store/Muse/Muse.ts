import create from 'zustand';
import channel from '../../../shared/lib/ipc-channels';
import { MuseMeta } from '../../../shared/types/moth';
import AudioPlayer from '../../lib/audioPlayer';
import MuseState, { MuseMap, PlayerActions, PlayState } from './Muse.types';
import { Actions, groupBy } from '../utils';

export default create<MuseState>((set, get) => ({
  Muse: [],

  MuseByArtist: new Map(),

  MuseByAlbum: new Map(),

  activeMuse: undefined,
  activeMuseIndex: undefined,

  activePlayList: [],

  player: undefined,

  playState: PlayState.paused,

  populateMuse: async () => {
    const Muse = await global.ipcRenderer.invoke(channel.muse.READY);
    set({ Muse });
  },

  groupByArtist: () => {
    const MuseByArtist: MuseMap = groupBy(get().Muse, 'artist');
    set({ MuseByArtist });
  },

  groupByAlbum: () => {
    const MuseByAlbum: MuseMap = groupBy(get().Muse, 'album');
    set({ MuseByAlbum });
  },

  setActiveMuse: async (muse: MuseMeta, index: number) => {
    set({ activeMuse: muse, activeMuseIndex: index });
  },

  // TODO: Assign proper instance of audio player to player
  initializePlayer: () => set({ player: undefined }),

  setPlayState: (playState: PlayState) => set({ playState }),

  setActivePlayList: (activePlayList: MuseMeta[]) => set({ activePlayList }),

  emit: async (action: PlayerActions) => {
    const activePlaylist = get().activePlayList;
    const activeIndex = get().activeMuseIndex;
    if (!activePlaylist) return;

    switch (action) {
      case PlayerActions.next: {
        const nextActiveIndex = Actions.get.next(activePlaylist.length, activeIndex as number);
        get().setActiveMuse(activePlaylist[nextActiveIndex], nextActiveIndex);
        break;
      }

      case PlayerActions.previous: {
        const nextActiveIndex = Actions.get.previous(activePlaylist.length, activeIndex as number);
        get().setActiveMuse(activePlaylist[nextActiveIndex], nextActiveIndex);
        break;
      }

      case PlayerActions.playPause: {
        await Actions.playPause(get().player as AudioPlayer, get().setPlayState);
        break;
      }

      default:
    }
  },
}));
