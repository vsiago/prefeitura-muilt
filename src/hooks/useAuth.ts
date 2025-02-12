import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, loginSuccess } from "@/redux/store/slices/authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const userFromRedux = useSelector(selectUser);
  const [user, setUser] = useState(userFromRedux);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const savedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (token && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      dispatch(loginSuccess({ user: parsedUser, token }));
    }

    setIsLoading(false);
  }, [dispatch]);

  return { user, isAuthenticated, isLoading };
}
