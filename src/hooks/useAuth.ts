import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, loginSuccess } from "@/redux/store/slices/authSlice";
import type { User } from "@/redux/store/slices/authSlice";
import axios from "axios";

export function useAuth() {
  const dispatch = useDispatch();
  const userFromRedux = useSelector(selectUser);
  const [user, setUser] = useState<User | null>(userFromRedux);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUserData = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;

      const response = await axios.get("http://localhost:3333/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const updatedUser: User = response.data.user;

        // Atualiza Redux e localStorage com os dados mais recentes
        dispatch(loginSuccess({ user: updatedUser, token }));
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setUser(updatedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (storedToken) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  return { user, isAuthenticated, isLoading };
}
