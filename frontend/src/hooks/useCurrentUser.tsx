import React from "react";
import { useAuth } from "./useAuth";
import { useGetUserQuery } from "../rtk/usersApi";

export const useCurrentUser = () => {
  const { user } = useAuth();
  const { data: currentUser, isLoading } = useGetUserQuery(
    { id: user?.id },
    { skip: !user }
  );

  return { currentUser, isLoading };
};
