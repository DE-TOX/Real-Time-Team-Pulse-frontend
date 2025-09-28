const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Make an API request to the backend
 * @param {string} endpoint - The API endpoint (e.g., '/api/teams')
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} - The response from the API
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Make an authenticated API request
 * @param {string} endpoint - The API endpoint
 * @param {string} token - JWT token for authentication
 * @param {Object} options - Fetch options
 * @returns {Promise} - The response from the API
 */
export const authenticatedRequest = async (endpoint, token, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
};

// ===================
// TEAMS API SERVICES
// ===================

export const teamsAPI = {
  /**
   * Get all teams for the current user
   */
  async getUserTeams(token) {
    const response = await authenticatedRequest('/api/teams', token);
    return response.teams;
  },

  /**
   * Create a new team
   */
  async createTeam(token, teamData) {
    const response = await authenticatedRequest('/api/teams', token, {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
    return response.team;
  },

  /**
   * Get team details by ID
   */
  async getTeam(token, teamId) {
    const response = await authenticatedRequest(`/api/teams/${teamId}`, token);
    return response.team;
  },

  /**
   * Join a team using invite code
   */
  async joinTeam(token, inviteCode) {
    const response = await authenticatedRequest('/api/teams/join', token, {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    });
    return response.team;
  },

  /**
   * Update team settings
   */
  async updateTeamSettings(token, teamId, settings) {
    const response = await authenticatedRequest(`/api/teams/${teamId}/settings`, token, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return response.team;
  },

  /**
   * Create team invitation
   */
  async createInvitation(token, teamId, invitationData) {
    const response = await authenticatedRequest(`/api/teams/${teamId}/invitations`, token, {
      method: 'POST',
      body: JSON.stringify(invitationData),
    });
    return response.invitation;
  },

  /**
   * Get team invitations
   */
  async getInvitations(token, teamId) {
    const response = await authenticatedRequest(`/api/teams/${teamId}/invitations`, token);
    return response.invitations;
  },
};

// ======================
// CHECK-INS API SERVICES
// ======================

export const checkInsAPI = {
  /**
   * Submit a new check-in for a team
   */
  async submitCheckIn(token, teamId, checkInData) {
    const response = await authenticatedRequest(`/api/teams/${teamId}/check-ins`, token, {
      method: 'POST',
      body: JSON.stringify(checkInData),
    });
    return response.data;
  },

  /**
   * Get team check-ins with filtering and pagination
   */
  async getTeamCheckIns(token, teamId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/teams/${teamId}/check-ins${queryString ? `?${queryString}` : ''}`;
    const response = await authenticatedRequest(endpoint, token);
    return {
      checkIns: response.data,
      pagination: response.pagination,
    };
  },

  /**
   * Get current user's personal check-ins
   */
  async getPersonalCheckIns(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/check-ins/me${queryString ? `?${queryString}` : ''}`;
    const response = await authenticatedRequest(endpoint, token);
    return {
      checkIns: response.data,
      pagination: response.pagination,
    };
  },

  /**
   * Delete a check-in
   */
  async deleteCheckIn(token, checkInId) {
    const response = await authenticatedRequest(`/api/check-ins/${checkInId}`, token, {
      method: 'DELETE',
    });
    return response;
  },

  /**
   * Get team analytics
   */
  async getTeamAnalytics(token, teamId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/teams/${teamId}/analytics${queryString ? `?${queryString}` : ''}`;
    const response = await authenticatedRequest(endpoint, token);
    return response.data;
  },
};

// ==================
// AI API SERVICES
// ==================

export const aiAPI = {
  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(token, text) {
    const response = await authenticatedRequest('/api/ai/sentiment', token, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return response;
  },

  /**
   * Get enhanced sentiment analysis
   */
  async getEnhancedSentiment(token, text) {
    const response = await authenticatedRequest('/api/ai/sentiment/enhanced', token, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return response;
  },

  /**
   * Generate AI insights from team data
   */
  async generateInsights(token, teamData, options = {}) {
    const response = await authenticatedRequest('/api/ai/insights', token, {
      method: 'POST',
      body: JSON.stringify({ teamData, options }),
    });
    return response.insights;
  },

  /**
   * Process alerts for team data
   */
  async processAlerts(token, teamData) {
    const response = await authenticatedRequest('/api/ai/alerts', token, {
      method: 'POST',
      body: JSON.stringify({ teamData }),
    });
    return response.alerts;
  },

  /**
   * Detect trends in wellness data
   */
  async detectTrends(token, checkIns, options = {}) {
    const response = await authenticatedRequest('/api/ai/trends', token, {
      method: 'POST',
      body: JSON.stringify({ checkIns, options }),
    });
    return response.analysis;
  },

  /**
   * Get AI service health status
   */
  async getHealthStatus(token) {
    const response = await authenticatedRequest('/api/ai/health', token);
    return response;
  },

  /**
   * Run comprehensive AI demo
   */
  async runDemo(token) {
    const response = await authenticatedRequest('/api/ai/demo', token);
    return response;
  },

  /**
   * Test HuggingFace connection
   */
  async testConnection(token) {
    const response = await authenticatedRequest('/api/ai/test', token);
    return response;
  },
};

// =================
// UTILITY FUNCTIONS
// =================

/**
 * Get authentication token from Supabase session
 */
export const getAuthToken = async () => {
  // This will be used by components to get the current session token
  if (typeof window !== 'undefined') {
    const { supabase } = await import('./supabase');
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }
  return null;
};

/**
 * Handle API errors consistently
 */
export const handleAPIError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);

  if (error.message) {
    return error.message;
  }

  return defaultMessage;
};

/**
 * Format API request parameters
 */
export const formatParams = (params) => {
  const formatted = {};

  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      formatted[key] = value;
    }
  });

  return formatted;
};

export default apiRequest;