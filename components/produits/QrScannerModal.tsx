"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { QrCode, Camera, X, AlertCircle } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function QrScannerModal() {
  const [open, setOpen] = React.useState(false);
  const [isScanning, setIsScanning] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const router = useRouter();
  const scannerRef = React.useRef<Html5Qrcode | null>(null);
  const elementId = "qr-reader-container";

  const stopScanner = React.useCallback(async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping QR scanner:", err);
      }
    }
    setIsScanning(false);
  }, []);

  const startScanner = React.useCallback(async () => {
    setErrorMessage(null);
    setIsScanning(true);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(elementId);
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // Success callback
          await stopScanner();
          setOpen(false);

          try {
            // Check if JSON formatted or direct ID/SKU
            const parsed = JSON.parse(decodedText);
            if (parsed && parsed.id) {
              toast.success("QR Code scanné avec succès!");
              router.push(`/dashboard/produits/${parsed.id}`);
              return;
            }
          } catch (e) {
            // Fallback: direct ID or SKU search query
          }

          toast.success(`Scan détecté: ${decodedText}`);
          router.push(`/dashboard/produits?search=${encodeURIComponent(decodedText)}`);
        },
        () => {
          // Frame error (silently ignore)
        }
      );
    } catch (err: any) {
      console.error("Failed to start scanner:", err);
      setErrorMessage(
        "Impossible d'accéder à la caméra. Vérifiez les autorisations de votre navigateur."
      );
      setIsScanning(false);
    }
  }, [router, stopScanner]);

  React.useEffect(() => {
    if (open) {
      // Delay slightly for DOM render
      const timeout = setTimeout(() => {
        startScanner();
      }, 300);
      return () => {
        clearTimeout(timeout);
        stopScanner();
      };
    } else {
      stopScanner();
    }
  }, [open, startScanner, stopScanner]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-9 gap-2 border-primary/30 text-primary hover:bg-primary/10"
      >
        <QrCode className="h-4 w-4" />
        <span className="hidden sm:inline font-semibold">Scanner QR Code</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Camera className="h-5 w-5 text-primary" /> Scanner un QR Code Produit
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pointez votre caméra vers l&apos;étiquette QR Code pour accéder directement à la fiche du produit.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="relative aspect-square w-full rounded-2xl bg-black overflow-hidden flex items-center justify-center border border-border/60">
              <div id={elementId} className="w-full h-full" />

              {!isScanning && !errorMessage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 text-white gap-2">
                  <Camera className="h-8 w-8 text-primary animate-pulse" />
                  <span className="text-xs font-medium">Démarrage de la caméra...</span>
                </div>
              )}

              {errorMessage && (
                <div className="absolute inset-0 p-6 flex flex-col items-center justify-center bg-slate-950/90 text-rose-400 text-center gap-3">
                  <AlertCircle className="h-10 w-10 text-rose-500" />
                  <p className="text-xs font-medium leading-relaxed">{errorMessage}</p>
                  <Button size="sm" variant="secondary" onClick={startScanner}>
                    Réessayer
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
