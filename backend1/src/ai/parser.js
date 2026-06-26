export function parsePlannerResponse(text) {
    if (!text) {
        throw new Error("Empty planner response.");
    }
    // Remove markdown if Gemini adds it
    const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    try {
        const parsed = JSON.parse(cleaned);
        if (!parsed.action) {
            throw new Error("Planner response missing action.");
        }
        return parsed;
    } catch (err) {
        throw new Error("Invalid planner JSON.");
    }
}