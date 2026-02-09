import { useMutation, useQueryClient } from "@tanstack/react-query";
import api, { type Property } from "@/lib/api-client";
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

interface DeletePropertyDialogProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePropertyDialog({ property, open, onOpenChange }: DeletePropertyDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deletePropertyMutation = useMutation({
    mutationFn: async () => {
      if (!property) return;
      
      const response = await fetch(`http://localhost:3001/api/inventory/${property.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete property");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Property deleted",
        description: "The property has been removed from your listings.",
      });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete property",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deletePropertyMutation.mutate();
  };

  if (!property) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{property.title}</strong> from your property listings.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePropertyMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deletePropertyMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deletePropertyMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Property
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
