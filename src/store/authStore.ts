// src/store/AuthStore.ts
import { create } from "zustand";
import { login, logout } from "@/http/api";
import { toast } from "sonner";


type User = {
  UserId: string;
  UserGroupId: string;
  CompanyId: string;
  IsValid: string;
  Token: string;
};

type State = {
  token: string | null;
  userID: string | null;
  userGroupId: string | null;
  companyId: string | null;
  isValid: boolean;
};

type Actions = {
  login: (userid: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};


const storageKeys = [
  "token",
  "userID",
  "userGroupId",
  "companyId",
  "isValid",
] as const;


const clearAuthStorage = () => {
  storageKeys.forEach((key) => localStorage.removeItem(key));
};

const setAuthStorage = (user: User) => {
  localStorage.setItem("token", user.Token);
  localStorage.setItem("userID", user.UserId);
  localStorage.setItem("userGroupId", user.UserGroupId);
  localStorage.setItem("companyId", user.CompanyId);
  localStorage.setItem("isValid", user.IsValid);
};


export const useAuthStore = create<State & Actions>((set) => ({
  token: localStorage.getItem("token"),
  userID: localStorage.getItem("userID"),
  userGroupId: localStorage.getItem("userGroupId"),
  companyId: localStorage.getItem("companyId"),
  isValid: localStorage.getItem("isValid") === "true",

  login: async (userid, password) => {
    try {
      const payload = { LoginId: userid, Password: password, isValid: "" };
      const res = await login(payload);
      const user: User = res.UserValid?.[0];

      if (user && user.IsValid === "true") {
        setAuthStorage(user);
        set({
          token: user.Token,
          userID: user.UserId,
          userGroupId: user.UserGroupId,
          companyId: user.CompanyId,
          isValid: true,
        });
      } else {
        clearAuthStorage();
        set({
          token: null,
          userID: null,
          userGroupId: null,
          companyId: null,
          isValid: false,
        });
      }
    } catch (error) {
      clearAuthStorage();
      set({
        token: null,
        userID: null,
        userGroupId: null,
        companyId: null,
        isValid: false,
      });

    }
  },

  logout: async () => {
    try {
      const res = await logout();
      if (res.ErrorCode !== "0") {
        throw new Error(res.ErrorMessage || "Logout failed");
      }
      clearAuthStorage();
      set({
        token: null,
        userID: null,
        userGroupId: null,
        companyId: null,
        isValid: false,
      });
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  },
}));
