// src/lib/auth-service.ts

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  token?: string;
  user?: {
    email: string;
    name: string;
  };
  error?: string;
};

// Simulation of a login API call
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  // TODO: Replace with your actual API endpoint
  // const response = await fetch('https://your-api.com/login', { ... });

  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock Success Logic (for testing)
      if (credentials.email === "admin@ocr.com" && credentials.password === "123456") {
        resolve({
          success: true,
          token: "fake-jwt-token-12345",
          user: { email: credentials.email, name: "Admin User" },
        });
      } else {
        // Mock Failure
        resolve({ success: false, error: "Invalid email or password" });
      }
    }, 1500); // Fake network delay
  });
}