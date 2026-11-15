import { Match, Team, PointsTableEntry, TournamentRules } from '../types/cricket';
import { oversStrToDecimal } from './cricketEngine';

/**
 * Calculates complete points table and precise ICC Net Run Rate (NRR)
 */
export function calculatePointsTable(
  teams: Team[],
  matches: Match[],
  rules: TournamentRules
): PointsTableEntry[] {
  const tableMap = new Map<string, {
    team: Team;
    played: number;
    won: number;
    lost: number;
    tied: number;
    noResult: number;
    points: number;
    runsScored: number;
    oversFacedDec: number;
    runsConceded: number;
    oversBowledDec: number;
    form: ('W' | 'L' | 'T' | 'NR')[];
  }>();

  // Initialize for all teams
  teams.forEach(team => {
    tableMap.set(team.id, {
      team,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      noResult: 0,
      points: 0,
      runsScored: 0,
      oversFacedDec: 0,
      runsConceded: 0,
      oversBowledDec: 0,
      form: [],
    });
  });

  // Process all completed or abandoned matches
  const completedMatches = matches.filter(m => m.status === 'completed' || m.status === 'abandoned');

  completedMatches.forEach(match => {
    const statsA = tableMap.get(match.teamAId);
    const statsB = tableMap.get(match.teamBId);

    if (!statsA || !statsB) return;

    if (match.status === 'abandoned') {
      statsA.played += 1;
      statsB.played += 1;
      statsA.noResult += 1;
      statsB.noResult += 1;
      statsA.points += rules.pointsForNR;
      statsB.points += rules.pointsForNR;
      statsA.form.push('NR');
      statsB.form.push('NR');
      return;
    }

    // Completed Match
    statsA.played += 1;
    statsB.played += 1;

    // Check winner
    if (!match.winnerTeamId) {
      // Tie
      statsA.tied += 1;
      statsB.tied += 1;
      statsA.points += rules.pointsForTie;
      statsB.points += rules.pointsForTie;
      statsA.form.push('T');
      statsB.form.push('T');
    } else if (match.winnerTeamId === match.teamAId) {
      statsA.won += 1;
      statsB.lost += 1;
      statsA.points += rules.pointsForWin;
      statsA.form.push('W');
      statsB.form.push('L');
    } else {
      statsB.won += 1;
      statsA.lost += 1;
      statsB.points += rules.pointsForWin;
      statsB.form.push('W');
      statsA.form.push('L');
    }

    // NRR Calculation - Innings 1 & 2
    if (match.innings1 && match.innings2) {
      const inn1 = match.innings1;
      const inn2 = match.innings2;

      const teamBatting1 = tableMap.get(inn1.battingTeamId);
      const teamBowling1 = tableMap.get(inn1.bowlingTeamId);
      const teamBatting2 = tableMap.get(inn2.battingTeamId);
      const teamBowling2 = tableMap.get(inn2.bowlingTeamId);

      const maxQuotaOvers = rules.oversPerInnings;

      // Innings 1: If all out, count full quota overs
      const inn1OversFaced = (inn1.totalWickets >= 10 || inn1.isCompleted && inn1.totalWickets >= 10)
        ? maxQuotaOvers 
        : oversStrToDecimal(inn1.oversCompletedStr);

      if (teamBatting1) {
        teamBatting1.runsScored += inn1.totalRuns;
        teamBatting1.oversFacedDec += inn1OversFaced;
      }
      if (teamBowling1) {
        teamBowling1.runsConceded += inn1.totalRuns;
        teamBowling1.oversBowledDec += inn1OversFaced;
      }

      // Innings 2:
      // If team chasing won by reaching target, actual overs faced are counted.
      // If team chasing was bowled all out, full quota overs are counted.
      const inn2OversFaced = (inn2.totalWickets >= 10) 
        ? maxQuotaOvers 
        : oversStrToDecimal(inn2.oversCompletedStr);

      if (teamBatting2) {
        teamBatting2.runsScored += inn2.totalRuns;
        teamBatting2.oversFacedDec += inn2OversFaced;
      }
      if (teamBowling2) {
        teamBowling2.runsConceded += inn2.totalRuns;
        teamBowling2.oversBowledDec += inn2OversFaced;
      }
    }
  });

  // Compute final NRR and assemble standings entries
  const entries: PointsTableEntry[] = Array.from(tableMap.values()).map(item => {
    const runsFor = item.runsScored;
    const oversFor = item.oversFacedDec;
    const runsAgainst = item.runsConceded;
    const oversAgainst = item.oversBowledDec;

    const rateFor = oversFor > 0 ? (runsFor / oversFor) : 0;
    const rateAgainst = oversAgainst > 0 ? (runsAgainst / oversAgainst) : 0;
    const computedNrr = Number((rateFor - rateAgainst).toFixed(3));
    const ov = item.team.standingsOverride;

    return {
      teamId: item.team.id,
      teamName: item.team.name,
      teamCode: item.team.code,
      teamLogo: item.team.logo,
      group: item.team.group,
      played: ov ? ov.played : item.played,
      won: ov ? ov.won : item.won,
      lost: ov ? ov.lost : item.lost,
      tied: ov ? ov.tied : item.tied,
      noResult: ov ? ov.noResult : item.noResult,
      points: ov ? ov.points : item.points,
      nrr: ov ? ov.nrr : (isNaN(computedNrr) ? 0 : computedNrr),
      runsScored: ov?.runsScored ?? runsFor,
      legalOversFaced: ov?.legalOversFaced ?? Number(oversFor.toFixed(2)),
      runsConceded: ov?.runsConceded ?? runsAgainst,
      legalOversBowled: ov?.legalOversBowled ?? Number(oversAgainst.toFixed(2)),
      form: ov?.form ?? item.form.slice(-5), // last 5 matches
      rank: 1,
    };
  });

  // Sort by Points (desc), then Won (desc), then NRR (desc)
  entries.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.won !== a.won) return b.won - a.won;
    return b.nrr - a.nrr;
  });

  // Assign overall rank & per-group qualification flags (Top 2 per group advance in 8-group format)
  const groupRankCounter = new Map<string, number>();
  return entries.map((entry, idx) => {
    const grpKey = entry.group || 'ALL';
    const grpRank = (groupRankCounter.get(grpKey) || 0) + 1;
    groupRankCounter.set(grpKey, grpRank);
    return {
      ...entry,
      rank: idx + 1,
      isQualified: grpRank <= 2 && entry.played >= 3,
      isEliminated: grpRank > 2 && entry.played >= 4 && entry.points <= 2,
    };
  });
}
