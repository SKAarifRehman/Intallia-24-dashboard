import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import * as XLSX from "xlsx";

/**
 * Export data to Excel using dynamic column keys.
 *
 * @param columns - Array of column keys from T.
 * @param data - Array of objects of type T.
 * @param filename - Desired filename (without extension).
 */
export const exportToExcel = <T extends Record<string, unknown>>(
  columns: (keyof T)[],
  data: T[],
  filename: string
): void => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: columns as string[],
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    console.error("Failed to export to Excel:", error);
    toast.error('Failed to export to Excel');
  }
};

/**
 * Export data to PDF using jsPDF and autoTable.
 *
 * @param columns - Array of column keys from T.
 * @param data - Array of objects of type T.
 * @param filename - Desired filename (without extension).
 */
export const exportToPDF = <T extends Record<string, unknown>>(
  columns: (keyof T)[],
  data: [T],
  filename: string
): void => {
  try {
    const doc = new jsPDF();

    const tableHead = columns.map(String);

    const tableBody = data.reduce<string[][]>((acc, row) => {
      const rowData = columns.reduce<string[]>((rowAcc, key) => {
        const cellValue = String(row[key] ?? "");
        rowAcc.push(cellValue);
        return rowAcc;
      }, []);
      acc.push(rowData);
      return acc;
    }, []);

    autoTable(doc, {
      head: [tableHead],
      body: tableBody,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [13, 175, 220] as const },
    });

    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Failed to export to PDF:", error);
    toast.error('Failed to export to PDF');
  }
};
