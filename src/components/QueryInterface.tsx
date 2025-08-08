"use client";

import { useState } from "react";
import { Search, Send, MessageSquare, Sparkles } from "lucide-react";

interface QueryInterfaceProps {
  uploadedFile: File | null;
  analysisData: any;
  isDarkMode: boolean;
}

export default function QueryInterface({
  uploadedFile,
  analysisData,
  isDarkMode,
}: QueryInterfaceProps) {
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [queryHistory, setQueryHistory] = useState<
    Array<{ query: string; response: string }>
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !uploadedFile) return;

    setIsProcessing(true);

    // Simulate AI query processing
    setTimeout(() => {
      const mockResponses = [
        "Based on the data, I found that sales increased by 15% in Q3 compared to Q2.",
        "The correlation between customer satisfaction and repeat purchases is 0.78.",
        "There are 3 outliers in the dataset that may need attention.",
        "The average transaction value is $125.50 with a standard deviation of $45.20.",
        "Seasonal patterns show peak activity during holiday months.",
      ];

      const randomResponse =
        mockResponses[Math.floor(Math.random() * mockResponses.length)];

      setQueryHistory((prev) => [...prev, { query, response: randomResponse }]);
      setQuery("");
      setIsProcessing(false);
    }, 1500);
  };

  const suggestedQueries = [
    "What are the key trends in this data?",
    "Show me correlations between variables",
    "Are there any outliers?",
    "What insights can you find?",
    "Generate a summary of the data",
  ];

  const bgClass = isDarkMode ? "bg-gray-700/50" : "bg-gray-50";
  const borderClass = isDarkMode ? "border-gray-600" : "border-gray-200";
  const textClass = isDarkMode ? "text-gray-200" : "text-gray-700";
  const textSecondaryClass = isDarkMode ? "text-gray-300" : "text-gray-600";
  const textTertiaryClass = isDarkMode ? "text-gray-400" : "text-gray-500";
  const inputBgClass = isDarkMode ? "bg-gray-700/50" : "bg-white";
  const inputBorderClass = isDarkMode ? "border-gray-600" : "border-gray-300";
  const placeholderClass = isDarkMode
    ? "placeholder-gray-400"
    : "placeholder-gray-500";

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <div className={`text-center ${textTertiaryClass} py-8`}>
          Upload a file to start asking questions
        </div>
      ) : (
        <div className="space-y-4">
          {/* Query Input */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about your data..."
                className={`w-full px-4 py-3 ${inputBgClass} border ${inputBorderClass} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode ? "text-white" : "text-gray-800"
                } ${placeholderClass}`}
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={!query.trim() || isProcessing}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-400 hover:text-blue-300 disabled:text-gray-500"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>

          {/* Suggested Queries */}
          <div>
            <h3 className={`text-sm font-medium ${textSecondaryClass} mb-2`}>
              Suggested Questions:
            </h3>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(suggestion)}
                  className={`px-3 py-1 text-xs ${bgClass} ${textSecondaryClass} rounded-full hover:${
                    isDarkMode ? "bg-gray-600" : "bg-gray-200"
                  } transition-colors border ${borderClass}`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Query History */}
          {queryHistory.length > 0 && (
            <div className="space-y-3">
              <h3 className={`text-sm font-medium ${textSecondaryClass}`}>
                Recent Queries:
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {queryHistory.map((item, index) => (
                  <div
                    key={index}
                    className={`${bgClass} rounded-lg p-3 border ${borderClass}`}
                  >
                    <div className="flex items-start space-x-2">
                      <Search className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${textClass} mb-1`}>
                          {item.query}
                        </p>
                        <div className="flex items-start space-x-2">
                          <Sparkles className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                          <p className={`text-sm ${textSecondaryClass}`}>
                            {item.response}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
