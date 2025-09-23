'use client'
import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpeechToText({
  continuous = true,
  interimResults = true,
  lang = 'en-US',
  timeout = 30000,
  onResult,
  onError,
  onEnd,
  onStart
} = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  const recognitionRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Check browser support
  const checkBrowserSupport = useCallback(() => {
    const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    setIsSupported(supported);
    return supported;
  }, []);

  // Initialize speech recognition
  const initializeSpeechRecognition = useCallback(() => {
    if (!isSupported || isInitializedRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    const recognition = recognitionRef.current;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      if (onStart) onStart();
    };

    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      setInterimTranscript(interimText);

      if (finalText) {
        setTranscript(prev => prev + (prev ? ' ' : '') + finalText);
        if (onResult) {
          onResult(finalText);
        }
      }
    };

    recognition.onerror = (event) => {
      const errorMessage = event.error;

      if (errorMessage === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access.');
        setHasPermission(false);
      } else {
        setError(`Speech recognition error: ${errorMessage}`);
      }

      setIsListening(false);
      if (onError) onError(errorMessage);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      if (onEnd) onEnd();
    };

    isInitializedRef.current = true;
  }, [isSupported]);

  // Start listening
  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError('Speech recognition not supported in this browser');
      return false;
    }

    if (!recognitionRef.current) {
      initializeSpeechRecognition();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (isListening) {
      stopListening();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
      recognitionRef.current.start();
      return true;
    } catch (error) {
      setError('Failed to start speech recognition: ' + error.message);
      return false;
    }
  }, [isSupported, isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }, [isListening]);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  // Check microphone permission
  const requestMicrophoneAccess = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      setHasPermission(false);
      setError('Microphone access denied. Please allow microphone access and try again.');
      return false;
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    const supported = checkBrowserSupport();
    if (supported) {
      initializeSpeechRecognition();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    hasPermission,
    audioLevel: 0, // Simplified for debugging
    browserSupport: {
      speechRecognition: isSupported,
      mediaDevices: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      permissions: !!(navigator.permissions)
    },
    startListening,
    stopListening,
    resetTranscript,
    requestMicrophoneAccess
  };
}