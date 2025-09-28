'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { teamsAPI, getAuthToken, handleAPIError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Users,
  Plus,
  UserPlus,
  Settings,
  Crown,
  Shield,
  User,
  Copy,
  Link,
  Calendar,
  MapPin,
  Globe
} from 'lucide-react';

export default function TeamsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [joinTeamOpen, setJoinTeamOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  // Load teams from backend API
  useEffect(() => {
    if (user) {
      loadTeams();
    }
  }, [user]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const teamsData = await teamsAPI.getUserTeams(token);

      // Transform backend data to match component expectations
      const transformedTeams = teamsData.map(team => ({
        id: team.id,
        name: team.name,
        description: team.description,
        memberCount: team.members?.length || 0,
        role: team.userRole,
        createdAt: team.created_at,
        inviteCode: team.invite_code,
        settings: {
          timezone: team.settings?.timezone || 'UTC',
          region: team.settings?.region || 'Unknown',
          isPrivate: team.is_private || false,
          allowMemberInvites: team.settings?.allowMemberInvites !== false
          },
        createdBy: team.createdBy
      }));

      setTeams(transformedTeams);
    } catch (err) {
      const errorMessage = handleAPIError(err, 'Failed to load teams');
      setError(errorMessage);
      console.error('Failed to load teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (formData) => {
    try {
      setCreateLoading(true);
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const teamData = {
        name: formData.get('teamName'),
        description: formData.get('teamDescription'),
        isPrivate: formData.get('isPrivate') === 'true',
        maxMembers: 50, // Default max members
        allowAnonymousCheckins: true, // Default setting
        settings: {
          timezone: formData.get('timezone'),
          region: formData.get('region')
        }
      };

      const newTeam = await teamsAPI.createTeam(token, teamData);

      // Transform and add to local state
      const transformedTeam = {
        id: newTeam.id,
        name: newTeam.name,
        description: newTeam.description,
        memberCount: 1,
        role: newTeam.userRole,
        createdAt: newTeam.created_at,
        inviteCode: newTeam.invite_code,
        settings: {
          timezone: teamData.settings.timezone,
          region: teamData.settings.region,
          isPrivate: newTeam.is_private,
          allowMemberInvites: true
        }
      };

      setTeams(prev => [...prev, transformedTeam]);
      setCreateTeamOpen(false);
    } catch (err) {
      const errorMessage = handleAPIError(err, 'Failed to create team');
      setError(errorMessage);
      console.error('Failed to create team:', err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    try {
      setJoinLoading(true);
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const joinedTeam = await teamsAPI.joinTeam(token, inviteCode);

      // Reload teams to get the updated list
      await loadTeams();

      setJoinTeamOpen(false);
      setInviteCode('');
    } catch (err) {
      const errorMessage = handleAPIError(err, 'Failed to join team');
      setError(errorMessage);
      console.error('Failed to join team:', err);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCopyInviteCode = async (inviteCode) => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      // You could add a toast notification here
      console.log('Invite code copied:', inviteCode);
    } catch (err) {
      console.error('Failed to copy invite code:', err);
    }
  };

  const handleShareLink = async (team) => {
    const shareLink = `${window.location.origin}/join/${team.inviteCode}`;
    try {
      await navigator.clipboard.writeText(shareLink);
      // You could add a toast notification here
      console.log('Share link copied:', shareLink);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  const canManageTeam = (team) => {
    return team.role === 'admin' || team.role === 'manager';
  };

  const canInviteMembers = (team) => {
    return team.role === 'admin' || team.role === 'manager' || 
    team.settings?.allowMemberInvites;
    };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown size={16} className="text-yellow-500" />;
      case 'manager':
        return <Shield size={16} className="text-blue-500" />;
      default:
        return <User size={16} className="text-gray-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      manager: 'bg-blue-100 text-blue-800 border-blue-200',
      member: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[role]}`}>
        {getRoleIcon(role)}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading your teams...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
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
                  loadTeams();
                }}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Team Management</CardTitle>
                <CardDescription className="text-base">
                  Create, join, and manage your teams. Collaborate effectively with your colleagues.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={joinTeamOpen} onOpenChange={setJoinTeamOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join Team
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join a Team</DialogTitle>
                    <DialogDescription>
                      Enter the invitation code provided by your team administrator.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                        <Label htmlFor="inviteCode">Invitation Code</Label>
                        <Input
                        id="inviteCode"
                        placeholder="e.g. TEAM-ABC123"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setJoinTeamOpen(false)}
                      disabled={joinLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleJoinTeam}
                      disabled={!inviteCode.trim() || joinLoading}
                    >
                      {joinLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Joining...
                        </>
                      ) : (
                        'Join Team'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={createTeamOpen} onOpenChange={setCreateTeamOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Team
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Team</DialogTitle>
                    <DialogDescription>
                      Set up a new team to start collaborating with your colleagues.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateTeam(new FormData(e.target));
                  }}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="teamName">Team Name</Label>
                        <Input
                          id="teamName"
                          name="teamName"
                          placeholder="e.g. Product Development"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="teamDescription">Description</Label>
                        <Input
                          id="teamDescription"
                          name="teamDescription"
                          placeholder="Brief description of your team"
                        />
                      </div>
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select name="timezone" defaultValue="UTC-8">
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
                      <div>
                        <Label htmlFor="region">Region</Label>
                        <Select name="region" defaultValue="North America">
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
                      <div>
                        <Label htmlFor="isPrivate">Team Privacy</Label>
                        <Select name="isPrivate" defaultValue="false">
                          <SelectTrigger>
                            <SelectValue placeholder="Select privacy setting" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="false">Public - Anyone can find and join</SelectItem>
                            <SelectItem value="true">Private - Invitation only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCreateTeamOpen(false)}
                        disabled={createLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createLoading}
                      >
                        {createLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          'Create Team'
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{team.name}</CardTitle>
                  <CardDescription className="mt-1" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {team.description}
                  </CardDescription>
                </div>
                <div className="ml-2 flex-shrink-0">
                  {getRoleBadge(team.role)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{team.memberCount} members</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{new Date(team.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{team.settings.region}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Globe className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{team.settings.timezone}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <div className="w-full space-y-2">
                {canManageTeam(team) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => router.push(`/dashboard/teams/${team.id}`)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Team
                  </Button>
                )}

                {canInviteMembers(team) && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleCopyInviteCode(team.inviteCode)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleShareLink(team)}
                    >
                      <Link className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                )}

                {!canManageTeam(team) && !canInviteMembers(team) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => router.push(`/dashboard/teams/${team.id}`)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View Team
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}

        {teams.length === 0 && (
          <div className="col-span-full">
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <CardTitle className="mb-2">No teams yet</CardTitle>
                <CardDescription className="mb-6">
                  Create your first team or join an existing one to get started.
                </CardDescription>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => setCreateTeamOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Team
                  </Button>
                  <Button variant="outline" onClick={() => setJoinTeamOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
