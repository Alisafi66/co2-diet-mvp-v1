# CO2 Diet Mobile App Prototype

Proof of concept for a privacy-first, offline-capable mobile application built as a Next.js web app.

The purpose of this project is to provide a functional UI and interactive prototype for upcoming user interviews and stakeholder demos. It tests the core user flow: frictionless onboarding, privacy-centric local data storage, and the daily tracking of CO2 emissions alongside nutritional metrics.

## Data Science Foundation

The architecture and dashboard metrics of this application are grounded in initial data exploration and visualization tasks to structure the CO2 and nutritional datasets.
* [Exploratory Data Analysis - Part 1](https://colab.research.google.com/drive/1gdssqteQysfps-F_uAgw1N9R9B1GBxV6?usp=sharing)
* [Data Visualization & Structuring - Part 2](#) *(Update with your second Colab link)*

## Project Status

This is an architectural UI proof of concept, not a production application. 
It currently demonstrates:
* Privacy-first onboarding (baseline metrics without gender collection)
* Offline-first data storage utilizing browser Local Storage
* Interactive daily dashboard tracking CO2, calories, and protein
* Manual meal entry logging

## Known Limitations & Active Development

* **Measurement Units:** The logging interface currently displays default test units (`mm`). This is actively being mapped to proper measurements (`g`, `kcal`, `kg CO2e`).
* **Manual Entry Friction:** All data is currently keyed in manually. We are transitioning this to a 1-click logging system for common meals.
* **Calculation Engine:** The precise mathematical formulas for deriving CO2/protein/calorie ratios are being finalized in the PRD and will be injected into the application state shortly.

## Future AI Integration Roadmap

To eliminate the friction of manual tracking, we are evaluating open-source AI models for future integration:
1. **Computer Vision (Photo Scanning):** Allowing users to photograph a meal, enabling the AI to detect the food items and automatically estimate nutritional and CO2 values.
2. **NLP (Voice Logging):** Allowing users to dictate meals via audio notes for automatic parsing and system assessment.

## Local Setup

1. Clone the repository
git clone https://github.com/ReduceCO2Now-com/CO2-Diet-Mobile-App.git
cd CO2-Diet-Mobile-App

2. Install dependencies
npm install

3. Run the development server
npm run dev

4. View the application
Open http://localhost:3000 in your browser.
