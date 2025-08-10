// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // In production/build mode, use same origin (when served from same server)
  if (import.meta.env.MODE === 'production') {
    return window.location.origin;
  }
  
  // In development, use explicit backend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  return backendUrl;
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Service initialized:', {
  mode: import.meta.env.MODE,
  baseUrl: API_BASE_URL,
  origin: window.location.origin
});

// API service class to handle all backend requests
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to make HTTP requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
      ...options,
    };

    // Remove Content-Type for FormData requests
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.message || data || 'Request failed');
      }

      return { data, status: response.status };
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Auth methods
  async signup(userData) {
    return this.request('/user/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async signin(credentials) {
    return this.request('/user/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/user/logout', {
      method: 'GET',
    });
  }

  // Profile methods
  async getProfile(userId = null) {
    const endpoint = userId ? `/user/profile/${userId}` : '/user/profile';
    return this.request(endpoint);
  }

  async updateProfile(profileData) {
    const formData = new FormData();
    
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key]);
      }
    });

    return this.request('/user/profile', {
      method: 'PUT',
      body: formData,
    });
  }

  async getProfileImage(userId) {
    return this.request(`/user/profile-image/${userId}`);
  }

  // Education methods
  async addEducation(educationData) {
    return this.request('/user/education', {
      method: 'POST',
      body: JSON.stringify(educationData),
    });
  }

  async updateEducation(educationData) {
    return this.request('/user/education', {
      method: 'PUT',
      body: JSON.stringify(educationData),
    });
  }

  async getEducation(educationId = null) {
    const endpoint = educationId ? `/user/education/${educationId}` : '/user/education';
    return this.request(endpoint);
  }

  async deleteEducation(educationId) {
    return this.request(`/user/education/${educationId}`, {
      method: 'DELETE',
    });
  }

  // Post methods
  async createPost(postData) {
    const formData = new FormData();
    
    Object.keys(postData).forEach(key => {
      if (postData[key] !== null && postData[key] !== undefined) {
        formData.append(key, postData[key]);
      }
    });

    return this.request('/posts', {
      method: 'POST',
      body: formData,
    });
  }

  async getAllPosts() {
    return this.request('/posts');
  }

  async getPostById(postId) {
    return this.request(`/posts/${postId}`);
  }

  async getPostsByUser(userId) {
    return this.request(`/posts/user/${userId}`);
  }

  async getMyPosts() {
    return this.request('/posts/my-posts');
  }

  async updatePost(postId, postData) {
    const formData = new FormData();
    
    Object.keys(postData).forEach(key => {
      if (postData[key] !== null && postData[key] !== undefined) {
        formData.append(key, postData[key]);
      }
    });

    return this.request(`/posts/${postId}`, {
      method: 'PUT',
      body: formData,
    });
  }

  async deletePost(postId) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // Admin methods
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAllUsers() {
    return this.request('/admin/users');
  }

  async getPendingUsers() {
    return this.request('/admin/users/pending');
  }

  async getUserDetails(userId) {
    return this.request(`/admin/users/${userId}`);
  }

  async approveUser(userId) {
    return this.request(`/admin/users/${userId}/approve`, {
      method: 'PUT',
    });
  }

  async rejectUser(userId, reason = '') {
    return this.request(`/admin/users/${userId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async updateUserRole(userId, role) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async bulkApproveUsers(userIds) {
    return this.request('/admin/users/bulk/approve', {
      method: 'PUT',
      body: JSON.stringify({ userIds }),
    });
  }

  async bulkRejectUsers(userIds, reason = '') {
    return this.request('/admin/users/bulk/reject', {
      method: 'PUT',
      body: JSON.stringify({ userIds, reason }),
    });
  }

  // Education methods
  async createEducationProfile(educationData) {
    return this.request('/education', {
      method: 'POST',
      body: JSON.stringify(educationData),
    });
  }

  async updateEducationProfile(educationData) {
    return this.request('/education', {
      method: 'PUT',
      body: JSON.stringify(educationData),
    });
  }

  async getMyEducationProfile() {
    return this.request('/education/me');
  }

  async getEducationProfile(userId) {
    return this.request(`/education/${userId}`);
  }

  async getAllEducationProfiles(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/education/browse?${queryParams}` : '/education/browse';
    return this.request(endpoint);
  }

  async deleteEducationProfile() {
    return this.request('/education', {
      method: 'DELETE',
    });
  }

  async getEducationStats() {
    return this.request('/education/admin/stats');
  }

  // Public methods
  async getApprovedUsers(search = '') {
    const endpoint = search ? `/user/approved?search=${encodeURIComponent(search)}` : '/user/approved';
    return this.request(endpoint);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
