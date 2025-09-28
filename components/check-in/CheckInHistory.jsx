'use client'
import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { checkInsAPI, getAuthToken, handleAPIError } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  History,
  Download,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

const moodEmojis = {
  1: '😢', 2: '😔', 3: '😐', 4: '🙂', 5: '😊',
  6: '😄', 7: '🤗', 8: '🥳', 9: '🌟', 10: '✨'
};

const getMoodColor = (mood) => {
  if (mood <= 3) return 'text-red-500';
  if (mood <= 5) return 'text-orange-500';
  if (mood <= 7) return 'text-blue-500';
  return 'text-green-500';
};

const getEnergyColor = (energy) => {
  if (energy <= 3) return 'text-red-500';
  if (energy <= 5) return 'text-orange-500';
  if (energy <= 7) return 'text-blue-500';
  return 'text-green-500';
};

const getTrendIcon = (current, previous) => {
  if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-gray-500" />;
};

export default function CheckInHistory({ teamId = null, userId = null }) {
  const { user } = useAuth();
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7');
  const [sortBy, setSortBy] = useState('date');

  // Load check-ins from backend API
  useEffect(() => {
    if (user) {
      loadCheckIns();
    }
  }, [user, teamId, userId, timeRange]);

  const loadCheckIns = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      let response;
      if (teamId) {
        // Get team check-ins
        const params = {
          limit: 100,
          include_anonymous: true
        };
        response = await checkInsAPI.getTeamCheckIns(token, teamId, params);
      } else {
        // Get personal check-ins
        const params = {
          limit: 100
        };
        response = await checkInsAPI.getPersonalCheckIns(token, params);
      }

      // Transform backend data to match component expectations
      const transformedCheckIns = response.checkIns.map(checkIn => ({
        id: checkIn.id,
        date: checkIn.created_at.split('T')[0],
        mood: checkIn.mood_score,
        energy: checkIn.energy_level,
        notes: checkIn.content,
        isAnonymous: checkIn.is_anonymous,
        timestamp: checkIn.created_at,
        sentimentLabel: checkIn.sentiment_label,
        sentimentScore: checkIn.sentiment_score
      }));

      setCheckIns(transformedCheckIns);
    } catch (err) {
      const errorMessage = handleAPIError(err, 'Failed to load check-ins');
      setError(errorMessage);
      console.error('Failed to load check-ins:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort check-ins
  const filteredCheckIns = useMemo(() => {
    const days = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    let filtered = checkIns.filter(checkIn =>
      new Date(checkIn.date) >= cutoffDate
    );

    // Sort by selected criteria
    switch (sortBy) {
      case 'mood':
        filtered.sort((a, b) => b.mood - a.mood);
        break;
      case 'energy':
        filtered.sort((a, b) => b.energy - a.energy);
        break;
      case 'date':
      default:
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
    }

    return filtered;
  }, [checkIns, timeRange, sortBy]);
  // Calculate averages and trends
  const stats = useMemo(() => {
    if (filteredCheckIns.length === 0) return null;

    const avgMood = filteredCheckIns.reduce((sum, ci) => sum + ci.mood, 0) / filteredCheckIns.length;
    const avgEnergy = filteredCheckIns.reduce((sum, ci) => sum + ci.energy, 0) / filteredCheckIns.length;

    // Calculate trend (compare first half vs second half)
    const midPoint = Math.floor(filteredCheckIns.length / 2);
    const recentHalf = filteredCheckIns.slice(0, midPoint);
    const olderHalf = filteredCheckIns.slice(midPoint);

    const recentAvgMood = recentHalf.length > 0 ?
      recentHalf.reduce((sum, ci) => sum + ci.mood, 0) / recentHalf.length : 0;
    const olderAvgMood = olderHalf.length > 0 ?
      olderHalf.reduce((sum, ci) => sum + ci.mood, 0) / olderHalf.length : 0;

    const recentAvgEnergy = recentHalf.length > 0 ?
      recentHalf.reduce((sum, ci) => sum + ci.energy, 0) / recentHalf.length : 0;
    const olderAvgEnergy = olderHalf.length > 0 ?
      olderHalf.reduce((sum, ci) => sum + ci.energy, 0) / olderHalf.length : 0;

    return {
      avgMood: avgMood.toFixed(1),
      avgEnergy: avgEnergy.toFixed(1),
      moodTrend: recentAvgMood - olderAvgMood,
      energyTrend: recentAvgEnergy - olderAvgEnergy,
      totalCheckIns: filteredCheckIns.length
    };
  }, [filteredCheckIns]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const exportData = () => {
    const csvContent = [
      'Date,Mood,Energy,Notes',
      ...filteredCheckIns.map(ci =>
        `${ci.date},${ci.mood},${ci.energy},"${ci.notes.replace(/"/g, '""')}"`
      )
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `check-in-history-${timeRange}days.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center min-h-96 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading check-ins...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-red-500 rounded"></div>
              <p className="text-red-700">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setError(null);
                  loadCheckIns();
                }}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Check-in History
              </CardTitle>
              <CardDescription>
                Track your wellness journey over time
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="14">Last 2 weeks</SelectItem>
                  <SelectItem value="30">Last month</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">By Date</SelectItem>
                  <SelectItem value="mood">By Mood</SelectItem>
                  <SelectItem value="energy">By Energy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Mood</p>
                  <p className="text-2xl font-bold">{stats.avgMood}/10</p>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(stats.moodTrend, 0)}
                  <span className="text-2xl">{moodEmojis[Math.round(stats.avgMood)] || '😊'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Energy</p>
                  <p className="text-2xl font-bold">{stats.avgEnergy}/10</p>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(stats.energyTrend, 0)}
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Check-ins</p>
                <p className="text-2xl font-bold">{stats.totalCheckIns}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">Consistency</p>
                <p className="text-2xl font-bold">
                  {Math.round((stats.totalCheckIns / parseInt(timeRange)) * 100)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Check-ins List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCheckIns.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No check-ins found for the selected period</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCheckIns.map((checkIn, index) => {
                const prevCheckIn = filteredCheckIns[index + 1];
                return (
                  <div
                    key={checkIn.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-1 min-w-16">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(checkIn.date)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(checkIn.timestamp).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Mood:</span>
                          <span className="text-2xl">{moodEmojis[checkIn.mood]}</span>
                          <span className={cn("font-medium", getMoodColor(checkIn.mood))}>
                            {checkIn.mood}/10
                          </span>
                          {prevCheckIn && getTrendIcon(checkIn.mood, prevCheckIn.mood)}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Energy:</span>
                          <span className={cn("font-medium", getEnergyColor(checkIn.energy))}>
                            {checkIn.energy}/10
                          </span>
                          {prevCheckIn && getTrendIcon(checkIn.energy, prevCheckIn.energy)}
                        </div>
                      </div>

                      {checkIn.notes && (
                        <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                          "{checkIn.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}