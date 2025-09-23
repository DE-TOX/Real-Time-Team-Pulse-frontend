'use client'
import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const generateMockData = (days = 7) => {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const baseHappiness = 75 + Math.random() * 20;
    const baseEnergy = 70 + Math.random() * 25;

    data.push({
      date: format(date, 'MMM dd'),
      fullDate: date.toISOString(),
      happiness: Math.round(baseHappiness + (Math.random() - 0.5) * 10),
      energy: Math.round(baseEnergy + (Math.random() - 0.5) * 15),
      checkIns: Math.floor(Math.random() * 8) + 5,
      sentiment: baseHappiness > 80 ? 'positive' : baseHappiness > 60 ? 'neutral' : 'negative'
    });
  }
  return data;
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
            <span className="font-medium">{pld.value}{pld.dataKey !== 'checkIns' ? '%' : ' check-ins'}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const getTrendIcon = (trend) => {
  if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-gray-500" />;
};

const getTrendColor = (trend) => {
  if (trend > 0) return "text-green-600";
  if (trend < 0) return "text-red-600";
  return "text-gray-600";
};

export default function SentimentChart({
  title = "Team Sentiment Trends",
  subtitle = "Real-time mood and energy tracking",
  showControls = true,
  chartType = "line", // "line" or "area"
  height = 400
}) {
  const [timeRange, setTimeRange] = useState('7');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockData = generateMockData(parseInt(timeRange));
    setData(mockData);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const calculateTrend = (key) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-3).reduce((sum, item) => sum + item[key], 0) / 3;
    const previous = data.slice(-6, -3).reduce((sum, item) => sum + item[key], 0) / 3;
    return Math.round(recent - previous);
  };

  const happinessTrend = calculateTrend('happiness');
  const energyTrend = calculateTrend('energy');
  const avgHappiness = Math.round(data.reduce((sum, item) => sum + item.happiness, 0) / data.length) || 0;
  const avgEnergy = Math.round(data.reduce((sum, item) => sum + item.energy, 0) / data.length) || 0;
  const totalCheckIns = data.reduce((sum, item) => sum + item.checkIns, 0);

  const ChartComponent = chartType === "area" ? AreaChart : LineChart;
  const DataComponent = chartType === "area" ? Area : Line;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {title}
              <Badge variant="outline" className="text-xs">
                Live
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              {subtitle} • Last updated {format(lastUpdated, 'HH:mm')}
            </CardDescription>
          </div>
          {showControls && (
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                disabled={isLoading}
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Happiness</p>
                <p className="text-2xl font-bold">{avgHappiness}%</p>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(happinessTrend)}
                <span className={cn("text-sm font-medium", getTrendColor(happinessTrend))}>
                  {happinessTrend > 0 ? '+' : ''}{happinessTrend}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Energy</p>
                <p className="text-2xl font-bold">{avgEnergy}%</p>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(energyTrend)}
                <span className={cn("text-sm font-medium", getTrendColor(energyTrend))}>
                  {energyTrend > 0 ? '+' : ''}{energyTrend}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Check-ins</p>
              <p className="text-2xl font-bold">{totalCheckIns}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Avg {Math.round(totalCheckIns / data.length)} per day
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer>
            <ChartComponent data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-muted-foreground"
                fontSize={12}
              />
              <YAxis
                className="text-muted-foreground"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {chartType === "area" ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="happiness"
                    stackId="1"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    name="Happiness"
                  />
                  <Area
                    type="monotone"
                    dataKey="energy"
                    stackId="1"
                    stroke="hsl(var(--secondary))"
                    fill="hsl(var(--secondary))"
                    fillOpacity={0.3}
                    name="Energy"
                  />
                </>
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="happiness"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    name="Happiness"
                  />
                  <Line
                    type="monotone"
                    dataKey="energy"
                    stroke="hsl(142, 76%, 36%)"
                    strokeWidth={3}
                    dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2, r: 4 }}
                    name="Energy"
                  />
                </>
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}