"use client";

import { useState, useEffect } from "react";
import { Brain, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import AutoAnalysis from "./AutoAnalysis";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      Loading chart...
    </div>
  ),
});

interface AnalysisData {
  summary?: {
    totalRows: number;
    totalColumns: number;
    missingValues: number;
  };
  insights?: string[];
  recommendations?: string[];
}

interface VisualizationsProps {
  data: AnalysisData | null;
  uploadedFile?: File | null;
  isDarkMode: boolean;
  onAnalysisComplete?: (data: AnalysisData) => void;
  isAnalyzing?: boolean;
  setIsAnalyzing?: (analyzing: boolean) => void;
}

interface ColumnAnalysis {
  name: string;
  type: "numeric" | "categorical" | "date" | "currency" | "percentage";
  uniqueValues: number;
  hasNulls: boolean;
  range?: { min: number; max: number };
  topValues?: { value: string; count: number }[];
}

interface ChartData {
  id: string;
  title: string;
  description: string;
  type: string;
  data: {
    data: Array<{
      x?: string[] | number[];
      y?: number[];
      type: string;
      mode?: string;
      marker?: Record<string, unknown>;
      line?: Record<string, unknown>;
      nbinsx?: number;
      z?: number[][];
      colorscale?: string;
      zmid?: number;
    }>;
    layout: {
      title: string;
      xaxis?: { title: string };
      yaxis?: { title: string };
      width: number;
      height: number;
      margin: { l: number; r: number; t: number; b: number };
      paper_bgcolor: string;
      plot_bgcolor: string;
      font: { color: string };
      annotations?: Array<{
        text: string;
        showarrow: boolean;
        x: number;
        y: number;
        xref: string;
        yref: string;
        font: { size: number; color: string };
      }>;
    };
  };
  priority: string;
}

export default function Visualizations({
  data,
  uploadedFile,
  isDarkMode,
  onAnalysisComplete,
  isAnalyzing,
  setIsAnalyzing,
}: VisualizationsProps) {
  const [dataset, setDataset] = useState<Record<string, string>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [recommendedCharts, setRecommendedCharts] = useState<ChartData[]>([]);

  useEffect(() => {
    if (uploadedFile) {
      parseDataset();
    }
  }, [uploadedFile]);

  const parseDataset = async () => {
    if (!uploadedFile) return;

    try {
      const text = await uploadedFile.text();
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

        // Analyze columns intelligently
        const analysis = analyzeColumns(headers, dataRows);

        // Generate recommended charts based on analysis
        const charts = generateRecommendedCharts(analysis, dataRows);
        setRecommendedCharts(charts);
      }
    } catch (error) {
      console.error("Error parsing dataset:", error);
    }
  };

  const analyzeColumns = (
    headers: string[],
    dataRows: any[]
  ): ColumnAnalysis[] => {
    return headers.map((header) => {
      const values = dataRows.map((row) => row[header]).filter((v) => v !== "");
      const uniqueValues = new Set(values).size;
      const hasNulls = values.length < dataRows.length;

      // Determine column type
      let type: ColumnAnalysis["type"] = "categorical";
      let range: { min: number; max: number } | undefined;
      let topValues: { value: string; count: number }[] | undefined;

      // Check if numeric
      const numericValues = values
        .map((v) => parseFloat(v))
        .filter((v) => !isNaN(v));
      if (numericValues.length > values.length * 0.8) {
        type = "numeric";
        range = {
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
        };

        // Check for specific types
        if (
          header.toLowerCase().includes("date") ||
          header.toLowerCase().includes("time")
        ) {
          type = "date";
        } else if (
          header.toLowerCase().includes("salary") ||
          header.toLowerCase().includes("price") ||
          header.toLowerCase().includes("cost") ||
          header.toLowerCase().includes("amount")
        ) {
          type = "currency";
        } else if (
          header.toLowerCase().includes("rate") ||
          header.toLowerCase().includes("percentage") ||
          header.toLowerCase().includes("score") ||
          header.toLowerCase().includes("performance")
        ) {
          type = "percentage";
        }
      } else {
        // Categorical - get top values
        const valueCounts: { [key: string]: number } = {};
        values.forEach((value) => {
          valueCounts[value] = (valueCounts[value] || 0) + 1;
        });
        topValues = Object.entries(valueCounts)
          .map(([value, count]) => ({ value, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
      }

      return {
        name: header,
        type,
        uniqueValues,
        hasNulls,
        range,
        topValues,
      };
    });
  };

  const generateRecommendedCharts = (
    analysis: ColumnAnalysis[],
    dataRows: any[]
  ) => {
    const charts: any[] = [];

    // 1. Distribution charts for categorical columns
    const categoricalCols = analysis.filter(
      (col) => col.type === "categorical"
    );
    categoricalCols.forEach((col) => {
      if (col.topValues && col.topValues.length > 0) {
        charts.push({
          id: `bar-${col.name}`,
          title: `${col.name} Distribution`,
          description: `Shows the frequency of each ${col.name.toLowerCase()} value`,
          type: "bar",
          data: generateBarChart(col.name, dataRows),
          priority: col.uniqueValues <= 20 ? "high" : "medium",
        });
      }
    });

    // 2. Histograms for numeric columns
    const numericCols = analysis.filter((col) => col.type === "numeric");
    numericCols.forEach((col) => {
      charts.push({
        id: `histogram-${col.name}`,
        title: `${col.name} Distribution`,
        description: `Shows the distribution of ${col.name.toLowerCase()} values`,
        type: "histogram",
        data: generateHistogram(col.name, dataRows),
        priority: "high",
      });
    });

    // 3. Correlation analysis for numeric columns
    if (numericCols.length >= 2) {
      charts.push({
        id: "correlation-heatmap",
        title: "Correlation Analysis",
        description: "Shows relationships between numeric variables",
        type: "heatmap",
        data: generateCorrelationHeatmap(numericCols, dataRows),
        priority: "high",
      });
    }

    // 4. Scatter plots for meaningful relationships
    const meaningfulPairs = findMeaningfulRelationships(analysis, dataRows);
    meaningfulPairs.forEach((pair) => {
      charts.push({
        id: `scatter-${pair.x}-${pair.y}`,
        title: `${pair.x} vs ${pair.y}`,
        description: pair.description,
        type: "scatter",
        data: generateScatterPlot(pair.x, pair.y, dataRows),
        priority: "medium",
      });
    });

    // 5. Time series for date columns
    const dateCols = analysis.filter((col) => col.type === "date");
    const numericForTime = numericCols.filter(
      (col) => !dateCols.some((dateCol) => dateCol.name === col.name)
    );

    if (dateCols.length > 0 && numericForTime.length > 0) {
      dateCols.forEach((dateCol) => {
        numericForTime.forEach((numCol) => {
          charts.push({
            id: `line-${dateCol.name}-${numCol.name}`,
            title: `${numCol.name} Over Time`,
            description: `Shows how ${numCol.name.toLowerCase()} changes over time`,
            type: "line",
            data: generateLineChart(dateCol.name, numCol.name, dataRows),
            priority: "high",
          });
        });
      });
    }

    // 6. Summary statistics
    charts.push({
      id: "summary-stats",
      title: "Data Summary",
      description: "Overview of dataset characteristics",
      type: "summary",
      data: generateSummaryStats(analysis, dataRows),
      priority: "low",
    });

    return charts.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (
        priorityOrder[b.priority as keyof typeof priorityOrder] -
        priorityOrder[a.priority as keyof typeof priorityOrder]
      );
    });
  };

  const findMeaningfulRelationships = (
    analysis: ColumnAnalysis[],
    dataRows: any[]
  ) => {
    const pairs: { x: string; y: string; description: string }[] = [];
    const numericCols = analysis.filter((col) => col.type === "numeric");

    // Common meaningful relationships
    const relationshipPatterns = [
      { pattern: ["age", "salary"], description: "Age vs Salary relationship" },
      {
        pattern: ["experience", "salary"],
        description: "Experience vs Salary relationship",
      },
      {
        pattern: ["performance", "salary"],
        description: "Performance vs Salary relationship",
      },
      {
        pattern: ["age", "performance"],
        description: "Age vs Performance relationship",
      },
      {
        pattern: ["experience", "performance"],
        description: "Experience vs Performance relationship",
      },
    ];

    relationshipPatterns.forEach(({ pattern, description }) => {
      const xCol = numericCols.find((col) =>
        col.name.toLowerCase().includes(pattern[0])
      );
      const yCol = numericCols.find((col) =>
        col.name.toLowerCase().includes(pattern[1])
      );

      if (xCol && yCol && xCol.name !== yCol.name) {
        pairs.push({ x: xCol.name, y: yCol.name, description });
      }
    });

    // If no meaningful patterns found, create some basic scatter plots
    if (pairs.length === 0 && numericCols.length >= 2) {
      for (let i = 0; i < numericCols.length - 1; i++) {
        for (let j = i + 1; j < numericCols.length; j++) {
          pairs.push({
            x: numericCols[i].name,
            y: numericCols[j].name,
            description: `${numericCols[i].name} vs ${numericCols[j].name} relationship`,
          });
        }
      }
    }

    return pairs.slice(0, 3); // Limit to top 3 meaningful relationships
  };

  const generateBarChart = (columnName: string, dataRows: any[]) => {
    const valueCounts: { [key: string]: number } = {};
    dataRows.forEach((row) => {
      const value = row[columnName] || "Unknown";
      valueCounts[value] = (valueCounts[value] || 0) + 1;
    });

    const values = Object.values(valueCounts);
    const labels = Object.keys(valueCounts);

    return {
      data: [
        {
          x: labels,
          y: values,
          type: "bar",
          marker: { color: "rgb(55, 83, 109)" },
        },
      ],
      layout: {
        title: `${columnName} Distribution`,
        xaxis: { title: columnName },
        yaxis: { title: "Count" },
        width: 500,
        height: 400,
        margin: { l: 50, r: 50, t: 50, b: 50 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: isDarkMode ? "#ffffff" : "#000000" },
      },
    };
  };

  const generateHistogram = (columnName: string, dataRows: any[]) => {
    const values = dataRows
      .map((row) => parseFloat(row[columnName]))
      .filter((v) => !isNaN(v));

    return {
      data: [
        {
          x: values,
          type: "histogram",
          nbinsx: Math.min(20, Math.ceil(values.length / 10)),
          marker: { color: "rgb(26, 118, 255)" },
        },
      ],
      layout: {
        title: `${columnName} Distribution`,
        xaxis: { title: columnName },
        yaxis: { title: "Frequency" },
        width: 500,
        height: 400,
        margin: { l: 50, r: 50, t: 50, b: 50 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: isDarkMode ? "#ffffff" : "#000000" },
      },
    };
  };

  const generateCorrelationHeatmap = (
    numericCols: ColumnAnalysis[],
    dataRows: any[]
  ) => {
    const labels = numericCols.map((col) => col.name);
    const correlationData: number[][] = [];

    for (let i = 0; i < numericCols.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < numericCols.length; j++) {
        if (i === j) {
          row.push(1);
        } else {
          const col1 = numericCols[i].name;
          const col2 = numericCols[j].name;
          const values1 = dataRows
            .map((row) => parseFloat(row[col1]))
            .filter((v) => !isNaN(v));
          const values2 = dataRows
            .map((row) => parseFloat(row[col2]))
            .filter((v) => !isNaN(v));

          const correlation = calculateCorrelation(values1, values2);
          row.push(correlation);
        }
      }
      correlationData.push(row);
    }

    return {
      data: [
        {
          z: correlationData,
          x: labels,
          y: labels,
          type: "heatmap",
          colorscale: "RdBu",
          zmid: 0,
        },
      ],
      layout: {
        title: "Correlation Matrix",
        width: 600,
        height: 500,
        margin: { l: 50, r: 50, t: 50, b: 50 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: isDarkMode ? "#ffffff" : "#000000" },
      },
    };
  };

  const generateScatterPlot = (xCol: string, yCol: string, dataRows: any[]) => {
    const values = dataRows
      .map((row) => ({
        x: parseFloat(row[xCol]),
        y: parseFloat(row[yCol]),
      }))
      .filter((point) => !isNaN(point.x) && !isNaN(point.y));

    return {
      data: [
        {
          x: values.map((v) => v.x),
          y: values.map((v) => v.y),
          type: "scatter",
          mode: "markers",
          marker: {
            size: 8,
            opacity: 0.7,
            color: "rgb(26, 118, 255)",
          },
        },
      ],
      layout: {
        title: `${xCol} vs ${yCol}`,
        xaxis: { title: xCol },
        yaxis: { title: yCol },
        width: 500,
        height: 400,
        margin: { l: 50, r: 50, t: 50, b: 50 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: isDarkMode ? "#ffffff" : "#000000" },
      },
    };
  };

  const generateLineChart = (
    dateCol: string,
    valueCol: string,
    dataRows: any[]
  ) => {
    const values = dataRows
      .map((row, i) => ({ x: i, y: parseFloat(row[valueCol]) }))
      .filter((point) => !isNaN(point.y));

    return {
      data: [
        {
          x: values.map((v) => v.x),
          y: values.map((v) => v.y),
          type: "scatter",
          mode: "lines+markers",
          line: { color: "rgb(26, 118, 255)" },
        },
      ],
      layout: {
        title: `${valueCol} Over Time`,
        xaxis: { title: "Time" },
        yaxis: { title: valueCol },
        width: 500,
        height: 400,
        margin: { l: 50, r: 50, t: 50, b: 50 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: isDarkMode ? "#ffffff" : "#000000" },
      },
    };
  };

  const generateSummaryStats = (
    analysis: ColumnAnalysis[],
    dataRows: any[]
  ) => {
    const numericCols = analysis.filter((col) => col.type === "numeric");
    const categoricalCols = analysis.filter(
      (col) => col.type === "categorical"
    );

    return {
      data: [],
      layout: {
        title: "Dataset Summary",
        width: 600,
        height: 400,
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: isDarkMode ? "#ffffff" : "#000000" },
        annotations: [
          {
            text:
              `Dataset: ${uploadedFile?.name}<br>` +
              `Total Rows: ${dataRows.length}<br>` +
              `Total Columns: ${analysis.length}<br>` +
              `Numeric Columns: ${numericCols.length}<br>` +
              `Categorical Columns: ${categoricalCols.length}<br>` +
              `Date Columns: ${
                analysis.filter((col) => col.type === "date").length
              }`,
            showarrow: false,
            x: 0.5,
            y: 0.5,
            xref: "paper",
            yref: "paper",
            font: { size: 14, color: isDarkMode ? "#ffffff" : "#000000" },
          },
        ],
      },
    };
  };

  const calculateCorrelation = (x: number[], y: number[]): number => {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const renderChart = (chart: any) => {
    if (!chart.data) return null;

    const bgClass = isDarkMode ? "bg-gray-800/50" : "bg-white";
    const borderClass = isDarkMode ? "border-gray-600" : "border-gray-200";
    const textClass = isDarkMode ? "text-white" : "text-gray-800";
    const textSecondaryClass = isDarkMode ? "text-gray-300" : "text-gray-600";

    return (
      <div
        key={chart.id}
        className={`border ${borderClass} rounded-lg p-4 ${bgClass}`}
      >
        <div className="mb-3">
          <h3 className={`text-lg font-semibold ${textClass}`}>
            {chart.title}
          </h3>
          <p className={`text-sm ${textSecondaryClass}`}>{chart.description}</p>
        </div>
        <Plot
          data={chart.data.data}
          layout={chart.data.layout}
          config={{ displayModeBar: false }}
        />
      </div>
    );
  };

  if (!uploadedFile || dataset.length === 0) {
    return (
      <div
        className={`text-center ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        } py-8`}
      >
        Upload a dataset to see intelligent visualizations
      </div>
    );
  }

  const bgClass = isDarkMode ? "bg-gray-800/50" : "bg-white";
  const borderClass = isDarkMode ? "border-gray-600" : "border-gray-200";
  const textClass = isDarkMode ? "text-white" : "text-gray-800";
  const infoBgClass = isDarkMode ? "bg-blue-500/10" : "bg-blue-50";
  const infoBorderClass = isDarkMode ? "border-blue-500/30" : "border-blue-200";
  const infoTextClass = isDarkMode ? "text-blue-200" : "text-blue-800";
  const footerBgClass = isDarkMode ? "bg-gray-700/50" : "bg-gray-50";
  const footerBorderClass = isDarkMode ? "border-gray-600" : "border-gray-200";
  const footerTextClass = isDarkMode ? "text-gray-400" : "text-gray-600";

  return (
    <div className="space-y-6">
      {/* AI Insights Section */}
      {uploadedFile && (
        <div className={`border ${borderClass} rounded-lg p-6 ${bgClass}`}>
          <div className="flex items-center mb-4">
            <Brain className="w-6 h-6 text-blue-400 mr-2" />
            <h3 className={`text-xl font-semibold ${textClass}`}>
              AI Insights & Analysis
            </h3>
          </div>
          <AutoAnalysis
            file={uploadedFile}
            onAnalysisComplete={onAnalysisComplete || (() => {})}
            isAnalyzing={isAnalyzing || false}
            setIsAnalyzing={setIsAnalyzing || (() => {})}
            isDarkMode={isDarkMode}
          />
        </div>
      )}

      {/* Charts Section */}
      <div className={`border ${borderClass} rounded-lg p-6 ${bgClass}`}>
        <div className="flex items-center mb-4">
          <Sparkles className="w-6 h-6 text-purple-400 mr-2" />
          <h3 className={`text-xl font-semibold ${textClass}`}>
            Intelligent Visualizations
          </h3>
        </div>

        <div
          className={`mb-4 p-3 ${infoBgClass} rounded-lg border ${infoBorderClass}`}
        >
          <p className={`text-sm ${infoTextClass}`}>
            <strong>Smart Analysis:</strong> Based on your dataset structure,
            we&apos;ve generated {recommendedCharts.length} meaningful
            visualizations that highlight important patterns and relationships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendedCharts.map((chart) => renderChart(chart))}
        </div>

        <div
          className={`mt-6 p-3 ${footerBgClass} rounded-lg border ${footerBorderClass}`}
        >
          <p className={`text-xs ${footerTextClass}`}>
            Dataset: {uploadedFile?.name} | Rows: {dataset.length} | Columns:{" "}
            {columns.length} | Charts generated based on data characteristics
          </p>
        </div>
      </div>
    </div>
  );
}
