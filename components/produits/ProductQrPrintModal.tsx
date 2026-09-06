"use client";

import * as React from "react";
import { Printer, QrCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { EnrichedProductItem } from "./ProductCard";

interface ProductQrPrintModalProps {
  product: EnrichedProductItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductQrPrintModal({
  product,
  open,
  onOpenChange,
}: ProductQrPrintModalProps) {
  if (!product) return null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const qrImage = product.qrCodeUrl || "";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Étiquette Produit - ${product.sku}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: #fff;
            }
            .label-card {
              border: 2px solid #000;
              border-radius: 12px;
              padding: 24px;
              width: 320px;
              text-align: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .title {
              font-size: 18px;
              font-weight: 800;
              margin-bottom: 4px;
              color: #000;
            }
            .sku {
              font-family: monospace;
              font-size: 14px;
              font-weight: bold;
              background: #f1f5f9;
              padding: 4px 8px;
              border-radius: 4px;
              display: inline-block;
              margin-bottom: 12px;
            }
            .qr-img {
              width: 200px;
              height: 200px;
              margin: 0 auto 12px auto;
              display: block;
            }
            .price {
              font-size: 22px;
              font-weight: 900;
              color: #0284c7;
            }
            @media print {
              body { height: auto; }
              .label-card { border: 2px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="label-card">
            <div class="title">${product.name}</div>
            <div class="sku">SKU: ${product.sku}</div>
            ${qrImage ? `<img class="qr-img" src="${qrImage}" />` : ""}
            <div class="price">${parseFloat(product.price).toLocaleString("fr-FR")} TND</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <QrCode className="h-5 w-5 text-primary" /> Étiquette QR Code Produit
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 flex justify-center">
          <div className="border-2 border-border/80 rounded-2xl p-6 bg-card text-center w-72 shadow-md space-y-3">
            <h4 className="font-extrabold text-base line-clamp-1 text-foreground">
              {product.name}
            </h4>
            <div className="inline-block bg-muted px-2.5 py-1 rounded font-mono text-xs font-bold text-muted-foreground">
              SKU: {product.sku}
            </div>

            {product.qrCodeUrl ? (
              <img
                src={product.qrCodeUrl}
                alt={`QR Code ${product.sku}`}
                className="w-48 h-48 mx-auto rounded-lg border border-border/40 p-2 bg-white"
              />
            ) : (
              <div className="w-48 h-48 mx-auto flex items-center justify-center bg-muted text-xs text-muted-foreground rounded-lg">
                QR Code indisponible
              </div>
            )}

            <div className="text-xl font-black text-primary">
              {parseFloat(product.price).toLocaleString("fr-FR")} TND
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button onClick={handlePrint} className="gap-2 bg-primary text-primary-foreground">
            <Printer className="h-4 w-4" /> Imprimer l&apos;étiquette
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
