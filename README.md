# CO2 Diet Mobile App Prototype

Proof of concept for a privacy-first, offline-capable mobile application built with Next.js and Tailwind CSS.

The purpose of this project is to provide a functional UI layer and interactive data pipeline for upcoming user interviews and stakeholder validation. The system evaluates a localized state architecture: tracking carbon footprints (CO2), caloric budgets, and macronutrients directly inside the client browser without external database requirements.

The proof of concept focuses on:

- Frictionless onboarding flows
- Privacy-first biometric metrics (excluding gender)
- Immutable local browser storage synchronization
- Real-time dashboard updates reflecting carbon emissions, protein, and calories
- Rapid meal logging via a search-and-add interface

## Data Science Foundation

The architecture and dashboard metrics of this application are grounded in initial data exploration and visualization tasks used to structure the CO2 and nutritional datasets.

* [Exploratory Data Analysis - Part 1](https://colab.research.google.com/drive/1gdssqteQysfps-F_uAgw1N9R9B1GBxV6?usp=sharing)
* [Data Visualization & Structuring - Part 2](https://colab.research.google.com/drive/1P7JG6HJ7v5JJJ80hnXowkfymsHPWumH6?hl=en-GB#scrollTo=HmVnZBCW41h9)

## Project Status

The proof of concept phase is complete, and the project has since progressed into a functioning MVP v1 build. All core tracking, logging, and retention features described below have been implemented and verified across a recent development session.

The application currently demonstrates:

- A public welcome page
- A multi-step onboarding sequence capturing core tracking objectives
- An interactive dashboard
- A granular meal logging interface with categorized time slots
- Live external food search through Open Food Facts
- Barcode scanning with verified fallback behavior
- Weight tracking with a dashboard trend graph
- Local reminder notifications
- Favorites and recent foods for one-click logging
- A shared global React context tied directly to `localStorage`

A full requirement-by-requirement status summary is included later in this document under MVP v1 Verification Summary.

## Intended Architecture

The architecture maintains an entirely client-side, offline-first execution model to protect user data privacy while keeping system responses instantaneous.

Current architecture:

```text
Frontend (Next.js App Router)
   |
   | State Synchronization and External API Parsing (Open Food Facts)
   v
React Context Engine (MealLogsProvider / WeightLogsProvider)
   |
   | Client-Side Storage
   v
Browser localStorage
```

The central question this POC set out to answer was:

> Does client-side local caching completely support a user-facing tracking profile, or must an external, credentialed database layer be introduced immediately?

Based on the current implementation, local caching has proven sufficient to support the full MVP v1 feature set, with the exception of persistent account creation, which remains intentionally deferred.

## Data Models

The project currently distinguishes between the following state models.

### User Profile

Represents the user's baseline metrics and tracking goals.

**Storage Key:** `rcn_user_profile`

**Fields:**

| Field | Description |
|---|---|
| `objective` | e.g., Lose Weight, Maintain Weight, Build Muscle |
| `age` | User's age |
| `weightKg` | User's weight in kilograms |
| `heightCm` | User's height in centimeters |
| `activityLevel` | Sedentary, Light, Moderate, Active, or Very Active |
| `dailyCalorieTarget` | Generated via a gender-neutral BMR calculation |
| `dailyCo2BudgetKg` | Calculated carbon threshold based on caloric needs |
| `dailyProteinTargetG` | Macronutrient target based on weight and goal |

> **Note:** In adherence to strict privacy principles, gender is explicitly excluded from this model.

### Meal Log

Represents an individual food entry.

**Storage Key:** `rcn_meal_logs`

**Fields:**

| Field | Description |
|---|---|
| `id` | Unique identifier |
| `foodId` | Reference to the food item |
| `name` | Food name |
| `mealType` | Breakfast, Lunch, Dinner, or Snack |
| `quantity` | Amount logged |
| `unit` | g, ml, cups, or portions |
| `quantityGrams` | Normalized quantity in grams |
| `co2Impact` | Carbon footprint impact |
| `calories` | Caloric value |
| `protein` | Protein value |
| `loggedAt` | Timestamp of the log entry |

### Additional Storage Keys

| Key | Description |
|---|---|
| `rcn_weight_logs` | Chronological weight data points used to render the dashboard trend graph |
| `rcn_favorite_foods` | Items manually marked by the user for rapid access |
| `rcn_custom_foods` | Offline list of manually estimated items created by the user |
| `rcn_reminders` | Local configuration toggles and timestamps for notification nudges |

## Pages

### [Welcome Page](https://co2-diet-mvp-v1.vercel.app/)

The initial landing interface directing users to the onboarding sequence.

### [Onboarding](https://co2-diet-mvp-v1.vercel.app/onboarding)

A two-step flow capturing goals and biometrics. Calculates the user's BMR dynamically and initializes the `rcn_user_profile` in local storage before redirecting to the dashboard.

### [Dashboard](https://co2-diet-mvp-v1.vercel.app/dashboard)

Reads global state to render real-time tracking modules for carbon footprint (kg CO2e), caloric intake, and protein consumption against the calculated daily targets. Includes a settings modal, tied to requirement FR-012, allowing baseline metrics to be adjusted dynamically.

### Log Meal

A dedicated search interface featuring:

- Category toggles (Breakfast, Lunch, Dinner, Snack)
- Live search against the Open Food Facts database
- One-click logging from Favorites and Recent items
- Custom food entry with category-based footprint estimation
- Native barcode scanning with graceful fallback to manual search
- Expandable quantity adjusters parsing multiple units

## Local Setup

The project can be run from the command line or an IDE. The example below uses VS Code, but the same process applies to other IDEs. The steps are listed in order and should be followed sequentially.

### 1. Clone the repository

```bash
git clone https://github.com/ReduceCO2Now-com/dite-app-prototype.git
cd dite-app-prototype
```

### 2. Open the project in VS Code

Choose **File → Open Folder** and select the repository folder.

### 3. Open the integrated terminal

In VS Code, open **Terminal → New Terminal**. Check that the terminal is in the same folder as `package.json`.

### 4. Install dependencies

```bash
npm install
```

### 5. Start the development server

Run:

```bash
npm run dev
```

Then open `https://dite-app-prototype.vercel.app/` with your browser to see the result.

### 6. Stop the development server

To stop the Next.js development server, return to the terminal and press `Ctrl + C`.

## MVP v1 Verification Summary

The table below reflects the current status of each requirement following the most recent verification session.

| # | Requirement | Status |
|---|---|---|
| 1 | Account generation / local mode | Partial, deferred by design and acceptable per the PRD |
| 2 | Calorie, protein, fat, and carb tracking | Done |
| 3 | Offline food database | Done |
| 4 | Open Food Facts access | Done |
| 5 | Barcode scanning | Done, graceful fallback confirmed, real-device decode test pending |
| 6 | Dashboard | Done |
| 7 | Weight tracking | Done |
| 8 | Reminders | Done |
| 9 | Favorites and recent foods | Done |
| 10 | CO2 calculation | Done |
| 11 | English only | Done |

Ten of eleven requirements are fully complete. The only remaining item is the full account and authentication system, which stays deferred in accordance with the PRD's local-mode-first priority rather than representing a gap in execution.

## Barcode Scanning Verification: Step by Step

The following steps document how the barcode scanning fallback behavior was tested and confirmed to be working as intended on a desktop environment without a webcam.

1. The scanner modal was opened from the Log Meal interface.
2. The application called the browser's `getUserMedia()` API to request camera access.
3. Since the test machine has no available webcam, the camera request failed as expected.
4. The application's `try/catch` handling caught this failure correctly and displayed a clean fallback message instead of crashing or freezing.
5. A Cancel button remained available throughout, ensuring the user was never left stuck in the scanner view.
6. The user was able to exit the fallback state and switch seamlessly to manual search.

This sequence confirms that the barcode scanning feature is properly built and that the no-camera scenario is handled gracefully, exactly as intended. It also confirms that this behavior is expected on a desktop machine without a camera, and is not a bug.

To complete a full end-to-end test of actual scanning and decoding, the next step is to run the application on a mobile phone connected to the same WiFi network, accessed at the local machine's IP address on the relevant port, for example `http://<your-local-IP>:3000`. This step is not urgent, but it is recommended before considering barcode scanning fully verified end to end.

## Current Limitations

This is not yet production-ready. Known limitations:

- Real-device barcode decoding has not yet been tested; only the fallback behavior has been verified so far.
- Full account creation and authentication remain deferred in favor of local-mode-first usage, consistent with the PRD.
- Browser local storage limits, typically around five megabytes, restrict long-term historical data retention.
- As a strictly local-first application, data does not sync between a user's mobile phone and their desktop browser.
- Measurement units in legacy or custom components may occasionally display placeholder flags, such as `mm`, if unit parsing fails.

## Possible Next Steps

Useful follow-up work evaluating open-source AI automation and backend infrastructure:

- **Real-Device Barcode Testing** — Complete an end-to-end scan and decode test on a mobile device to fully verify the barcode scanning feature.
- **Computer Vision Model Execution** — Integrate free, lightweight on-device vision models allowing users to upload a meal photo for automatic bounding-box ingredient identification and carbon index lookups.
- **Audio NLP Transcription Engine** — Implement speech-to-text models processing natural voice descriptions to extract item names and weight metrics directly into the active tracking context.
- **Opt-In Cloud Synchronization** — Evaluate syncing local offline state to a secure, encrypted cloud database once a user actively chooses to create a persistent, cross-device account.

## From Prototype to Production: User Research and Mobile Build Plan

The current MVP v1 prototype is intended to serve a second purpose beyond internal verification. It is planned to be used as a walking prototype for direct user interviews, allowing real feedback to be gathered on the onboarding flow, the dashboard, the meal logging experience, and the overall value proposition of the app.

### User Research Phase

Feedback gathered from these interviews will be documented systematically, covering usability issues, feature gaps, points of confusion, and any requested changes. This documentation will then be used to inform a prioritized list of improvements and adjustments to be made before development begins on the production mobile application.

### Production Build Plan

Once the research phase is complete and the necessary changes have been identified, the production mobile application will be built using the Get Shit Done framework, integrated with Claude to support and accelerate development. The application will be built using Flutter, allowing a single codebase to target both major mobile platforms.

This approach is expected to result in two fully functional native applications:

- An iOS application, built using Swift and Dart through Flutter
- An Android application, built using Kotlin and Dart through Flutter

The end goal is a production ready, cross platform mobile application that reflects both the technical foundation validated in this prototype and the direct feedback gathered from real users during the research phase.
