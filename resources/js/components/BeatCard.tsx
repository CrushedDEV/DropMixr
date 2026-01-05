// BeatCard.tsx
import { Link, usePage } from '@inertiajs/react';
import { UserIcon, Play, Pause, Coins, Volume2, ShoppingCart, Music } from 'lucide-react';
import { useAudioPlayer } from '@/contexts/audio-player-context';
import React from 'react';

interface BeatCardProps {
  id: number;
  title: string;
  user: string;
  bpm: number;
  tonalidad: string;
  image: string;
  audio: string;
  index: number;
  viewMode?: 'grid' | 'list';
}

const BeatCard = ({ id, title, user, bpm, tonalidad, image, audio, index, viewMode = 'grid' }: BeatCardProps) => {
  const { settings } = usePage().props as any;
  const downloadCost = settings?.credit_cost_download ?? 1;

  const { currentTrack, isPlaying, toggle, progress, duration, seek, volume, setVolume } = useAudioPlayer();

  const isCurrentTrack = currentTrack?.id === id;
  const isThisPlaying = isCurrentTrack && isPlaying;
  const displayProgress = isCurrentTrack ? progress : 0;
  const displayDuration = isCurrentTrack ? duration : 0;

  // Handle Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCurrentTrack) {
      seek(parseFloat(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle Click
  const handleClickPlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle({
      id,
      url: audio,
      title,
      artist: user,
      image
    });
  };

  // Render Controls Helper
  const renderControls = () => (
    <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col justify-end p-4 transition-all duration-300 ${isThisPlaying ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:visible group-hover:opacity-100'}`}>

      {/* Center Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={handleClickPlayPause}
          className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-105 hover:bg-white/20 transition-all cursor-pointer"
        >
          {isThisPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-1" />}
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 flex flex-col gap-3 mt-auto pt-8">
        {/* Progress */}
        <div className="flex items-center gap-3 text-[10px] font-medium text-white/80 select-none">
          <span className="w-8 text-right tabular-nums">{formatTime(displayProgress)}</span>
          <div className="relative flex-1 h-1 bg-white/20 rounded-full overflow-hidden group/seek">
            <input
              type="range"
              min="0"
              max={displayDuration || 100}
              value={displayProgress}
              onChange={handleSeek}
              onClick={(e) => e.stopPropagation()}
              disabled={!isCurrentTrack}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            <div
              className="absolute left-0 top-0 h-full bg-white rounded-full pointer-events-none transition-all duration-100"
              style={{ width: `${(displayProgress / (displayDuration || 1)) * 100}%` }}
            />
          </div>
          <span className="w-8 tabular-nums">{formatTime(displayDuration)}</span>
        </div>
      </div>
    </div>
  );

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div className={`group relative flex items-center gap-4 p-3 rounded-lg border transition-all duration-300 ${isThisPlaying ? 'bg-zinc-900 border-zinc-700' : 'bg-transparent border-transparent hover:bg-zinc-900/50 hover:border-zinc-800'}`}>

        {/* Image / Play */}
        <div className="relative w-12 h-12 rounded bg-zinc-800 overflow-hidden flex-shrink-0 group/image">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800">
              <Music className="w-5 h-5 text-zinc-600" />
            </div>
          )}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <button
              onClick={handleClickPlayPause}
              className="text-white transform transition-transform hover:scale-110"
            >
              {isThisPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium truncate ${isThisPlaying ? 'text-pink-500' : 'text-zinc-100'}`}>{title}</h3>
          <p className="text-xs text-zinc-500 truncate">{user}</p>
        </div>

        {/* Metadatos */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800">
            {bpm} BPM
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800">
            {tonalidad}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href={`/mashups/${id}/download`}>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors">
              <span>{downloadCost}</span>
              <Coins className="w-3 h-3 text-yellow-600 fill-yellow-600" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // GRID VIEW (Default)
  return (
    <div className="group flex flex-col gap-3 max-w-[280px]">
      {/* Image Container */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl shadow-black/50">
        {image ? (
          <img
            src={image}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-700 ${isThisPlaying ? 'scale-105' : 'group-hover:scale-105'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800">
            <div className={`w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center transition-transform duration-700 ${isThisPlaying ? 'scale-110' : 'group-hover:scale-110'}`}>
              <Music className="w-10 h-10 text-zinc-700" />
            </div>
          </div>
        )}

        {/* State Indicators (Top Left/Right) */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isThisPlaying && (
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white animate-pulse">
              <Volume2 className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Default Play Overlay (When NOT playing) */}
        {!isThisPlaying && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={handleClickPlayPause}
              className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-105 hover:bg-white/20 transition-all cursor-pointer transform translate-y-4 group-hover:translate-y-0 duration-300"
            >
              <Play className="w-6 h-6 fill-white ml-1" />
            </button>
          </div>
        )}

        {/* Active Controls (When Playing) */}
        {renderControls()}

      </div>

      {/* Info Section */}
      <div className="space-y-1">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <Link href={`/mashups/${id}`} className="block">
              <h3 className="text-base font-semibold text-white truncate hover:text-pink-500 transition-colors cursor-pointer">{title}</h3>
            </Link>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="truncate hover:text-white cursor-pointer transition-colors">{user}</span>
            </div>
          </div>

          {/* Buy Button - Minimal */}
          <Link href={`/mashups/${id}/download`}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all group/btn text-xs font-medium text-white">
              <span>{downloadCost}</span>
              <Coins className="w-3 h-3 text-yellow-500" />
            </button>
          </Link>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-500">
          <span className="px-1.5 py-0.5 rounded-md bg-zinc-900/50 border border-white/5">{bpm} BPM</span>
          <span className="px-1.5 py-0.5 rounded-md bg-zinc-900/50 border border-white/5">{displayDuration ? formatTime(displayDuration) : "--:--"}</span>
          <span className="px-1.5 py-0.5 rounded-md bg-zinc-900/50 border border-white/5">{tonalidad}</span>
        </div>

      </div>
    </div>
  );
};

export default BeatCard;
