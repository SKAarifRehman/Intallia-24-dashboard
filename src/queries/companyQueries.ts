import { getScreen, deleteCompany } from "@/http/api.js";
import { useMutation, useQuery, QueryClient, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () =>
      getScreen({
        ScreenName: "CompanyMaster",
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

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (companyId: string | number) => {
      const payload = {
        JSON: JSON.stringify({
          Header: [{ CompanyId: companyId }],
          Response: [{ ResponseText: "", ErrorCode: "" }],
        }),
      };
      return deleteCompany(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      navigate("/company");
      toast.success("Company deleted successfully.");
    },
    onError: (error: unknown) => {
      console.error("Delete failed:", error);
      toast.error("Failed to delete company.");
    },
  });
}


