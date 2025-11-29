import { db } from "@/src/db";
import { problem } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function getProblems() {
  try {
    const problems = await db.query.problem.findMany({
      with: {
        statement: true,
        tags: {
          with: {
            tag: true,
          },
        },
        aopsMetadata: true,
      },
    });
    return problems;
  } catch (error) {
    console.error("Error fetching problems:", error);
    throw new Error("Failed to fetch problems");
  }
}

export async function getProblemById(id: string) {
  try {
    const result = await db.query.problem.findFirst({
      where: eq(problem.id, id),
      with: {
        statement: true,
        tags: {
          with: {
            tag: true,
          },
        },
        aopsMetadata: true,
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching problem:", error);
    throw new Error("Failed to fetch problem");
  }
}
