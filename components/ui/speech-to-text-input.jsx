'use client'
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Mic,
  MicOff,
  Square,
  RotateCcw,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
  CheckCircle,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSpeechToText } from '@/hooks/useSpeechToText';

export function SpeechToTextInput({
  value = '',
  onChange,
  placeholder = 'Start typing or click the microphone to speak...',
  className,
  disabled = false,
  autoFocus = false,
  maxLength = 500,
  continuous = true,
  timeout = 30000,
  silenceTimeout = 3000,
  showAudioLevel = true,
  showTranscript = true,
  variant = 'default',
  size = 'default',
  ...props
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const textareaRef = useRef(null);

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    hasPermission,
    audioLevel,
    browserSupport,
    startListening,
    stopListening,
    resetTranscript,
    requestMicrophoneAccess
  } = useSpeechToText({
    continuous,
    timeout,
    silenceTimeout,
    onResult: (text) => {
      const newValue = localValue + (localValue ? ' ' : '') + text;
      setLocalValue(newValue);
      if (onChange) onChange(newValue);
    },
    onError: (error) => {
      console.error('Speech recognition error:', error);
    },
    onEnd: () => {
      if (transcript) {
        resetTranscript();
      }
    }
  });

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleToggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      if (hasPermission === false) {
        await requestMicrophoneAccess();
      }
      startListening();
    }
  };

  const handleClearText = () => {
    setLocalValue('');
    if (onChange) onChange('');
    resetTranscript();
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm min-h-[60px]';
      case 'lg':
        return 'text-base min-h-[120px]';
      default:
        return 'text-sm min-h-[80px]';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'ghost':
        return 'border-transparent bg-transparent';
      case 'outline':
        return 'border-input bg-background';
      default:
        return '';
    }
  };

  if (!isSupported) {
    return (
      <div className={cn('space-y-2', className)}>
        <Textarea
          ref={textareaRef}
          value={localValue}
          onChange={handleTextChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={cn(getSizeClasses(), getVariantClasses())}
          {...props}
        />
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">
            Speech recognition is not supported in this browser. You can still type manually.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={localValue + (isListening && interimTranscript ? ` ${interimTranscript}` : '')}
          onChange={handleTextChange}
          placeholder={placeholder}
          disabled={disabled || isListening}
          maxLength={maxLength}
          className={cn(
            getSizeClasses(),
            getVariantClasses(),
            isListening && 'ring-2 ring-primary/50 border-primary/50',
            'resize-none transition-all duration-200'
          )}
          {...props}
        />

        {isListening && showAudioLevel && (
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1 bg-primary/10 backdrop-blur-sm rounded-full px-2 py-1">
              <Volume2 className="h-3 w-3 text-primary" />
              <Progress value={audioLevel} className="w-8 h-1" />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={isListening ? "destructive" : "outline"}
            onClick={handleToggleListening}
            disabled={disabled || (!isSupported && !isListening)}
            className={cn(
              "transition-all duration-200",
              isListening && "animate-pulse"
            )}
          >
            {isListening ? (
              <>
                <Square className="h-3 w-3 mr-1" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-3 w-3 mr-1" />
                Speak
              </>
            )}
          </Button>

          {localValue && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleClearText}
              disabled={disabled}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}

          {hasPermission === false && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={requestMicrophoneAccess}
              disabled={disabled}
            >
              <Settings className="h-3 w-3 mr-1" />
              Allow Mic
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isListening && (
            <Badge variant="secondary" className="animate-pulse">
              <Mic className="h-2 w-2 mr-1" />
              Listening...
            </Badge>
          )}

          {hasPermission === true && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-3 w-3" />
              <span>Mic Ready</span>
            </div>
          )}

          {hasPermission === false && (
            <div className="flex items-center gap-1 text-amber-600">
              <AlertCircle className="h-3 w-3" />
              <span>Mic Access Needed</span>
            </div>
          )}

          <span>{localValue.length}/{maxLength}</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {isListening && showTranscript && interimTranscript && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-xs font-medium text-primary">Processing speech...</span>
          </div>
          <p className="text-sm text-muted-foreground italic">
            "{interimTranscript}"
          </p>
        </div>
      )}

      {!browserSupport.speechRecognition && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">
            Your browser doesn't support speech recognition. Try using Chrome, Edge, or Safari.
          </span>
        </div>
      )}

      {!browserSupport.mediaDevices && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">
            Microphone access is not available. Please ensure you're using HTTPS.
          </span>
        </div>
      )}
    </div>
  );
}

export default SpeechToTextInput;