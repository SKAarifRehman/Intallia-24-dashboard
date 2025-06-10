import { useQuery, useMutation, UseQueryResult, UseMutationResult, UseMutationOptions } from "@tanstack/react-query";
import { getUserGroupScreens, createRole, deleteRole, updateRole } from "@/http/api";

// Types for ParentScreen and ChildScreen
export interface ChildScreen {
  ScreenId: string;
  ScreenName: string;
  ParentName: string;
  UserGroupId: string;
  ReadPermission: boolean;
  WritePermission: boolean;
  DeletePermission: boolean;
}

export interface ParentScreen {
  ScreenId: string;
  ScreenName: string;
  ParentName: string;
  ScreenNameData: ChildScreen[];
}

// Payload type for create/update/delete
export interface UserGroupPayload {
  JSON: string;
}

// API response type (customize as per your backend)
export interface ApiResponse {
  ResponseText?: string;
  ErrorCode?: string;
  [key: string]: any;
}

// Query to fetch user group screens
export function useUserGroupScreens(userGroupId: string, companyId: string): UseQueryResult<ParentScreen[]> {
  const payload: UserGroupPayload = {
    JSON: JSON.stringify({
      Header: [{ UserGroupId: userGroupId, CompanyId: companyId }],
      Response: [{ ResponseText: "", ErrorCode: "" }],
    }),
  };

  return useQuery<ParentScreen[]>({
    queryKey: ["screenGroup", userGroupId, companyId],
    queryFn: async () => {
      const res = await getUserGroupScreens(payload);
      // If your API returns the array directly as res.data:
      return Array.isArray(res) ? res : [];
    },
    enabled: !!userGroupId,
    select: (data) => (Array.isArray(data) ? data : []),
  });
}

// Mutation to create user group screens
export function useCreateUserGroupScreens(): UseMutationResult<ApiResponse, unknown, UserGroupPayload> {
  return useMutation<ApiResponse, unknown, UserGroupPayload>({
    mutationFn: (payload: UserGroupPayload) => createRole(payload),
  });
}

// Mutation to update user group screens
export function useUpdateRole(options?: UseMutationOptions<ApiResponse, unknown, UserGroupPayload>) {
  return useMutation<ApiResponse, unknown, UserGroupPayload>({
    mutationFn: (payload: UserGroupPayload) => {
      console.log("Payload for updateRole:", payload);
      return updateRole(payload);
    },
    ...options,
  });
}

// Mutation to delete user group screens
export function useDeleteRole(
  options?: UseMutationOptions<ApiResponse, unknown, { userGroupId: string; companyId: string }>
): UseMutationResult<ApiResponse, unknown, { userGroupId: string; companyId: string }> {
  return useMutation<ApiResponse, unknown, { userGroupId: string; companyId: string }>({
    mutationFn: (params: { userGroupId: string; companyId: string }) => {
      const payload: UserGroupPayload = {
        JSON: JSON.stringify({
          Header: [{ UserGroupId: params.userGroupId, CompanyId: params.companyId }],
          Response: [{ ResponseText: "", ErrorCode: "" }],
        }),
      };
      return deleteRole(payload);
    },
    ...options,
  });
}
