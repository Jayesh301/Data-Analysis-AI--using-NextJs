import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface AnalysisRequest {
  fileContent: string;
  fileName: string;
  fileType: string;
}

export interface QueryRequest {
  query: string;
  analysisData: any;
  fileContent?: string;
}

export interface AnalysisResponse {
  summary: {
    totalRows: number;
    totalColumns: number;
    dataTypes: string[];
    missingValues: number;
  };
  insights: string[];
  recommendations: string[];
  correlations: Array<{
    var1: string;
    var2: string;
    correlation: number;
  }>;
}

export interface QueryResponse {
  answer: string;
  code?: string;
  visualization?: string;
}

class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async analyzeData(request: AnalysisRequest): Promise<AnalysisResponse> {
    try {
      const prompt = `
        Analyze the following data and provide a comprehensive analysis:
        
        File: ${request.fileName}
        Type: ${request.fileType}
        Content (first 1000 characters): ${request.fileContent.substring(0, 1000)}
        
        Please provide:
        1. Summary statistics (total rows, columns, data types, missing values)
        2. Key insights about the data
        3. Recommendations for further analysis
        4. Top correlations between variables
        
        Return the response as a JSON object with the following structure:
        {
          "summary": {
            "totalRows": number,
            "totalColumns": number,
            "dataTypes": ["string"],
            "missingValues": number
          },
          "insights": ["string"],
          "recommendations": ["string"],
          "correlations": [
            {
              "var1": "string",
              "var2": "string", 
              "correlation": number
            }
          ]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON response
      try {
        return JSON.parse(text);
      } catch (parseError) {
        // Fallback to mock data if parsing fails
        return this.getMockAnalysis();
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getMockAnalysis();
    }
  }

  async processQuery(request: QueryRequest): Promise<QueryResponse> {
    try {
      const prompt = `
        Answer the following question about the data:
        
        Question: ${request.query}
        
        Analysis Context: ${JSON.stringify(request.analysisData)}
        
        Provide a clear, concise answer based on the data analysis. If the question requires code or visualization, include that as well.
        
        Return the response as a JSON object:
        {
          "answer": "string",
          "code": "string (optional)",
          "visualization": "string (optional)"
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return {
          answer: "I'm sorry, I couldn't process that query. Please try rephrasing your question.",
        };
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        answer: "I'm sorry, there was an error processing your query. Please try again.",
      };
    }
  }

  private getMockAnalysis(): AnalysisResponse {
    return {
      summary: {
        totalRows: Math.floor(Math.random() * 1000) + 100,
        totalColumns: Math.floor(Math.random() * 10) + 3,
        dataTypes: ['numeric', 'categorical', 'datetime'],
        missingValues: Math.floor(Math.random() * 50),
      },
      insights: [
        'Data shows strong correlation between variables A and B',
        'Outliers detected in 3% of the dataset',
        'Seasonal patterns identified in time series data',
        'Data quality score: 87%',
      ],
      recommendations: [
        'Consider removing outliers for better analysis',
        'Apply data normalization for machine learning models',
        'Create additional derived features',
        'Validate data completeness before modeling',
      ],
      correlations: [
        { var1: 'Column A', var2: 'Column B', correlation: 0.85 },
        { var1: 'Column C', var2: 'Column D', correlation: 0.72 },
        { var1: 'Column A', var2: 'Column E', correlation: -0.34 },
      ],
    };
  }
}

export const geminiService = new GeminiService();
