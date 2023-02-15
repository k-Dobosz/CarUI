/* eslint-disable jsx-a11y/media-has-caption */
import {
  RiPlayFill,
  RiPauseFill,
  RiSkipForwardFill,
  RiSkipBackFill,
  RiMusic2Fill,
} from 'react-icons/ri';
import './music.scss';
import { useEffect, useRef, useState } from 'react';
import Visualization from './visualization';
import img from './artwork.png';
import song from './audio.mp3';

export default function Music() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [demandTime, setDemandTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playPauseHandler = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    const dmin = Math.floor(time / 60);
    const dsec = Math.floor(time) - dmin * 60;

    return `${(dmin < 10 ? '0' : '') + dmin}:${(dsec < 10 ? '0' : '') + dsec}`;
  };

  useEffect(() => {
    if (!audioRef.current) return undefined;

    audioRef.current.currentTime = demandTime;
  }, [demandTime]);

  return (
    <>
      <div id="music">
        <section id="music-info">
          <section id="artwork">
            {img ? (
              <img src={img} alt="Artwork" />
            ) : (
              <div className="img-placeholder">
                <RiMusic2Fill size="4em" />
              </div>
            )}
          </section>
          <section id="info">
            <h2 id="info-artist">Artist name</h2>
            <h1 id="info-song">Song name</h1>
            <input
              type="range"
              name=""
              id="timeline"
              min="0"
              max={duration}
              value={audioRef.current?.currentTime}
              onChange={(e) => setDemandTime(e.target.value)}
            />
            <div id="time">
              <span id="currentTime">{currentTime}</span>{' '}
              <span id="durationTime">{formatTime(duration)}</span>
            </div>
            <audio
              src={song}
              ref={audioRef}
              onTimeUpdate={(e) =>
                setCurrentTime(formatTime(e.target.currentTime))
              }
              onLoadedData={(e) => setDuration(e.target.duration)}
            />
            <Visualization audioRef={audioRef} />
          </section>
        </section>
        <section id="music-control">
          <button type="button">music list</button>
          <button type="button">
            <RiSkipBackFill size="3em" />
          </button>
          <button type="button" id="playpause" onClick={playPauseHandler}>
            {isPlaying ? <RiPauseFill size="3em" /> : <RiPlayFill size="3em" />}
          </button>
          <button type="button">
            <RiSkipForwardFill size="3em" />
          </button>
          <button type="button">repeat</button>
        </section>
      </div>
    </>
  );
}
