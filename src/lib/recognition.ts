import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const outputSchema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      description:
        "The predicted category. Must be one of: 'pszok', 'small_electronics', 'electronics', 'expired_medications', or 'ERROR'.",
    },
    title: {
      type: Type.STRING,
      description: "A short, descriptive title for the item.",
    },
  },
  required: ["category", "title"],
};

export async function getCategoryPrediction(
  imageData: string,
  description?: string
) {
  const prompt = `Analyze the provided image data and description. 
  Identify the object. If it can be thrown out to one of the typical recycling categories
  such as "mixed", "plastic", "metal", "paper", "glass" return "ERROR" as the category and "Cannot identify item" as the title.
  If it doesn't assign it to one of these 4 waste categories:
  1. "pszok"
  2. "small_electronics"
  3. "electronics"
  4. "expired_medications"

  Definition for "pszok" (Selective Collection of Municipal Waste Point):
  PSZOK accepts the following types of municipal waste:
  - paper and cardboard packaging, glass, textiles;
  - packaging waste from metals and plastics (beverage cans, food items, PET bottles, edible oil packaging, etc.);
  - glass packaging (e.g., empty bottles, jars, glass cosmetic packaging);
  - packaging from motor oils, detergents, plant protection products;
  - pressurized aerosol containers;
  - used or expired fire extinguishers from cars and households;
  - tires from passenger cars, motorcycles, bicycles;
  - concrete waste, brick rubble, ceramics, tiles and terracotta, etc. from self-conducted renovations;
  - glass, e.g., window glass, door glass (colorless), mirrors;
  - clothing waste, textiles;
  - textile packaging (e.g., jute sacks);
  - solvents, acids, alkalis (corrosive substances);
  - photographic reagents;
  - plant protection products;
  - edible oils and fats;
  - used or expired motor oils;
  - paints, paint packaging, and packaging containing hazardous substances;
  - adhesives, packaging containing hazardous substances;
  - inks, toners for printers;
  - binders and resins containing hazardous substances;
  - detergents (in manufacturer's packaging);
  - wood containing hazardous substances;
  - wood (wooden crates, boards, etc.);
  - packaging containing residues of hazardous substances;
  - plastic waste (buckets, bowls, toys, crates, garden furniture, etc.);
  - metal waste (bicycle frames, wheels, hangers, device casings, handles, metal elements, etc.);
  - fluorescent lamps, energy-saving lamps, mercury thermometers;
  - refrigeration and air conditioning equipment (fridges, freezers, ACs);
  - used electrical and electronic equipment (radios, TVs, dishwashers, stoves, washing machines, vacuums, CD/DVD players);
  - accumulators, batteries;
  - expired medicines;
  - bulky waste;
  - biodegradable waste (grass, leaves);
  - medical waste from home treatment (needles, syringes).

  PSZOK does NOT accept:
  - unsorted mixed municipal waste;
  - materials containing asbestos;
  - roofing felt and construction polystyrene;
  - leaking or damaged packaging;
  - industrial/business waste.

  Note: If an item fits "small_electronics", "electronics", or "expired_medications" specifically, prefer those categories over "pszok". Use "pszok" for the other items listed above (e.g. furniture, chemicals, construction waste, tires, etc.).

  If the object is identified, return the matching category and a concise title.
  If the object cannot be identified or doesn't fit these categories, return "ERROR" as the category and "Cannot identify item" as the title.
  
  Description: ${description || "N/A"}`;

  // For the actual image data, you would typically pass a Part object
  // For simplicity, we'll keep the example focused on the prompt and schema
  const contents = [
    {
      role: "user",
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData.replace(/^data:image\/\w+;base64,/, ""),
          },
        },
      ],
    },
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents, 
      config: {
        responseMimeType: "application/json",
        responseSchema: outputSchema, 
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text response generated");
    }
    const jsonString = text.trim();
    const structuredData = JSON.parse(jsonString);

    return structuredData;

  } catch (error) {
    console.error("Error generating structured content:", error);
    return null;
  }
}