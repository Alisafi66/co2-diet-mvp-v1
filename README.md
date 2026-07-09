# CO2 Diet Mobile App Prototype

Proof of concept for a privacy-first, offline-capable mobile application built with Next.js and Tailwind CSS.

The purpose of this project is to provide a functional UI layer and interactive data pipeline for upcoming user interviews and stakeholder validation. The system evaluates a localized state architecture: tracking carbon footprints (CO2), caloric budgets, and macronutrients directly inside the client browser without external database requirements.

The proof of concept focuses on:

- Frictionless onboarding flows
- Privacy-first biometric metrics (excluding gender)
- Immutable local browser storage synchronization
- Real-time dashboard updates reflecting carbon emissions, protein, and calories
- Rapid meal logging via a search-and-add interface

## Project Status

This is an architectural proof of concept, not a production infrastructure.

It currently demonstrates:

- A public welcome page
- A multi-step onboarding sequence capturing core tracking objectives
- An interactive dashboard
- A granular meal logging interface with categorized time slots
- A shared global React context tied directly to `localStorage`

## Intended Architecture

The architecture maintains an entirely client-side, offline-first execution model to protect user data privacy while keeping system responses instantaneous.

Possible future architecture:

```text
Frontend (Next.js App Router)
   |
   | State Synchronization
   v
React Context Engine (MealLogsProvider)
   |
   | Client-Side Storage
   v
Browser localStorage
```

The central question this POC helps answer is:

> Does client-side local caching completely support a user-facing tracking profile, or must an external, credentialed database layer be introduced immediately?

## Data Models

The project currently distinguishes between two primary state models.

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
| `dailyCalorieTarget` | Generated via a gender-neutral BMR calculation |

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

## Pages

### Welcome Page
**URL:** `/`

The initial landing interface directing users to the onboarding sequence.

### Onboarding
**URL:** `/onboarding`

A two-step flow capturing goals and biometrics. Calculates the user's BMR dynamically and initializes the `rcn_user_profile` in local storage before redirecting to the dashboard.

### Dashboard
**URL:** `/dashboard`

Reads global state to render real-time tracking modules for carbon footprint (kg CO2e), caloric intake, and protein consumption against the calculated daily targets.

### Log Meal
**URL:** `/log`

A dedicated search interface featuring:

- Category toggles (Breakfast, Lunch, Dinner, Snack)
- Live match filters tracking baseline carbon scores
- Expandable quantity adjusters parsing multiple units

## Local Setup

The project can be run from the command line or an IDE. The example below uses VS Code, but the same process applies to other IDEs.

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

The following URLs are now available:

* **Welcome:** `https://dite-app-prototype.vercel.app/`
* **Onboarding:** `https://dite-app-prototype.vercel.app/onboarding`
* **Dashboard:** `https://dite-app-prototype.vercel.app/dashboard`
* **Log Meal:** `https://dite-app-prototype.vercel.app/log`

### 6. Stop the development server

To stop the Next.js development server, return to the terminal and press `Ctrl + C`.

## Current Limitations

This is not production-ready. Known limitations:

- Measurement units in legacy components may display placeholder flags (e.g., `mm`).
- All data entry is strictly manual; there is currently no barcode scanning or historical template logging.
- Local storage limits restrict long-term historical data retention.
- Seed data relies on a static, mock JSON dictionary rather than a live nutritional API.

## Possible Next Steps

Useful follow-up work evaluating open-source AI automation:

- **Computer Vision Model Execution** — Integrate free, lightweight on-device vision models allowing users to upload a meal photo for automatic bounding-box ingredient identification and carbon index lookups.
- **Audio NLP Transcription Engine** — Implement speech-to-text models processing natural voice descriptions to extract item names and weight metrics directly into the active tracking context.
- **Database Synchronization** — Evaluate syncing local state to a cloud database once a user chooses to create a persistent account.
