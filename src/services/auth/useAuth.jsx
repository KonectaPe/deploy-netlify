import { useContext } from "react";
import { AuthContext } from "./Authcontext.jsx";

export const useAuth = () => useContext(AuthContext);
