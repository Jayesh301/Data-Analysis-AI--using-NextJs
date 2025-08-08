"use client";

import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import FileUploader from "@/components/FileUploader";
import DataPreview from "@/components/DataPreview";
import DataTypesAnalysis from "@/components/DataTypesAnalysis";
import NullValuesAnalysis from "@/components/NullValuesAnalysis";
import AutoAnalysis from "@/components/AutoAnalysis";
import QueryInterface from "@/components/QueryInterface";
import Visualizations from "@/components/Visualizations";
import CustomAnalysis from "@/components/CustomAnalysis";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dataset, setDataset] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState<
    | "upload"
    | "preview"
    | "types"
    | "nulls"
    | "recommendations"
    | "visualizations"
    | "query"
  >("upload");

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setAnalysisData(null);
    parseDataset(file);
    setActiveSection("preview");
  };

  const parseDataset = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim());

      if (lines.length > 0) {
        const headers = lines[0]
          .split(",")
          .map((h) => h.trim().replace(/"/g, ""));
        const dataRows = lines.slice(1).map((line) => {
          const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || "";
          });
          return row;
        });

        setColumns(headers);
        setDataset(dataRows);
      }
    } catch (error) {
      console.error("Error parsing dataset:", error);
    }
  };

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
    setIsAnalyzing(false);
    // Stay in visualizations section since insights are now included there
  };

  const navigationItems = [
    { id: "upload", label: "Upload", icon: "📁", disabled: false },
    { id: "preview", label: "Preview", icon: "👁️", disabled: !uploadedFile },
    { id: "types", label: "Data Types", icon: "🔍", disabled: !uploadedFile },
    { id: "nulls", label: "Null Values", icon: "❓", disabled: !uploadedFile },
    {
      id: "recommendations",
      label: "Recommendations",
      icon: "🎯",
      disabled: !uploadedFile,
    },
    {
      id: "visualizations",
      label: "Charts & Insights",
      icon: "📊",
      disabled: !uploadedFile,
    },
    {
      id: "query",
      label: "Ask Questions",
      icon: "❓",
      disabled: !uploadedFile,
    },
  ];

  const bgClass = isDarkMode
    ? "min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    : "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";

  const headerBgClass = isDarkMode
    ? "bg-gray-900/50 backdrop-blur-sm border-b border-gray-700"
    : "bg-white shadow-sm border-b";

  const navBgClass = isDarkMode
    ? "bg-gray-900/50 backdrop-blur-sm border-b border-gray-700"
    : "bg-white shadow-sm border-b";

  const cardBgClass = isDarkMode
    ? "bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700"
    : "bg-white rounded-xl shadow-lg";

  const textPrimaryClass = isDarkMode ? "text-white" : "text-gray-800";
  const textSecondaryClass = isDarkMode ? "text-gray-300" : "text-gray-600";

  return (
    <div className={bgClass}>
      {/* Header */}
      <div className={headerBgClass}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h1
                className={`text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2`}
              >
                Data Analysis AI
              </h1>
              <p className={textSecondaryClass + " text-lg"}>
                AI-powered data analysis with intelligent visualizations
              </p>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={navBgClass}>
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-3 py-4 overflow-x-auto">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                disabled={item.disabled}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  activeSection === item.id
                    ? isDarkMode
                      ? "bg-blue-600 text-white shadow-lg transform scale-105 shadow-blue-500/25"
                      : "bg-blue-500 text-white shadow-lg transform scale-105"
                    : item.disabled
                    ? isDarkMode
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isDarkMode
                    ? "bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600"
                    : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Upload Section */}
        {activeSection === "upload" && (
          <div className="max-w-4xl mx-auto">
            <div className={cardBgClass + " p-8"}>
              <div className="text-center mb-8">
                <div
                  className={`w-20 h-20 ${
                    isDarkMode ? "bg-blue-500/20" : "bg-blue-100"
                  } rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isDarkMode ? "border border-blue-500/30" : ""
                  }`}
                >
                  <span className="text-3xl">📁</span>
                </div>
                <h2 className={`text-2xl font-bold ${textPrimaryClass} mb-2`}>
                  Upload Your Data
                </h2>
                <p className={textSecondaryClass}>
                  Start by uploading your CSV or Excel file to begin the
                  analysis
                </p>
              </div>
              <FileUploader
                onFileUpload={handleFileUpload}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        )}

        {/* Data Preview Section */}
        {activeSection === "preview" && uploadedFile && (
          <div className="max-w-6xl mx-auto">
            <div className={cardBgClass + " p-6"}>
              <h3
                className={`text-xl font-semibold ${textPrimaryClass} mb-4 flex items-center`}
              >
                <span className="mr-2">👁️</span>
                Data Preview
              </h3>
              <DataPreview file={uploadedFile} isDarkMode={isDarkMode} />
            </div>
          </div>
        )}

        {/* Data Types Analysis Section */}
        {activeSection === "types" && uploadedFile && (
          <div className="max-w-6xl mx-auto">
            <div className={cardBgClass + " p-6"}>
              <h3
                className={`text-xl font-semibold ${textPrimaryClass} mb-4 flex items-center`}
              >
                <span className="mr-2">🔍</span>
                Data Types Analysis
              </h3>
              <DataTypesAnalysis
                dataset={dataset}
                columns={columns}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        )}

        {/* Null Values Analysis Section */}
        {activeSection === "nulls" && uploadedFile && (
          <div className="max-w-6xl mx-auto">
            <div className={cardBgClass + " p-6"}>
              <h3
                className={`text-xl font-semibold ${textPrimaryClass} mb-4 flex items-center`}
              >
                <span className="mr-2">❓</span>
                Null Values Analysis
              </h3>
              <NullValuesAnalysis
                dataset={dataset}
                columns={columns}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {activeSection === "recommendations" && uploadedFile && (
          <div className="max-w-6xl mx-auto">
            <div className={cardBgClass + " p-6"}>
              <h3
                className={`text-xl font-semibold ${textPrimaryClass} mb-4 flex items-center`}
              >
                <span className="mr-2">🎯</span>
                Recommendations
              </h3>
              <CustomAnalysis
                data={analysisData}
                file={uploadedFile}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        )}

        {/* Visualizations Section */}
        {activeSection === "visualizations" && uploadedFile && (
          <div className="max-w-7xl mx-auto">
            <div className={cardBgClass + " p-6"}>
              <h3
                className={`text-xl font-semibold ${textPrimaryClass} mb-6 flex items-center`}
              >
                <span className="mr-2">📊</span>
                Charts & Insights
              </h3>
              <Visualizations
                data={analysisData}
                uploadedFile={uploadedFile}
                isDarkMode={isDarkMode}
                onAnalysisComplete={handleAnalysisComplete}
                isAnalyzing={isAnalyzing}
                setIsAnalyzing={setIsAnalyzing}
              />
            </div>
          </div>
        )}

        {/* Query Section */}
        {activeSection === "query" && uploadedFile && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Query Interface */}
              <div className={cardBgClass + " p-6"}>
                <h3
                  className={`text-xl font-semibold ${textPrimaryClass} mb-4 flex items-center`}
                >
                  <span className="mr-2">❓</span>
                  Ask Questions
                </h3>
                <QueryInterface
                  uploadedFile={uploadedFile}
                  analysisData={analysisData}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Custom Analysis */}
              {analysisData && (
                <div className={cardBgClass + " p-6"}>
                  <h3
                    className={`text-xl font-semibold ${textPrimaryClass} mb-4 flex items-center`}
                  >
                    <span className="mr-2">⚙️</span>
                    Custom Analysis
                  </h3>
                  <CustomAnalysis
                    data={analysisData}
                    file={uploadedFile}
                    isDarkMode={isDarkMode}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty States */}
        {activeSection === "preview" && !uploadedFile && (
          <div className="max-w-4xl mx-auto">
            <div className={cardBgClass + " p-8 text-center"}>
              <div
                className={`w-20 h-20 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                } rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isDarkMode ? "border border-gray-600" : ""
                }`}
              >
                <span className="text-3xl">📁</span>
              </div>
              <h2 className={`text-2xl font-bold ${textPrimaryClass} mb-2`}>
                No Data Uploaded
              </h2>
              <p className={`${textSecondaryClass} mb-6`}>
                Please upload a file first to begin the analysis
              </p>
              <button
                onClick={() => setActiveSection("upload")}
                className={`px-6 py-3 rounded-lg transition-colors shadow-lg ${
                  isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Upload Data
              </button>
            </div>
          </div>
        )}

        {activeSection === "query" && !uploadedFile && (
          <div className="max-w-4xl mx-auto">
            <div className={cardBgClass + " p-8 text-center"}>
              <div
                className={`w-20 h-20 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                } rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isDarkMode ? "border border-gray-600" : ""
                }`}
              >
                <span className="text-3xl">❓</span>
              </div>
              <h2 className={`text-2xl font-bold ${textPrimaryClass} mb-2`}>
                No Data Available
              </h2>
              <p className={`${textSecondaryClass} mb-6`}>
                Please upload a file first to ask questions about your data
              </p>
              <button
                onClick={() => setActiveSection("upload")}
                className={`px-6 py-3 rounded-lg transition-colors shadow-lg ${
                  isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Upload Data
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={`${
          isDarkMode
            ? "bg-gray-900/50 backdrop-blur-sm border-t border-gray-700"
            : "bg-white border-t"
        } mt-16`}
      >
        <div className="container mx-auto px-4 py-6">
          <div
            className={`text-center text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <p>Data Analysis AI - Powered by Gemini AI</p>
            <p className="mt-1">
              Upload, analyze, and visualize your data with intelligent insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
