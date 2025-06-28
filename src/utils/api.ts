// API configuration for Vercel deployment
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// API endpoints
export const API_ENDPOINTS = {
  GROQ_CHAT: 'https://api.groq.com/openai/v1/chat/completions',
  BACKEND_REGISTER: `${BACKEND_URL}/api/register/`,
  BACKEND_LOGIN: `${BACKEND_URL}/api/login/`,
};

// Mock data for testing when backend is not available
const MOCK_USERS = new Map();

// API utilities
export const apiUtils = {
  // Check if Groq API key is available
  isGroqApiKeyAvailable: (): boolean => {
    return !!GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_api_key_here';
  },

  // Get Groq API headers
  getGroqHeaders: () => {
    if (!apiUtils.isGroqApiKeyAvailable()) {
      throw new Error('Groq API key is not configured. Please set NEXT_PUBLIC_GROQ_API_KEY in your environment variables.');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    };
  },

  // Backend registration with fallback
  register: async (userData: {
    child_name: string;
    child_dob: string;
    child_group?: string;
    parent_name: string;
    parent_dob: string;
    parent_mobile: string;
    password: string;
  }) => {
    try {
      // Try real backend first
      const response = await fetch(API_ENDPOINTS.BACKEND_REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Backend not available, using mock registration');
    }

    // Mock registration fallback
    const mockUserId = Date.now();
    MOCK_USERS.set(userData.parent_mobile, {
      id: mockUserId,
      parent_name: userData.parent_name,
      password: userData.password,
      children: [{
        id: 1,
        name: userData.child_name,
        gender: 'male'
      }]
    });

    return {
      success: true,
      message: 'Registration successful (mock mode)',
      user_id: mockUserId
    };
  },

  // Backend login with fallback
  login: async (credentials: {
    parent_mobile: string;
    password: string;
  }) => {
    try {
      // Try real backend first
      const response = await fetch(API_ENDPOINTS.BACKEND_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Backend not available, using mock login');
    }

    // Mock login fallback
    const user = MOCK_USERS.get(credentials.parent_mobile);
    if (user && user.password === credentials.password) {
      return {
        success: true,
        children: user.children,
        parent_name: user.parent_name
      };
    } else {
      throw new Error('Invalid credentials');
    }
  },

  // Handle API errors
  handleApiError: (error: any) => {
    console.error('API Error:', error);
    if (error.message?.includes('API key')) {
      return 'API key is not configured. Please check your environment variables.';
    }
    if (error.status === 404) {
      return 'Service not found. Please check your API configuration.';
    }
    if (error.status >= 500) {
      return 'Server error. Please try again later.';
    }
    return 'An error occurred. Please try again.';
  },
};

export default apiUtils;
