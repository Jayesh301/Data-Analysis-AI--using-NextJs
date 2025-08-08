"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isDarkMode: boolean;
}

export default function FileUploader({
  onFileUpload,
  isDarkMode,
}: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  const borderClass = isDarkMode ? "border-gray-600" : "border-gray-300";
  const hoverBorderClass = isDarkMode
    ? "hover:border-blue-400"
    : "hover:border-blue-400";
  const hoverBgClass = isDarkMode ? "hover:bg-blue-500/10" : "hover:bg-blue-50";
  const activeBgClass = isDarkMode ? "bg-blue-500/10" : "bg-blue-50";
  const rejectBgClass = isDarkMode ? "bg-red-500/10" : "bg-red-50";
  const rejectBorderClass = isDarkMode ? "border-red-400" : "border-red-400";
  const textClass = isDarkMode ? "text-white" : "text-gray-800";
  const textSecondaryClass = isDarkMode ? "text-gray-300" : "text-gray-600";
  const textTertiaryClass = isDarkMode ? "text-gray-400" : "text-gray-500";
  const successBgClass = isDarkMode ? "bg-green-500/10" : "bg-green-50";
  const successBorderClass = isDarkMode
    ? "border-green-500/30"
    : "border-green-200";
  const infoBgClass = isDarkMode ? "bg-blue-500/10" : "bg-blue-50";
  const infoBorderClass = isDarkMode ? "border-blue-500/30" : "border-blue-200";

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? `${activeBgClass} scale-105`
            : isDragReject
            ? `${rejectBgClass}`
            : `${borderClass} ${hoverBorderClass} ${hoverBgClass}`
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-6">
          {isDragReject ? (
            <div
              className={`w-16 h-16 ${rejectBgClass} rounded-full flex items-center justify-center border ${rejectBorderClass}`}
            >
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          ) : acceptedFiles.length > 0 ? (
            <div
              className={`w-16 h-16 ${successBgClass} rounded-full flex items-center justify-center border ${successBorderClass}`}
            >
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          ) : (
            <div
              className={`w-16 h-16 ${infoBgClass} rounded-full flex items-center justify-center border ${infoBorderClass}`}
            >
              <Upload className="w-8 h-8 text-blue-400" />
            </div>
          )}

          <div className="space-y-3">
            {acceptedFiles.length > 0 ? (
              <>
                <p className={`text-xl font-semibold ${textClass}`}>
                  File Uploaded Successfully!
                </p>
                <p className={textSecondaryClass}>{acceptedFiles[0].name}</p>
                <p className={`text-sm ${textTertiaryClass}`}>
                  Click to upload a different file
                </p>
              </>
            ) : (
              <>
                <p className={`text-xl font-semibold ${textClass}`}>
                  {isDragActive
                    ? "Drop your file here"
                    : isDragReject
                    ? "Invalid file type"
                    : "Drag & drop your file here"}
                </p>
                <p className={textSecondaryClass}>or click to browse</p>
                <p className={`text-sm ${textTertiaryClass}`}>
                  Supports CSV, Excel (.xlsx, .xls) files
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* File Info */}
      {acceptedFiles.length > 0 && (
        <div
          className={`${successBgClass} border ${successBorderClass} rounded-lg p-4`}
        >
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-green-400" />
            <div>
              <p
                className={`font-medium ${
                  isDarkMode ? "text-green-300" : "text-green-800"
                }`}
              >
                {acceptedFiles[0].name}
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                Size: {(acceptedFiles[0].size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div
        className={`${infoBgClass} border ${infoBorderClass} rounded-lg p-4`}
      >
        <h4
          className={`font-medium ${
            isDarkMode ? "text-blue-300" : "text-blue-800"
          } mb-2`}
        >
          📋 Upload Instructions
        </h4>
        <ul
          className={`text-sm ${
            isDarkMode ? "text-blue-200" : "text-blue-700"
          } space-y-1`}
        >
          <li>• Ensure your file has headers in the first row</li>
          <li>• Supported formats: CSV, Excel (.xlsx, .xls)</li>
          <li>• Maximum file size: 10MB</li>
          <li>• Data should be clean and well-structured</li>
        </ul>
      </div>
    </div>
  );
}
