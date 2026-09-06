import QRCode from "qrcode";

/**
 * Generates a Data URL (base64 PNG string) representing a QR code for a product.
 * Encodes the Product ID and SKU in JSON format or URL format.
 */
export async function generateProductQRCode(
  productId: string,
  sku: string
): Promise<string> {
  const payload = JSON.stringify({
    type: "PRODUCT_QR",
    id: productId,
    sku: sku,
  });

  try {
    const qrDataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 2,
      width: 300,
      color: {
        dark: "#0f172a", // Slate 900
        light: "#ffffff",
      },
    });

    return qrDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate product QR code");
  }
}
