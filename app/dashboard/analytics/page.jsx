'use client'
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Users,
  User,
  Download,
  Settings
} from 'lucide-react';
import ManagerDashboard from '@/components/analytics/ManagerDashboard';
import PersonalAnalytics from '@/components/analytics/PersonalAnalytics';
import SentimentChart from '@/components/analytics/SentimentChart';
import MoodTrendVisualization from '@/components/analytics/MoodTrendVisualization';
import WellnessReportExport from '@/components/analytics/WellnessReportExport';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user role check - in real app this would come from user context
  const isManager = user?.role === 'admin' || user?.role === 'manager';
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              {isManager
                ? 'Team wellness insights and comprehensive analytics'
                : `Welcome back, ${userName}! Track your wellness journey`
              }
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className="text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                Real-time data
              </Badge>
              {isManager && (
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Team insights
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <WellnessReportExport
              reportType={isManager ? 'team' : 'personal'}
              trigger={
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              }
            />
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {isManager ? (
          // Manager View with Full Dashboard
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Team Overview</TabsTrigger>
              <TabsTrigger value="trends">Mood Trends</TabsTrigger>
              <TabsTrigger value="personal">My Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <ManagerDashboard />
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <div className="grid gap-6">
                <SentimentChart
                  title="Team Sentiment Over Time"
                  subtitle="Comprehensive mood and energy tracking across all team members"
                  chartType="line"
                  height={500}
                />
                <MoodTrendVisualization />
              </div>
            </TabsContent>

            <TabsContent value="personal" className="space-y-6">
              <PersonalAnalytics userId={user?.id} />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <SentimentChart
                    title="Weekly Summary"
                    subtitle="Last 7 days of team activity"
                    chartType="area"
                    height={300}
                    showControls={false}
                  />
                  <SentimentChart
                    title="Monthly Trends"
                    subtitle="30-day rolling average"
                    chartType="line"
                    height={300}
                    showControls={false}
                  />
                </div>
                <div className="space-y-6">
                  <div className="bg-muted/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Export Options</h3>
                    <div className="space-y-3">
                      <WellnessReportExport
                        reportType="team"
                        trigger={
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Weekly Team Report
                          </Button>
                        }
                      />
                      <WellnessReportExport
                        reportType="team"
                        trigger={
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Monthly Executive Summary
                          </Button>
                        }
                      />
                      <WellnessReportExport
                        reportType="personal"
                        trigger={
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Personal Insights Report
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          // Individual User View - Personal Analytics Only
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">My Overview</TabsTrigger>
              <TabsTrigger value="trends">My Trends</TabsTrigger>
              <TabsTrigger value="reports">My Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <PersonalAnalytics userId={user?.id} />
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <div className="grid gap-6">
                <SentimentChart
                  title="My Wellness Journey"
                  subtitle="Your personal mood and energy tracking over time"
                  chartType="area"
                  height={400}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SentimentChart
                    title="This Week"
                    subtitle="Recent 7 days"
                    chartType="line"
                    height={300}
                    showControls={false}
                  />
                  <SentimentChart
                    title="This Month"
                    subtitle="Last 30 days"
                    chartType="line"
                    height={300}
                    showControls={false}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <SentimentChart
                    title="Personal Summary"
                    subtitle="Your wellness overview"
                    chartType="area"
                    height={300}
                    showControls={false}
                  />
                </div>
                <div className="space-y-6">
                  <div className="bg-muted/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Export Your Data</h3>
                    <div className="space-y-3">
                      <WellnessReportExport
                        reportType="personal"
                        trigger={
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Weekly Personal Report
                          </Button>
                        }
                      />
                      <WellnessReportExport
                        reportType="personal"
                        trigger={
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Monthly Wellness Summary
                          </Button>
                        }
                      />
                      <WellnessReportExport
                        reportType="personal"
                        trigger={
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Raw Data Export (CSV)
                          </Button>
                        }
                      />
                    </div>
                    <div className="mt-4 p-4 bg-background rounded-lg border">
                      <h4 className="font-medium mb-2">Privacy Note</h4>
                      <p className="text-sm text-muted-foreground">
                        Your personal wellness data is private and only visible to you.
                        Team managers see aggregated, anonymous trends only.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}