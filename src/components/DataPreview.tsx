"use client";

import { useState, useEffect } from "react";

interface DataPreviewProps {
  file: File;
  isDarkMode: boolean;
}

export default function DataPreview({ file, isDarkMode }: DataPreviewProps) {
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const readFile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (file.type === "text/csv") {
          const text = await file.text();
          const lines = text.split("\n").slice(0, 6); // First 6 lines
          const data = lines.map((line) =>
            line.split(",").map((cell) => cell.trim())
          );
          setPreviewData(data);
        } else {
          // For Excel files, we'll show a placeholder
          setPreviewData([
            ["Column 1", "Column 2", "Column 3"],
            ["Data 1", "Data 2", "Data 3"],
            ["Data 4", "Data 5", "Data 6"],
          ]);
        }
      } catch {
        setError("Error reading file");
      } finally {
        setIsLoading(false);
      }
    };

    readFile();
  }, [file]);

  const bgClass = isDarkMode ? "bg-gray-700/50" : "bg-gray-50";
  const borderClass = isDarkMode ? "border-gray-600" : "border-gray-200";
  const textClass = isDarkMode ? "text-gray-200" : "text-gray-700";
  const textSecondaryClass = isDarkMode ? "text-gray-300" : "text-gray-600";
  const textTertiaryClass = isDarkMode ? "text-gray-400" : "text-gray-500";
  const hoverClass = isDarkMode ? "hover:bg-gray-700/30" : "hover:bg-gray-50";

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 text-center py-4">{error}</div>
      ) : (
        <div className="space-y-4">
          <div className={`${bgClass} rounded-lg p-4 border ${borderClass}`}>
            <div className={`text-sm ${textSecondaryClass} mb-2`}>
              File Size: {(file.size / 1024).toFixed(2)} KB
            </div>
            <div className={`text-sm ${textSecondaryClass}`}>
              Type: {file.type || "Unknown"}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full border ${borderClass} rounded-lg`}>
              <thead className={bgClass}>
                {previewData.length > 0 && (
                  <tr>
                    {previewData[0].map((header, index) => (
                      <th
                        key={index}
                        className={`px-4 py-2 text-left text-sm font-medium ${textClass} border-b ${borderClass}`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                )}
              </thead>
              <tbody>
                {previewData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className={hoverClass}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-4 py-2 text-sm ${textSecondaryClass} border-b ${borderClass}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {previewData.length > 5 && (
            <div className={`text-center text-sm ${textTertiaryClass}`}>
              Showing first 5 rows of {previewData.length} total rows
            </div>
          )}
        </div>
      )}
    </div>
  );
}
