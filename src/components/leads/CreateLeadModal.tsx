import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLeadModal({ open, onOpenChange }: CreateLeadModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerPhone: "",
    buyerEmail: "",
    requirements: "",
    budget: "",
    location: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
  });

  const createLeadMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Transform to backend format
      const leadData = {
        customerName: data.buyerName,
        customerPhone: data.buyerPhone,
        customerEmail: data.buyerEmail,
        items: data.requirements,
        amount: parseFloat(data.budget),
        address: data.location,
        status: "pending", // Will be transformed to "NEW"
      };

      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error("Failed to create lead");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Lead created successfully",
        description: "The new lead has been added to your pipeline.",
      });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create lead",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      buyerName: "",
      buyerPhone: "",
      buyerEmail: "",
      requirements: "",
      budget: "",
      location: "",
      priority: "MEDIUM",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.buyerName || !formData.buyerPhone || !formData.requirements || !formData.budget) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.buyerPhone.replace(/\s/g, ""))) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    createLeadMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
          <DialogDescription>
            Add a new property inquiry to your pipeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Buyer Name */}
            <div className="grid gap-2">
              <Label htmlFor="buyerName">
                Buyer Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="buyerName"
                placeholder="e.g., Raj Malhotra"
                value={formData.buyerName}
                onChange={(e) =>
                  setFormData({ ...formData, buyerName: e.target.value })
                }
                required
              />
            </div>

            {/* Buyer Phone */}
            <div className="grid gap-2">
              <Label htmlFor="buyerPhone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="buyerPhone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.buyerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, buyerPhone: e.target.value })
                }
                required
              />
            </div>

            {/* Buyer Email */}
            <div className="grid gap-2">
              <Label htmlFor="buyerEmail">Email (Optional)</Label>
              <Input
                id="buyerEmail"
                type="email"
                placeholder="raj@example.com"
                value={formData.buyerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, buyerEmail: e.target.value })
                }
              />
            </div>

            {/* Requirements */}
            <div className="grid gap-2">
              <Label htmlFor="requirements">
                Requirements <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="requirements"
                placeholder="e.g., 3BHK in Sector 49, near metro"
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            {/* Budget and Location Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Budget */}
              <div className="grid gap-2">
                <Label htmlFor="budget">
                  Budget (₹) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="8000000"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  required
                />
              </div>

              {/* Priority */}
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div className="grid gap-2">
              <Label htmlFor="location">Preferred Location</Label>
              <Input
                id="location"
                placeholder="e.g., Sector 49, Gurgaon"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
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
              disabled={createLeadMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createLeadMutation.isPending}>
              {createLeadMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
