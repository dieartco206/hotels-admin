const API_BASE_URL = 'http://localhost:8080/api';

export const getAuthToken = () => localStorage.getItem('admin_jwt_token');
export const setAuthToken = (token) => localStorage.setItem('admin_jwt_token', token);
export const removeAuthToken = () => localStorage.removeItem('admin_jwt_token');

export const getAuthUser = () => {
  try {
    const raw = localStorage.getItem('admin_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};
export const setAuthUser = (user) => localStorage.setItem('admin_user', JSON.stringify(user));
export const removeAuthUser = () => localStorage.removeItem('admin_user');

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (err) {
    console.error(`Admin API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const adminApi = {
  // Auth
  login: async (email, password) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.data?.token) {
      setAuthToken(res.data.token);
      setAuthUser(res.data.user);
    }
    return res.data;
  },

  getMe: async () => {
    return request('/auth/me');
  },

  // Dashboard
  getDashboard: async () => {
    return request('/admin/dashboard');
  },

  // Applications
  getApplications: async (status = 'all') => {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    return request(`/admin/applications${query}`);
  },

  reviewApplication: async (id, action, notes = '') => {
    return request(`/admin/applications/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ action, notes }),
    });
  },

  // Hotels
  getHotels: async () => {
    return request('/hotels?all=true');
  },

  toggleHotelStatus: async (id, status) => {
    return request(`/admin/hotels/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Bookings
  getBookings: async (country = 'all', status = 'all') => {
    const params = new URLSearchParams();
    if (country && country !== 'all') params.append('country', country);
    if (status && status !== 'all') params.append('status', status);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request(`/admin/bookings${qs}`);
  },

  cancelBooking: async (id) => {
    return request(`/bookings/${id}/cancel`, {
      method: 'POST',
    });
  },

  // Settlements
  getSettlements: async (status = 'all') => {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    return request(`/admin/settlements${query}`);
  },

  approvePayout: async (id) => {
    return request(`/admin/settlements/${id}/payout`, {
      method: 'POST',
    });
  },
};
