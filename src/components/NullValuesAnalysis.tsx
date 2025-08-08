"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface NullValuesAnalysisProps {
  dataset: Record<string, string>[];
  columns: string[];
  isDarkMode: boolean;
}

interface NullAnalysis {
  column: string;
  nullCount: number;
  nonNullCount: number;
  nullPercentage: number;
  severity: "low" | "medium" | "high";
  recommendations: string[];
}

export default function NullValuesAnalysis({
  dataset,
  columns,
  isDarkMode,
}: NullValuesAnalysisProps) {
  const [nullAnalysis, setNullAnalysis] = useState<NullAnalysis[]>([]);
  const [totalNulls, setTotalNulls] = useState(0);

  useEffect(() => {
    if (dataset.length > 0 && columns.length > 0) {
      analyzeNullValues();
    }
  }, [dataset, columns]);

  const analyzeNullValues = () => {
    const analysis: NullAnalysis[] = columns.map((column) => {
      const values = dataset.map((row) => row[column]);
      const nullCount = values.filter(
        (val) => val === "" || val === null || val === undefined
      ).length;
      const nonNullCount = dataset.length - nullCount;
      const nullPercentage = (nullCount / dataset.length) * 100;

      let severity: "low" | "medium" | "high";
      let recommendations: string[] = [];

      if (nullPercentage === 0) {
        severity = "low";
        recommendations = ["No null values found - excellent data quality!"];
      } else if (nullPercentage <= 5) {
        severity = "low";
        recommendations = [
          "Low null percentage - consider simple imputation methods",
          "Use mean/median for numeric columns",
          "Use mode for categorical columns",
        ];
      } else if (nullPercentage <= 20) {
        severity = "medium";
        recommendations = [
          "Moderate null percentage - requires careful handling",
          "Consider multiple imputation techniques",
          "Analyze patterns in missing data",
          "Check for systematic missingness",
        ];
      } else {
        severity = "high";
        recommendations = [
          "High null percentage - significant data quality issue",
          "Investigate root cause of missing data",
          "Consider data collection improvements",
          "May need to exclude or heavily transform columns",
        ];
      }

      return {
        column,
        nullCount,
        nonNullCount,
        nullPercentage,
        severity,
        recommendations,
      };
    });

    setNullAnalysis(analysis);
    setTotalNulls(analysis.reduce((sum, item) => sum + item.nullCount, 0));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return isDarkMode ? "text-green-400" : "text-green-600";
      case "medium":
        return isDarkMode ? "text-yellow-400" : "text-yellow-600";
      case "high":
        return isDarkMode ? "text-red-400" : "text-red-600";
      default:
        return isDarkMode ? "text-gray-400" : "text-gray-600";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const bgClass = isDarkMode ? "bg-gray-700/50" : "bg-gray-50";
  const borderClass = isDarkMode ? "border-gray-600" : "border-gray-200";
  const textClass = isDarkMode ? "text-gray-200" : "text-gray-700";
  const textSecondaryClass = isDarkMode ? "text-gray-400" : "text-gray-500";

  const columnsWithNulls = nullAnalysis.filter((item) => item.nullCount > 0);
  const columnsWithoutNulls = nullAnalysis.filter(
    (item) => item.nullCount === 0
  );

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className={`${bgClass} rounded-lg p-4 border ${borderClass}`}>
        <h4 className={`font-semibold ${textClass} mb-3`}>
          Null Values Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className={textSecondaryClass}>Total Null Values</div>
            <div className={`font-semibold ${textClass}`}>{totalNulls}</div>
          </div>
          <div>
            <div className={textSecondaryClass}>Columns with Nulls</div>
            <div className={`font-semibold ${textClass}`}>
              {columnsWithNulls.length}
            </div>
          </div>
          <div>
            <div className={textSecondaryClass}>Clean Columns</div>
            <div className={`font-semibold ${textClass}`}>
              {columnsWithoutNulls.length}
            </div>
          </div>
          <div>
            <div className={textSecondaryClass}>Overall Null %</div>
            <div className={`font-semibold ${textClass}`}>
              {((totalNulls / (dataset.length * columns.length)) * 100).toFixed(
                1
              )}
              %
            </div>
          </div>
        </div>
      </div>

      {/* Null Values Table */}
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
                Null Count
              </th>
              <th
                className={`px-4 py-3 text-left text-sm font-medium ${textClass} border-b ${borderClass}`}
              >
                Non-Null Count
              </th>
              <th
                className={`px-4 py-3 text-left text-sm font-medium ${textClass} border-b ${borderClass}`}
              >
                Null %
              </th>
              <th
                className={`px-4 py-3 text-left text-sm font-medium ${textClass} border-b ${borderClass}`}
              >
                Severity
              </th>
              <th
                className={`px-4 py-3 text-left text-sm font-medium ${textClass} border-b ${borderClass}`}
              >
                Progress Bar
              </th>
            </tr>
          </thead>
          <tbody>
            {nullAnalysis.map((item, index) => (
              <tr
                key={index}
                className={`hover:${
                  isDarkMode ? "bg-gray-700/30" : "bg-gray-50"
                }`}
              >
                <td
                  className={`px-4 py-3 text-sm font-medium ${textClass} border-b ${borderClass}`}
                >
                  {item.column}
                </td>
                <td
                  className={`px-4 py-3 text-sm ${textClass} border-b ${borderClass}`}
                >
                  {item.nullCount}
                </td>
                <td
                  className={`px-4 py-3 text-sm ${textClass} border-b ${borderClass}`}
                >
                  {item.nonNullCount}
                </td>
                <td className={`px-4 py-3 text-sm border-b ${borderClass}`}>
                  <span className={getSeverityColor(item.severity)}>
                    {item.nullPercentage.toFixed(1)}%
                  </span>
                </td>
                <td className={`px-4 py-3 text-sm border-b ${borderClass}`}>
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(item.severity)}
                    <span className={getSeverityColor(item.severity)}>
                      {item.severity.charAt(0).toUpperCase() +
                        item.severity.slice(1)}
                    </span>
                  </div>
                </td>
                <td className={`px-4 py-3 text-sm border-b ${borderClass}`}>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.severity === "low"
                          ? "bg-green-500"
                          : item.severity === "medium"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${100 - item.nullPercentage}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recommendations by Severity */}
      <div className="space-y-4">
        {["high", "medium", "low"].map((severity) => {
          const items = nullAnalysis.filter(
            (item) => item.severity === severity
          );
          if (items.length === 0) return null;

          return (
            <div
              key={severity}
              className={`${bgClass} rounded-lg p-4 border ${borderClass}`}
            >
              <div className="flex items-center space-x-2 mb-3">
                {getSeverityIcon(severity)}
                <h4 className={`font-semibold ${textClass} capitalize`}>
                  {severity} Severity ({items.length} columns)
                </h4>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      isDarkMode ? "bg-gray-600/50" : "bg-white"
                    } border ${borderClass}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-medium ${textClass}`}>
                        {item.column}
                      </span>
                      <span
                        className={`text-sm ${getSeverityColor(item.severity)}`}
                      >
                        {item.nullPercentage.toFixed(1)}% null
                      </span>
                    </div>
                    <ul className="text-sm space-y-1">
                      {item.recommendations.map((rec, recIndex) => (
                        <li
                          key={recIndex}
                          className={`flex items-start space-x-2 ${textSecondaryClass}`}
                        >
                          <span className="text-xs mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Recommendations */}
      <div className={`${bgClass} rounded-lg p-4 border ${borderClass}`}>
        <h4 className={`font-semibold ${textClass} mb-3`}>
          Overall Recommendations
        </h4>
        <div className="space-y-2 text-sm">
          {totalNulls === 0 ? (
            <p className={`${textClass} flex items-center space-x-2`}>
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Perfect! No null values found in the dataset.</span>
            </p>
          ) : (
            <>
              <p className={`${textClass} flex items-center space-x-2`}>
                <Info className="w-4 h-4 text-blue-400" />
                <span>
                  Found {totalNulls} null values across{" "}
                  {columnsWithNulls.length} columns.
                </span>
              </p>
              <p className={textSecondaryClass}>
                Consider data imputation strategies based on the severity levels
                above.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
