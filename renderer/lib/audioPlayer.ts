import EventEmitter from 'events';
import { threadId } from 'worker_threads';
import Audio from './audio';
import Player from './player';

const UPDATE_INTERVAL = 200;

export default class AudioPlayer extends EventEmitter {
  audioContext: AudioContext;
  nodes: AudioNode[];
  audio: Audio | null;
  volume: any;
  loop: boolean;
  timer: NodeJS.Timer;

  constructor(context: AudioContext) {
    super();

    this.audioContext = context;
    this.nodes = [];
    this.audio = null;

    this.volume = this.audioContext?.createGain();
    this.volume?.connect(this.audioContext.destination);

    this.loop = false;
  }

  load(audio: Audio) {
    this.unload();
    this.audio = audio;
    this.audio.addNode;
  }

  unload() {
    const { audio } = this;

    if (audio) {
      this.stop();
      audio.unload();

      this.emit('audio-unload');
    }
  }

  play() {
    const { audio } = this;

    if (audio) {
      if (audio.playing) {
        this.pause();
      } else {
        audio.play();

        this.timer = setInterval(() => {
          if (!audio.repeat && audio.getPosition() >= 1.0) {
            if (this.loop) {
              this.seek(0);
            } else {
              this.stop();
            }
          }

          this.emit('tick');
        }, UPDATE_INTERVAL);

        this.emit('play');
        this.emit('playback-change');
      }
    }
  }

  pause() {
    const { audio } = this;

    if (audio) {
      audio.pause();

      clearInterval(this.timer);

      this.emit('pause');
      this.emit('playback-change');
    }
  }

  isPaused() {
    // TODO: implement
    return false;
  }

  stop() {
    const { audio } = this;

    if (audio) {
      audio.stop();
      clearInterval(this.timer);
      this.emit('stop');
      this.emit('playback-change');
    }
  }

  seek(val) {
    const { audio } = this;

    if (audio) {
      audio.seek(val);
      this.emit('seek');
    }
  }

  getAudio() {
    return this.audio;
  }

  hasAudio() {
    return !!this.getAudio();
  }

  setSrc(src: string) {
    // TODO: implement func
    return;
  }

  setVolume(val) {
    if (this.volume) {
      this.volume.gain.value = val;
    }
  }

  getVolume() {
    return this.volume.gain.value;
  }

  getCurrentTime() {
    const { audio } = this;

    if (audio) {
      return audio.getCurrentTime();
    }
    return 0;
  }

  getDuration() {
    const { audio } = this;

    if (audio) {
      return audio.getDuration();
    }

    return 0;
  }

  getPosition() {
    const { audio } = this;

    if (audio) {
      return audio.getPosition();
    }

    return 0;
  }

  setLoop(val) {
    this.loop = val;
  }

  isPlaying() {
    return !!(this.audio && this.audio.playing);
  }

  isLooping() {
    return !!this.loop;
  }
}
