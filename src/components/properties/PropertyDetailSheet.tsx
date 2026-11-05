import type { Property } from "@/lib/api-client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Maximize, MapPin, Edit } from "lucide-react";

const formatPrice = (price: number) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
  return `₹${price.toLocaleString()}`;
};

function amenitiesList(amenities?: string | string[]) {
  if (!amenities) return [];
  if (Array.isArray(amenities)) return amenities;
  return amenities.split(",").map((a) => a.trim()).filter(Boolean);
}

interface PropertyDetailSheetProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (property: Property) => void;
}

export function PropertyDetailSheet({
  property,
  open,
  onOpenChange,
  onEdit,
}: PropertyDetailSheetProps) {
  if (!property) return null;

  const amenities = amenitiesList(property.amenities);
  const image =
    property.image ||
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="text-left space-y-1">
          <SheetTitle className="pr-8">{property.title}</SheetTitle>
          <SheetDescription className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {property.location || "Location TBD"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
            <img
              src={image}
              alt={property.title}
              className="h-full w-full object-cover"
            />
            <Badge
              className={`absolute top-3 left-3 ${
                property.available
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {property.available ? "Available" : "Sold"}
            </Badge>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(property.price)}
              </p>
            </div>
            <Badge variant="secondary">{property.category}</Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {property.bhk != null && property.bhk > 0 && (
              <span className="flex items-center gap-1.5">
                <Bed className="h-4 w-4" />
                {property.bhk} BHK
              </span>
            )}
            {property.sqft != null && property.sqft > 0 && (
              <span className="flex items-center gap-1.5">
                <Maximize className="h-4 w-4" />
                {property.sqft.toLocaleString()} sqft
              </span>
            )}
            {property.possession && (
              <span>Possession: {property.possession}</span>
            )}
          </div>

          {property.reraNo && (
            <p className="text-xs text-muted-foreground">
              RERA: {property.reraNo}
            </p>
          )}

          {property.description && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>
          )}

          {amenities.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {amenities.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {onEdit && (
            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onEdit(property);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit property
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
