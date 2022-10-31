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

export default function Music() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
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

  useEffect(() => {
    audioRef.current.currentTime = demandTime;
  }, [demandTime]);

  return (
    <div id="music">
      <section id="music-info">
        <section id="artwork">
          <img src={img} alt="Artwork" />
        </section>
        <section id="info">
          <h2>Artist name</h2>
          <h1>Song name</h1>
          <input
            type="range"
            name=""
            id="timeline"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => setDemandTime(e.target.value)}
          />
          <div id="time">
            <span id="currentTime">{currentTime}</span>{' '}
            <span id="durationTime">{duration}</span>
          </div>
          <audio
            src="audio.mp3"
            ref={audioRef}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            onLoadedData={(e) => setDuration(e.target.duration)}
            controls
          />
          <Visualization audioRef={audioRef} />
        </section>
      </section>
      <section id="music-control">
        <div id="controls">
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
        </div>
      </section>
    </div>
  );
}
