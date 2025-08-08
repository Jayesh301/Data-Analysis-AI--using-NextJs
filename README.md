# Data Analysis AI

An AI-powered data analysis platform built with Next.js and Google Gemini AI. Upload your data files and get instant insights, visualizations, and answers to your questions.

## 🚀 Features

### **User Interface Layer**

- **File Uploader**: Drag & drop support for CSV and Excel files
- **Data Preview**: Real-time preview of uploaded data
- **Auto-Analysis**: AI-powered automatic data analysis
- **Query Interface**: Natural language questions about your data
- **Interactive Visualizations**: Dynamic charts using Plotly.js
- **Custom Analysis**: Detailed insights and recommendations

### **Analysis Layer**

- **Automatic Analysis**: Statistical analysis, pattern detection, and insight generation
- **NLP Interpreter**: Natural language query processing
- **Code Executor**: Safe query execution and result formatting

### **AI Services Layer**

- **Gemini AI Integration**: Google's advanced language model for data analysis
- **Dynamic Data Visualization**: Plotly.js charts based on dataset structure
- **Recommendation Engine**: AI-powered suggestions for further analysis

## 📊 Visualization Features

### **Dynamic Chart Generation**

The application automatically analyzes your dataset and creates appropriate visualizations:

- **Correlation Heatmap**: Shows relationships between numeric variables
- **Bar Charts**: Distribution of categorical variables
- **Histograms**: Distribution of numeric variables
- **Line Charts**: Trends over time or sequence
- **Scatter Plots**: Relationships between two numeric variables
- **Data Distribution**: Summary of data types and structure

### **Smart Chart Selection**

- Automatically identifies numeric vs categorical columns
- Generates appropriate charts based on data types
- Handles missing data gracefully
- Responsive design for different screen sizes

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Google Gemini API key

### Setup Steps

1. **Clone and Install Dependencies**

   ```bash
   cd data-analysis-ai
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Get Gemini API Key**

   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env.local` file

4. **Run Development Server**

   ```bash
   npm run dev
   ```

5. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
data-analysis-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.ts    # Data analysis API
│   │   │   └── query/route.ts      # Query processing API
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Main application page
│   ├── components/
│   │   ├── FileUploader.tsx        # File upload component
│   │   ├── DataPreview.tsx         # Data preview component
│   │   ├── AutoAnalysis.tsx        # AI analysis component
│   │   ├── QueryInterface.tsx      # Natural language queries
│   │   ├── Visualizations.tsx      # Plotly.js charts
│   │   └── CustomAnalysis.tsx      # Detailed analysis
│   └── services/
│       └── geminiService.ts        # Gemini AI integration
├── sample_data.csv                 # Sample dataset for testing
├── public/                         # Static assets
└── package.json                    # Dependencies and scripts
```

## 🎯 Usage

### 1. Upload Data

- Drag and drop your CSV or Excel file
- Supported formats: `.csv`, `.xlsx`, `.xls`
- File size limit: 10MB
- Sample data provided: `sample_data.csv`

### 2. Automatic Analysis

- AI automatically analyzes your data
- Provides summary statistics
- Generates key insights
- Identifies correlations
- Suggests recommendations

### 3. Interactive Visualizations

- **Correlation Heatmap**: View relationships between variables
- **Bar Charts**: See distribution of categories
- **Histograms**: Understand data distributions
- **Line Charts**: Track trends over time
- **Scatter Plots**: Explore variable relationships
- **Data Summary**: Overview of data structure

### 4. Ask Questions

- Use natural language to query your data
- Example questions:
  - "What are the key trends?"
  - "Show me correlations between variables"
  - "Are there any outliers?"
  - "Generate a summary"

### 5. Custom Analysis

- Detailed insights breakdown
- Actionable recommendations
- Export options
- Share results

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_GEMINI_API_KEY`: Your Google Gemini API key

### Customization

- Modify prompts in `src/services/geminiService.ts`
- Add new chart types in `src/components/Visualizations.tsx`
- Extend analysis features in `src/components/AutoAnalysis.tsx`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

- **Netlify**: Similar to Vercel setup
- **Railway**: Container-based deployment
- **Heroku**: Traditional hosting option

## 📊 Supported Data Types

### File Formats

- **CSV**: Comma-separated values
- **Excel**: `.xlsx` and `.xls` files

### Data Types

- **Numeric**: Numbers, percentages, currency
- **Categorical**: Text, categories, labels
- **DateTime**: Dates, timestamps, time series

### Chart Types

- **Correlation Heatmap**: For numeric variables
- **Bar Charts**: For categorical variables
- **Histograms**: For numeric distributions
- **Line Charts**: For time series or sequences
- **Scatter Plots**: For variable relationships

## 🔒 Security

- API keys are stored securely in environment variables
- File uploads are validated and sanitized
- No data is stored permanently on the server
- All processing happens in memory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your API key is correct
3. Ensure your file format is supported
4. Check the browser's network tab for API errors

## 🔮 Future Enhancements

- [ ] Real-time data streaming
- [ ] Advanced ML model integration
- [ ] Collaborative analysis features
- [ ] Custom visualization builder
- [ ] Data export in multiple formats
- [ ] Integration with external data sources
- [ ] 3D visualizations
- [ ] Interactive dashboard creation
