import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";

/**
 * Universal API caller for the client panel.
 * @param {string} method - HTTP method: 'get' | 'post' | 'put' | 'delete'
 * @param {string} endpoint - API path (relative to BASE_URL)
 * @param {object} [data] - Request body (for POST/PUT)
 * @param {object} [params] - URL query params (for GET)
 * @returns {Promise<any>} - Response data
 */
export const apiFunction = async (method, endpoint, data = null, params = null, withAuth = false) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        ...(withAuth ? { Authorization: `Bearer ${localStorage.getItem("token")}`, role: "student" } : {}),
      },
    };

    if (data) config.data = data;
    if (params) config.params = params;

    const response = await axios(config);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};
