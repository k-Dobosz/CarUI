/* eslint-disable jsx-a11y/media-has-caption */
import {
  RiPlayFill,
  RiPauseFill,
  RiSkipForwardFill,
  RiSkipBackFill,
} from 'react-icons/ri';
import './music.css';
import { useEffect, useRef, useState } from 'react';
import Visualization from './visualization';
import img from './artwork.png';
import song from './audio.mp3';
import Topbar from '../topbar/topbar';

export default function Music() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
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
      <Topbar />
      <div id="music">
        <section id="music-info">
          <section id="artwork">
            {img ? <img src={img} alt="Artwork" /> : ''}
          </section>
          <section id="info">
            <div id="info-wrapper">
              <h2>Artist name</h2>
              <h1>Song name</h1>
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
            </div>
          </section>
        </section>
        <section id="music-control">
          <div id="controls">
            <button type="button">music list</button>
            <button type="button">
              <RiSkipBackFill size="3em" />
            </button>
            <button type="button" id="playpause" onClick={playPauseHandler}>
              {isPlaying ? (
                <RiPauseFill size="3em" />
              ) : (
                <RiPlayFill size="3em" />
              )}
            </button>
            <button type="button">
              <RiSkipForwardFill size="3em" />
            </button>
            <button type="button">repeat</button>
          </div>
        </section>
      </div>
    </>
  );
}
