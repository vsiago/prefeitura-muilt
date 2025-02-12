"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function useAuthRedirect() {
  const router = useRouter();
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.role === "master" || parsedUser.role === "tecnico") {
        router.push("/dashboard");
      } else {
        router.push("/home");
      }
    }
    setIsLoading(false);
  }, [router]);

  return { isLoading };
}
