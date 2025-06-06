import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { deleteCompany } from "@/http/api";
import { useToast } from "@/hooks/use-toast"


export const useDeleteCompany = (): UseMutationResult<void> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutationFn = async (companyId: string) => {
    const payload = {
      JSON: JSON.stringify({
        Header: [{ CompanyId: companyId }],
        Response: [{ ResponseText: "", ErrorCode: "" }],
      }),
    };
    return deleteCompany(payload);
  };

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (error: Error) => {
      console.error("Delete failed:", error);
      toast({
        variant: "error",
        title: "Failed to delete company",
        //description: error.message,
      });
    },
  });
};
