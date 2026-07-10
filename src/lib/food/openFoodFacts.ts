import { Food, FoodCategory } from "@/types/food";

export async function searchOpenFoodFacts(query: string): Promise<Food[]> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        query
      )}&search_simple=1&action=process&json=1&page_size=15`
    );

    // Instead of throwing an error (which Next.js turns into a red screen), just return empty
    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (!data.products) return [];

    // Map the messy API data perfectly into your existing Food interface!
    const mappedFoods: Food[] = data.products
      .filter((p: any) => p.product_name) // Only keep items that actually have a name
      .map((p: any) => {
        return {
          id: p._id || p.code || Math.random().toString(),
          name: p.product_name,
          category: determineCategory(p.categories),
          defaultServingG: 100,
          co2PerKg: estimateCO2PerKg(p.ecoscore_score),
          caloriesPer100g: p.nutriments?.["energy-kcal_100g"] || 0,
          proteinPer100g: p.nutriments?.proteins_100g || 0,
          source: "Open Food Facts",
        };
      });

    return mappedFoods;
  } catch (error) {
    // We use console.log instead of console.error so Next.js stays quiet and lets the app run offline
    console.log("Open Food Facts API blocked or offline. Using local fallback.");
    return [];
  }
}

/**
 * Looks up a single product by barcode (EAN/UPC) using Open Food Facts'
 * dedicated product endpoint — more accurate than text search since it's
 * an exact match rather than a fuzzy query.
 */
export async function getProductByBarcode(barcode: string): Promise<Food | null> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`,
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.status !== 1 || !data.product?.product_name) {
      return null;
    }

    const p = data.product;

    return {
      id: p._id || p.code || barcode,
      name: p.product_name,
      category: determineCategory(p.categories),
      defaultServingG: 100,
      co2PerKg: estimateCO2PerKg(p.ecoscore_score),
      caloriesPer100g: p.nutriments?.["energy-kcal_100g"] || 0,
      proteinPer100g: p.nutriments?.proteins_100g || 0,
      source: "Open Food Facts",
    };
  } catch (error) {
    console.log("Open Food Facts barcode lookup blocked or offline.");
    return null;
  }
}

// Helper: Safely map API categories to your strict FoodCategory type
function determineCategory(apiCategories?: string): FoodCategory {
  if (!apiCategories) return "other";
  const lower = apiCategories.toLowerCase();
  if (lower.includes("milk") || lower.includes("cheese")) return "dairy";
  if (lower.includes("meat") || lower.includes("beef") || lower.includes("chicken")) return "meat";
  if (lower.includes("fish") || lower.includes("seafood")) return "seafood";
  if (lower.includes("drink") || lower.includes("beverage")) return "beverages";
  if (lower.includes("fruit") || lower.includes("vegetable")) return "produce";
  return "processed";
}

// Helper: Estimate kg CO2e per kg based on the Open Food Facts EcoScore (0-100)
function estimateCO2PerKg(ecoScore?: number): number {
  if (!ecoScore) return 2.5;
  return Number(((100 - ecoScore) * 0.05).toFixed(2));
}