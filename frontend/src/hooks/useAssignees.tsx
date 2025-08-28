import React from "react";
import api from "../api";

export function useAssignees() {
  const [assignees, setAssignees] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let isMounted = true; // avoid state updates if component unmounts

    const fetchAssignees = async () => {
      try {
        const response = await api.get("assignees");
        if (isMounted) {
          setAssignees(response.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAssignees();

    return () => {
      isMounted = false; // cleanup
    };
  }, []);

  return { assignees, loading, error };
}
