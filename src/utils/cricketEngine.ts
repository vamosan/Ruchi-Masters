import { 
  Innings, 
  BallRecord, 
  BattingStats, 
  BowlingStats, 
  ExtraType, 
  WicketType,
  Match 
} from '../types/cricket';

/**
 * Converts legal balls (e.g. 19 balls) to cricket overs string (e.g. "3.1")
 */
export function ballsToOversStr(balls: number): string {
  const overs = Math.floor(balls / 6);
  const remaining = balls % 6;
  return `${overs}.${remaining}`;
}

/**
 * Converts cricket overs string (e.g. "3.1") to decimal overs for mathematics (e.g. 3 + 1/6 = 3.1667)
 */
export function oversStrToDecimal(oversStr: string): number {
  if (!oversStr) return 0;
  const parts = oversStr.split('.');
  const overs = parseInt(parts[0] || '0', 10);
  const balls = parseInt(parts[1] || '0', 10);
  return overs + (balls / 6);
}

/**
 * Calculate Run Rate: Runs / Decimal Overs
 */
export function calculateRunRate(runs: number, legalBalls: number): number {
  if (legalBalls === 0) return 0;
  const oversDec = legalBalls / 6;
  return Number((runs / oversDec).toFixed(2));
}

/**
 * Calculate Required Run Rate
 */
export function calculateRequiredRunRate(
  target: number, 
  currentRuns: number, 
  totalMaxOvers: number, 
  legalBallsBowled: number
): number {
  const runsNeeded = target - currentRuns;
  if (runsNeeded <= 0) return 0;
  
  const totalMaxBalls = totalMaxOvers * 6;
  const ballsRemaining = totalMaxBalls - legalBallsBowled;
  
  if (ballsRemaining <= 0) return 99.9;
  const oversRemainingDec = ballsRemaining / 6;
  return Number((runsNeeded / oversRemainingDec).toFixed(2));
}

/**
 * Generates exciting AI commentary for a ball
 */
export function generateCommentary(
  ballNumberStr: string,
  strikerName: string,
  bowlerName: string,
  runs: number,
  extraType: ExtraType,
  isWicket: boolean,
  wicketType?: WicketType,
  fielderName?: string
): string {
  const prefix = `${ballNumberStr} - ${bowlerName} to ${strikerName}, `;
  
  if (isWicket) {
    switch (wicketType) {
      case 'bowled':
        return `${prefix}CLEAN BOWLED! That's absolute timber! Stumps shattered as the batsman misses completely.`;
      case 'caught':
        return fielderName 
          ? `${prefix}OUT! Caught by ${fielderName}! Lofted in the air and taken cleanly in the deep!` 
          : `${prefix}OUT! Caught! The fielder makes no mistake!`;
      case 'lbw':
        return `${prefix}OUT! LBW! Trapped right in front of middle stump! Finger goes up immediately!`;
      case 'run_out':
        return fielderName 
          ? `${prefix}OUT! RUN OUT! Sensational direct hit from ${fielderName}! Batsman is short of his ground!` 
          : `${prefix}OUT! RUN OUT! Complete breakdown in communication!`;
      case 'stumped':
        return `${prefix}OUT! STUMPED! Lightning quick hands behind the stumps! Dragged his foot out and bails are off!`;
      case 'hit_wicket':
        return `${prefix}OUT! HIT WICKET! Stepped back too deep and clips the bails!`;
      default:
        return `${prefix}OUT! That's a huge wicket! The fielding side erupts in celebration!`;
    }
  }

  if (extraType === 'wide') {
    return `${prefix}Wide ball called! Slipped down the leg side, easy extra run added to the tally.`;
  }
  if (extraType === 'no_ball') {
    return `${prefix}NO BALL! Overstepping! ${runs > 0 ? `${runs} runs taken and ` : ''}FREE HIT signaled for the next delivery!`;
  }
  if (extraType === 'bye') {
    return `${prefix}${runs} Bye${runs > 1 ? 's' : ''}! Misses bat and keeper fumbles slightly.`;
  }
  if (extraType === 'leg_bye') {
    return `${prefix}${runs} Leg Bye${runs > 1 ? 's' : ''}! Struck on the pads and deflected into the gap.`;
  }

  if (runs === 6) {
    const lines = [
      `${prefix}SIX! MASSIVE! Launched high, handsome, and deep into the stands! What a sensational stroke!`,
      `${prefix}SIX! Dispatched with sheer power over long-on! That is out of the ground!`,
      `${prefix}SIX! Pure timing! Picked up effortlessly over deep mid-wicket!`
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  }
  if (runs === 4) {
    const lines = [
      `${prefix}FOUR! Glorious cover drive! Threaded through the gap and races away to the fence!`,
      `${prefix}FOUR! Pierces the backward point and third man region with pristine placement!`,
      `${prefix}FOUR! Pulled away with authority into the mid-wicket boundary!`
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  }
  if (runs === 3) return `${prefix}Three runs taken! Superb running between the wickets, turning two into three.`;
  if (runs === 2) return `${prefix}Two runs! Pushed gently into deep square leg, hustled back for a brace.`;
  if (runs === 1) return `${prefix}Single taken! Tucked into the gap on the on-side to rotate the strike.`;
  
  return `${prefix}No run. Solid defensive push back to the bowler, good tight length.`;
}

/**
 * Calculates win probability estimate (0 - 100%) for Team A (Batting / Chasing)
 */
export function calculateWinProbability(
  match: Match,
  oversPerInnings: number = 20
): { teamAName: string; teamBName: string; teamAPercent: number; teamBPercent: number } {
  if (match.status === 'completed') {
    const isWinnerA = match.winnerTeamId === match.teamAId;
    return {
      teamAName: 'Team A',
      teamBName: 'Team B',
      teamAPercent: isWinnerA ? 100 : 0,
      teamBPercent: isWinnerA ? 0 : 100
    };
  }

  if (!match.innings1 || match.status === 'scheduled' || match.status === 'toss') {
    return { teamAName: 'Team A', teamBName: 'Team B', teamAPercent: 50, teamBPercent: 50 };
  }

  if (match.currentInningsNumber === 1) {
    const runs = match.innings1.totalRuns;
    const wickets = match.innings1.totalWickets;
    const balls = match.innings1.legalBallsBowled;
    const maxBalls = oversPerInnings * 6;
    const crr = calculateRunRate(runs, balls);
    const parScore = oversPerInnings * 8.5; // ~170 in T20
    const projected = crr * oversPerInnings;
    
    // Inning 1 heuristic
    let batProb = 50 + (projected - parScore) * 0.35 - (wickets * 3.5);
    batProb = Math.max(15, Math.min(85, Math.round(batProb)));
    
    return {
      teamAName: 'Batting Team',
      teamBName: 'Bowling Team',
      teamAPercent: batProb,
      teamBPercent: 100 - batProb
    };
  }

  // 2nd Innings Chasing calculation
  if (match.innings2 && match.innings2.target) {
    const target = match.innings2.target;
    const runs = match.innings2.totalRuns;
    const wickets = match.innings2.totalWickets;
    const ballsBowled = match.innings2.legalBallsBowled;
    const ballsLeft = (oversPerInnings * 6) - ballsBowled;
    const runsNeeded = target - runs;

    if (runsNeeded <= 0) {
      return { teamAName: 'Chasing Team', teamBName: 'Defending Team', teamAPercent: 100, teamBPercent: 0 };
    }
    if (wickets >= 10 || ballsLeft <= 0) {
      return { teamAName: 'Chasing Team', teamBName: 'Defending Team', teamAPercent: 0, teamBPercent: 100 };
    }

    const rrr = (runsNeeded / (ballsLeft / 6));
    const wicketsInHand = 10 - wickets;

    let chaseProb = 50;
    // RRR benchmark 8.0 RPO
    chaseProb += (8.0 - rrr) * 8;
    chaseProb += (wicketsInHand - 5) * 6;
    chaseProb = Math.max(2, Math.min(98, Math.round(chaseProb)));

    return {
      teamAName: 'Chasing Team',
      teamBName: 'Defending Team',
      teamAPercent: chaseProb,
      teamBPercent: 100 - chaseProb
    };
  }

  return { teamAName: 'Team A', teamBName: 'Team B', teamAPercent: 50, teamBPercent: 50 };
}
