import { getScreen, deleteUser, getUserById, addUser } from "@/http/api.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Custom hook to fetch user list.
 */
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () =>
      getScreen({
        ScreenName: "UserMaster",
        LookUpKey: "GetList",
        Filter1: "",
        Filter2: "",
        Filter3: "",
        Filter4: "",
        Filter5: "",
      }),
    retry: 2,
  });
}

/**
 * Custom hook to delete a user.
 * Handles API call, cache invalidation, navigation, and notifications.
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Helper to create payload for delete API
  const createDeletePayload = (userId: string | number) => ({
    JSON: JSON.stringify({
      Header: [{ UserId: userId }],
      Response: [{ ResponseText: "", ErrorCode: "" }],
    }),
  });

  return useMutation({
    mutationFn: async (userId: string | number) => {
      const payload = createDeletePayload(userId);
      return deleteUser(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/user");
      toast.success("User deleted successfully.");
    },
    onError: (error: unknown) => {
      console.error("Delete failed:", error);
      toast.error("Failed to delete user.");
    },
  });
}

/**
 * Custom hook to fetch a single user by ID.
 */
export function useUserById(userId?: string | number) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      getUserById({
        JSON: JSON.stringify({
          Header: [{ UserId: userId }],
          Response: [{ ResponseText: "", ErrorCode: "" }],
        }),
      }),

    enabled: !!userId, // Only run if userId is provided
    retry: 2,
  });
}

//aDD new user
export function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { JSON: string }) => {
      return await addUser(payload);
    },
    onSuccess: (data) => {
      console.log("user added successfully:", data);
      toast.success("user added successfully");
    },
    onError: (error: unknown) => {
      console.error("Add user failed:", error);
      toast.error("Failed to add user ");
    },
  });
}
