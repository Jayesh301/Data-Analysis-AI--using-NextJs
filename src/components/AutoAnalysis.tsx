"use client";

import { useState, useEffect } from "react";
import {
  Brain,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";

interface AnalysisData {
  summary: {
    totalRows: number;
    totalColumns: number;
    missingValues: number;
  };
  insights: string[];
  recommendations: string[];
  correlations?: Array<{
    var1: string;
    var2: string;
    correlation: number;
  }>;
}

interface AutoAnalysisProps {
  file: File;
  onAnalysisComplete: (data: AnalysisData) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  isDarkMode: boolean;
}

export default function AutoAnalysis({
  file,
  onAnalysisComplete,
  isAnalyzing,
  setIsAnalyzing,
  isDarkMode,
}: AutoAnalysisProps) {
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (file && !analysisResults && !isAnalyzing) {
      performAnalysis();
    }
  }, [file]);

  const performAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);
      setProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate AI analysis (replace with actual Gemini API call)
      const mockAnalysis = {
        summary: {
          totalRows: Math.floor(Math.random() * 1000) + 100,
          totalColumns: Math.floor(Math.random() * 10) + 3,
          dataTypes: ["numeric", "categorical", "datetime"],
          missingValues: Math.floor(Math.random() * 50),
        },
        insights: [
          "Data shows strong correlation between variables A and B",
          "Outliers detected in 3% of the dataset",
          "Seasonal patterns identified in time series data",
          "Data quality score: 87%",
        ],
        recommendations: [
          "Consider removing outliers for better analysis",
          "Apply data normalization for machine learning models",
          "Create additional derived features",
          "Validate data completeness before modeling",
        ],
        correlations: [
          { var1: "Column A", var2: "Column B", correlation: 0.85 },
          { var1: "Column C", var2: "Column D", correlation: 0.72 },
          { var1: "Column A", var2: "Column E", correlation: -0.34 },
        ],
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setProgress(100);
      clearInterval(progressInterval);

      setAnalysisResults(mockAnalysis);
      onAnalysisComplete(mockAnalysis);
    } catch (err) {
      setError("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const retryAnalysis = () => {
    setAnalysisResults(null);
    setError(null);
    setProgress(0);
    performAnalysis();
  };

  const bgClass = isDarkMode ? "bg-blue-500/10" : "bg-blue-50";
  const borderClass = isDarkMode ? "border-blue-500/30" : "border-blue-200";
  const errorBgClass = isDarkMode ? "bg-red-500/10" : "bg-red-50";
  const errorBorderClass = isDarkMode ? "border-red-500/30" : "border-red-200";
  const successBgClass = isDarkMode ? "bg-green-500/10" : "bg-green-50";
  const successBorderClass = isDarkMode
    ? "border-green-500/30"
    : "border-green-200";
  const cardBgClass = isDarkMode ? "bg-gray-800/50" : "bg-white";
  const cardBorderClass = isDarkMode ? "border-gray-600" : "border-gray-200";
  const textClass = isDarkMode ? "text-white" : "text-gray-800";
  const textSecondaryClass = isDarkMode ? "text-gray-300" : "text-gray-600";
  const textTertiaryClass = isDarkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className="space-y-6">
      {isAnalyzing ? (
        <div className="space-y-6">
          <div className={`${bgClass} border ${borderClass} rounded-lg p-6`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-blue-300" : "text-blue-800"
                  }`}
                >
                  Analyzing Data with AI
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-blue-200" : "text-blue-600"
                  }`}
                >
                  Processing your dataset...
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div
              className={`w-full ${
                isDarkMode ? "bg-blue-500/20" : "bg-blue-200"
              } rounded-full h-2 mb-4`}
            >
              <div
                className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div
              className={`text-sm ${
                isDarkMode ? "text-blue-200" : "text-blue-700"
              } space-y-2`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Performing statistical analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Detecting patterns and correlations</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Generating insights and recommendations</span>
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="space-y-4">
          <div
            className={`${errorBgClass} border ${errorBorderClass} rounded-lg p-6`}
          >
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-red-300" : "text-red-800"
                }`}
              >
                Analysis Failed
              </h3>
            </div>
            <p
              className={`${isDarkMode ? "text-red-200" : "text-red-700"} mb-4`}
            >
              {error}
            </p>
            <button
              onClick={retryAnalysis}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry Analysis
            </button>
          </div>
        </div>
      ) : analysisResults ? (
        <div className="space-y-6">
          {/* Success Message */}
          <div
            className={`${successBgClass} border ${successBorderClass} rounded-lg p-4`}
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <h3
                  className={`font-semibold ${
                    isDarkMode ? "text-green-300" : "text-green-800"
                  }`}
                >
                  Analysis Complete!
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-green-200" : "text-green-600"
                  }`}
                >
                  Your data has been successfully analyzed
                </p>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div
            className={`${
              isDarkMode
                ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10"
                : "bg-gradient-to-r from-blue-50 to-indigo-50"
            } border ${borderClass} rounded-lg p-6`}
          >
            <h3 className={`font-semibold ${textClass} mb-4 flex items-center`}>
              <BarChart3 className="w-5 h-5 text-blue-400 mr-2" />
              Summary Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                className={`${cardBgClass} rounded-lg p-4 text-center border ${cardBorderClass}`}
              >
                <div className="text-2xl font-bold text-blue-400">
                  {analysisResults.summary.totalRows}
                </div>
                <div className={`text-sm ${textSecondaryClass}`}>
                  Total Rows
                </div>
              </div>
              <div
                className={`${cardBgClass} rounded-lg p-4 text-center border ${cardBorderClass}`}
              >
                <div className="text-2xl font-bold text-green-400">
                  {analysisResults.summary.totalColumns}
                </div>
                <div className={`text-sm ${textSecondaryClass}`}>
                  Total Columns
                </div>
              </div>
              <div
                className={`${cardBgClass} rounded-lg p-4 text-center border ${cardBorderClass}`}
              >
                <div className="text-2xl font-bold text-orange-400">
                  {analysisResults.summary.missingValues}
                </div>
                <div className={`text-sm ${textSecondaryClass}`}>
                  Missing Values
                </div>
              </div>
              <div
                className={`${cardBgClass} rounded-lg p-4 text-center border ${cardBorderClass}`}
              >
                <div className="text-2xl font-bold text-purple-400">87%</div>
                <div className={`text-sm ${textSecondaryClass}`}>
                  Quality Score
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div
            className={`${cardBgClass} border ${cardBorderClass} rounded-lg p-6`}
          >
            <h3 className={`font-semibold ${textClass} mb-4 flex items-center`}>
              <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
              Key Insights
            </h3>
            <div className="space-y-3">
              {analysisResults.insights.map(
                (insight: string, index: number) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 p-3 ${
                      isDarkMode ? "bg-green-500/10" : "bg-green-50"
                    } rounded-lg border ${
                      isDarkMode ? "border-green-500/30" : "border-green-200"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-green-200" : "text-green-800"
                      }`}
                    >
                      {insight}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div
            className={`${cardBgClass} border ${cardBorderClass} rounded-lg p-6`}
          >
            <h3 className={`font-semibold ${textClass} mb-4 flex items-center`}>
              <Brain className="w-5 h-5 text-purple-400 mr-2" />
              Recommendations
            </h3>
            <div className="space-y-3">
              {analysisResults.recommendations.map(
                (rec: string, index: number) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 p-3 ${
                      isDarkMode ? "bg-purple-500/10" : "bg-purple-50"
                    } rounded-lg border ${
                      isDarkMode ? "border-purple-500/30" : "border-purple-200"
                    }`}
                  >
                    <Brain className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-purple-200" : "text-purple-800"
                      }`}
                    >
                      {rec}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Top Correlations */}
          {analysisResults.correlations &&
            analysisResults.correlations.length > 0 && (
              <div
                className={`${cardBgClass} border ${cardBorderClass} rounded-lg p-6`}
              >
                <h3 className={`font-semibold ${textClass} mb-4`}>
                  Top Correlations
                </h3>
                <div className="space-y-3">
                  {analysisResults.correlations?.map((corr, index: number) => (
                    <div
                      key={index}
                      className={`${
                        isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                      } p-4 rounded-lg border ${cardBorderClass}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium ${textSecondaryClass}`}>
                          {corr.var1} ↔ {corr.var2}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            Math.abs(corr.correlation) > 0.7
                              ? "text-green-400"
                              : Math.abs(corr.correlation) > 0.4
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {corr.correlation.toFixed(2)}
                        </span>
                      </div>
                      <div
                        className={`w-full ${
                          isDarkMode ? "bg-gray-600" : "bg-gray-200"
                        } rounded-full h-2`}
                      >
                        <div
                          className={`h-2 rounded-full ${
                            Math.abs(corr.correlation) > 0.7
                              ? "bg-green-500"
                              : Math.abs(corr.correlation) > 0.4
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.abs(corr.correlation) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      ) : (
        <div className={`text-center ${textTertiaryClass} py-8`}>
          <Brain className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p>Ready to analyze your data</p>
        </div>
      )}
    </div>
  );
}
