'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { teamsAPI, aiAPI, checkInsAPI, getAuthToken, handleAPIError } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Lightbulb,
  Heart,
  Zap,
  Target,
  BarChart3,
  RefreshCw,
  Download,
  Eye,
  MessageSquare,
  Star,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InsightsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [trends, setTrends] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadInsightsData();
    }
  }, [user, selectedTeam, selectedTimeframe]);

  const loadInsightsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getAuthToken();
      if (!token) throw new Error('Authentication required');

      // Load user teams
      const userTeams = await teamsAPI.getUserTeams(token);
      setTeams(userTeams);

      // Load AI insights and analytics
      const [aiDemo, teamCheckIns] = await Promise.all([
        aiAPI.runDemo(token),
        selectedTeam !== 'all'
          ? checkInsAPI.getTeamCheckIns(token, selectedTeam, { limit: 50 })
          : checkInsAPI.getPersonalCheckIns(token, { limit: 50 })
      ]);

      // Process AI demo results
      if (aiDemo.results) {
        setInsights(aiDemo.results.insights?.data || []);
        setAlerts(aiDemo.results.alerts?.data || []);

        if (aiDemo.trends) {
          setTrends(aiDemo.trends.insights || []);
        }
      }

      // Generate additional insights if we have check-ins
      if (teamCheckIns.checkIns?.length > 0) {
        try {
          const aiInsights = await aiAPI.generateInsights(token, {
            checkIns: teamCheckIns.checkIns.map(ci => ({
              userId: ci.user_id,
              mood: ci.mood_score,
              energy: ci.energy_level,
              timestamp: ci.created_at,
              content: ci.content,
              sentiment: ci.sentiment_score
            }))
          });

          if (aiInsights?.length > 0) {
            setInsights(prev => [...prev, ...aiInsights.slice(0, 5)]);
          }
        } catch (aiError) {
          console.error('AI insights generation failed:', aiError);
        }
      }

    } catch (err) {
      const errorMessage = handleAPIError(err, 'Failed to load insights');
      setError(errorMessage);
      console.error('Failed to load insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshInsights = async () => {
    setRefreshing(true);
    await loadInsightsData();
    setRefreshing(false);
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'pattern': return Activity;
      case 'correlation': return BarChart3;
      case 'alert': return AlertTriangle;
      case 'recommendation': return Lightbulb;
      default: return Brain;
    }
  };

  const getInsightColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getAlertSeverity = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
       default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading AI insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            AI Insights
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover patterns, trends, and actionable insights from your wellness data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={refreshInsights}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
              <Button variant="outline" size="sm" onClick={loadInsightsData}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Insight Filters</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Team:</label>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Period:</label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 3 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">
            <Lightbulb className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {insights.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Insights Yet</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  We need more check-in data to generate meaningful insights. Encourage your team to check in regularly.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {insights.map((insight, index) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <Badge variant="outline" className="text-xs">
                            {insight.type || 'insight'}
                          </Badge>
                        </div>
                        {insight.priority && (
                          <Badge
                            variant="outline"
                            className={cn("text-xs", getInsightColor(insight.priority))}
                          >
                            {insight.priority}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">
                        {insight.title || `Insight ${index + 1}`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {insight.description || insight.insight || insight.message}
                      </p>
                      {insight.recommendation && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">Recommendation:</p>
                          <p className="text-sm text-muted-foreground">
                            {insight.recommendation}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">All Good!</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  No alerts at the moment. Your team's wellness metrics are looking healthy.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <Card key={index} className={cn(
                  "border-l-4",
                  alert.severity === 'HIGH' ? 'border-l-red-500' :
                  alert.severity === 'MEDIUM' ? 'border-l-amber-500' : 'border-l-blue-500'
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={cn(
                          "h-5 w-5",
                          alert.severity === 'HIGH' ? 'text-red-500' :
                          alert.severity === 'MEDIUM' ? 'text-amber-500' : 'text-blue-500'
                        )} />
                        <CardTitle className="text-lg">
                          {alert.title || alert.ruleName}
                        </CardTitle>
                      </div>
                      <Badge variant={getAlertSeverity(alert.severity)}>
                        {alert.severity || 'Medium'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {alert.message || alert.description}
                    </p>
                    {alert.recommendations && alert.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Recommendations:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {alert.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {alert.timestamp && (
                      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {trends.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Building Trend Analysis</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Trend analysis requires time-series data. Check back after a few days of regular check-ins.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {trends.map((trend, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">
                        {trend.message || `Trend ${index + 1}`}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {trend.description || trend.message}
                    </p>
                    {trend.coefficient && (
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="font-medium">Correlation: </span>
                          <span className={cn(
                            Math.abs(trend.coefficient) > 0.7 ? 'text-green-600' :
                            Math.abs(trend.coefficient) > 0.4 ? 'text-amber-600' : 'text-gray-600'
                          )}>
                            {(trend.coefficient * 100).toFixed(1)}%
                          </span>
                        </div>
                        {trend.significance && (
                          <div className="text-sm">
                            <span className="font-medium">Significance: </span>
                            <span className="text-muted-foreground">
                              {(trend.significance * 100).toFixed(2)}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    {trend.recommendation && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Recommendation:</p>
                        <p className="text-sm text-muted-foreground">
                          {trend.recommendation}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}