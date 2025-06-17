import { useState, useRef } from "react";

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;

    onstart: () => void;
    onend: () => void;
    onerror: (event: Event & { error: string }) => void;
    onresult: (event: SpeechRecognitionEvent) => void;

    start(): void;
    stop(): void;
    abort(): void;
  }

type SpeechRecognitionConstructor = new () => SpeechRecognition;

interface UseVoiceInput {
  startListening: () => void;
  isListening: boolean;
}

export function useVoiceInput(onResult: (transcript: string) => void): UseVoiceInput {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e: Event & { error: string }) => {
      console.error("Speech recognition error:", e.error);
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return { startListening, isListening };
}
