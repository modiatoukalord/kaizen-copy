
'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from './use-toast';

interface UseSpeechRecognitionProps {
  onEnd: () => void;
}

// Type guard for SpeechRecognition
const hasSpeechRecognition = (): boolean =>
  typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

export const useSpeechRecognition = ({ onEnd }: UseSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!hasSpeechRecognition()) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      let errorMessage = 'Une erreur est survenue lors de la reconnaissance vocale.';
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMessage = "L'accès au microphone a été refusé. Veuillez l'autoriser dans les paramètres de votre navigateur.";
      } else if (event.error === 'no-speech') {
        errorMessage = "Aucun son n'a été détecté. Veuillez réessayer.";
      }
      toast({
        variant: 'destructive',
        title: 'Erreur de reconnaissance vocale',
        description: errorMessage,
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      onEnd();
    };

    recognitionRef.current = recognition;
  }, [onEnd]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
        if (!hasSpeechRecognition()) {
            toast({
                variant: 'destructive',
                title: 'Navigateur non compatible',
                description: "La reconnaissance vocale n'est pas prise en charge par votre navigateur.",
            });
            return;
        }
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, startListening, stopListening };
};
