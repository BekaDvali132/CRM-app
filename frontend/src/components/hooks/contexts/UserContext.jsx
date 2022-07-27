import { createContext } from "react";

export const UserContext = createContext({user: localStorage.getItem("user")})