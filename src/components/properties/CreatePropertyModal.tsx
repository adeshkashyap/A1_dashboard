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
import { Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePropertyModal({ open, onOpenChange }: CreatePropertyModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: "",
    bhk: "",
    sqft: "",
    price: "",
    location: "",
    category: "3BHK",
    reraNo: "",
    possession: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const createPropertyMutation = useMutation({
    mutationFn: async (data: typeof formData & { image?: string }) => {
      const propertyData = {
        name: data.title,
        price: parseFloat(data.price),
        category: data.category,
        image: data.image,
        available: true,
        bhk: data.bhk ? parseInt(data.bhk) : undefined,
        sqft: data.sqft ? parseFloat(data.sqft) : undefined,
        location: data.location,
        reraNo: data.reraNo,
        possession: data.possession,
        description: data.description,
      };

      const response = await fetch("http://localhost:3001/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error("Failed to create property");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Property created successfully",
        description: "The new property has been added to your listings.",
      });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create property",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      bhk: "",
      sqft: "",
      price: "",
      location: "",
      category: "3BHK",
      reraNo: "",
      possession: "",
      description: "",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.price || !formData.category) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    let imageData = imagePreview;

    // If no image provided, use a default placeholder
    if (!imageData) {
      imageData = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800";
    }

    createPropertyMutation.mutate({ ...formData, image: imageData });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Property</DialogTitle>
          <DialogDescription>
            Add a new property listing to your inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Property Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">
                Property Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., 3BHK Luxury Apartment - Sector 49"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {/* BHK, SQFT, Price Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bhk">BHK</Label>
                <Input
                  id="bhk"
                  type="number"
                  placeholder="3"
                  value={formData.bhk}
                  onChange={(e) =>
                    setFormData({ ...formData, bhk: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sqft">SQFT</Label>
                <Input
                  id="sqft"
                  type="number"
                  placeholder="1800"
                  value={formData.sqft}
                  onChange={(e) =>
                    setFormData({ ...formData, sqft: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">
                  Price (₹) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="8000000"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Location and Category Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Sector 49, Gurgaon"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2BHK">2BHK</SelectItem>
                    <SelectItem value="3BHK">3BHK</SelectItem>
                    <SelectItem value="4BHK">4BHK</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Plot">Plot</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* RERA and Possession Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="reraNo">RERA Number</Label>
                <Input
                  id="reraNo"
                  placeholder="HRERA-GGN-2024-001"
                  value={formData.reraNo}
                  onChange={(e) =>
                    setFormData({ ...formData, reraNo: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="possession">Possession</Label>
                <Input
                  id="possession"
                  placeholder="Dec 2026 or Ready to Move"
                  value={formData.possession}
                  onChange={(e) =>
                    setFormData({ ...formData, possession: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Spacious 3BHK apartment with modern amenities..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div className="grid gap-2">
              <Label htmlFor="image">Property Image</Label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                If no image is uploaded, a default placeholder will be used.
              </p>
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
              disabled={createPropertyMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createPropertyMutation.isPending}>
              {createPropertyMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Property
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
