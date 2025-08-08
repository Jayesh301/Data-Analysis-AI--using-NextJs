"use client";

import { useState, useEffect } from "react";
import {
  Database,
  Hash,
  Calendar,
  DollarSign,
  Percent,
  Type,
} from "lucide-react";

interface DataTypesAnalysisProps {
  dataset: any[];
  columns: string[];
  isDarkMode: boolean;
}

interface ColumnInfo {
  name: string;
  type: string;
  nonNullCount: number;
  nullCount: number;
  nullPercentage: number;
  uniqueCount: number;
  memoryUsage: string;
  sampleValues: string[];
}

export default function DataTypesAnalysis({
  dataset,
  columns,
  isDarkMode,
}: DataTypesAnalysisProps) {
  const [columnInfo, setColumnInfo] = useState<ColumnInfo[]>([]);

  useEffect(() => {
    if (dataset.length > 0 && columns.length > 0) {
      analyzeDataTypes();
    }
  }, [dataset, columns]);

  const analyzeDataTypes = () => {
    const info: ColumnInfo[] = columns.map((column) => {
      const values = dataset
        .map((row) => row[column])
        .filter((val) => val !== "");
      const nonNullCount = values.length;
      const nullCount = dataset.length - nonNullCount;
      const nullPercentage = (nullCount / dataset.length) * 100;
      const uniqueCount = new Set(values).size;

      // Determine data type
      let type = "object";
      const sampleValues = values.slice(0, 5);

      if (
        column.toLowerCase().includes("date") ||
        column.toLowerCase().includes("time")
      ) {
        type = "datetime";
      } else if (
        column.toLowerCase().includes("salary") ||
        column.toLowerCase().includes("price") ||
        column.toLowerCase().includes("cost") ||
        column.toLowerCase().includes("amount")
      ) {
        type = "currency";
      } else if (
        column.toLowerCase().includes("rate") ||
        column.toLowerCase().includes("percentage") ||
        column.toLowerCase().includes("score") ||
        column.toLowerCase().includes("performance")
      ) {
        type = "percentage";
      } else {
        // Check if numeric
        const numericValues = values
          .map((v) => parseFloat(v))
          .filter((v) => !isNaN(v));
        if (numericValues.length > values.length * 0.8) {
          type = "numeric";
        } else if (uniqueCount <= dataset.length * 0.1) {
          type = "categorical";
        } else {
          type = "text";
        }
      }

      // Calculate memory usage (simplified)
      const avgValueLength =
        values.reduce((sum, val) => sum + String(val).length, 0) /
        values.length;
      const memoryUsage = `${((avgValueLength * values.length) / 1024).toFixed(
        2
      )} KB`;

      return {
        name: column,
        type,
        nonNullCount,
        nullCount,
        nullPercentage,
        uniqueCount,
        memoryUsage,
        sampleValues: sampleValues.map((v) => String(v).substring(0, 20)),
      };
    });

    setColumnInfo(info);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "numeric":
        return <Hash className="w-4 h-4 text-blue-400" />;
      case "datetime":
        return <Calendar className="w-4 h-4 text-green-400" />;
      case "currency":
        return <DollarSign className="w-4 h-4 text-yellow-400" />;
      case "percentage":
        return <Percent className="w-4 h-4 text-purple-400" />;
      case "categorical":
        return <Database className="w-4 h-4 text-orange-400" />;
      default:
        return <Type className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "numeric":
        return isDarkMode ? "text-blue-400" : "text-blue-600";
      case "datetime":
        return isDarkMode ? "text-green-400" : "text-green-600";
      case "currency":
        return isDarkMode ? "text-yellow-400" : "text-yellow-600";
      case "percentage":
        return isDarkMode ? "text-purple-400" : "text-purple-600";
      case "categorical":
        return isDarkMode ? "text-orange-400" : "text-orange-600";
      default:
        return isDarkMode ? "text-gray-400" : "text-gray-600";
    }
  };

  const bgClass = isDarkMode ? "bg-gray-700/50" : "bg-gray-50";
  const borderClass = isDarkMode ? "border-gray-600" : "border-gray-200";
  const textClass = isDarkMode ? "text-gray-200" : "text-gray-700";
  const textSecondaryClass = isDarkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className={`${bgClass} rounded-lg p-4 border ${borderClass}`}>
        <h4 className={`font-semibold ${textClass} mb-3`}>Dataset Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className={textSecondaryClass}>Total Rows</div>
            <div className={`font-semibold ${textClass}`}>{dataset.length}</div>
          </div>
          <div>
            <div className={textSecondaryClass}>Total Columns</div>
            <div className={`font-semibold ${textClass}`}>{columns.length}</div>
          </div>
          <div>
            <div className={textSecondaryClass}>Memory Usage</div>
            <div className={`font-semibold ${textClass}`}>
              {columnInfo
                .reduce((sum, col) => sum + parseFloat(col.memoryUsage), 0)
                .toFixed(2)}{" "}
              KB
            </div>
          </div>
          <div>
            <div className={textSecondaryClass}>Null Values</div>
            <div className={`font-semibold ${textClass}`}>
              {columnInfo.reduce((sum, col) => sum + col.nullCount, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Data Types Table */}
      <div className="overflow-x-auto">
        <table className={`w-full border ${borderClass} rounded-lg`}>
          <thead className={bgClass}>
            <tr>
              <th
                className={`px-4 py-3 text-left text-sm font-medium ${textClass} border-b ${borderClass}`}
              >
                Column
              </th>
              <th
                className={`px-4 py-3 text-left text-sm font-medium ${textClass} border-b ${borderClass}`}
              >
                Type
              </th>
              <th
                className={`px-4 py-3 text-left text-sm font-medium ${textClass} border-b ${borderClass}`}
              >
                Non-Null Count
              </th>
              <th
                className={`px-4 py-3 text-left text-sm font-medium ${textClass} border-b ${borderClass}`}
              >
                Null Count
              </th>
              <th
                className={`px-4 py-3 text-left text-sm font-medium ${textClass} border-b ${borderClass}`}
              >
                Null %
              </th>
              <th
                className={`px-4 py-3 text-left text-sm font-medium ${textClass} border-b ${borderClass}`}
              >
                Unique
              </th>
              <th
                className={`px-4 py-3 text-left text-sm font-medium ${textClass} border-b ${borderClass}`}
              >
                Memory
              </th>
              <th
                className={`px-4 py-3 text-left text-sm font-medium ${textClass} border-b ${borderClass}`}
              >
                Sample Values
              </th>
            </tr>
          </thead>
          <tbody>
            {columnInfo.map((col, index) => (
              <tr
                key={index}
                className={`hover:${
                  isDarkMode ? "bg-gray-700/30" : "bg-gray-50"
                }`}
              >
                <td
                  className={`px-4 py-3 text-sm font-medium ${textClass} border-b ${borderClass}`}
                >
                  {col.name}
                </td>
                <td className={`px-4 py-3 text-sm border-b ${borderClass}`}>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(col.type)}
                    <span className={getTypeColor(col.type)}>{col.type}</span>
                  </div>
                </td>
                <td
                  className={`px-4 py-3 text-sm ${textClass} border-b ${borderClass}`}
                >
                  {col.nonNullCount}
                </td>
                <td
                  className={`px-4 py-3 text-sm ${textClass} border-b ${borderClass}`}
                >
                  {col.nullCount}
                </td>
                <td className={`px-4 py-3 text-sm border-b ${borderClass}`}>
                  <span
                    className={
                      col.nullPercentage > 10
                        ? "text-red-400"
                        : "text-green-400"
                    }
                  >
                    {col.nullPercentage.toFixed(1)}%
                  </span>
                </td>
                <td
                  className={`px-4 py-3 text-sm ${textClass} border-b ${borderClass}`}
                >
                  {col.uniqueCount}
                </td>
                <td
                  className={`px-4 py-3 text-sm ${textSecondaryClass} border-b ${borderClass}`}
                >
                  {col.memoryUsage}
                </td>
                <td
                  className={`px-4 py-3 text-sm ${textSecondaryClass} border-b ${borderClass}`}
                >
                  <div className="max-w-xs truncate">
                    {col.sampleValues.join(", ")}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Type Distribution */}
      <div className={`${bgClass} rounded-lg p-4 border ${borderClass}`}>
        <h4 className={`font-semibold ${textClass} mb-3`}>
          Data Type Distribution
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(
            columnInfo.reduce((acc, col) => {
              acc[col.type] = (acc[col.type] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([type, count]) => (
            <div key={type} className="flex items-center space-x-2">
              {getTypeIcon(type)}
              <span className={`${getTypeColor(type)} font-medium`}>
                {type}
              </span>
              <span className={textSecondaryClass}>({count})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
