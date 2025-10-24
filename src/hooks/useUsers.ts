import { useState, useEffect } from "react";
import axios from "@/lib/utils/axios";
import { User } from "@/lib/types/admin";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get("/users");
      // Ensure data is an array and has the expected structure
      if (Array.isArray(data)) {
        // Filter out invalid users (missing required fields)
        const validUsers = data.filter(user => 
          user && 
          user.firstName && 
          user.lastName && 
          user.keycloakId &&
          user._id
        );
        setUsers(validUsers);
      } else {
        console.warn('Users data is not an array:', data);
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err : new Error("Failed to fetch users"));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error };
}
