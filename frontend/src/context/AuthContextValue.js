import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  token: "",
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {},
});
