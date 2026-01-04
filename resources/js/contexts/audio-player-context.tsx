import { createContext, useContext, ReactNode } from 'react';

export interface Track {
    id: number;
    url: string;
    title: string;
    artist: string;
    image?: string;
}

interface AudioPlayerContextType {
    currentTrack: Track | null;
    isPlaying: boolean;
    volume: number;
    progress: number;
    duration: number;
    play: (track: Track) => void;
    pause: () => void;
    toggle: (track: Track) => void;
    seek: (time: number) => void;
    setVolume: (vol: number) => void;
}

export const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
    const context = useContext(AudioPlayerContext);
    if (!context) {
        throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
    }
    return context;
};
