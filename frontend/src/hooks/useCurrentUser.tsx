import React from "react";
import { useAuth } from "./useAuth";
import api from "../api";

export const useCurrentUser = () => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  React.useEffect(() => {
    if (!user?.id) {
      return;
    }
    // Fetch current user
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get(`users/${user.id}`);
        setCurrentUser(response.data || null);
      } catch (error) {
        console.error(`Error fetching current user:`, error);
      }
    };

    fetchCurrentUser();
  }, [user.id]);

  return { currentUser };
};
