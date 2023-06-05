import React, {
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { SubmitHandler } from "react-hook-form";

export interface iUserInfo {
  name?: string;
  email?: string;
  phone?: string;
  date?: Date;
}
export interface iLoginData {
  email: string;
  password: string;
}
interface iAuthProvider {
  children: React.ReactNode;
}

export interface iContact {
  id: string;
  name: string;
  email: string;
  phone: string;
}
interface iAuthContextProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
  userInfo: iUserInfo;
  login: (data: iLoginData) => void;
  logout: () => void;
  getUserContacts: () => Promise<void> | void;
  setUserContacts: React.Dispatch<SetStateAction<iContact[]>>;
  userContacts: iContact[];
  loginError: boolean;
  setLoginError: React.Dispatch<React.SetStateAction<boolean>>;
  patchUser: SubmitHandler<iUserInfo>;
  patchSuccess: boolean | undefined;
  setPatchSuccess: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export const AuthContext = createContext({} as iAuthContextProps);

export const AuthProvider = ({ children }: iAuthProvider) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({} as iUserInfo);
  const [userContacts, setUserContacts] = useState<iContact[] | []>([]);
  const [patchSuccess, setPatchSuccess] = useState<boolean | undefined>(false);
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      setIsLoading(true);
      const id = localStorage.getItem("@userId");
      const response = await api.get(`/users/${id}`);
      setUserInfo(response?.data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  const login: SubmitHandler<iLoginData> = async (data) => {
    setIsLoading(true);
    try {
      setIsLoading(true);
      const response = await api.post("/login", data);
      localStorage.setItem("@token", response.data.token);
      localStorage.setItem("@userId", response.data.userId);
      getUserContacts();
      setUserInfo(response.data.user);
    } catch (err: any) {
      setLoginError(true);
      localStorage.clear();
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard");
      }, 800);
    }
  };
  const patchUser: SubmitHandler<iUserInfo> = async (data: iUserInfo) => {
    const userId = localStorage.getItem("@userId");
    const token = localStorage.getItem("@token");
    api.defaults.headers.common.authorization = `Bearer ${token}`;
    Object.entries(data).forEach(([key, value]) => {
      if (value === "") {
        delete data[key as keyof iUserInfo];
      }
    });
    if (data.email === userInfo.email) {
      delete data.email;
    }
    if (Object.keys(data).length === 0) {
      return;
    }
    try {
      const response = await api.patch(`/users/${userId}`, {
        ...data,
      });
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setPatchSuccess(true);
        setUserInfo(response.data);
        setTimeout(() => {
          setPatchSuccess(false);
        }, 2500);
      }, 600);
    } catch (err: any) {
      setIsLoading(false);
      err.response.status === 401 && setUserInfo({});
    }
  };
  const logout = () => {
    setUserInfo({} as iUserInfo);
    localStorage.clear();
    navigate("/");
  };

  const getUserContacts = async () => {
    try {
      const userId = localStorage.getItem("@userId");
      const response: iContact[] = (await api.get(`contacts/users/${userId}`))
        .data;
      setUserContacts(response);
      setIsLoading(false);
    } catch (err) {}
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          patchSuccess,
          setPatchSuccess,
          patchUser,
          isLoading,
          userInfo,
          userContacts,
          setIsLoading,
          setUserContacts,
          logout,
          login,
          getUserContacts,
          loginError,
          setLoginError,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
