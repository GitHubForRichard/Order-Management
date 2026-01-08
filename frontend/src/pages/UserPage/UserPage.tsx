import * as React from "react";

import UserList from "./UserList";

import api from "../../api";

const UserPage = () => {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    // Fetch user records
    const fetchUsers = async () => {
      try {
        const response = await api.get(`users`);
        setUsers(response.data || []);
      } catch (error) {
        console.error(`Error fetching users:`, error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserUpdated = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  return <UserList users={users} onUserUpdated={handleUserUpdated} />;
};

export default UserPage;
