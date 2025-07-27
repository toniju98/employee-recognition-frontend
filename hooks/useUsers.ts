import { useState, useEffect } from "react";
import axios from "@/lib/utils/axios";
import { User } from "@/lib/types/admin";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/users/");
      console.log("data", data);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch users"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error };
}
