import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';

const songsList = [
    {
        name: "Low",
        artist: "Lenny Kravitz",
        src: "/1.mp3",
        cover: "assets/1.jpg"
    },
    {
        name: "What You Know",
        artist: "Two Door Cinema Club",
        src: "/2.mp3",
        cover: "assets/2.jpg"
    },
    {
        name: "You Only Live Once",
        artist: "The Strokes",
        src: "/3.mp3",
        cover: "assets/3.jpg"
    }
];

const MusicPlayer = () => {
    const [currentSong, setCurrentSong] = useState(0);
    const [playing, setPlaying] = useState(false);
    const song = useRef(new Audio());
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');

    useEffect(() => {
        loadSong(currentSong);
        song.current.addEventListener('timeupdate', updateProgress);
        song.current.addEventListener('ended', nextSong);

        return () => {
            song.current.removeEventListener('timeupdate', updateProgress);
            song.current.removeEventListener('ended', nextSong);
        };
    }, [currentSong]);

    const loadSong = (index) => {
        const { name, artist, src, cover } = songsList[index];
        song.current.src = src;
        song.current.load();
        song.current.onloadedmetadata = () => {
            setDuration(formatTime(song.current.duration));
            setCurrentTime('0:00');
            setProgress(0);
        };
    };

    const updateProgress = () => {
        if (song.current.duration) {
            const pos = (song.current.currentTime / song.current.duration) * 100;
            setProgress(pos);
            setCurrentTime(formatTime(song.current.currentTime));
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const togglePlayPause = () => {
        if (playing) {
            song.current.pause();
        } else {
            song.current.play();
        }
        setPlaying(!playing);
    };

    const nextSong = () => {
        setCurrentSong((currentSong + 1) % songsList.length);

        setPlaying(true);
    };

    const prevSong = () => {
        setCurrentSong((currentSong - 1 + songsList.length) % songsList.length);

        setPlaying(true);
    };

    const playMusic = () => {
        loadSong(currentSong);
        song.current.play();
        setPlaying(true);
    };

    const seek = (e) => {
        const pos = (e.nativeEvent.offsetX / e.target.clientWidth) * song.current.duration;
        song.current.currentTime = pos;
    };

    // useEffect to handle auto-play when the currentSong changes
    useEffect(() => {
        if (playing) {
            song.current.play();
        } else {
            song.current.pause();
        }
    }, [currentSong, playing]);

    return (
        <div className="containerMusic">
            <div className="cover" id="cover">
                <img loading='lazy' src="./DiscoGif.webp" alt="" />
            </div>
            <div className="song-info">
                <h4 className="song-name">{songsList[currentSong].name}</h4>
                <h5 className="artist-name">{songsList[currentSong].artist}</h5>

            </div>
            <div className="progress-container" onClick={seek}>
                <div className="progress-bar">
                    <div className="fill-bar" style={{ width: `${progress}%` }}></div>
                </div>
                <div className='time-container'>
                    <div className="time ">{currentTime} - {duration}</div>
                </div>
            </div>
            <div className="controls">
                <button id="prev" onClick={prevSong}>
                    <FontAwesomeIcon width={30} size='xl' icon={faBackward} />
                </button>
                <button id="play" onClick={togglePlayPause}>
                    <FontAwesomeIcon width={30} size='xl' icon={playing ? faPause : faPlay} />
                </button>
                <button id="next" onClick={nextSong}>
                    <FontAwesomeIcon width={30} size='xl' icon={faForward} />
                </button>
            </div>

        </div>
    );
};

export default MusicPlayer;
