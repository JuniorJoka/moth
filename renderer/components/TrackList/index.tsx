import { MuseState } from "../../lib/types";
import useMuseStore from "../../store/useMuseStore";
import { Track } from "../Track";

const selector = (state: MuseState) => state.Muse;

export const TrackList = () => {
  const tracks = useMuseStore(selector);
  return (
    <div>
      {tracks.map((track) => (
        <Track key={track.title + track.duration} track={track} />
      ))}
    </div>
  );
};