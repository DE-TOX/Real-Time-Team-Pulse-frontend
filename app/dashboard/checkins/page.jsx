'use client'
import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import QuickCheckInForm from '../../../components/check-in/QuickCheckInForm';
import { useToast } from '../../../contexts/ToastContext';
import CheckInHistory from '../../../components/check-in/CheckInHistory';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  History,
  Plus,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CheckInsPage() {
  const { user } = useAuth();
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const { success, error, info } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const todayCheckIn = null; // Set to null to show no check-in today
  const streakCount = 5;
  const weeklyGoal = 5;
  const completedThisWeek = 4;

  const handleCheckInSubmit = async (checkInData) => {
    console.log('Submitting check-in:', checkInData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Here you would send the data to your backend
    // await fetch('/api/check-ins', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(checkInData)
    // });

    setShowCheckInForm(false);
    // You might want to refresh the data or show a success message
  };

  const getProgressPercentage = () => {
    return Math.min((completedThisWeek / weeklyGoal) * 100, 100);
  };
   const getStreakEmoji = (count) => {
    if (count >= 30) return '🔥';
    if (count >= 14) return '⭐';
    if (count >= 7) return '💪';
    if (count >= 3) return '🌱';
    return '👍';
  };

  if (showCheckInForm) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <QuickCheckInForm
          onSubmit={handleCheckInSubmit}
          onCancel={() => setShowCheckInForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Check-ins</h1>
          <p className="text-muted-foreground">
            Track your daily wellness and see your progress over time
          </p>
        </div>
        {!todayCheckIn && (
          <Button
            onClick={() => setShowCheckInForm(true)}
            size="lg"
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            Quick Check-in
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Today's Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Check-in
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayCheckIn ? (
                <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Check-in completed!</p>
                    <p className="text-sm text-green-700">
                      Mood: {todayCheckIn.mood}/10 • Energy: {todayCheckIn.energy}/10
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-2">Haven't checked in today</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Take a moment to reflect on how you're feeling
                  </p>
                  <Button onClick={() => setShowCheckInForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Start Check-in
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Streak */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-3xl font-bold">{streakCount}</p>
                    <p className="text-sm text-muted-foreground">days</p>
                  </div>
                  <div className="text-3xl">
                    {getStreakEmoji(streakCount)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Weekly Goal</p>
                    <p className="text-sm font-medium">{completedThisWeek}/{weeklyGoal}</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(getProgressPercentage())}% complete
                  </p>
                  </div>
              </CardContent>
            </Card>

            {/* This Month */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-3xl font-bold">18</p>
                    <p className="text-sm text-muted-foreground">check-ins</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setShowCheckInForm(true)}
                >
                  <CheckCircle className="h-6 w-6" />
                  <span className="text-sm">Quick Check-in</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setActiveTab('history')}
                >
                  <History className="h-6 w-6" />
                  <span className="text-sm">View History</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  disabled
                >
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">View Trends</span>
                  <span className="text-xs text-muted-foreground">Coming Soon</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  disabled
                >
                  <Target className="h-6 w-6" />
                  <span className="text-sm">Set Goals</span>
                  <span className="text-xs text-muted-foreground">Coming Soon</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Wellness Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Consistency is key:</strong> Try to check in at the same time each day to build a healthy habit.
                  </p>
                  </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-900">
                    <strong>Be honest:</strong> Your check-ins are most valuable when you're truthful about how you're feeling.
                  </p>
                  </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-900">
                    <strong>Use voice input:</strong> Sometimes it's easier to speak your thoughts than type them out.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <CheckInHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}

