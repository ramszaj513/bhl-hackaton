import "dotenv/config";
import { db } from "./index";
import { WasteDeliveryPoint, wasteCategory, OpeningHours } from "./schema";
import proj4 from "proj4";

// Define the projection for EPSG:2178 (Warsaw area)
// Source: https://epsg.io/2178
const EPSG_2178 = "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs";
const WGS84 = "EPSG:4326";

const BASE_URL = "https://testmapa.um.warszawa.pl/mapviewer/dataserver/DANE_WAWA";
const QUERY_PARAMS = "&bbox=7436182.666666665%2C5725277.733333332%2C7548484.533333331%2C5848687.866666665&include_label_box=true&to_srid=2178&bbox_srid=2178&ssid=112_883293711573272583%0A&refresh=21310";

const wasteCategoryNameMap: Record<string, string[]> = {
    "pszok": ["EKOPUNKTY_PSZOK_N", "EKOPUNKTY_MPSZOK_N"],
    "expired_medications": ["EKOPUNKTY_OPL_N"],
    "electronics": ["EKOPUNKY_MPE_N", "EKOPUNKTY_MPZE_N"],
    "small_electronics": ["EKOPUNKTY_PME_N"]
}

interface Feature {
    type: string;
    _id: string;
    geometry: {
        type: string;
        coordinates: [number, number];
    };
    properties: {
        NAZWA_SERWIS: string;
        _label_: string;
        [key: string]: any;
    };
}

interface FeatureCollection {
    type: string;
    features: Feature[];
}

function parseOpeningHours(label: string): OpeningHours | null {
    const openingHoursMatch = label.match(/Dzień i godzina odbioru: (.*?)(?:\n|$)/);
    if (!openingHoursMatch) return null;

    const rawHours = openingHoursMatch[1].trim();
    const result: OpeningHours = {};

    if (rawHours.toLowerCase().includes("całodobowo")) {
        const allDays: (keyof OpeningHours)[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        for (const day of allDays) {
            result[day] = ["00:00", "24:00"];
        }
        return result;
    }

    // Example: "poniedziałek - piatek 7:00 - 20:00; sobota 9:00 - 17:00"
    const parts = rawHours.split(';');

    const dayMap: Record<string, keyof OpeningHours> = {
        'poniedziałek': 'Monday',
        'wtorek': 'Tuesday',
        'środa': 'Wednesday',
        'czwartek': 'Thursday',
        'piątek': 'Friday',
        'piatek': 'Friday', // Handle typo in source data
        'sobota': 'Saturday',
        'niedziela': 'Sunday'
    };

    const daysOrder: (keyof OpeningHours)[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (const part of parts) {
        // Split into days part and hours part
        // Look for the last occurrence of a digit to separate time from days?
        // Or regex: (days range) (hours range)

        // "poniedziałek - piatek 7:00 - 20:00"
        const timeMatch = part.match(/(\d{1,2}[:.]\d{2})\s*-\s*(\d{1,2}[:.]\d{2})/);
        if (!timeMatch) continue;

        const start = timeMatch[1].replace(/\./g, ':');
        const end = timeMatch[2].replace(/\./g, ':');
        const timeRange: [string, string] = [start, end];

        const daysPart = part.substring(0, timeMatch.index).trim();

        if (daysPart.includes('-')) {
            const [startDayRaw, endDayRaw] = daysPart.split('-').map(d => d.trim().toLowerCase());
            const startDay = dayMap[startDayRaw];
            const endDay = dayMap[endDayRaw];

            if (startDay && endDay) {
                let startIndex = daysOrder.indexOf(startDay);
                let endIndex = daysOrder.indexOf(endDay);

                if (startIndex !== -1 && endIndex !== -1) {
                    for (let i = startIndex; i <= endIndex; i++) {
                        result[daysOrder[i]] = timeRange;
                    }
                }
            }
        } else {
            const dayRaw = daysPart.trim().toLowerCase();
            const day = dayMap[dayRaw];
            if (day) {
                result[day] = timeRange;
            }
        }
    }

    return Object.keys(result).length > 0 ? result : null;
}

async function seed() {
    console.log("🌱 Starting seeding...");

    try {
        // 1. Clear existing data
        console.log("Cleaning up existing data...");
        await db.delete(WasteDeliveryPoint);

        // 2. Iterate over categories and layers
        for (const [category, layers] of Object.entries(wasteCategoryNameMap)) {
            console.log(`Processing category: ${category}`);

            for (const layer of layers) {
                console.log(`  Fetching layer: ${layer}...`);
                const url = `${BASE_URL}?t=${layer}${QUERY_PARAMS}`;

                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        console.error(`  ❌ Failed to fetch layer ${layer}: ${response.statusText}`);
                        continue;
                    }
                    const data: FeatureCollection = await response.json();
                    console.log(`  Found ${data.features.length} features.`);

                    const values = data.features.map((feature) => {
                        // Convert coordinates from EPSG:2178 to WGS84
                        const [x, y] = feature.geometry.coordinates;
                        const [lon, lat] = proj4(EPSG_2178, WGS84, [x, y]);

                        const openingHours = parseOpeningHours(feature.properties._label_);

                        return {
                            id: feature._id, // Use the API's ID
                            lat: lat.toString(), // Store as string for decimal type
                            lon: lon.toString(),
                            description: feature.properties._label_,
                            openingHours: openingHours,
                            category: category as any, // Type assertion to match enum
                        };
                    });

                    if (values.length > 0) {
                        await db.insert(WasteDeliveryPoint).values(values).onConflictDoNothing();
                        console.log(`  ✅ Inserted ${values.length} records.`);
                    } else {
                        console.log("  No data to insert.");
                    }

                } catch (err) {
                    console.error(`  ❌ Error processing layer ${layer}:`, err);
                }
            }
        }

        console.log("✅ Seeding completed successfully!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

seed();
