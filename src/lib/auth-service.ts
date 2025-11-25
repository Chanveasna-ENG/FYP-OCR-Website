// src/lib/auth-service.ts

const API_BASE_URL = "http://103.253.145.16:8000"; // Replace with your actual API URL

export type LoginCredentials = {
  username: string; // Backend uses OAuth2PasswordRequestForm which expects 'username'
  password: string;
};

export type RegisterCredentials = {
  username: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  token?: string;
  user?: {
    username: string;
    email: string;
    id: number;
  };
  error?: string;
};

// --- Login Function ---
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    // OAuth2 form data requires x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.detail || "Login failed" };
    }

    // Store token securely (HttpOnly cookie is better, but for this scope localStorage is okay)
    localStorage.setItem("accessToken", data.access_token);

    // After getting token, fetch user details
    return await fetchUserProfile(data.access_token);

  } catch (err) {
    return { success: false, error: "Network error. Please check your connection." };
  }
}

// --- Register Function ---
export async function registerUser(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.detail || "Registration failed" };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: "Network error during registration." };
  }
}

// --- Fetch User Profile ---
async function fetchUserProfile(token: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: "Failed to fetch user profile" };
    }

    return { 
      success: true, 
      token: token,
      user: data.user // Assuming backend returns { user: { ... } }
    };
  } catch (err) {
    return { success: false, error: "Failed to verify session." };
  }
}

// --- Logout Helper ---
export function logoutUser() {
  localStorage.removeItem("accessToken");
}