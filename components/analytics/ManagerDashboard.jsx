'use client'
import { useState, useEffect } from 'react';
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
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Brain,
  Target,
  Award,
  Calendar,
  Download,
  RefreshCw,
  Lightbulb,
  Heart,
  Zap,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SentimentChart from './SentimentChart';
import MoodTrendVisualization from './MoodTrendVisualization';

const generateAIInsights = () => [
  {
    id: 1,
    type: 'positive',
    title: 'Team Morale Improving',
    insight: 'Your team\'s happiness levels have increased by 15% over the past week. The implementation of flexible work hours appears to be having a positive impact.',
    recommendation: 'Consider extending flexible work arrangements to other departments.',
    confidence: 92,
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Energy Levels Declining on Fridays',
    insight: 'There\'s a consistent 23% drop in energy levels on Fridays compared to mid-week. This suggests potential end-of-week burnout.',
    recommendation: 'Consider implementing "Focus Fridays" with reduced meetings and more flexible schedules.',
    confidence: 87,
    icon: AlertTriangle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
    borderColor: 'border-amber-200 dark:border-amber-800'
  },
  {
    id: 3,
    type: 'insight',
    title: 'Remote vs Office Sentiment Gap',
    insight: 'Remote employees consistently report 8% higher happiness levels than office workers, but 12% lower energy scores.',
    recommendation: 'Explore hybrid collaboration tools and in-person team building activities for remote workers.',
    confidence: 79,
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  {
    id: 4,
    type: 'action',
    title: 'High Performer Stress Signals',
    insight: 'Top 20% performers show increasing stress indicators despite high productivity. Risk of burnout detected.',
    recommendation: 'Schedule one-on-one check-ins and consider workload redistribution.',
    confidence: 94,
    icon: Target,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    borderColor: 'border-purple-200 dark:border-purple-800'
  }
];

const generateTeamStats = () => ({
  totalMembers: 47,
  activeMembers: 42,
  avgHappiness: 7.8,
  avgEnergy: 7.2,
  participationRate: 89,
  burnoutRisk: 'Low',
  topConcerns: ['Workload', 'Meeting fatigue', 'Work-life balance'],
  positiveDrivers: ['Team collaboration', 'Recognition', 'Growth opportunities'],
  weeklyTrend: {
    happiness: +5.2,
    energy: -2.1,
    participation: +8.4
  }
});

const generateAlerts = () => [
  {
    id: 1,
    severity: 'high',
    title: '3 team members showing burnout signals',
    description: 'Sarah M., Mike J., and Alex K. have consistently low energy scores',
    actionRequired: true,
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    severity: 'medium',
    title: 'Participation rate dropped 12% this week',
    description: 'Check-in completion is below target in Engineering team',
    actionRequired: false,
    timestamp: '1 day ago'
  },
  {
    id: 3,
    severity: 'low',
    title: 'New wellness trend detected',
    description: 'Morning check-ins show 20% better mood scores',
    actionRequired: false,
    timestamp: '3 days ago'
  }
];

export default function ManagerDashboard() {
  const [timeRange, setTimeRange] = useState('7');
  const [insights, setInsights] = useState([]);
  const [teamStats, setTeamStats] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setInsights(generateAIInsights());
    setTeamStats(generateTeamStats());
    setAlerts(generateAlerts());
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const handleExportReport = () => {
    // Simulate report generation
    console.log('Generating wellness report...');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300';
      case 'medium': return 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300';
      default: return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Team wellness insights and analytics • Last updated {lastUpdated.toLocaleTimeString()}
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
          <Button variant="outline" onClick={loadDashboardData} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Happiness</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.avgHappiness}/10</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{teamStats.weeklyTrend?.happiness}% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Levels</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.avgEnergy}/10</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              {teamStats.weeklyTrend?.energy}% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participation</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.participationRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{teamStats.weeklyTrend?.participation}% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Burnout Risk</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{teamStats.burnoutRisk}</div>
            <div className="text-xs text-muted-foreground">
              {teamStats.activeMembers}/{teamStats.totalMembers} members active
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Priority Alerts
            </CardTitle>
            <CardDescription>
              Items requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-4 rounded-lg border",
                  getSeverityColor(alert.severity)
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{alert.title}</h4>
                      <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-90">{alert.description}</p>
                    <p className="text-xs opacity-75">{alert.timestamp}</p>
                  </div>
                  {alert.actionRequired && (
                    <Button size="sm" variant="outline">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Generated Insights
          </CardTitle>
          <CardDescription>
            Intelligent analysis of your team's wellness patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map((insight) => {
              const IconComponent = insight.icon;
              return (
                <div
                  key={insight.id}
                  className={cn(
                    "p-4 rounded-lg border-2",
                    insight.bgColor,
                    insight.borderColor
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-lg bg-white dark:bg-gray-900")}>
                      <IconComponent className={cn("h-5 w-5", insight.color)} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% confident
                        </Badge>
                      </div>
                      <p className="text-sm opacity-90">{insight.insight}</p>
                      <div className="bg-white/50 dark:bg-gray-900/50 p-3 rounded-md">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 mt-0.5 text-amber-500" />
                          <p className="text-sm font-medium">Recommendation:</p>
                        </div>
                        <p className="text-sm mt-1 opacity-90">{insight.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SentimentChart
          title="Real-time Team Sentiment"
          subtitle="Live mood and energy tracking"
          chartType="area"
          height={350}
        />
        <Card>
          <CardHeader>
            <CardTitle>Team Concerns & Drivers</CardTitle>
            <CardDescription>
              What's impacting your team's wellbeing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3 text-red-600">Top Concerns</h4>
              <div className="space-y-3">
                {teamStats.topConcerns?.map((concern, index) => (
                  <div key={concern} className="flex items-center justify-between">
                    <span className="text-sm">{concern}</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={85 - (index * 15)}
                        className="w-20 h-2"
                      />
                      <span className="text-xs text-muted-foreground w-8">
                        {85 - (index * 15)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-green-600">Positive Drivers</h4>
              <div className="space-y-3">
                {teamStats.positiveDrivers?.map((driver, index) => (
                  <div key={driver} className="flex items-center justify-between">
                    <span className="text-sm">{driver}</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={90 - (index * 10)}
                        className="w-20 h-2"
                      />
                      <span className="text-xs text-muted-foreground w-8">
                        {90 - (index * 10)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <MoodTrendVisualization />
    </div>
  );
}