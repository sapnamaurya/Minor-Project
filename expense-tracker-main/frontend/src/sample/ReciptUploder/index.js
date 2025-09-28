import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Tesseract from "tesseract.js";
import { useGlobalContext } from "../../context/globalContext";

const ReceiptUploader = () => {
  const { addExpense } = useGlobalContext();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const { data: { text } } = await Tesseract.recognize(file, "eng");
    console.log("OCR Text:", text);

    // Extract numbers from receipt
    const totalMatch = text.match(/TOTAL\s+\$?\s*([\d.,]+)/i);
    const taxMatch = text.match(/Tax\s+([\d.,]+)/i);

    const expenseData = {
      description: "Scanned Receipt",
      category: "General",
      amount: totalMatch ? parseFloat(totalMatch[1].replace(",", "")) : 0,
      tax: taxMatch ? parseFloat(taxMatch[1].replace(",", "")) : 0,
      date: new Date(),
    };

    // Call your GlobalContext function
    await addExpense(expenseData);

    alert("✅ Expense successfully created from scanned receipt!");
  }, [addExpense]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="p-6 border-2 border-dashed rounded-lg text-center cursor-pointer">
      <input {...getInputProps()} />
      <p>Drag & drop receipt or click to upload</p>
    </div>
  );
};

export default ReceiptUploader;
