import { Action } from '@/types/hand';

export const analyzeGameTags = (actions: Action[]): string[] => {
    const tags: string[] = [];

    const preflopActions = actions.filter(a => a.phase === 'Preflop');
    const flopActions = actions.filter(a => a.phase === 'Flop');

    // Pot Size Logic
    let raiseCount = 0;
    let lastAggressor: 'Hero' | 'Villain' | null = null;

    preflopActions.forEach(a => {
        if (['Bet', 'Raise', 'All-in'].includes(a.type)) {
            raiseCount++;
            lastAggressor = a.isHero ? 'Hero' : 'Villain';
        }
    });

    if (raiseCount === 1) {
        tags.push('Single Raised Pot');
    } else if (raiseCount === 2) {
        tags.push('3Bet Pot');
    } else if (raiseCount >= 3) {
        tags.push('4Bet Pot');
    }

    // Aggression Logic (Flop)
    if (flopActions.length > 0) {


        // C-Bet: Preflop Aggressor was Hero, Hero Bets Fop
        // Note: Check-Raise is NOT a C-Bet usually, but a C-Bet opportunity checked.
        if (lastAggressor === 'Hero') {
            // Find Hero's first action on Flop
            const heroFirstFlopAction = flopActions.find(a => a.isHero);
            if (heroFirstFlopAction && ['Bet', 'All-in'].includes(heroFirstFlopAction.type)) {
                // Ensure no one bet before hero?
                // If Hero is OOP, they act. If IP, they act after check.
                // C-Bet is generally the *opening* bet of the street by the preflop aggressor.
                // So verify that previous actions on flop were checks.
                const actionsBeforeHero = flopActions.slice(0, flopActions.indexOf(heroFirstFlopAction));
                const isLeaded = actionsBeforeHero.some(a => ['Bet', 'Raise', 'All-in'].includes(a.type));

                if (!isLeaded) {
                    tags.push('C-Bet');
                }
            }
        }

        // Donk Bet: Preflop Aggressor was Villain, Hero Bets into them (Hero leads)
        if (lastAggressor === 'Villain') {
            const heroFirstFlopAction = flopActions.find(a => a.isHero);
            if (heroFirstFlopAction && ['Bet', 'All-in'].includes(heroFirstFlopAction.type)) {
                // Must be the OPENING bet of the street.
                const actionsBeforeHero = flopActions.slice(0, flopActions.indexOf(heroFirstFlopAction));
                const isLeaded = actionsBeforeHero.some(a => ['Bet', 'Raise', 'All-in'].includes(a.type));

                if (!isLeaded) {
                    tags.push('Donk Bet');
                }
            }
        }

        // Check-Raise
        // Hero Checks, Then Villain Bets, Then Hero Raises
        // Sequence: Check (Hero) -> ... -> Bet (Villain) -> ... -> Raise (Hero)

        // Iterate actions to find pattern
        let heroChecked = false;
        let villainBetAfterCheck = false;

        for (const action of flopActions) {
            if (action.isHero && action.type === 'Check') {
                heroChecked = true;
            } else if (!action.isHero && ['Bet', 'Raise', 'All-in'].includes(action.type) && heroChecked) {
                villainBetAfterCheck = true;
            } else if (action.isHero && ['Raise', 'All-in'].includes(action.type) && villainBetAfterCheck) {
                tags.push('Check-Raise');
                break;
            }
        }
    }

    return tags;
};
