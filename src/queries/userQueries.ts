import { getScreen, deleteUser } from "@/http/api.js";
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
