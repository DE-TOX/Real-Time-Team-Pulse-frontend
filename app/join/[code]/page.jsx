'use client'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Users,
  Sparkles,
  Crown,
  Shield,
  User,
  Calendar,
  MapPin,
  Globe,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react';
import styles from './page.module.css';

export default function JoinTeamPage() {
  const { code } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);

  // Mock data lookup by invite code
  useEffect(() => {
    const findTeamByCode = (inviteCode) => {
      const mockTeams = [
        {
          id: 1,
          name: 'Product Development',
          description: 'Main product development team working on core features',
          memberCount: 12,
          createdAt: '2024-01-15',
          inviteCode: 'PROD-DEV-2024',
          settings: {
            timezone: 'UTC-8',
            region: 'North America',
            isPrivate: false
          }
        },
        {
          id: 2,
          name: 'Marketing Team',
          description: 'Creative marketing and brand management team',
          memberCount: 6,
          createdAt: '2024-02-20',
          inviteCode: 'MARKETING-TEAM',
          settings: {
            timezone: 'UTC-5',
            region: 'Europe',
            isPrivate: true
          }
        }
      ];

      return mockTeams.find(team => team.inviteCode === inviteCode);
    };

    setTimeout(() => {
      const foundTeam = findTeamByCode(code);
      if (foundTeam) {
        setTeam(foundTeam);
      } else {
        setError('Invalid or expired invitation code');
      }
      setLoading(false);
    }, 1000);
  }, [code]);

  const handleJoinTeam = async () => {
    if (!user) {
      // Redirect to login with return URL
      router.push(`/auth/login?returnUrl=${encodeURIComponent(`/join/${code}`)}`);
      return;
    }

    setJoining(true);
    try {
      // Simulate API call to join team
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Joined team:', team.id);

      // Redirect to team page after joining
      router.push(`/dashboard/teams/${team.id}`);
    } catch (err) {
      setError('Failed to join team. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.joinPage}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading invitation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className={styles.joinPage}>
        <div className={styles.container}>
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>
              <X size={48} />
            </div>
            <h2 className={styles.errorTitle}>Invalid Invitation</h2>
            <p className={styles.errorMessage}>
              {error || 'This invitation link is invalid or has expired.'}
            </p>
            <Button onClick={() => router.push('/dashboard/teams')}>
              View My Teams
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.joinPage}>
      <div className={styles.container}>
        <div className={styles.inviteCard}>
          <div className={styles.cardHeader}>
            <div className={styles.teamIcon}>
              <Sparkles size={32} />
            </div>
            <div className={styles.inviteText}>
              <h1 className={styles.inviteTitle}>You're invited to join</h1>
              <h2 className={styles.teamName}>{team.name}</h2>
            </div>
          </div>

          <div className={styles.teamInfo}>
            <p className={styles.teamDescription}>{team.description}</p>

            <div className={styles.teamStats}>
              <div className={styles.stat}>
                <Users size={16} />
                <span>{team.memberCount} members</span>
              </div>
              <div className={styles.stat}>
                <Calendar size={16} />
                <span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
              </div>
              <div className={styles.stat}>
                <MapPin size={16} />
                <span>{team.settings.region}</span>
              </div>
              <div className={styles.stat}>
                <Globe size={16} />
                <span>{team.settings.timezone}</span>
              </div>
              <div className={styles.stat}>
                {team.settings.isPrivate ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{team.settings.isPrivate ? 'Private Team' : 'Public Team'}</span>
              </div>
            </div>
          </div>

          <div className={styles.actionSection}>
            {!user ? (
              <div className={styles.authPrompt}>
                <p className={styles.authMessage}>
                  Sign in to join this team
                </p>
                <Button size="lg" onClick={handleJoinTeam}>
                  Sign In & Join Team
                </Button>
              </div>
            ) : (
              <div className={styles.joinPrompt}>
                <p className={styles.joinMessage}>
                  Ready to collaborate with the {team.name} team?
                </p>
                <Button
                  size="lg"
                  onClick={handleJoinTeam}
                  disabled={joining}
                >
                  {joining ? (
                    <>
                      <div className={styles.buttonSpinner}></div>
                      Joining...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Join Team
                    </>
                  )}
                </Button>
              </div>
            )}

            <div className={styles.secondaryActions}>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/teams')}
              >
                View My Teams
              </Button>
              {user && (
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
