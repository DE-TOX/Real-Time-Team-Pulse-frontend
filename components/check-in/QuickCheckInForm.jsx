'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { checkInsAPI, teamsAPI, getAuthToken, handleAPIError } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  { value: 5, emoji: '😊', label: 'Very Happy', color: 'text-green-500' }
];

const energyLevels = [
  { value: 1, label: 'Exhausted', color: 'text-red-500' },
  { value: 2, label: 'Low', color: 'text-red-400' },
  { value: 3, label: 'Average', color: 'text-gray-500' },
  { value: 4, label: 'Good', color: 'text-blue-500' },
  { value: 5, label: 'Energized', color: 'text-green-500' }
];

export default function QuickCheckInForm({ teamId = null, onSubmit, onCancel, isLoading = false }) {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    mood: [4], // Changed from 7 to 4 (middle of 1-5 scale)
    energy: [4], // Changed from 7 to 4 (middle of 1-5 scale)
    notes: '',
    isAnonymous: false,
    date: new Date().toISOString()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(teamId);
  const [userTeams, setUserTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(!teamId); // Only load teams if teamId not provided

  // Load user teams if no teamId provided
  useEffect(() => {
    if (!teamId && user) {
      loadUserTeams();
    }
  }, [teamId, user]);

  const loadUserTeams = async () => {
    try {
      setTeamsLoading(true);
      const token = await getAuthToken();
      if (!token) return;

      const teams = await teamsAPI.getUserTeams(token);
      setUserTeams(teams);

      // Auto-select first team if only one team
      if (teams.length === 1) {
        setSelectedTeamId(teams[0].id);
      }
    } catch (err) {
      console.error('Failed to load teams:', err);
    } finally {
      setTeamsLoading(false);
    }
  };

  const handleSliderChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!selectedTeamId) {
        throw new Error('Please select a team for your check-in');
      }

      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const checkInData = {
        content: formData.notes.trim() || 'Quick check-in',
        mood_score: formData.mood[0],
        energy_level: formData.energy[0],
        is_anonymous: formData.isAnonymous,
        input_method: 'text'
      };

      // Submit to backend API
      const result = await checkInsAPI.submitCheckIn(token, selectedTeamId, checkInData);

      // Call parent onSubmit if provided
      if (onSubmit) {
        await onSubmit(result);
      }

      success({
        title: "Check-in submitted!",
        description: "Your check-in has been recorded successfully."
      });

      // Reset form
      setFormData({
        mood: [4], // Reset to middle of 1-5 scale
        energy: [4], // Reset to middle of 1-5 scale
        notes: '',
        isAnonymous: false,
        date: new Date().toISOString()
      });

    } catch (err) {
      const errorMessage = handleAPIError(err, 'Failed to submit check-in');
      setSubmitError(errorMessage);
      showError({
        title: "Check-in failed",
        description: errorMessage
      });
      console.error('Failed to submit check-in:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodEmoji = (value) => {
    const mood = moodEmojis.find(m => m.value === value) || moodEmojis[2]; // Default to neutral (index 2)
    return mood;
  };

  const getEnergyLevel = (value) => {
    const energy = energyLevels.find(e => e.value === value) || energyLevels[2]; // Default to average (index 2)
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
          {/* Error Display */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-red-500 rounded"></div>
                <p className="text-red-700 text-sm">{submitError}</p>
              </div>
            </div>
          )}

          {/* Team Selector - only show if no teamId provided */}
          {!teamId && (
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <User className="h-5 w-5" />
                Select Team
              </Label>
              {teamsLoading ? (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Loading your teams...</span>
                </div>
              ) : userTeams.length > 0 ? (
                <Select value={selectedTeamId || ''} onValueChange={setSelectedTeamId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a team for your check-in" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No teams found. You need to join a team first to submit check-ins.
                </div>
              )}
            </div>
          )}

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
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>😢 Very Sad</span>
              <span>😐 Neutral</span>
              <span>😊 Very Happy</span>
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
              max={5}
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
            disabled={isSubmitting || isLoading || (!teamId && !selectedTeamId)}
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