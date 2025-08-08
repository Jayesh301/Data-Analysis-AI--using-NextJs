"use client";

import { useState } from "react";
import { Settings, Download, Share2, Filter, Target } from "lucide-react";

interface AnalysisData {
  summary?: {
    totalRows: number;
    totalColumns: number;
    missingValues: number;
  };
  insights?: string[];
  recommendations?: string[];
}

interface CustomAnalysisProps {
  data: AnalysisData | null;
  file: File | null;
  isDarkMode: boolean;
}

export default function CustomAnalysis({
  data,
  isDarkMode,
}: CustomAnalysisProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState("insights");

  const analysisTypes = [
    { id: "insights", name: "Key Insights", icon: Target },
    { id: "recommendations", name: "Recommendations", icon: Settings },
    { id: "export", name: "Export Options", icon: Download },
  ];

  const renderInsights = () => (
    <div className="space-y-4">
      <h3
        className={`font-semibold ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Detailed Insights
      </h3>
      <div className="space-y-3">
        {data?.insights?.map((insight: string, index: number) => (
          <div
            key={index}
            className={`${
              isDarkMode ? "bg-blue-500/10" : "bg-blue-50"
            } border-l-4 border-blue-400 p-4 rounded-r-lg`}
          >
            <p
              className={`text-sm ${
                isDarkMode ? "text-blue-200" : "text-blue-800"
              }`}
            >
              {insight}
            </p>
          </div>
        ))}
        {!data?.insights && (
          <div
            className={`${
              isDarkMode ? "bg-gray-700/50" : "bg-gray-100"
            } border-l-4 border-gray-400 p-4 rounded-r-lg`}
          >
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              No insights available yet. Please complete the analysis first.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-4">
      <h3
        className={`font-semibold ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Actionable Recommendations
      </h3>
      <div className="space-y-3">
        {data?.recommendations?.map((rec: string, index: number) => (
          <div
            key={index}
            className={`${
              isDarkMode ? "bg-green-500/10" : "bg-green-50"
            } border-l-4 border-green-400 p-4 rounded-r-lg`}
          >
            <p
              className={`text-sm ${
                isDarkMode ? "text-green-200" : "text-green-800"
              }`}
            >
              {rec}
            </p>
          </div>
        ))}
        {!data?.recommendations && (
          <div
            className={`${
              isDarkMode ? "bg-gray-700/50" : "bg-gray-100"
            } border-l-4 border-gray-400 p-4 rounded-r-lg`}
          >
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              No recommendations available yet. Please complete the analysis
              first.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderExportOptions = () => (
    <div className="space-y-4">
      <h3
        className={`font-semibold ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Export Analysis
      </h3>
      <div className="grid grid-cols-1 gap-3">
        <button
          className={`flex items-center justify-between p-4 ${
            isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
          } rounded-lg hover:${
            isDarkMode ? "bg-gray-600" : "bg-gray-100"
          } transition-colors border ${
            isDarkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <Download className="w-5 h-5 text-blue-400" />
            <div>
              <p
                className={`font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Export as PDF
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Complete analysis report
              </p>
            </div>
          </div>
          <span
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            →
          </span>
        </button>

        <button
          className={`flex items-center justify-between p-4 ${
            isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
          } rounded-lg hover:${
            isDarkMode ? "bg-gray-600" : "bg-gray-100"
          } transition-colors border ${
            isDarkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <Share2 className="w-5 h-5 text-green-400" />
            <div>
              <p
                className={`font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Share Results
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Generate shareable link
              </p>
            </div>
          </div>
          <span
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            →
          </span>
        </button>

        <button
          className={`flex items-center justify-between p-4 ${
            isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
          } rounded-lg hover:${
            isDarkMode ? "bg-gray-600" : "bg-gray-100"
          } transition-colors border ${
            isDarkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-purple-400" />
            <div>
              <p
                className={`font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Custom Analysis
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Create specific queries
              </p>
            </div>
          </div>
          <span
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            →
          </span>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedAnalysis) {
      case "insights":
        return renderInsights();
      case "recommendations":
        return renderRecommendations();
      case "export":
        return renderExportOptions();
      default:
        return renderInsights();
    }
  };

  const activeBgClass = isDarkMode ? "bg-orange-500/20" : "bg-orange-100";
  const activeTextClass = isDarkMode ? "text-orange-300" : "text-orange-700";
  const activeBorderClass = isDarkMode
    ? "border-orange-500/30"
    : "border-orange-200";
  const inactiveBgClass = isDarkMode ? "bg-gray-700/50" : "bg-gray-100";
  const inactiveTextClass = isDarkMode ? "text-gray-300" : "text-gray-600";
  const inactiveBorderClass = isDarkMode
    ? "border-gray-600"
    : "border-gray-200";
  const hoverBgClass = isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200";
  const summaryBgClass = isDarkMode ? "bg-gray-700/50" : "bg-gray-50";
  const summaryBorderClass = isDarkMode ? "border-gray-600" : "border-gray-200";
  const textClass = isDarkMode ? "text-white" : "text-gray-800";
  const textSecondaryClass = isDarkMode ? "text-gray-400" : "text-gray-500";
  const textTertiaryClass = isDarkMode ? "text-gray-200" : "text-gray-700";

  return (
    <div className="space-y-4">
      {/* Analysis Type Selector */}
      <div className="flex space-x-2 mb-6">
        {analysisTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedAnalysis(type.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedAnalysis === type.id
                  ? `${activeBgClass} ${activeTextClass} border ${activeBorderClass}`
                  : `${inactiveBgClass} ${inactiveTextClass} hover:${hoverBgClass} border ${inactiveBorderClass}`
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{type.name}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[200px]">{renderContent()}</div>

      {/* Summary Stats */}
      {data?.summary && (
        <div
          className={`mt-6 p-4 ${summaryBgClass} rounded-lg border ${summaryBorderClass}`}
        >
          <h4 className={`font-medium ${textClass} mb-2`}>Analysis Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className={textSecondaryClass}>Data Points:</span>
              <span className={`ml-2 font-medium ${textTertiaryClass}`}>
                {data.summary.totalRows}
              </span>
            </div>
            <div>
              <span className={textSecondaryClass}>Variables:</span>
              <span className={`ml-2 font-medium ${textTertiaryClass}`}>
                {data.summary.totalColumns}
              </span>
            </div>
            <div>
              <span className={textSecondaryClass}>Missing Data:</span>
              <span className={`ml-2 font-medium ${textTertiaryClass}`}>
                {data.summary.missingValues}
              </span>
            </div>
            <div>
              <span className={textSecondaryClass}>Quality Score:</span>
              <span className={`ml-2 font-medium ${textTertiaryClass}`}>
                87%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
