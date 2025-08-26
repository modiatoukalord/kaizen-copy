
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  audioUrl: string;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => setIsPlaying(false);

    if (audio) {
      audio.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <audio ref={audioRef} src={audioUrl} preload="auto" />
      <Button onClick={togglePlayPause} variant="ghost" size="icon" className="h-8 w-8">
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <div className="text-xs text-muted-foreground">Note vocale</div>
    </div>
  );
}
