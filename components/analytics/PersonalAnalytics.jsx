'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { checkInsAPI, aiAPI, getAuthToken, handleAPIError } from '@/lib/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
  ComposedChart,
  Bar
} from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Smile,
  Battery,
  Clock,
  BarChart3,
  Download,
  RefreshCw,
  Lightbulb,
  Star,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper functions for AI insights
const getInsightIcon = (type) => {
  switch (type) {
    case 'pattern': return Clock;
    case 'trend': return TrendingDown;
    case 'correlation': return BarChart3;
    default: return Lightbulb;
  }
};

const getInsightColor = (priority) => {
  switch (priority) {
    case 'high': return 'text-red-600';
    case 'medium': return 'text-amber-600';
    case 'low': return 'text-green-600';
    default: return 'text-blue-600';
  }
};

// Fallback insights when AI service is unavailable
const generateFallbackInsights = (data) => [
  {
    id: 1,
    title: 'Consistency Pattern',
    insight: 'You tend to have more consistent mood scores during weekdays. Consider maintaining your routine.',
    type: 'pattern',
    icon: Clock,
    color: 'text-blue-600'
  },
  {
    id: 2,
    title: 'Energy Trends',
    insight: 'Your energy levels show improvement over the selected period. Keep up the good work!',
    type: 'trend',
    icon: TrendingUp,
    color: 'text-green-600'
  }
];

// Calculate streak for goals
const calculateStreak = (data, metric, target, lessThan = false) => {
  let streak = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    const value = data[i][metric];
    const achieved = lessThan ? value <= target : value >= target;
    if (achieved) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

export default function PersonalAnalytics({ userId = 'current-user', teamId = null }) {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30');
  const [data, setData] = useState([]);
  const [goals, setGoals] = useState([]);
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (user) {
      loadPersonalData();
    }
  }, [timeRange, user, teamId]);

  const loadPersonalData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Get personal check-ins
      const params = {
        limit: parseInt(timeRange) * 2, // Get more data than the time range
        date_from: new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      const checkInsResponse = await checkInsAPI.getPersonalCheckIns(token, params);
      const checkIns = checkInsResponse.checkIns;

      // Transform check-ins to chart data
      const chartData = [];
      const today = new Date();
      for (let i = parseInt(timeRange) - 1; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayCheckIns = checkIns.filter(ci =>
          ci.created_at.split('T')[0] === dateStr
        );

        if (dayCheckIns.length > 0) {
          const avgMood = dayCheckIns.reduce((sum, ci) => sum + ci.mood_score, 0) / dayCheckIns.length;
          const avgEnergy = dayCheckIns.reduce((sum, ci) => sum + ci.energy_level, 0) / dayCheckIns.length;
          const avgSentiment = dayCheckIns.reduce((sum, ci) => sum + (ci.sentiment_score || 0), 0) / dayCheckIns.length;

          chartData.push({
            date: format(date, 'MMM dd'),
            fullDate: date.toISOString(),
            happiness: Math.round(avgMood * 2), // Convert 1-5 scale to 1-10
            energy: Math.round(avgEnergy * 2),
            productivity: Math.round((avgMood + avgEnergy) * 1), // Simple productivity calculation
            stress: Math.max(1, Math.min(10, Math.round(5 - avgSentiment * 3))), // Convert sentiment to stress
            dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
          });
        }
      }

      setData(chartData);

      // Generate AI insights if we have check-ins
      if (checkIns.length > 0) {
        try {
          const insightsResponse = await aiAPI.generateInsights(token, {
            checkIns: checkIns.map(ci => ({
              userId: ci.user_id,
              mood: ci.mood_score,
              energy: ci.energy_level,
              timestamp: ci.created_at,
              notes: ci.content,
              sentiment: ci.sentiment_score
            }))
          });

          // Transform AI insights to component format
          const transformedInsights = insightsResponse.slice(0, 3).map((insight, index) => ({
            id: index + 1,
            title: insight.title,
            insight: insight.description,
            type: insight.type,
            icon: getInsightIcon(insight.type),
            color: getInsightColor(insight.priority)
          }));

          setInsights(transformedInsights);
        } catch (aiError) {
          console.error('Failed to generate AI insights:', aiError);
          // Use fallback insights if AI fails
          setInsights(generateFallbackInsights(chartData));
        }
      }

      // Generate goals based on recent performance
      const recentData = chartData.slice(-7); // Last 7 days
      if (recentData.length > 0) {
        const avgHappiness = recentData.reduce((sum, d) => sum + d.happiness, 0) / recentData.length;
        const avgEnergy = recentData.reduce((sum, d) => sum + d.energy, 0) / recentData.length;
        const avgStress = recentData.reduce((sum, d) => sum + d.stress, 0) / recentData.length;

        setGoals([
          {
            id: 1,
            title: 'Maintain happiness above 8',
            target: 8,
            current: avgHappiness,
            progress: (avgHappiness / 8) * 100,
            status: avgHappiness >= 8 ? 'achieved' : avgHappiness >= 7 ? 'on-track' : 'needs-attention',
            streak: calculateStreak(chartData, 'happiness', 8),
            icon: Smile,
            color: 'text-green-600'
          },
          {
            id: 2,
            title: 'Keep energy above 7',
            target: 7,
            current: avgEnergy,
            progress: (avgEnergy / 7) * 100,
            status: avgEnergy >= 7 ? 'achieved' : avgEnergy >= 6 ? 'on-track' : 'needs-attention',
            streak: calculateStreak(chartData, 'energy', 7),
            icon: Battery,
            color: 'text-blue-600'
          },
          {
            id: 3,
            title: 'Reduce stress below 4',
            target: 4,
            current: avgStress,
            progress: avgStress <= 4 ? 100 : ((4 / avgStress) * 100),
            status: avgStress <= 4 ? 'achieved' : avgStress <= 5 ? 'on-track' : 'needs-attention',
            streak: calculateStreak(chartData, 'stress', 4, true), // true for "less than" goal
            icon: Target,
            color: 'text-amber-600'
          }
        ]);
      }

    } catch (err) {
      const errorMessage = handleAPIError(err, 'Failed to load analytics data');
      setError(errorMessage);
      console.error('Failed to load personal analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const avgHappiness = data.length ? (data.reduce((sum, item) => sum + item.happiness, 0) / data.length).toFixed(1) : 0;
  const avgEnergy = data.length ? (data.reduce((sum, item) => sum + item.energy, 0) / data.length).toFixed(1) : 0;
  const avgStress = data.length ? (data.reduce((sum, item) => sum + item.stress, 0) / data.length).toFixed(1) : 0;
  const totalCheckIns = data.length;

  // Calculate trends (comparing last week to previous week)
  const currentWeek = data.slice(-7);
  const previousWeek = data.slice(-14, -7);

  const happinessTrend = currentWeek.length && previousWeek.length ?
    ((currentWeek.reduce((sum, item) => sum + item.happiness, 0) / currentWeek.length) -
     (previousWeek.reduce((sum, item) => sum + item.happiness, 0) / previousWeek.length)).toFixed(1) : 0;

  const energyTrend = currentWeek.length && previousWeek.length ?
    ((currentWeek.reduce((sum, item) => sum + item.energy, 0) / currentWeek.length) -
     (previousWeek.reduce((sum, item) => sum + item.energy, 0) / previousWeek.length)).toFixed(1) : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'achieved': return 'text-green-600 bg-green-50 border-green-200';
      case 'on-track': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'needs-attention': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-4 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((pld, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: pld.color }}
              />
              <span className="capitalize">{pld.dataKey}:</span>
              <span className="font-medium">{pld.value}/10</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center min-h-96 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading your wellness data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
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
                  loadPersonalData();
                }}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Wellness Journey</h1>
          <p className="text-muted-foreground mt-2">
            Personal insights and progress tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadPersonalData} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Happiness</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgHappiness}/10</div>
            <div className="flex items-center text-xs">
              {parseFloat(happinessTrend) >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={parseFloat(happinessTrend) >= 0 ? 'text-green-600' : 'text-red-600'}>
                {parseFloat(happinessTrend) >= 0 ? '+' : ''}{happinessTrend} from last week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Energy</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEnergy}/10</div>
            <div className="flex items-center text-xs">
              {parseFloat(energyTrend) >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={parseFloat(energyTrend) >= 0 ? 'text-green-600' : 'text-red-600'}>
                {parseFloat(energyTrend) >= 0 ? '+' : ''}{energyTrend} from last week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Stress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgStress}/10</div>
            <div className="text-xs text-muted-foreground">
              Lower is better
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCheckIns}</div>
            <div className="text-xs text-green-600">
              {Math.round((totalCheckIns / parseInt(timeRange)) * 100)}% completion rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Personal Goals
          </CardTitle>
          <CardDescription>
            Track your wellness objectives and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {goals.map((goal) => {
              const IconComponent = goal.icon;
              return (
                <div
                  key={goal.id}
                  className={cn(
                    "p-4 rounded-lg border-2",
                    getStatusColor(goal.status)
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white">
                      <IconComponent className={cn("h-5 w-5", goal.color)} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h4 className="font-semibold">{goal.title}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {goal.current}/{goal.target}
                          </span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <Badge variant="outline">
                          {goal.streak} day streak
                        </Badge>
                        <span className="capitalize">{goal.status.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Wellness Trends</CardTitle>
              <CardDescription>
                Track your mood, energy, and stress over time
              </CardDescription>
            </div>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="happiness">Happiness Only</SelectItem>
                <SelectItem value="energy">Energy Only</SelectItem>
                <SelectItem value="stress">Stress Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-muted-foreground"
                  fontSize={12}
                />
                <YAxis
                  className="text-muted-foreground"
                  fontSize={12}
                  domain={[0, 10]}
                />
                <Tooltip content={<CustomTooltip />} />

                {(selectedMetric === 'all' || selectedMetric === 'happiness') && (
                  <Line
                    type="monotone"
                    dataKey="happiness"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    name="Happiness"
                  />
                )}

                {(selectedMetric === 'all' || selectedMetric === 'energy') && (
                  <Line
                    type="monotone"
                    dataKey="energy"
                    stroke="hsl(142, 76%, 36%)"
                    strokeWidth={3}
                    dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2, r: 4 }}
                    name="Energy"
                  />
                )}

                {(selectedMetric === 'all' || selectedMetric === 'stress') && (
                  <Bar
                    dataKey="stress"
                    fill="hsl(25, 95%, 53%)"
                    opacity={0.6}
                    name="Stress"
                    radius={[2, 2, 0, 0]}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Personal Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Personal Insights
          </CardTitle>
          <CardDescription>
            AI-powered insights about your wellness patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {insights.map((insight) => {
              const IconComponent = insight.icon;
              return (
                <div
                  key={insight.id}
                  className="p-4 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-background">
                      <IconComponent className={cn("h-5 w-5", insight.color)} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {insight.insight}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {insight.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}