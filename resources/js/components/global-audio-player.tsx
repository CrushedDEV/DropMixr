import { useState, useRef, useEffect, ReactNode } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { AudioPlayerContext, Track } from '@/contexts/audio-player-context';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';

interface AudioPlayerProviderProps {
    children: ReactNode;
}

export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);

    // Audio Processing Refs (from BeatCard)
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const filtersConnected = useRef(false);
    const lfoIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lowPassRef = useRef<BiquadFilterNode | null>(null);

    const { props } = usePage();
    const user = (props.auth as any).user;
    const isAdmin = user?.is_admin;

    // --- Audio Logic from BeatCard ---

    const setupAudioFilters = () => {
        if (isAdmin) return; // Admins get pure audio
        if (!audioRef.current || filtersConnected.current) return;

        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContextClass();
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaElementSource(audioRef.current);
            sourceRef.current = source;

            const lowPassFilter = audioContext.createBiquadFilter();
            lowPassFilter.type = 'lowpass';
            lowPassFilter.frequency.value = 800;
            lowPassFilter.Q.value = 10;
            lowPassRef.current = lowPassFilter;

            const highPassFilter = audioContext.createBiquadFilter();
            highPassFilter.type = 'highpass';
            highPassFilter.frequency.value = 100;

            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.8;

            source.connect(lowPassFilter);
            lowPassFilter.connect(highPassFilter);
            highPassFilter.connect(gainNode);
            gainNode.connect(audioContext.destination);

            filtersConnected.current = true;
            startLFO();
        } catch (error) {
            console.error('Error setting up audio filters:', error);
        }
    };

    const startLFO = () => {
        if (lfoIntervalRef.current) return;
        let phase = 0;
        const updateFilter = () => {
            if (!lowPassRef.current) return;
            phase += Math.PI / 30;
            if (phase > Math.PI * 2) phase = 0;
            const minFreq = 150;
            const maxFreq = 8000;
            const freq = minFreq + ((Math.sin(phase) + 1) / 2) * (maxFreq - minFreq);
            lowPassRef.current.frequency.value = freq;
        };
        lfoIntervalRef.current = setInterval(updateFilter, 50);
    };

    const stopLFO = () => {
        if (lfoIntervalRef.current) {
            clearInterval(lfoIntervalRef.current);
            lfoIntervalRef.current = null;
        }
    };

    // --- State Management ---
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const audioBlobUrl = useRef<string | null>(null);

    const loadAudioBlob = async (url: string) => {
        setIsLoadingAudio(true);
        try {
            // Determine the URL to fetch
            // If it's a relative path (not starting with http/blob), append origin or leave it
            // If your track.url is already a full URL to /storage/..., we should change it to /mashups/{id}/stream
            // BUT for now, user might have old data.
            // Ideally, we fetch whatever URL is given but with headers.

            // However, browsers block cross-origin fetches with custom headers unless CORS allows it.
            // Assuming same-origin for now (local dev or production relative).

            // Construct new URL if needed, or use existing. 
            // The User requested "no se pueda descargar... buscando el audio source". 
            // So we blindly convert the given URL to a Blob via Ajax.

            let fetchUrl = url;

            // Optimization: If it looks like a direct storage URL, assume we want to proxy it if we implemented that?
            // Actually, we implemented /mashups/{id}/stream. 
            // But 'currentTrack' only has 'url' property currently. 
            // We should use the track.id to construct the stream URL if possible, OR expect track.url to be the stream url.
            // Let's assume we construct it: `/mashups/${id}/stream`

            // Fallback: if existing URL is passed and ID exists, prefer the stream route?
            // Yes, to enforce the header check on backend.
            if (currentTrack?.id && !url.startsWith('blob:')) {
                fetchUrl = `/mashups/${currentTrack.id}/stream`;
            }

            const response = await fetch(fetchUrl, {
                headers: {
                    'X-dropmixr-Stream': 'true', // The secret handshake
                    'Accept': 'audio/mpeg, audio/*'
                }
            });

            if (!response.ok) throw new Error(`Audio fetch failed: ${response.statusText}`);

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            // Cleanup old blob to prevent memory leaks
            if (audioBlobUrl.current) {
                URL.revokeObjectURL(audioBlobUrl.current);
            }

            audioBlobUrl.current = blobUrl;
            return blobUrl;

        } catch (error) {
            console.error("Secure audio fetch error:", error);
            setIsLoadingAudio(false);
            return null;
        }
    };

    const play = async (track: Track) => {
        if (currentTrack?.id === track.id) {
            // Resume
            if (audioRef.current) {
                audioRef.current.play();
                setIsPlaying(true);
            }
        } else {
            // New track
            setIsPlaying(true); // Optimistic UI
            setCurrentTrack(track); // Triggers effect
            // Note: actual fetching happens in the useEffect hook to keep it reactive
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggle = (track: Track) => {
        if (currentTrack?.id === track.id) {
            if (isPlaying) pause();
            else play(track);
        } else {
            play(track);
        }
    };

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setProgress(time);
        }
    };

    // Sync Audio with State
    useEffect(() => {
        const syncAudio = async () => {
            if (!currentTrack) return;

            // PREPARE SOURCE (Blob Strategy)
            if (currentTrack.id !== (audioRef.current as any)?._loadedTrackId) {
                // Clean state
                if (audioRef.current) {
                    audioRef.current.pause();
                    (audioRef.current as any)._loadedTrackId = null;
                }

                const blobUrl = await loadAudioBlob(currentTrack.url);

                if (blobUrl && audioRef.current) {
                    audioRef.current.src = blobUrl;
                    (audioRef.current as any)._loadedTrackId = currentTrack.id;
                    setIsLoadingAudio(false);
                }
            }

            if (!audioRef.current) return;

            // Only setup filters once we have interaction/track
            if (!filtersConnected.current) {
                setupAudioFilters();
            }

            if (isPlaying && !isLoadingAudio) {
                try {
                    if (audioContextRef.current?.state === 'suspended') {
                        await audioContextRef.current.resume();
                    }
                    await audioRef.current.play();
                } catch (e) {
                    console.error("Play failed", e);
                    setIsPlaying(false);
                }
            } else if (!isPlaying) {
                audioRef.current.pause();
            }
        };
        syncAudio();
    }, [currentTrack, isPlaying]);

    // Handle Volume (unchanged)
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Format time helper
    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };

    // Cleanup
    useEffect(() => {
        return () => {
            stopLFO();
            if (audioBlobUrl.current) URL.revokeObjectURL(audioBlobUrl.current);
        };
    }, []);

    return (
        <AudioPlayerContext.Provider value={{
            currentTrack,
            isPlaying,
            volume,
            progress,
            duration,
            play,
            pause,
            toggle,
            seek,
            setVolume
        }}>
            {children}

            {/* Hidden Audio Element - src is managed manually via blob */}
            <audio
                ref={audioRef}
                crossOrigin="anonymous"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onError={(e) => console.error('Audio playback error', e)}
                className="hidden"
            />

            {/* Persistent Bottom Player UI */}
            {currentTrack && (
                <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-[100] shadow-2xl animate-in slide-in-from-bottom duration-300">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        {/* Track Info */}
                        <div className="flex items-center gap-4 w-1/4">
                            <div className="w-12 h-12 rounded bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg overflow-hidden relative">
                                {currentTrack.image ? (
                                    <img src={currentTrack.image} alt={currentTrack.title} className="w-full h-full object-cover" />
                                ) : (
                                    <Music className="w-6 h-6 text-white" />
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="text-white font-medium truncate">{currentTrack.title}</h4>
                                <p className="text-gray-400 text-xs truncate">{currentTrack.artist}</p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col items-center flex-1 max-w-2xl">
                            <div className="flex items-center gap-6 mb-1">
                                <button className="text-gray-400 hover:text-white transition-colors" onClick={() => seek(progress - 10)}>
                                    <SkipBack className="w-5 h-5" />
                                </button>
                                <button
                                    className="w-10 h-10 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg"
                                    onClick={() => isPlaying ? pause() : play(currentTrack)}
                                >
                                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                                </button>
                                <button className="text-gray-400 hover:text-white transition-colors" onClick={() => seek(progress + 10)}>
                                    <SkipForward className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="w-full flex items-center gap-3 text-xs text-gray-400">
                                <span className="min-w-[40px] text-right">{formatTime(progress)}</span>
                                <div
                                    className="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer relative group"
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const percent = (e.clientX - rect.left) / rect.width;
                                        seek(percent * duration);
                                    }}
                                >
                                    <div
                                        className="absolute top-0 left-0 h-full bg-pink-500 rounded-full"
                                        style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <span className="min-w-[40px]">{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Volume & Extras */}
                        <div className="flex items-center justify-end gap-3 w-1/4">
                            <div className="flex items-center gap-2 group">
                                <Volume2 className="w-5 h-5 text-gray-400" />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AudioPlayerContext.Provider>
    );
}
