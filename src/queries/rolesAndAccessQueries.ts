import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { getScreen, createRole, deleteRole, updateRole } from "@/http/api";

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

// Query to fetch user group screens
export function useUserGroupScreens(userGroupId: string, companyId: string = "Intallia24"): UseQueryResult<ParentScreen[]> {
  const payload = {
    JSON: JSON.stringify({
      Header: [{ UserGroupId: userGroupId, CompanyId: companyId }],
      Response: [{ ResponseText: "", ErrorCode: "" }],
    }),
  };

  return useQuery<ParentScreen[]>({
    queryKey: ["screenGroup", userGroupId, companyId],
    queryFn: () => getScreen(payload),
    enabled: !!userGroupId,
    select: (data) => data || [],
  });
}

// Mutation to create user group screens
export function useCreateUserGroupScreens(): UseMutationResult<any, unknown, any> {
  return useMutation({
    mutationFn: (payload: any) => createRole(payload),
  });
}

export function useUpdateRole(options?: any) {
  return useMutation({
    mutationFn: (payload: any) => {
      console.log("Payload for updateRole:", payload);
      updateRole(payload);
    },
    ...options,
  });
}

export function useDeleteRole(options?: any) {
  return useMutation({
    mutationFn: (userGroupId: string) => {
      const payload = {
        JSON: JSON.stringify({
          Header: [{ UserGroupId: userGroupId, CompanyId: "Intallia24" }],
          Response: [{ ResponseText: "", ErrorCode: "" }],
        }),
      };
      return deleteRole(payload);
    },
    ...options,
  });
}
