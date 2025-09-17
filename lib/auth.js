import { supabase } from './supabase'

// Auth functions for frontend
export const auth = {
  // Sign up new user
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Profile functions
export const profiles = {
  // Get user profile
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Update user profile
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Create user profile (called after signup)
  async createProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id: userId, ...profileData }])
      .select()
      .single()
    return { data, error }
  }
}

// Team functions
export const teams = {
  // Get user teams
  async getUserTeams(userId) {
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        team_id,
        role,
        joined_at,
        teams (
          id,
          name,
          description,
          created_at
        )
      `)
      .eq('user_id', userId)
    return { data, error }
  },

  // Create new team
  async createTeam(teamData, userId) {
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert([{ ...teamData, created_by: userId }])
      .select()
      .single()

    if (teamError) return { data: null, error: teamError }

    // Add creator as manager
    const { error: memberError } = await supabase
      .from('team_members')
      .insert([{ team_id: team.id, user_id: userId, role: 'manager' }])

    return { data: team, error: memberError }
  },

  // Join team by invite code
  async joinTeam(inviteCode, userId) {
    // First get the team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id')
      .eq('invite_code', inviteCode)
      .single()

    if (teamError) return { data: null, error: teamError }

    // Add user to team
    const { data, error } = await supabase
      .from('team_members')
      .insert([{ team_id: team.id, user_id: userId, role: 'member' }])
      .select()
      .single()

    return { data, error }
  }
}

// Check-ins functions
export const checkIns = {
  // Submit check-in
  async submitCheckIn(checkInData) {
    const { data, error } = await supabase
      .from('check_ins')
      .insert([checkInData])
      .select()
      .single()
    return { data, error }
  },

  // Get user's check-ins
  async getUserCheckIns(userId, limit = 10) {
    const { data, error } = await supabase
      .from('check_ins')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  },

  // Get team check-ins (for managers)
  async getTeamCheckIns(teamId, limit = 50) {
    const { data, error } = await supabase
      .from('check_ins')
      .select(`
        *,
        profiles!user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  }
}