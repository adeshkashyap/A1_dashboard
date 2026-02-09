import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { QrCode, RefreshCcw } from "lucide-react";

interface QrModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrData?: string; // base64 or URL
}

export function QrModal({ open, onOpenChange, qrData }: QrModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogDescription>
            Open WhatsApp on your phone, go to Linked Devices, and scan this code to connect your agency's WhatsApp automation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <div className="bg-white p-4 shadow-sm rounded-lg border">
            <div className="w-64 h-64 bg-slate-100 flex items-center justify-center relative group">
              {qrData ? (
                <img src={qrData} alt="WhatsApp QR Code" className="w-full h-full" />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <QrCode className="h-32 w-32 text-slate-300" />
                  <p className="text-sm text-slate-400">Generating QR Code...</p>
                </div>
              )}
              {qrData && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  <RefreshCcw className="h-8 w-8 text-primary animate-spin" />
                </div>
              )}
            </div>
          </div>
          <p className="mt-6 text-sm text-center text-slate-500">
            QR code refreshes automatically. Scanning enables real-time lead automation via WhatsApp.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
