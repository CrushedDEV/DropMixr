// BeatCard.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UserIcon } from 'lucide-react';

interface BeatCardProps {
  id: number;
  user: string;
  bpm: number;
  tonalidad: string;
  image: string;
  audio: string;
  onPlayPause: (index: number) => void;
  index: number;
}

const BeatCard = ({ id, user, bpm, tonalidad, image, audio, onPlayPause, index }: BeatCardProps) => {
  return (
    <Card key={id} className="bg-transparent border border-gray-700 rounded-lg p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
      <CardHeader className="relative">
        <img
          src={image}
          alt={`Mashup ${id}`}
          className="w-full h-40 object-cover rounded-md"
        />
      </CardHeader>
      <CardContent className="flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <UserIcon className="w-6 h-6 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">{user}</span>
          </div>
          <Button onClick={() => onPlayPause(index)} className="bg-indigo-600 text-white hover:bg-indigo-700">
            Play/Pause
          </Button>
        </div>
        <div className="mt-2 text-sm text-gray-400 flex space-x-4">
          <span>BPM: {bpm}</span>
          <span>Tonalidad: {tonalidad}</span>
        </div>
        <audio id={`audio-${index}`} src={audio} className="mt-4 w-full" />
      </CardContent>
    </Card>
  );
};

export default BeatCard;
