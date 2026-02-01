import { StructureItem } from '@/types/tournament';

export const calculateCurrentBlind = (startTime: Date, structure: StructureItem[], currentTime: Date): StructureItem => {
    if (!structure || structure.length === 0) {
        return { sb: 100, bb: 200, duration: 0 };
    }

    const elapsedMs = currentTime.getTime() - startTime.getTime();
    const elapsedMinutes = elapsedMs / (1000 * 60);

    if (elapsedMinutes <= 0) {
        // Return first non-break item or first item
        return structure[0];
    }

    let accumulatedMinutes = 0;

    for (let i = 0; i < structure.length; i++) {
        const item = structure[i];
        accumulatedMinutes += item.duration;

        if (elapsedMinutes < accumulatedMinutes) {
            if (item.isBreak) {
                // If currently in a break, return the NEXT active level
                // If it's the last item, return it (game paused/break until end?) logic check:
                // Test requirement says "returns NEXT level during break"
                const nextIndex = i + 1;
                if (nextIndex < structure.length) {
                    return structure[nextIndex];
                }
                // Fallback if break is last item (unlikely for structure but possible)
                return item;
            }
            return item;
        }
    }

    // If time exceeds total duration, return last item
    return structure[structure.length - 1];
};

export const getBlindLevelAtTime = () => { };
