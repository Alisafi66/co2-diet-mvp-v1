export interface ReminderSettings {
    mealReminder: {
      enabled: boolean;
      time: string; // "HH:MM", 24-hour format
    };
    weightReminder: {
      enabled: boolean;
      time: string; // "HH:MM", 24-hour format
    };
    /** Tracks which reminders already fired today, to avoid repeat notifications */
    lastFiredDate: {
      meal: string | null; // "YYYY-MM-DD"
      weight: string | null;
    };
  }
  
  export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
    mealReminder: { enabled: false, time: "12:00" },
    weightReminder: { enabled: false, time: "08:00" },
    lastFiredDate: { meal: null, weight: null },
  };