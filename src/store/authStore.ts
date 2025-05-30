// src/store/AuthStore.ts
import { create } from "zustand";
import api, { login } from "@/http/api";

type State = {
  token: string | null;
  userID: string | number | null;
};

type Actions = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<State & Actions>((set) => ({
  token: localStorage.getItem("token"),
  userID: localStorage.getItem("userID"),

  login: async (userid, password) => {
    const payload = {
      LoginId: userid,
      Password: password,
      isValid: "",
    };

    const res = await login(payload);

    // Extract values from the actual response
    const user = res.UserValid[0];

    const token = user.Token;
    const userID = user.UserId;

    localStorage.setItem("token", token);
    localStorage.setItem("userID", userID);

    set({ token, userID });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    set({ token: null, userID: null });
  },
}));
