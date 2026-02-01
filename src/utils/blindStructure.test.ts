import { describe, it, expect } from 'vitest';
import { calculateCurrentBlind, getBlindLevelAtTime } from './blindStructure';
import { StructureItem } from '@/types/tournament';

describe('blindStructure Utils', () => {
    const mockStructure: StructureItem[] = [
        { sb: 100, bb: 200, duration: 20, isBreak: false },
        { sb: 200, bb: 400, duration: 20, isBreak: false },
        { sb: 0, bb: 0, duration: 10, isBreak: true, label: 'Break' },
        { sb: 300, bb: 600, duration: 20, isBreak: false },
    ];
    const startTime = new Date('2024-01-01T10:00:00');

    it('returns first level before start time', () => {
        const time = new Date('2024-01-01T09:59:00');
        const level = calculateCurrentBlind(startTime, mockStructure, time);
        expect(level).toEqual(expect.objectContaining({ sb: 100, bb: 200 }));
    });

    it('returns first level during first level duration', () => {
        const time = new Date('2024-01-01T10:10:00'); // 10 mins in
        const level = calculateCurrentBlind(startTime, mockStructure, time);
        expect(level).toEqual(expect.objectContaining({ sb: 100, bb: 200 }));
    });

    it('returns second level during second level duration', () => {
        const time = new Date('2024-01-01T10:30:00'); // 30 mins in (20 + 10)
        const level = calculateCurrentBlind(startTime, mockStructure, time);
        expect(level).toEqual(expect.objectContaining({ sb: 200, bb: 400 }));
    });

    it('returns NEXT level during break', () => {
        const time = new Date('2024-01-01T10:45:00'); // 45 mins in (20+20+5) - Break
        const level = calculateCurrentBlind(startTime, mockStructure, time);
        // Expect next level (Level 3)
        expect(level).toEqual(expect.objectContaining({ sb: 300, bb: 600 }));
    });

    it('returns last level if time exceeds total duration', () => {
        const time = new Date('2024-01-01T12:00:00'); // Way after
        const level = calculateCurrentBlind(startTime, mockStructure, time);
        expect(level).toEqual(expect.objectContaining({ sb: 300, bb: 600 }));
    });

    it('returns default 100/200 if structure is empty', () => {
        const level = calculateCurrentBlind(startTime, [], new Date());
        expect(level).toEqual(expect.objectContaining({ sb: 100, bb: 200 }));
    });
});
