'use client'

import { useState, useEffect } from 'react';
import { teamsAPI, checkInsAPI, aiAPI, getAuthToken, handleAPIError } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Heart,
  Zap,
  MessageSquare,
  Clock,
  Target,
  Star,
  Activity,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TeamInsights({ teamId, className }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [checkIns, setCheckIns] = useState([]);

  useEffect(() => {
    if (teamId) {
      loadTeamInsights();
    }
  }, [teamId]);

  const loadTeamInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getAuthToken();
      if (!token) throw new Error('Authentication required');

      // Load team data and check-ins in parallel
      const [team, teamCheckIns, teamAnalytics] = await Promise.all([
        teamsAPI.getTeam(token, teamId),
        checkInsAPI.getTeamCheckIns(token, teamId, { limit: 100 }),
        checkInsAPI.getTeamAnalytics(token, teamId, { period: '30d' })
      ]);

      setTeamData(team);
      setCheckIns(teamCheckIns.checkIns || []);
      setAnalytics(teamAnalytics);

      // Generate AI insights for the team
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
            })),
            teamId: teamId
          });

          setInsights(aiInsights || []);
        } catch (aiError) {
          console.error('AI insights generation failed:', aiError);
          // Generate fallback insights
          setInsights(generateFallbackInsights(teamCheckIns.checkIns, teamAnalytics));
        }
      }

    } catch (err) {
      const errorMessage = handleAPIError(err, 'Failed to load team insights');
      setError(errorMessage);
      console.error('Failed to load team insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackInsights = (checkIns, analytics) => {
    const insights = [];

    if (checkIns.length > 0) {
      const avgMood = checkIns.reduce((sum, ci) => sum + ci.mood_score, 0) / checkIns.length;
      const avgEnergy = checkIns.reduce((sum, ci) => sum + ci.energy_level, 0) / checkIns.length;

      // Participation insight
      const uniqueUsers = new Set(checkIns.map(ci => ci.user_id)).size;
      const totalMembers = teamData?.members?.length || 1;
      const participationRate = (uniqueUsers / totalMembers) * 100;

      insights.push({
        id: 'participation',
        title: 'Team Participation',
        description: `${participationRate.toFixed(1)}% of team members are actively checking in`,
        type: 'metric',
        priority: participationRate > 80 ? 'high' : participationRate > 60 ? 'medium' : 'low',
        icon: 'users',
        value: participationRate,
        unit: '%'
      });

      // Mood insight
      insights.push({
        id: 'mood',
        title: 'Team Mood Trend',
        description: avgMood > 4 ? 'Team mood is above average' : 'Team mood could use attention',
        type: 'trend',
        priority: avgMood > 4 ? 'high' : 'medium',
        icon: 'heart',
        value: avgMood,
        unit: '/5'
      });

      // Energy insight
      insights.push({
        id: 'energy',
        title: 'Energy Levels',
        description: avgEnergy > 4 ? 'Team energy is strong' : 'Team might need an energy boost',
        type: 'trend',
        priority: avgEnergy > 4 ? 'high' : 'medium',
        icon: 'zap',
        value: avgEnergy,
        unit: '/5'
      });
    }

    return insights;
  };

  const getInsightIcon = (iconName) => {
    const icons = {
      users: Users,
      heart: Heart,
      zap: Zap,
      message: MessageSquare,
      target: Target,
      star: Star,
      activity: Activity,
      lightbulb: Lightbulb,
      chart: BarChart3,
      trend: TrendingUp
    };
    return icons[iconName] || Lightbulb;
  };

  const getInsightColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading team insights...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("border-red-200", className)}>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
            <Button variant="outline" size="sm" onClick={loadTeamInsights}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Team Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {teamData?.name} Insights
          </CardTitle>
          <CardDescription>
            AI-powered insights for your team's wellness data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {teamData?.members?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Members</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {checkIns.length}
              </div>
              <div className="text-sm text-muted-foreground">Check-ins</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {new Set(checkIns.map(ci => ci.user_id)).size}
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {checkIns.length > 0 ?
                  (checkIns.reduce((sum, ci) => sum + ci.mood_score, 0) / checkIns.length).toFixed(1) :
                  '--'
                }
              </div>
              <div className="text-sm text-muted-foreground">Avg Mood</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      {insights.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight) => {
            const Icon = getInsightIcon(insight.icon);
            return (
              <Card key={insight.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <Badge variant="outline" className="text-xs">
                        {insight.type}
                      </Badge>
                    </div>
                    {insight.priority && (
                      <Badge className={cn("text-xs", getInsightColor(insight.priority))}>
                        {insight.priority}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base">
                    {insight.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {insight.description}
                  </p>
                  {insight.value && (
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-semibold text-primary">
                        {insight.value.toFixed(1)}{insight.unit}
                      </div>
                      {insight.type === 'metric' && insight.value && (
                        <Progress
                          value={insight.unit === '%' ? insight.value : (insight.value / 5) * 100}
                          className="flex-1 h-2"
                        />
                      )}
                    </div>
                  )}
                  {insight.recommendation && (
                    <div className="mt-3 p-2 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground">
                        {insight.recommendation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Building Insights</h3>
            <p className="text-muted-foreground text-center max-w-md">
              We need more check-in data from your team to generate meaningful insights.
              Encourage team members to check in regularly.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Team Message
            </Button>
            <Button variant="outline" size="sm">
              <Target className="h-4 w-4 mr-2" />
              Set Team Goals
            </Button>
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              View Detailed Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}