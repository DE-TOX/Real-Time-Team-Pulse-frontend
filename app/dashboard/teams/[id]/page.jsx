'use client'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
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
  Users,
  Settings,
  UserPlus,
  Crown,
  Shield,
  User,
  Mail,
  MoreVertical,
  UserX,
  Edit,
  Copy,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';
import styles from './page.module.css';

export default function TeamDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');

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
        isPrivate: false
      }
    };

    const mockMembers = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        role: 'admin',
        avatar: null,
        joinedAt: '2024-01-15',
        lastActive: '2024-03-20T10:30:00Z',
        status: 'online'
      },
      {
        id: 2,
        name: 'Mike Chen',
        email: 'mike@company.com',
        role: 'manager',
        avatar: null,
        joinedAt: '2024-01-20',
        lastActive: '2024-03-20T09:45:00Z',
        status: 'away'
      },
      {
        id: 3,
        name: 'Emily Davis',
        email: 'emily@company.com',
        role: 'member',
        avatar: null,
        joinedAt: '2024-02-01',
        lastActive: '2024-03-20T11:15:00Z',
        status: 'online'
      },
      {
        id: 4,
        name: 'Alex Rodriguez',
        email: 'alex@company.com',
        role: 'member',
        avatar: null,
        joinedAt: '2024-02-15',
        lastActive: '2024-03-19T16:30:00Z',
        status: 'offline'
      },
      {
        id: 5,
        name: 'Lisa Wang',
        email: 'lisa@company.com',
        role: 'member',
        avatar: null,
        joinedAt: '2024-03-01',
        lastActive: '2024-03-20T08:20:00Z',
        status: 'online'
      }
    ];

    setTimeout(() => {
      setTeam(mockTeam);
      setMembers(mockMembers);
      setLoading(false);
    }, 1000);
  }, [id]);

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

  const getStatusBadge = (status) => {
    const styles = {
      online: 'bg-green-100 text-green-800 border-green-200',
      away: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      offline: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const statusDot = {
      online: 'bg-green-500',
      away: 'bg-yellow-500',
      offline: 'bg-gray-400'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        <div className={`w-2 h-2 rounded-full ${statusDot[status]}`}></div>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const canManageMembers = () => {
    return team && (team.role === 'admin' || team.role === 'manager');
  };

  const canManageRole = (memberRole) => {
    if (!team) return false;
    if (team.role === 'admin') return true;
    if (team.role === 'manager' && memberRole === 'member') return true;
    return false;
  };

  const handleInviteMember = async () => {
    // Simulate API call
    console.log('Inviting member:', { email: inviteEmail, role: inviteRole });
    setInviteOpen(false);
    setInviteEmail('');
    setInviteRole('member');
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setEditMemberOpen(true);
  };

  const handleUpdateMemberRole = async (newRole) => {
    if (!selectedMember) return;

    // Simulate API call
    setMembers(prev => prev.map(member =>
      member.id === selectedMember.id
        ? { ...member, role: newRole }
        : member
    ));

    setEditMemberOpen(false);
    setSelectedMember(null);
  };

  const handleRemoveMember = async (memberId) => {
    // Simulate API call
    setMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const formatLastActive = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading team details...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className={styles.notFound}>
        <h2>Team not found</h2>
        <Button onClick={() => router.push('/dashboard/teams')}>
          <ArrowLeft size={16} />
          Back to Teams
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.teamPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerNav}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/teams')}
            >
              <ArrowLeft size={16} />
              Back to Teams
            </Button>
          </div>

          <div className={styles.teamInfo}>
            <div className={styles.teamDetails}>
              <h1 className={styles.teamName}>{team.name}</h1>
              <p className={styles.teamDescription}>{team.description}</p>
              <div className={styles.teamMeta}>
                <div className={styles.metaItem}>
                  <Users size={16} />
                  <span>{members.length} members</span>
                </div>
                <div className={styles.metaItem}>
                  <Calendar size={16} />
                  <span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={styles.metaItem}>
                  <MapPin size={16} />
                  <span>{team.settings.region}</span>
                </div>
                <div className={styles.metaItem}>
                  <Globe size={16} />
                  <span>{team.settings.timezone}</span>
                </div>
                <div className={styles.metaItem}>
                  {team.settings.isPrivate ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span>{team.settings.isPrivate ? 'Private' : 'Public'}</span>
                </div>
              </div>
            </div>
            {getRoleBadge(team.role)}
          </div>

          <div className={styles.headerActions}>
            {canManageMembers() && (
              <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus size={16} />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join {team.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="inviteEmail">Email Address</Label>
                      <Input
                        id="inviteEmail"
                        type="email"
                        placeholder="colleague@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="inviteRole">Role</Label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          {team.role === 'admin' && (
                            <SelectItem value="manager">Manager</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setInviteOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleInviteMember} disabled={!inviteEmail.trim()}>
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/teams/${id}/settings`)}
            >
              <Settings size={16} />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className={styles.membersSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Team Members</h2>
          <p className={styles.sectionDescription}>
            Manage your team members and their roles
          </p>
        </div>

        <div className={styles.membersList}>
          {members.map((member) => (
            <div key={member.id} className={styles.memberCard}>
              <div className={styles.memberInfo}>
                <div className={styles.memberAvatar}>
                  <User size={20} />
                </div>
                <div className={styles.memberDetails}>
                  <div className={styles.memberName}>{member.name}</div>
                  <div className={styles.memberEmail}>{member.email}</div>
                  <div className={styles.memberMeta}>
                    <Clock size={12} />
                    <span>{formatLastActive(member.lastActive)}</span>
                    <span>•</span>
                    <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className={styles.memberStatus}>
                {getStatusBadge(member.status)}
                {getRoleBadge(member.role)}
              </div>

              {canManageMembers() && member.id !== user?.id && (
                <div className={styles.memberActions}>
                  {canManageRole(member.role) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMember(member)}
                    >
                      <Edit size={14} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <UserX size={14} />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Member Role Dialog */}
      <Dialog open={editMemberOpen} onOpenChange={setEditMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member Role</DialogTitle>
            <DialogDescription>
              Change {selectedMember?.name}'s role in {team.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Role</Label>
              <div className="mt-1">
                {selectedMember && getRoleBadge(selectedMember.role)}
              </div>
            </div>
            <div>
              <Label>New Role</Label>
              <Select onValueChange={handleUpdateMemberRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  {team.role === 'admin' && (
                    <>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMemberOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
