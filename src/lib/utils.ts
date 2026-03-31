/**
 * Calculates the recommended age based on the product size and the overall size range.
 * 
 * Rules:
 * 1. If the size range starts below 140:
 *    - 90  -> 4세
 *    - 100 -> 4세
 *    - 110 -> 4-5세
 *    - 120 -> 5-6세
 *    - 130 -> 6-7세
 *    - 140 -> 7-8세
 * 2. If the size range starts at 140 or above:
 *    - 140 -> 10-11세
 *    - 150 -> 11-12세
 *    - 160 -> 12-13세
 *    - 170 -> 13-14세
 */
export function calculateAge(sizeStr: string, sizeRangeStr: string): string {
    const size = parseInt(sizeStr);
    if (isNaN(size)) return "";

    const rangeParts = (sizeRangeStr || "").split("-");
    const firstSizeInRange = parseInt(rangeParts[0]);

    if (!isNaN(firstSizeInRange) && firstSizeInRange >= 140) {
        // Rule B (High size range)
        if (size >= 170) return "13-14세";
        if (size >= 160) return "12-13세";
        if (size >= 150) return "11-12세";
        return "10-11세"; // Default for 140 and below in this range
    } else {
        // Rule A (Low/Normal size range)
        if (size >= 140) return "7-8세";
        if (size >= 130) return "6-7세";
        if (size >= 120) return "5-6세";
        if (size >= 110) return "4-5세";
        return "4세"; // Default for 90, 100 and below
    }
}
