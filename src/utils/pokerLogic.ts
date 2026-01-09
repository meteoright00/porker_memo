
export const POSITIONS_2MAX = ['SB', 'BB'];
export const POSITIONS_6MAX = ['SB', 'BB', 'UTG', 'MP', 'CO', 'BTN'];
export const POSITIONS_9MAX = ['SB', 'BB', 'UTG', 'EP', 'MP', 'LJ', 'HJ', 'CO', 'BTN'];
export const POSITIONS_10MAX = ['SB', 'BB', 'UTG', 'UTG+1', 'EP', 'MP', 'LJ', 'HJ', 'CO', 'BTN'];

// Standard order for 6-max: SB -> BB -> UTG -> MP -> CO -> BTN
// Preflop Action Order: UTG -> MP -> CO -> BTN -> SB -> BB

export const getPositionsForCount = (count: number): string[] => {
    if (count <= 2) return POSITIONS_2MAX;
    if (count <= 6) return POSITIONS_6MAX;
    if (count <= 9) return POSITIONS_9MAX;
    return POSITIONS_10MAX;
};

export const getNextActor = (
    currentActionPosition: string,
    phase: 'Preflop' | 'Flop' | 'Turn' | 'River',
    foldedPositions: string[],
    playerCount: number = 6
): string | null => {
    const allPositions = getPositionsForCount(playerCount);

    // Determine the base order based on phase
    let order = [...allPositions];
    if (phase === 'Preflop') {
        // Shift UTG to front: [UTG, MP, ..., BTN, SB, BB]
        // 0: SB, 1: BB, 2: UTG
        const blinds = order.slice(0, 2);
        const others = order.slice(2);
        order = [...others, ...blinds];
    } else {
        // Postflop: SB starts. Order is standard.
    }

    // Find current index
    const currentIndex = order.indexOf(currentActionPosition);
    if (currentIndex === -1) return null; // Logic error or non-standard pos

    // Find next non-folded player
    let nextIndex = (currentIndex + 1) % order.length;
    let attempts = 0;

    while (attempts < order.length) {
        const nextPos = order[nextIndex];
        if (!foldedPositions.includes(nextPos)) {
            return nextPos;
        }
        nextIndex = (nextIndex + 1) % order.length;
        attempts++;
    }

    return null; // Should not happen in valid game state
};

// Initial actor for a phase
export const getInitialActor = (
    phase: 'Preflop' | 'Flop' | 'Turn' | 'River',
    foldedPositions: string[],
    playerCount: number = 6
): string | null => {
    const allPositions = getPositionsForCount(playerCount);

    let order = [...allPositions];
    if (phase === 'Preflop') {
        const blinds = order.slice(0, 2);
        const others = order.slice(2);
        order = [...others, ...blinds];
    }

    // Return first non-folded player
    for (const pos of order) {
        if (!foldedPositions.includes(pos)) {
            return pos;
        }
    }
    return null;
};

// Check if hand has ended (Hero folded or active villains folded)
// Check if hand has ended (Hero folded or active villains folded)
export const checkHandEnded = (
    actions: { position?: string | null; type: string; isHero: boolean; }[],
    playerCount: number
): boolean => {
    // 1. Hero Folded?
    const heroFolded = actions.some(a => a.isHero && a.type === 'Fold');
    if (heroFolded) return true;

    // 2. Everyone else folded?
    // Count distinct villains who have folded
    const foldedVillains = new Set(
        actions
            .filter(a => !a.isHero && a.type === 'Fold' && a.position)
            .map(a => a.position!)
    );

    // If total players - 1 (Hero) have folded, hand is over.
    return foldedVillains.size === (playerCount - 1);
};
