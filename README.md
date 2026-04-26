# LifeBoat.ai – The Career Survival Engine

LifeBoat.ai is an intelligent, high-performance career survival dashboard engineered to streamline the candidate's journey from initial resume analysis to job acquisition and financial planning. Built with a sleek, minimalist "Silver Cloud Glass" aesthetic, the platform leverages powerful advanced language models and real-time data APIs to provide actionable career insights, hyper-tailored ATS resumes, localized job discovery, and budget-aware housing data.

The system is designed to operate autonomously without reliance on third-party agent frameworks, ensuring rapid execution, data integrity, and a premium user experience.

---

## Core Architecture & Features

### Intelligent Resume Parsing & Skill Extraction
The platform accepts standard text-based PDF resumes and utilizes advanced extraction logic. The core intelligence engine connects to Anthropic's Claude 3.7 Sonnet model via OpenRouter to perform deep semantic analysis of the candidate's profile. The system categorizes the candidate's capabilities into specific domains (Technical, Soft, and Industry skills), extracts primary roles, and identifies core competencies to power the rest of the application's functionality.

### Real-Time Job Discovery Engine
Instead of generic job boards, LifeBoat.ai features a dynamic, skill-matched discovery engine. It automatically queries the Adzuna Jobs API using the precise skills extracted from the candidate's resume. 
- **Dynamic Filtering**: Users can filter opportunities by region (India, USA, Remote, UK, etc.) and seamlessly pivot the search parameters using auto-populated dropdowns containing their specific parsed skills and primary job roles.
- **Financial Localization**: The interface seamlessly handles salary data, formatting compensation into localized currencies (e.g., INR) for immediate clarity.

### Budget-Aware Housing Intelligence
For candidates relocating for new roles, the platform features a dedicated Housing Discovery module.
- **Geo-Targeted Searches**: It integrates with the OpenStreetMap (Nominatim) API to discover specific "Paying Guest" (PG), Hostel, and Co-Living accommodations in major technology hubs (e.g., Bangalore, Mumbai, Delhi, Chennai, Hyderabad, Pune).
- **Amenity & Type Classification**: The UI provides detailed insights into the type of housing and included amenities (WiFi, AC, Meals), ensuring candidates can secure housing that fits within their relocation budget.

### Financial Runway Analytics
To assist with financial planning during the job search, the platform includes a dynamic Financial Hub. It features an animated SVG dashboard that calculates the candidate's career survival runway in months based on their current liquid capital, monthly burn rate, and target salary expectations. The system provides visual, color-coded status alerts (Critical, Warning, Stable) to guide financial decision-making.

---

## Technology Stack

The application is built on a modern, decoupled architecture designed for speed and scalability:

- **Frontend Application**: React.js, Vite, Framer Motion (for fluid micro-animations), and Lucide React (for minimalist iconography).
- **Backend Service**: Node.js, Express.js, Axios, and Multer (for robust, multi-part file handling and PDF buffer processing).
- **Design System**: A custom, utility-first CSS framework establishing the "Silver Cloud Glass" design system, utilizing variable-weight Google Fonts (Inter and Outfit) and strict, professional design tokens.
- **Intelligence Layer**: OpenRouter acting as the gateway for Anthropic's Claude 3.7 Sonnet model.
- **External Data Providers**: Adzuna Jobs API and OpenStreetMap.

---

## Application Workflow

1. **Candidate Onboarding**: The user uploads their PDF resume into the secure dropzone.
2. **Profile Generation**: The system processes the document and populates the dashboard with categorized skill matrices and financial planning tools.
3. **Market Discovery**: The user browses the skill-matched job feed, utilizing dynamic dropdowns to filter by specific technologies or geographic regions.
4. **Relocation Planning**: The user explores the Housing Discovery module to evaluate local living costs and accommodation availability near their target roles.

---
*LifeBoat.ai — Engineered with precision for the modern technical candidate.*
