import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api, { type SalesRep } from "@/lib/api-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SalesRepModalProps {
  rep: SalesRep | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SalesRepModal({ rep, open, onOpenChange }: SalesRepModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!rep;
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    active: true,
    commission: "",
    monthlyTarget: "",
  });

  useEffect(() => {
    if (rep) {
      setFormData({
        name: rep.name || "",
        phone: rep.phone || "",
        email: rep.email || "",
        active: rep.active ?? true,
        commission: rep.commission?.toString() || "",
        monthlyTarget: rep.monthlyTarget?.toString() || "",
      });
    } else {
      resetForm();
    }
  }, [rep, open]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const repData = {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        active: data.active,
        commission: data.commission ? parseFloat(data.commission) : undefined,
        monthlyTarget: data.monthlyTarget ? parseFloat(data.monthlyTarget) : undefined,
      };

      if (isEditing && rep) {
        return api.salesReps.update(rep.id, repData);
      } else {
        return api.salesReps.create(repData);
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Sales rep updated" : "Sales rep added",
        description: `${formData.name} has been ${isEditing ? "updated" : "added"} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["salesReps"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: `Failed to ${isEditing ? "update" : "add"} sales rep`,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      active: true,
      commission: "",
      monthlyTarget: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name and phone number.",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Add"} Sales Representative</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update" : "Add"} sales rep information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Amit Sharma"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="amit@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Commission and Target */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="commission">Commission (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  step="0.1"
                  placeholder="2.5"
                  value={formData.commission}
                  onChange={(e) =>
                    setFormData({ ...formData, commission: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="monthlyTarget">Monthly Target (₹)</Label>
                <Input
                  id="monthlyTarget"
                  type="number"
                  placeholder="5000000"
                  value={formData.monthlyTarget}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlyTarget: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="active">Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.active ? "Rep can receive new leads" : "Rep is inactive"}
                </p>
              </div>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              disabled={saveMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Update" : "Add"} Rep
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
