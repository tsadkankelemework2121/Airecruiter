"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "company" | "government";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    fullName: string,
    email: string,
    password: string,
    role: "user" | "company" | "government"
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // First, check for government credentials via API
      try {
        const govResponse = await fetch("/api/auth/government", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (govResponse.ok) {
          const govData = await govResponse.json();
          if (govData.success && govData.user) {
            setUser(govData.user);
            localStorage.setItem("user", JSON.stringify(govData.user));
            setIsLoading(false);
            return true;
          }
        }
      } catch (govError) {
        // Not a government user, continue with regular login
        console.log("Not a government account, trying regular login");
      }

      // Check if user exists in localStorage for regular users
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const users: User[] = JSON.parse(storedUsers);
        const foundUser = users.find(
          (u) => u.email === email.toLowerCase().trim()
        );

        if (foundUser) {
          // In production, verify password hash
          // For now, we'll just check if user exists
          setUser(foundUser);
          localStorage.setItem("user", JSON.stringify(foundUser));
          setIsLoading(false);
          return true;
        }
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    fullName: string,
    email: string,
    password: string,
    role: "user" | "company" | "government"
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call - In production, replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if user already exists
      const storedUsers = localStorage.getItem("users");
      let users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      const emailLower = email.toLowerCase().trim();
      if (users.some((u) => u.email === emailLower)) {
        setIsLoading(false);
        return false; // User already exists
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        fullName,
        email: emailLower,
        role,
      };

      // In production, hash password before storing
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/signin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
