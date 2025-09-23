'use client'
import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import SpeechToTextInput from '@/components/ui/speech-to-text-input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle,
  Smile,
  Meh,
  Frown,
  Battery,
  User,
  MessageSquare,
  Send,
  Loader2,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

const moodEmojis = [
  { value: 1, emoji: '😢', label: 'Very Sad', color: 'text-red-500' },
  { value: 2, emoji: '😔', label: 'Sad', color: 'text-red-400' },
  { value: 3, emoji: '😐', label: 'Neutral', color: 'text-gray-500' },
  { value: 4, emoji: '🙂', label: 'Good', color: 'text-blue-500' },
  { value: 5, emoji: '😊', label: 'Happy', color: 'text-green-500' },
  { value: 6, emoji: '😄', label: 'Very Happy', color: 'text-green-600' },
  { value: 7, emoji: '🤗', label: 'Excited', color: 'text-green-700' },
  { value: 8, emoji: '🥳', label: 'Elated', color: 'text-green-800' },
  { value: 9, emoji: '🌟', label: 'Amazing', color: 'text-green-900' },
  { value: 10, emoji: '✨', label: 'Perfect', color: 'text-yellow-500' }
];

const energyLevels = [
  { value: 1, label: 'Exhausted', color: 'text-red-500' },
  { value: 2, label: 'Very Low', color: 'text-red-400' },
  { value: 3, label: 'Low', color: 'text-orange-500' },
  { value: 4, label: 'Below Average', color: 'text-orange-400' },
  { value: 5, label: 'Average', color: 'text-gray-500' },
  { value: 6, label: 'Above Average', color: 'text-blue-400' },
  { value: 7, label: 'Good', color: 'text-blue-500' },
  { value: 8, label: 'High', color: 'text-green-500' },
  { value: 9, label: 'Very High', color: 'text-green-600' },
  { value: 10, label: 'Energized', color: 'text-green-700' }
];

export default function QuickCheckInForm({ onSubmit, onCancel, isLoading = false }) {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    mood: [7],
    energy: [7],
    notes: '',
    isAnonymous: false,
    date: new Date().toISOString()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSliderChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const checkInData = {
        mood: formData.mood[0],
        energy: formData.energy[0],
        notes: formData.notes.trim(),
        isAnonymous: formData.isAnonymous,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      };

      if (onSubmit) {
        await onSubmit(checkInData);
        success({
          title: "Check-in submitted!",
          description: "Your check-in has been recorded successfully."
        });
      }

      setFormData({
        mood: [7],
        energy: [7],
        notes: '',
        isAnonymous: false,
        date: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to submit check-in:', err);
      error({
        title: "Submission failed",
        description: "Unable to submit your check-in. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodEmoji = (value) => {
    const mood = moodEmojis.find(m => m.value === value) || moodEmojis[6];
    return mood;
  };

  const getEnergyLevel = (value) => {
    const energy = energyLevels.find(e => e.value === value) || energyLevels[6];
    return energy;
  };

  const currentMood = getMoodEmoji(formData.mood[0]);
  const currentEnergy = getEnergyLevel(formData.energy[0]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <CheckCircle className="h-6 w-6 text-primary" />
          Quick Check-in
        </CardTitle>
        <CardDescription>
          Share how you're feeling today with your team
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium flex items-center gap-2">
                <Smile className="h-5 w-5" />
                How are you feeling?
              </Label>
              <div className="flex items-center gap-2">
                <span className={cn("text-2xl", currentMood.color)}>
                  {currentMood.emoji}
                </span>
                <span className={cn("text-sm font-medium", currentMood.color)}>
                  {currentMood.label}
                </span>
              </div>
            </div>
            <Slider
              value={formData.mood}
              onValueChange={(value) => handleSliderChange('mood', value)}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>😢 Very Sad</span>
              <span>😐 Neutral</span>
              <span>✨ Perfect</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium flex items-center gap-2">
                <Battery className="h-5 w-5" />
                What's your energy level?
              </Label>
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-medium", currentEnergy.color)}>
                  {formData.energy[0]}/10
                </span>
                <span className={cn("text-sm font-medium", currentEnergy.color)}>
                  {currentEnergy.label}
                </span>
              </div>
            </div>
            <Slider
              value={formData.energy}
              onValueChange={(value) => handleSliderChange('energy', value)}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>🔋 Exhausted</span>
              <span>⚡ Average</span>
              <span>🚀 Energized</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Additional thoughts (optional)
            </Label>
            <SpeechToTextInput
              value={formData.notes}
              onChange={(value) => setFormData(prev => ({ ...prev, notes: value }))}
              placeholder="Anything else you'd like to share about how you're feeling?"
              maxLength={500}
              continuous={true}
              timeout={30000}
              silenceTimeout={3000}
              showAudioLevel={true}
              showTranscript={true}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <EyeOff className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium">Submit Anonymously</Label>
                <p className="text-xs text-muted-foreground">
                  Your check-in will be included in team metrics without identifying you
                </p>
              </div>
            </div>
            <Switch
              checked={formData.isAnonymous}
              onCheckedChange={(checked) =>
                setFormData(prev => ({ ...prev, isAnonymous: checked }))
              }
            />
          </div>
        </CardContent>

        <CardFooter className="gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex-1"
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Check-in
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}