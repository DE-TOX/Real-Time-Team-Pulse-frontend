'use client'
import { useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Download,
  FileText,
  Mail,
  Share2,
  Calendar,
  Users,
  BarChart3,
  Copy,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const REPORT_SECTIONS = [
  { id: 'summary', label: 'Executive Summary', description: 'High-level overview and key metrics' },
  { id: 'trends', label: 'Mood & Energy Trends', description: 'Detailed trend analysis over time' },
  { id: 'distribution', label: 'Sentiment Distribution', description: 'Breakdown of team mood states' },
  { id: 'insights', label: 'AI Insights', description: 'Generated recommendations and patterns' },
  { id: 'alerts', label: 'Priority Alerts', description: 'Items requiring attention' },
  { id: 'participation', label: 'Participation Metrics', description: 'Check-in completion and engagement' },
  { id: 'goals', label: 'Goal Progress', description: 'Individual and team objectives' },
  { id: 'recommendations', label: 'Action Items', description: 'Suggested next steps' }
];

const EXPORT_FORMATS = [
  { id: 'pdf', label: 'PDF Report', description: 'Complete formatted report with charts', icon: FileText },
  { id: 'csv', label: 'CSV Data', description: 'Raw data for further analysis', icon: BarChart3 },
  { id: 'email', label: 'Email Summary', description: 'Send digest to stakeholders', icon: Mail }
];

const SHARE_OPTIONS = [
  { id: 'link', label: 'Shareable Link', description: 'Generate a secure link to view the report' },
  { id: 'schedule', label: 'Scheduled Reports', description: 'Automatically send reports on a schedule' },
  { id: 'dashboard', label: 'Live Dashboard', description: 'Create a real-time dashboard link' }
];

export default function WellnessReportExport({
  trigger,
  reportType = 'team', // 'team' or 'personal'
  data = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSections, setSelectedSections] = useState(['summary', 'trends', 'insights']);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedShare, setSelectedShare] = useState('');
  const [timeRange, setTimeRange] = useState('30');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSectionToggle = (sectionId) => {
    setSelectedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock report data
    const reportData = {
      type: reportType,
      format: selectedFormat,
      sections: selectedSections,
      timeRange: timeRange,
      generatedAt: new Date().toISOString(),
      data: data
    };

    if (selectedFormat === 'pdf') {
      // Simulate PDF generation
      const blob = new Blob(['Mock PDF content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wellness-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (selectedFormat === 'csv') {
      // Simulate CSV generation
      const csvContent = `Date,Happiness,Energy,Stress,Notes\n2024-01-01,8,7,3,"Good day"\n2024-01-02,7,6,4,"Average day"`;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wellness-data-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (selectedFormat === 'email') {
      // Simulate email sending
      console.log('Sending email to:', recipientEmail);
      console.log('Message:', customMessage);
    }

    setIsExporting(false);
    setIsOpen(false);
  };

  const handleShare = async () => {
    setIsSharing(true);

    // Simulate share link generation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockLink = `https://wellness.company.com/reports/shared/${Math.random().toString(36).substr(2, 9)}`;
    setShareLink(mockLink);
    setIsSharing(false);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Wellness Report
          </DialogTitle>
          <DialogDescription>
            Customize and export your {reportType === 'team' ? 'team' : 'personal'} wellness insights
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Time Range */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Time Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="14">Last 14 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Report Sections */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Include Sections</CardTitle>
                <CardDescription>
                  Choose which sections to include in your report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {REPORT_SECTIONS.map((section) => (
                    <div key={section.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={section.id}
                        checked={selectedSections.includes(section.id)}
                        onCheckedChange={() => handleSectionToggle(section.id)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor={section.id} className="font-medium">
                          {section.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Export Format */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {EXPORT_FORMATS.map((format) => {
                    const IconComponent = format.icon;
                    return (
                      <div
                        key={format.id}
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                          selectedFormat === format.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        )}
                        onClick={() => setSelectedFormat(format.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5" />
                          <div>
                            <div className="font-medium">{format.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {format.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedFormat === 'email' && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <Label htmlFor="email">Recipient Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="manager@company.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Custom Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Add a personal message to include with the report..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview & Share */}
          <div className="space-y-6">
            {/* Report Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Report Preview</CardTitle>
                <CardDescription>
                  Summary of what will be included
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Time Range:</span>
                      <div className="font-medium">Last {timeRange} days</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Format:</span>
                      <div className="font-medium capitalize">{selectedFormat}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sections:</span>
                      <div className="font-medium">{selectedSections.length} selected</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <div className="font-medium capitalize">{reportType} Report</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-muted-foreground text-sm mb-2">Selected Sections:</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSections.map((sectionId) => {
                        const section = REPORT_SECTIONS.find(s => s.id === sectionId);
                        return (
                          <Badge key={sectionId} variant="secondary">
                            {section?.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Options
                </CardTitle>
                <CardDescription>
                  Share insights with your team or stakeholders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {SHARE_OPTIONS.map((option) => (
                    <div
                      key={option.id}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        selectedShare === option.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      )}
                      onClick={() => setSelectedShare(option.id)}
                    >
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedShare === 'link' && (
                  <div className="mt-4 space-y-3">
                    <Button
                      onClick={handleShare}
                      disabled={isSharing}
                      className="w-full"
                    >
                      {isSharing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Link...
                        </>
                      ) : (
                        'Generate Shareable Link'
                      )}
                    </Button>

                    {shareLink && (
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-between gap-2">
                          <Input
                            value={shareLink}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={copyToClipboard}
                          >
                            {copied ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Link expires in 30 days. Recipients can view but not edit.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedSections.length} sections • {timeRange} days • {selectedFormat.toUpperCase()}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || selectedSections.length === 0}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}