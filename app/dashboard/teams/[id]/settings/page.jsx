'use client'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Settings,
  Save,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  AlertTriangle,
  CheckCircle,
  Globe,
  Lock,
  Users,
  Clock,
  MapPin,
  Link2,
  Shield
} from 'lucide-react';
import styles from './page.module.css';

export default function TeamSettingsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [regenerateCodeOpen, setRegenerateCodeOpen] = useState(false);
  const [formData, setFormData] = useState({});

  // Mock data for demonstration
  useEffect(() => {
    const mockTeam = {
      id: parseInt(id),
      name: 'Product Development',
      description: 'Main product development team working on core features',
      memberCount: 12,
      role: 'admin', // Current user's role
      createdAt: '2024-01-15',
      inviteCode: 'PROD-DEV-2024',
      settings: {
        timezone: 'UTC-8',
        region: 'North America',
        isPrivate: false,
        allowMemberInvites: true,
        autoApproveJoinRequests: false,
        notificationSettings: {
          weeklyReports: true,
          memberJoined: true,
          memberLeft: false,
          settingsChanged: true
        }
      }
    };

    setTimeout(() => {
      setTeam(mockTeam);
      setFormData({
        name: mockTeam.name,
        description: mockTeam.description,
        timezone: mockTeam.settings.timezone,
        region: mockTeam.settings.region,
        isPrivate: mockTeam.settings.isPrivate,
        allowMemberInvites: mockTeam.settings.allowMemberInvites,
        autoApproveJoinRequests: mockTeam.settings.autoApproveJoinRequests,
        ...mockTeam.settings.notificationSettings
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const canManageSettings = () => {
    return team && (team.role === 'admin' || team.role === 'manager');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update team data
      setTeam(prev => ({
        ...prev,
        name: formData.name,
        description: formData.description,
        settings: {
          ...prev.settings,
          timezone: formData.timezone,
          region: formData.region,
          isPrivate: formData.isPrivate,
          allowMemberInvites: formData.allowMemberInvites,
          autoApproveJoinRequests: formData.autoApproveJoinRequests,
          notificationSettings: {
            weeklyReports: formData.weeklyReports,
            memberJoined: formData.memberJoined,
            memberLeft: formData.memberLeft,
            settingsChanged: formData.settingsChanged
          }
        }
      }));

      console.log('Settings saved successfully');
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateCode = async () => {
    try {
      // Simulate API call
      const newCode = `TEAM-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      setTeam(prev => ({
        ...prev,
        inviteCode: newCode
      }));
      setRegenerateCodeOpen(false);
      console.log('Invite code regenerated:', newCode);
    } catch (err) {
      console.error('Failed to regenerate code:', err);
    }
  };

  const handleCopyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(team.inviteCode);
      console.log('Invite code copied');
    } catch (err) {
      console.error('Failed to copy invite code:', err);
    }
  };

  const handleCopyInviteLink = async () => {
    try {
      const inviteLink = `${window.location.origin}/join/${team.inviteCode}`;
      await navigator.clipboard.writeText(inviteLink);
      console.log('Invite link copied');
    } catch (err) {
      console.error('Failed to copy invite link:', err);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Team deleted');
      router.push('/dashboard/teams');
    } catch (err) {
      console.error('Failed to delete team:', err);
    }
  };

  if (loading) {
    return (
      <div className={styles.settingsPage}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading team settings...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className={styles.settingsPage}>
        <div className={styles.notFound}>
          <h2>Team not found</h2>
          <Button onClick={() => router.push('/dashboard/teams')}>
            <ArrowLeft size={16} />
            Back to Teams
          </Button>
        </div>
      </div>
    );
  }

  if (!canManageSettings()) {
    return (
      <div className={styles.settingsPage}>
        <div className={styles.accessDenied}>
          <Shield size={48} />
          <h2>Access Restricted</h2>
          <p>You don't have permission to manage team settings.</p>
          <Button onClick={() => router.push(`/dashboard/teams/${id}`)}>
            <ArrowLeft size={16} />
            Back to Team
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.settingsPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerNav}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/teams/${id}`)}
            >
              <ArrowLeft size={16} />
              Back to Team
            </Button>
          </div>

          <div className={styles.headerInfo}>
            <div className={styles.headerIcon}>
              <Settings size={24} />
            </div>
            <div>
              <h1 className={styles.pageTitle}>Team Settings</h1>
              <p className={styles.pageDescription}>
                Manage {team.name} configuration and preferences
              </p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <Button onClick={handleSaveSettings} disabled={saving}>
              {saving ? (
                <>
                  <div className={styles.saveSpinner}></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className={styles.settingsContent}>
        {/* General Settings */}
        <div className={styles.settingsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>General Settings</h2>
            <p className={styles.sectionDescription}>
              Basic information and team configuration
            </p>
          </div>

          <div className={styles.settingsCard}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter team name"
                />
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="teamDescription">Description</Label>
                <Input
                  id="teamDescription"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of your team"
                />
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => handleInputChange('timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC-12">UTC-12 (Baker Island)</SelectItem>
                    <SelectItem value="UTC-8">UTC-8 (Pacific)</SelectItem>
                    <SelectItem value="UTC-5">UTC-5 (Eastern)</SelectItem>
                    <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                    <SelectItem value="UTC+1">UTC+1 (Central Europe)</SelectItem>
                    <SelectItem value="UTC+8">UTC+8 (Asia)</SelectItem>
                    <SelectItem value="UTC+9">UTC+9 (Japan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="region">Region</Label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => handleInputChange('region', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North America">North America</SelectItem>
                    <SelectItem value="South America">South America</SelectItem>
                    <SelectItem value="Europe">Europe</SelectItem>
                    <SelectItem value="Asia">Asia</SelectItem>
                    <SelectItem value="Africa">Africa</SelectItem>
                    <SelectItem value="Oceania">Oceania</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Access */}
        <div className={styles.settingsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Privacy & Access</h2>
            <p className={styles.sectionDescription}>
              Control who can join and access your team
            </p>
          </div>

          <div className={styles.settingsCard}>
            <div className={styles.toggleSection}>
              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <div className={styles.toggleTitle}>
                    {formData.isPrivate ? <Lock size={16} /> : <Globe size={16} />}
                    Team Privacy
                  </div>
                  <div className={styles.toggleDescription}>
                    {formData.isPrivate
                      ? 'Private team - invitation only'
                      : 'Public team - anyone can find and join'
                    }
                  </div>
                </div>
                <Select
                  value={formData.isPrivate ? 'true' : 'false'}
                  onValueChange={(value) => handleInputChange('isPrivate', value === 'true')}
                >
                  <SelectTrigger className={styles.privacySelect}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">
                      <div className={styles.selectOption}>
                        <Globe size={14} />
                        Public
                      </div>
                    </SelectItem>
                    <SelectItem value="true">
                      <div className={styles.selectOption}>
                        <Lock size={14} />
                        Private
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <div className={styles.toggleTitle}>
                    <Users size={16} />
                    Member Invitations
                  </div>
                  <div className={styles.toggleDescription}>
                    Allow team members to invite others
                  </div>
                </div>
                <Select
                  value={formData.allowMemberInvites ? 'true' : 'false'}
                  onValueChange={(value) => handleInputChange('allowMemberInvites', value === 'true')}
                >
                  <SelectTrigger className={styles.privacySelect}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Enabled</SelectItem>
                    <SelectItem value="false">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <div className={styles.toggleTitle}>
                    <CheckCircle size={16} />
                    Auto-approve Join Requests
                  </div>
                  <div className={styles.toggleDescription}>
                    Automatically approve new member requests
                  </div>
                </div>
                <Select
                  value={formData.autoApproveJoinRequests ? 'true' : 'false'}
                  onValueChange={(value) => handleInputChange('autoApproveJoinRequests', value === 'true')}
                >
                  <SelectTrigger className={styles.privacySelect}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Enabled</SelectItem>
                    <SelectItem value="false">Manual Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Invitation Management */}
        <div className={styles.settingsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Invitation Management</h2>
            <p className={styles.sectionDescription}>
              Manage team invitation codes and links
            </p>
          </div>

          <div className={styles.settingsCard}>
            <div className={styles.inviteSection}>
              <div className={styles.inviteItem}>
                <div className={styles.inviteInfo}>
                  <Label>Invitation Code</Label>
                  <div className={styles.inviteCode}>{team.inviteCode}</div>
                </div>
                <div className={styles.inviteActions}>
                  <Button variant="outline" size="sm" onClick={handleCopyInviteCode}>
                    <Copy size={14} />
                    Copy Code
                  </Button>
                  <Dialog open={regenerateCodeOpen} onOpenChange={setRegenerateCodeOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RefreshCw size={14} />
                        Regenerate
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Regenerate Invitation Code</DialogTitle>
                        <DialogDescription>
                          This will create a new invitation code and invalidate the current one.
                          Existing invitation links will stop working.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setRegenerateCodeOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleRegenerateCode}>
                          Regenerate Code
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className={styles.inviteItem}>
                <div className={styles.inviteInfo}>
                  <Label>Invitation Link</Label>
                  <div className={styles.inviteLink}>
                    {`${window.location.origin}/join/${team.inviteCode}`}
                  </div>
                </div>
                <div className={styles.inviteActions}>
                  <Button variant="outline" size="sm" onClick={handleCopyInviteLink}>
                    <Link2 size={14} />
                    Copy Link
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className={styles.settingsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Notifications</h2>
            <p className={styles.sectionDescription}>
              Configure team notification preferences
            </p>
          </div>

          <div className={styles.settingsCard}>
            <div className={styles.toggleSection}>
              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <div className={styles.toggleTitle}>Weekly Reports</div>
                  <div className={styles.toggleDescription}>
                    Receive weekly team performance summaries
                  </div>
                </div>
                <Select
                  value={formData.weeklyReports ? 'true' : 'false'}
                  onValueChange={(value) => handleInputChange('weeklyReports', value === 'true')}
                >
                  <SelectTrigger className={styles.privacySelect}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Enabled</SelectItem>
                    <SelectItem value="false">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <div className={styles.toggleTitle}>Member Joined</div>
                  <div className={styles.toggleDescription}>
                    Notify when new members join the team
                  </div>
                </div>
                <Select
                  value={formData.memberJoined ? 'true' : 'false'}
                  onValueChange={(value) => handleInputChange('memberJoined', value === 'true')}
                >
                  <SelectTrigger className={styles.privacySelect}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Enabled</SelectItem>
                    <SelectItem value="false">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <div className={styles.toggleTitle}>Member Left</div>
                  <div className={styles.toggleDescription}>
                    Notify when members leave the team
                  </div>
                </div>
                <Select
                  value={formData.memberLeft ? 'true' : 'false'}
                  onValueChange={(value) => handleInputChange('memberLeft', value === 'true')}
                >
                  <SelectTrigger className={styles.privacySelect}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Enabled</SelectItem>
                    <SelectItem value="false">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <div className={styles.toggleTitle}>Settings Changes</div>
                  <div className={styles.toggleDescription}>
                    Notify when team settings are modified
                  </div>
                </div>
                <Select
                  value={formData.settingsChanged ? 'true' : 'false'}
                  onValueChange={(value) => handleInputChange('settingsChanged', value === 'true')}
                >
                  <SelectTrigger className={styles.privacySelect}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Enabled</SelectItem>
                    <SelectItem value="false">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        {team.role === 'admin' && (
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Danger Zone</h2>
              <p className={styles.sectionDescription}>
                Irreversible and destructive actions
              </p>
            </div>

            <div className={styles.dangerCard}>
              <div className={styles.dangerItem}>
                <div className={styles.dangerInfo}>
                  <div className={styles.dangerTitle}>
                    <AlertTriangle size={16} />
                    Delete Team
                  </div>
                  <div className={styles.dangerDescription}>
                    Permanently delete this team and all its data. This action cannot be undone.
                  </div>
                </div>
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 size={14} />
                      Delete Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Team</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{team.name}"? This action cannot be undone.
                        All team data, members, and settings will be permanently lost.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteTeam}>
                        Delete Team
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}