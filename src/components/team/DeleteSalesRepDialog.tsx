import { useMutation, useQueryClient } from "@tanstack/react-query";
import api, { type SalesRep } from "@/lib/api-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeleteSalesRepDialogProps {
  rep: SalesRep | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSalesRepDialog({ rep, open, onOpenChange }: DeleteSalesRepDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteRepMutation = useMutation({
    mutationFn: async () => {
      if (!rep) return;
      return api.salesReps.delete(rep.id);
    },
    onSuccess: () => {
      toast({
        title: "Sales rep deleted",
        description: `${rep?.name} has been removed from your team.`,
      });
      queryClient.invalidateQueries({ queryKey: ["salesReps"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete sales rep",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteRepMutation.mutate();
  };

  if (!rep) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{rep.name}</strong> from your sales team.
            {rep.leadsHandled && rep.leadsHandled > 0 && (
              <span className="block mt-2 text-orange-600">
                ⚠️ This rep has handled {rep.leadsHandled} lead(s). Their assigned leads will become unassigned.
              </span>
            )}
            <span className="block mt-2">This action cannot be undone.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteRepMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteRepMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteRepMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Rep
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
