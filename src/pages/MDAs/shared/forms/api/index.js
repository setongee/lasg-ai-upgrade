import axios from 'axios';
import { env } from '../../../../../api/read/environment';
import { uploadDocument } from '../../../api/uploader/uploadFIles';

const base_url = `${env}/forms`;

// Helper function for API requests
const apiRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${base_url}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error.response?.data || error;
  }
};

// Helper function for public API requests (no authentication)
const publicApiRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${base_url}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Public API request failed:', error);
    throw error.response?.data || error;
  }
};

export const api = {
  // GET /api/v2/forms/all - Get all forms
  getForms: async () => {
    return await apiRequest('GET', '/all');
  },

  // GET /api/v2/forms/mda/:mda - Get forms by MDA
  getFormsByMda: async (mdaId) => {
    return await apiRequest('GET', `/mda/${mdaId}`);
  },

  // POST /api/v2/forms/create - Create a new form
  createForm: async (formData) => {
    return await apiRequest('POST', '/create', formData);
  },

  // GET /api/v2/forms/:id - Get form by ID (public for live form)
  getFormById: async (formId) => {
    return await publicApiRequest('GET', `/${formId}`);
  },

  // PUT /api/v2/forms/update/:id - Update an existing form
  updateForm: async (formId, formData) => {
    return await apiRequest('PUT', `/update/${formId}`, formData);
  },

  // DELETE /api/v2/forms/delete/:id - Delete a form
  deleteForm: async (formId) => {
    return await apiRequest('DELETE', `/delete/${formId}`);
  },

  // GET /api/v2/forms/:id/responses - Get all responses for a specific form
  getResponses: async (formId) => {
    return await apiRequest('GET', `/${formId}/responses`);
  },

  // GET /api/v2/forms/responses/responseId - Get detailed response by ID
  getResponseDetail: async (responseId) => {
    return await apiRequest('GET', `/responses/${responseId}`);
  },

  // POST /api/v2/forms/:id/submit - Submit a form response
  submitForm: async (formId, data) => {
    return await publicApiRequest('POST', `/${formId}/submit`, data);
  },

  // Upload file using the existing uploadDocument function
  uploadFile: async (file, folderName = 'uploads') => {
    try {
      const result = await uploadDocument(file, folderName);
      // Ensure we return a consistent object for both preview and storage
      return {
        url: result.data?.url || result.url || result.documentUrl || result,
        name: result.data?.original_name || file.name,
      };
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  },
};
