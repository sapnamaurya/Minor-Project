import Tesseract from "tesseract.js";

const handleReceiptUpload = async (file) => {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please upload a valid image (JPG, PNG, etc.)");
    return;
  }

  const reader = new FileReader();

  reader.onload = async () => {
    try {
      const imageData = reader.result; // base64 data URL

      const { data: { text } } = await Tesseract.recognize(imageData, "eng");

      console.log("OCR result:", text);

      const totalMatch = text.match(/TOTAL\s+\$?\s*([\d.,]+)/i);
      const total = totalMatch ? parseFloat(totalMatch[1].replace(",", "")) : 0;

      const taxMatch = text.match(/Tax\s+([\d.,]+)/i);
      const tax = taxMatch ? parseFloat(taxMatch[1].replace(",", "")) : 0;

      alert(`Successfully uploaded. Total: ${total}, Tax: ${tax}`);
    } catch (err) {
      console.error("OCR failed:", err);
      alert("Failed to process the image. Please try again.");
    }
  };

  reader.readAsDataURL(file); // 👈 ensures Tesseract gets base64 image
};

export default handleReceiptUpload;
