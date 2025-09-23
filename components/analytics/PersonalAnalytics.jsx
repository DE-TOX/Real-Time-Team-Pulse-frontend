'use client'
import { useState, useEffect } from 'react';
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

const generatePersonalData = (days = 30) => {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const baseHappiness = 6 + Math.random() * 3;
    const baseEnergy = 6 + Math.random() * 3;

    // Add some realistic patterns
    const dayOfWeek = date.getDay();
    const isFriday = dayOfWeek === 5;
    const isMonday = dayOfWeek === 1;

    data.push({
      date: format(date, 'MMM dd'),
      fullDate: date.toISOString(),
      happiness: Math.max(1, Math.min(10, Math.round(
        baseHappiness +
        (isFriday ? -0.5 : 0) +
        (isMonday ? -0.3 : 0) +
        (Math.random() - 0.5)
      ))),
      energy: Math.max(1, Math.min(10, Math.round(
        baseEnergy +
        (isFriday ? -0.8 : 0) +
        (isMonday ? -0.5 : 0) +
        (Math.random() - 0.5)
      ))),
      productivity: Math.max(1, Math.min(10, Math.round(
        (baseHappiness + baseEnergy) / 2 + (Math.random() - 0.5)
      ))),
      stress: Math.max(1, Math.min(10, Math.round(
        5 + (Math.random() - 0.5) * 2 + (isFriday ? 1 : 0)
      ))),
      dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek]
    });
  }
  return data;
};

const generateGoals = () => [
  {
    id: 1,
    title: 'Maintain 8+ happiness score',
    target: 8,
    current: 7.8,
    progress: 97.5,
    status: 'on-track',
    streak: 12,
    icon: Smile,
    color: 'text-green-600'
  },
  {
    id: 2,
    title: 'Keep energy above 7',
    target: 7,
    current: 7.2,
    progress: 102.8,
    status: 'achieved',
    streak: 8,
    icon: Battery,
    color: 'text-blue-600'
  },
  {
    id: 3,
    title: 'Reduce stress below 4',
    target: 4,
    current: 4.5,
    progress: 88.9,
    status: 'needs-attention',
    streak: 3,
    icon: Target,
    color: 'text-amber-600'
  }
];

const generateInsights = () => [
  {
    id: 1,
    title: 'Your Happy Hours',
    insight: 'You tend to have the highest mood scores between 10-11 AM. Consider scheduling important tasks during this time.',
    type: 'pattern',
    icon: Clock,
    color: 'text-blue-600'
  },
  {
    id: 2,
    title: 'Friday Dip',
    insight: 'Your energy consistently drops by 15% on Fridays. Maybe plan lighter workloads at week-end.',
    type: 'trend',
    icon: TrendingDown,
    color: 'text-amber-600'
  },
  {
    id: 3,
    title: 'Productivity Correlation',
    insight: 'Your happiness and productivity have a 87% correlation. Focusing on wellbeing improves your output.',
    type: 'correlation',
    icon: BarChart3,
    color: 'text-green-600'
  }
];

export default function PersonalAnalytics({ userId = 'current-user' }) {
  const [timeRange, setTimeRange] = useState('30');
  const [data, setData] = useState([]);
  const [goals, setGoals] = useState([]);
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('all');

  useEffect(() => {
    loadPersonalData();
  }, [timeRange]);

  const loadPersonalData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setData(generatePersonalData(parseInt(timeRange)));
    setGoals(generateGoals());
    setInsights(generateInsights());
    setIsLoading(false);
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

  return (
    <div className="space-y-6 p-6">
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