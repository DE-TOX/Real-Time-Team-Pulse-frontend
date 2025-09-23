'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './page.module.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FloatingCheckInButton from "@/components/check-in/FloatingCheckInButton";
import {
  Sparkles,
  CheckCircle,
  TrendingUp,
  Zap,
  Users,
  Shield,
  FileText,
  Calendar,
  Rocket,
  BarChart3,
  Brain,
  Smartphone,
  Lightbulb,
  Smile,
  Coffee,
  Activity
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setCurrentDate(dateString);
    };

    updateDate();
    const interval = setInterval(updateDate, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const displayName = user?.user_metadata?.full_name?.split(' ')[0] ||
                     user?.email?.split('@')[0] ||
                     'Team Member';

  // Mock data for demo
  const metrics = {
    teamHappiness: 94,
    energyLevel: 87,
    participation: { current: 12, total: 14 },
    burnoutRisk: 'Low'
  };

  // Mock data for demo with icon components instead of emojis
  const moodIcons = {
    happy: <Smile size={16} />,
    sleepy: <Coffee size={16} />,
    energetic: <Activity size={16} />
  };

  const recentCheckIns = [
    { id: 1, user: 'Sarah Chen', mood: moodIcons.happy, energy: 8, time: '2 hours ago' },
    { id: 2, user: 'Mike Johnson', mood: moodIcons.sleepy, energy: 6, time: '3 hours ago' },
    { id: 3, user: 'Emma Davis', mood: moodIcons.energetic, energy: 9, time: '4 hours ago' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Team Standup', time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'Check-in Reminder', time: '2:00 PM', type: 'reminder' },
    { id: 3, title: 'Weekly Retro', time: '4:00 PM', type: 'meeting' },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Welcome Section */}
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>
            Welcome back, {displayName}! <Sparkles size={20} className={styles.inline} />
          </h1>
          <p className={styles.welcomeSubtitle}>
            {currentDate} • Here's your team wellness overview
          </p>
        </div>
        <FloatingCheckInButton variant="regular" className="shrink-0" />
      </div>

      {/* Metrics Grid */}
      <div className={styles.metricsGrid}>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Team Happiness
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.teamHappiness}%</div>
            <p className="text-xs text-green-600">
              +5% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Energy Level
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.energyLevel}%</div>
            <p className="text-xs text-blue-600">
              +2% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Participation
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.participation.current}/{metrics.participation.total}
            </div>
            <p className="text-xs text-muted-foreground">
              2 pending check-ins
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Burnout Risk
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.burnoutRisk}</div>
            <p className="text-xs text-green-600">
              Stable trend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className={styles.contentGrid}>
        {/* Recent Check-ins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Check-ins
            </CardTitle>
            <CardDescription>
              Latest wellness check-ins from your team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCheckIns.map((checkIn) => (
              <div key={checkIn.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {checkIn.mood}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{checkIn.user}</p>
                    <p className="text-xs text-muted-foreground">{checkIn.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Energy</p>
                  <p className="font-semibold">{checkIn.energy}/10</p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Check-ins
            </Button>
          </CardFooter>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>
              Upcoming meetings and reminders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="text-sm font-mono text-primary font-semibold w-16">
                  {event.time}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{event.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.type === 'meeting'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Open Calendar
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Frequently used actions and tools
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Analytics</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Brain className="h-5 w-5" />
              <span className="text-xs">AI Insights</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Users className="h-5 w-5" />
              <span className="text-xs">Team Settings</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Smartphone className="h-5 w-5" />
              <span className="text-xs">Mobile App</span>
            </Button>
          </CardContent>
        </Card>

        {/* AI Recommendation */}
        <Card className="border-l-4 border-l-violet-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              AI Recommendation
            </CardTitle>
            <CardDescription>
              Personalized insights for your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your team's energy levels have been consistently high this week!
              Consider scheduling a team celebration or recognition activity
              to maintain this positive momentum.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm" className="w-full">
              View Full Analysis
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Mobile Floating Action Button */}
      <FloatingCheckInButton variant="fab" />
    </div>
  );
}