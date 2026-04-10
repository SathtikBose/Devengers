Project Overview
NutriScan is a mobile application developed for the modern consumer who wants to make informed dietary choices without deciphering complex scientific labels. By combining mobile imaging technology with backend nutritional analysis, the app provides an instant health "grade" for food products, identifies beneficial or harmful ingredients, and suggests healthier alternatives.

Key Features
📸 Multi-Modal Scanning Interface
The application offers three intuitive ways to analyze products:

Live Camera Capture: Directly photograph ingredient labels for instant analysis using Base64-encoded image processing.

Gallery Upload: Select existing photos from the device's library to run historical scans.

Manual Barcode Entry: A dedicated input field for barcode numbers to fetch product data directly from the API.

📊 Comprehensive Health Analysis
Upon scanning, users receive a detailed breakdown of their food item:

Dynamic Health Score: A visual 0–100 score that changes color (green, amber, or red) based on the product's overall health impact.

Nutritional Grade: An easy-to-understand letter grade (e.g., A, B, C) for quick decision-making.

Visual Nutrient Tracking: Real-time progress bars for calories, protein, and sugar content.

🥗 Ingredient Insights & Alternatives
Categorized Ingredients: The app intelligently splits labels into "Safe & Beneficial" and "Avoid / Limit" categories, providing specific reasons for why certain ingredients should be avoided.

Healthy Swaps: If a product is flagged as unhealthy, the system suggests verified "Healthier Alternatives" with a one-tap swap action.

Technical Architecture
Tech Stack
Framework: Expo (v54) and React Native (v0.81.5) for cross-platform performance.

Navigation: Expo Router (v6.0.23) utilizing file-based routing for a seamless user experience.

State Management: Zustand (v5.0.12) for efficient, global management of scan results and product data.

UI/Styling: NativeWind (v4.2.3) (Tailwind CSS for React Native) ensuring a modern, responsive design.

API Management: Axios-based client with a built-in mock mode toggle in the environment configuration for development and testing.

Core Workflow
Ingestion: The useScan hook manages the logic for image capture and gallery picking.

Processing: Images are converted to Base64 and transmitted via scanImageApi to the backend.

Storage: The resulting analysis is stored in the useScanStore, which triggers an automatic navigation to the Analysis screen.

Presentation: The AnalysisScreen renders the data using robust fallbacks to ensure the UI remains functional even with incomplete datasets.

Getting Started
Prerequisites
Node.js and npm

Expo Go app installed on a mobile device or an Android/iOS emulator

Installation
Install dependencies:

Bash
npm install
Start the development server:

Bash
npx expo start
Switch to Mock Data (Optional):
Set USE_MOCK=true in your .env configuration to test the UI with pre-defined analysis data without needing a live backend.