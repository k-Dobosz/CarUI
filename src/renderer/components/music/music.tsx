import {
  RiPlayFill,
  RiPauseFill,
  RiSkipForwardFill,
  RiSkipBackFill,
  RiMusic2Fill,
} from 'react-icons/ri';
import './music.scss';
import { useEffect, useRef, useState } from 'react';
import jsmediatags from 'jsmediatags';
import Visualization from './visualization';
import song from './audio.mp3';

type CurrentSongType = {
  title: string;
  artist: string;
  coverImage: string;
  currentTime: number;
  duration: number;
};

export default function Music() {
  const audioRef = useRef<HTMLAudioElement>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [demandTime, setDemandTime] = useState<number>(0);
  const [currentSong, setCurrentSong] = useState<CurrentSongType>({
    title: 'Song name',
    artist: 'Artist name',
    coverImage: '',
    currentTime: 0,
    duration: 0,
  });
  const { ipcRenderer } = window.electron;

  const updateCurrentSong = (inputData) => {
    setCurrentSong({ ...currentSong, ...inputData });
  };

  const formatTime = (time: number): string => {
    const dmin = Math.floor(time / 60);
    const dsec = Math.floor(time) - dmin * 60;

    return `${(dmin < 10 ? '0' : '') + dmin}:${(dsec < 10 ? '0' : '') + dsec}`;
  };

  const playPauseHandler = (): void => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const convertImageDataToBase64 = (imageData: Array<number>): String => {
    return Buffer.from(imageData).toString('base64');
  };

  useEffect(() => {
    if (!audioRef.current) return undefined;

    audioRef.current.currentTime = demandTime;
  }, [demandTime]);

  useEffect(() => {
    jsmediatags.read(audioRef.current.src, {
      onSuccess: ({ tags }) => {
        updateCurrentSong({
          title: tags.title,
          artist: tags.artist,
          coverImage: `data:${
            tags.picture.format
          };base64, ${convertImageDataToBase64(tags.picture.data)}`,
        });
      },
      onError: (error) => {
        console.log(':(', error.type, error.info);
      },
    });
  }, [audioRef.current?.src]);

  return (
    <div id="music">
      <section id="music-info">
        <section id="artwork">
          {currentSong.coverImage ? (
            <img src={currentSong.coverImage} alt="Artwork" />
          ) : (
            <div className="img-placeholder">
              <RiMusic2Fill size="4em" />
            </div>
          )}
        </section>
        <section id="info">
          <h2>{currentSong.artist}</h2>
          <h1>{currentSong.title}</h1>
          <input
            type="range"
            name=""
            id="timeline"
            min="0"
            max={currentSong.duration}
            value={audioRef.current?.currentTime || 0}
            onChange={(e) => setDemandTime(Number(e.target.value))}
          />
          <div id="time">
            <span id="currentTime">{formatTime(currentSong.currentTime)}</span>{' '}
            <span id="durationTime">{formatTime(currentSong.duration)}</span>
          </div>
          <audio
            src={song}
            ref={audioRef}
            onTimeUpdate={(e) =>
              updateCurrentSong({
                currentTime: e.target.currentTime,
              })
            }
            onLoadedData={(e) =>
              updateCurrentSong({ duration: e.target.duration })
            }
          />
          <Visualization audioRef={audioRef} />
        </section>
      </section>
      <section id="music-control">
        <button type="button">music list</button>
        <button
          type="button"
          onClick={() => {
            ipcRenderer.sendMessage('carplay-sendkey', [{ key: 'prev' }]);
          }}
        >
          <RiSkipBackFill size="3em" />
        </button>
        <button type="button" id="playpause" onClick={playPauseHandler}>
          {isPlaying ? <RiPauseFill size="3em" /> : <RiPlayFill size="3em" />}
        </button>
        <button
          type="button"
          onClick={() => {
            ipcRenderer.sendMessage('carplay-sendkey', [{ key: 'next' }]);
          }}
        >
          <RiSkipForwardFill size="3em" />
        </button>
        <button type="button">repeat</button>
      </section>
    </div>
  );
}
