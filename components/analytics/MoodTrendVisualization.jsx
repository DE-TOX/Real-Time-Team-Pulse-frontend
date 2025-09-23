'use client'
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { format, subDays } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Smile,
  Meh,
  Frown,
  Users,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOOD_COLORS = {
  'Very Happy': '#10b981',
  'Happy': '#34d399',
  'Good': '#6ee7b7',
  'Neutral': '#9ca3af',
  'Sad': '#f59e0b',
  'Very Sad': '#ef4444'
};

const ENERGY_COLORS = {
  'High': '#10b981',
  'Medium': '#f59e0b',
  'Low': '#ef4444'
};

const generateMoodDistribution = () => {
  const moods = ['Very Happy', 'Happy', 'Good', 'Neutral', 'Sad', 'Very Sad'];
  return moods.map(mood => ({
    mood,
    count: Math.floor(Math.random() * 20) + 5,
    percentage: Math.floor(Math.random() * 30) + 5,
    emoji: mood === 'Very Happy' ? '😄' : mood === 'Happy' ? '😊' : mood === 'Good' ? '🙂' : mood === 'Neutral' ? '😐' : mood === 'Sad' ? '😔' : '😢'
  }));
};

const generateHourlyData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return hours.map(hour => ({
    hour: `${hour}:00`,
    checkIns: Math.floor(Math.random() * 15) + 1,
    avgMood: Math.floor(Math.random() * 4) + 6,
    isWorkHour: hour >= 9 && hour <= 17
  }));
};

const generateWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    positive: Math.floor(Math.random() * 40) + 30,
    neutral: Math.floor(Math.random() * 30) + 15,
    negative: Math.floor(Math.random() * 15) + 5
  }));
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((pld, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: pld.color }}
            />
            <span className="capitalize">{pld.dataKey}:</span>
            <span className="font-medium">{pld.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MoodPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg">{data.emoji}</span>
          <span className="font-medium">{data.mood}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {data.count} people ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export default function MoodTrendVisualization() {
  const [moodDistribution, setMoodDistribution] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMoodDistribution(generateMoodDistribution());
      setHourlyData(generateHourlyData());
      setWeeklyData(generateWeeklyData());
      setIsLoading(false);
    }, 500);
  };

  const totalResponses = moodDistribution.reduce((sum, item) => sum + item.count, 0);
  const averageMood = moodDistribution.reduce((sum, item, index) => sum + (item.count * (6 - index)), 0) / totalResponses || 0;
  const participationRate = Math.round((totalResponses / 50) * 100); // Assuming 50 team members

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResponses}</div>
            <p className="text-xs text-muted-foreground">
              {participationRate}% participation rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
            <Smile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMood.toFixed(1)}/10</div>
            <p className="text-xs text-green-600">
              +0.3 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12%</div>
            <p className="text-xs text-muted-foreground">
              Positive sentiment increase
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Visualization Tabs */}
      <Tabs defaultValue="distribution" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="distribution">Mood Distribution</TabsTrigger>
          <TabsTrigger value="hourly">Hourly Patterns</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Current Mood Distribution</CardTitle>
                <CardDescription>
                  How the team is feeling today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={moodDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="count"
                        nameKey="mood"
                      >
                        {moodDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={MOOD_COLORS[entry.mood]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<MoodPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Mood Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Breakdown</CardTitle>
                <CardDescription>
                  Individual mood categories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {moodDistribution.map((item) => (
                  <div key={item.mood} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.emoji}</span>
                        <span className="font-medium">{item.mood}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{item.count}</span>
                        <span className="text-sm text-muted-foreground ml-1">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={item.percentage}
                      className="h-2"
                      style={{
                        '--progress-background': MOOD_COLORS[item.mood]
                      }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hourly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Check-in Patterns by Hour</CardTitle>
              <CardDescription>
                When team members are most active with check-ins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="hour"
                      className="text-muted-foreground"
                      fontSize={12}
                    />
                    <YAxis className="text-muted-foreground" fontSize={12} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium mb-2">{label}</p>
                              <p className="text-sm">
                                Check-ins: <span className="font-bold">{payload[0].value}</span>
                              </p>
                              <p className="text-sm">
                                Avg Mood: <span className="font-bold">{payload[0].payload.avgMood}/10</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="checkIns"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span>Work hours (9AM-5PM)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted rounded"></div>
                  <span>Off hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Sentiment Trends</CardTitle>
              <CardDescription>
                Positive, neutral, and negative sentiment distribution by day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="day"
                      className="text-muted-foreground"
                      fontSize={12}
                    />
                    <YAxis className="text-muted-foreground" fontSize={12} />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar
                      dataKey="positive"
                      stackId="a"
                      fill="#10b981"
                      name="Positive"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="neutral"
                      stackId="a"
                      fill="#9ca3af"
                      name="Neutral"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="negative"
                      stackId="a"
                      fill="#ef4444"
                      name="Negative"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}