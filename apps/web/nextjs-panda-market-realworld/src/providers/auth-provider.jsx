"use client"
import { createContext, useContext, useEffect, useState } from "react";

import { authService } from "@/services/auth-service";
import { userService } from "@/services/user-service";

const AuthContext = createContext({
  user: null,
  login: () => { },
  signUp: () => { },
  isInitialized: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const getUser = async () => {
    try {
      const user = await userService.getMe();
      setUser(user)
    } catch (error) {
      console.error('사용자 정보 가져오기 실패', error)
      setUser(null)
    } finally {
      setIsInitialized(true)
    }
  }

  useEffect(() => {
    getUser();
  }, [])

  const login = async (email, password) => {
    try {
      await authService.login(email, password);
      await getUser();
    } catch (error) {
      console.error('로그인 실패:', error)
      throw error
    }
  };

  //TODO: logout 기능 추후 

  const signUp = async (email, nickname, password, passwordConfirmation) => {
    try {
      await authService.register(email, nickname, password, passwordConfirmation)
      await login(email, password);
    } catch (error) {
      console.error('회원가입 실패:', error)
      throw error
    }
  }


  return (
    <AuthContext.Provider value={{ user, login, signUp, isInitialized }}>
      {children}
    </AuthContext.Provider>
  )
}


