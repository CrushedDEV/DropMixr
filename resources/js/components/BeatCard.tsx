// BeatCard.tsx
import { Link, usePage } from '@inertiajs/react';
import { UserIcon, Play, Pause, Coins, Volume2, ShoppingCart } from 'lucide-react';
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
    <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-end p-4 transition-opacity duration-300 ${isThisPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'}`}>

      {/* Play/Pause Button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <button
          onClick={handleClickPlayPause}
          className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform pointer-events-auto cursor-pointer"
        >
          {isThisPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 flex flex-col gap-2 mt-auto pt-8 pointer-events-auto">

        {/* Progress */}
        <div className="flex items-center gap-2 text-xs font-medium text-white/90">
          <span className="min-w-[30px] text-right">{formatTime(displayProgress)}</span>
          <input
            type="range"
            min="0"
            max={displayDuration || 100}
            value={displayProgress}
            onChange={handleSeek}
            onClick={(e) => e.stopPropagation()}
            disabled={!isCurrentTrack}
            className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className="min-w-[30px]">{formatTime(displayDuration)}</span>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 justify-end">
          <div className="flex items-center gap-2 group/volume bg-black/40 px-2 py-1 rounded-full">
            <Volume2 className="w-3 h-3 text-gray-300" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => { e.stopPropagation(); setVolume(parseFloat(e.target.value)); }}
              onClick={(e) => e.stopPropagation()}
              className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div className={`group relative flex items-center gap-3 p-3 rounded-xl border transition-all ${isThisPlaying ? 'bg-gray-800/80 border-pink-500/30' : 'bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 hover:border-pink-500/30'}`}>

        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img src={image} alt={title} className="w-full h-full object-cover" />

          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <button
              onClick={handleClickPlayPause}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
            >
              {isThisPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className={`text-sm font-semibold truncate ${isThisPlaying ? 'text-pink-400' : 'text-white'}`}>{title}</h3>
              <p className="text-xs text-gray-400 truncate">{user}</p>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-12 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                title={`Volumen: ${Math.round(volume * 100)}%`}
              />
            </div>
          </div>

          <div className={`flex items-center gap-2 text-[10px] text-gray-400 mt-2 transition-opacity duration-200 ${isThisPlaying || 'group-hover:opacity-100 opacity-60'}`}>
            <span className="w-8 text-right">{formatTime(displayProgress)}</span>
            <input
              type="range"
              min="0"
              max={displayDuration || 100}
              value={displayProgress}
              onChange={handleSeek}
              disabled={!isCurrentTrack}
              className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:rounded-full disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="w-8">{formatTime(displayDuration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 border-l border-gray-800 pl-3">
          <div className="hidden sm:flex flex-col items-end gap-1 text-[10px] text-gray-500">
            <span>{bpm} BPM</span>
            <span>{tonalidad}</span>
          </div>

          <Link href={`/mashups/${id}/download`}>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg text-xs font-bold text-white transition-all shadow-lg hover:shadow-pink-500/25">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Comprar</span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-black/20 rounded text-[10px] ml-1">
                <Coins className="w-3 h-3 text-yellow-400" />
                {downloadCost}
              </span>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // GRID VIEW
  return (
    <div className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-700 ${isThisPlaying ? 'scale-110 blur-[2px]' : 'group-hover:scale-105'}`}
        />

        {renderControls()}

        {!isThisPlaying && (
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none group-hover:opacity-0 transition-opacity">
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-full">
              <div className="w-1 h-1 rounded-full bg-pink-500 animate-pulse"></div>
              <span className="text-[9px] font-medium text-white/80 uppercase">Preview</span>
            </div>

            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
              <Play className="w-4 h-4 text-white ml-0.5" />
            </div>

            <div className="absolute bottom-2 left-2">
              <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] font-medium text-white">
                {bpm} BPM
              </span>
            </div>
          </div>
        )}

      </div>

      <div className="p-3 bg-gray-900 relative z-20">
        <h3 className="text-sm font-semibold text-white truncate mb-0.5 group-hover:text-pink-400 transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <UserIcon className="w-3 h-3" />
            <span className="truncate max-w-[80px]">{user}</span>
          </div>

          {/* Buy Button */}
          <Link href={`/mashups/${id}/download`}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg text-[10px] font-bold text-white transition-all shadow-md hover:shadow-pink-500/25">
              <ShoppingCart className="w-3 h-3" />
              <span>Comprar</span>
              <span className="flex items-center gap-0.5 bg-black/20 px-1 py-0.5 rounded text-[9px] ml-0.5">
                <Coins className="w-2.5 h-2.5 text-yellow-400" />
                {downloadCost}
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BeatCard;
