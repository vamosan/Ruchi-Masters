import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Trophy, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Award, 
  Flame,
  Shield
} from 'lucide-react';
import { Match, Innings, Team, Player } from '../../types/cricket';
import { useTournament } from '../../context/TournamentContext';

interface Props {
  match: Match;
  onClose: () => void;
}

export const DetailedScorecard: React.FC<Props> = ({ match, onClose }) => {
  const { teams } = useTournament();
  const [activeInningsTab, setActiveInningsTab] = useState<1 | 2>(1);

  const teamA = teams.find(t => t.id === match.teamAId);
  const teamB = teams.find(t => t.id === match.teamBId);
  const allPlayers = teams.flatMap(t => t.players);

  const inn1 = match.innings1;
  const inn2 = match.innings2;

  const currentInn = activeInningsTab === 1 ? inn1 : inn2;
  const battingTeam = currentInn ? teams.find(t => t.id === currentInn.battingTeamId) : undefined;
  const bowlingTeam = currentInn ? teams.find(t => t.id === currentInn.bowlingTeamId) : undefined;

  const getPlayerName = (id: string) => {
    const p = allPlayers.find(pl => pl.id === id);
    return p ? p.name : 'Unknown Player';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 shadow-2xl my-8 space-y-6 text-slate-100">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Certified Match Scorecard
              </span>
              <span className="text-xs text-slate-400 font-semibold">{match.title}</span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              {teamA?.name} vs {teamB?.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
              title="Print Scorecard"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / PDF
            </button>
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Scorecard Summary Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{match.date} • {match.venue}</span>
              </div>
              {match.tossWinnerId && (
                <div className="text-xs text-slate-300">
                  Toss: <strong>{teams.find(t => t.id === match.tossWinnerId)?.name}</strong> won the toss and elected to <strong>{match.tossDecision}</strong>
                </div>
              )}
            </div>

            {match.winMargin && (
              <div className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-black text-sm flex items-center gap-2 shadow">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{match.winMargin}</span>
              </div>
            )}
          </div>

          {/* Quick Innings scores strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {inn1 && (
              <div className={`p-3 rounded-xl border flex items-center justify-between ${activeInningsTab === 1 ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-900 border-slate-800'}`}>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase">1st Innings: {teams.find(t => t.id === inn1.battingTeamId)?.name}</div>
                  <div className="text-lg font-black text-white font-mono">{inn1.totalRuns}/{inn1.totalWickets} <span className="text-xs text-slate-400 font-normal font-sans">({inn1.oversCompletedStr} Ov)</span></div>
                </div>
                <button
                  onClick={() => setActiveInningsTab(1)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold no-print ${activeInningsTab === 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
                >
                  View Card
                </button>
              </div>
            )}

            {inn2 && (
              <div className={`p-3 rounded-xl border flex items-center justify-between ${activeInningsTab === 2 ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-900 border-slate-800'}`}>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase">2nd Innings: {teams.find(t => t.id === inn2.battingTeamId)?.name}</div>
                  <div className="text-lg font-black text-white font-mono">{inn2.totalRuns}/{inn2.totalWickets} <span className="text-xs text-slate-400 font-normal font-sans">({inn2.oversCompletedStr} Ov)</span></div>
                </div>
                <button
                  onClick={() => setActiveInningsTab(2)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold no-print ${activeInningsTab === 2 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
                >
                  View Card
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Selected Innings Detailed Table */}
        {currentInn ? (
          <div className="space-y-6">
            {/* Batting Card */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🏏 Batting — {battingTeam?.name}</span>
                </h3>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {currentInn.totalRuns}/{currentInn.totalWickets} ({currentInn.oversCompletedStr} Ov) • CRR: {((currentInn.totalRuns / (currentInn.legalBallsBowled / 6 || 1))).toFixed(2)}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Batter</th>
                      <th className="p-3">Dismissal</th>
                      <th className="p-3 text-right">Runs</th>
                      <th className="p-3 text-right">Balls</th>
                      <th className="p-3 text-right">4s</th>
                      <th className="p-3 text-right">6s</th>
                      <th className="p-3 text-right">SR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {currentInn.battingScorecard.map((bat, idx) => {
                      const p = allPlayers.find(pl => pl.id === bat.playerId);
                      return (
                        <tr key={bat.playerId} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-3 font-bold text-white flex items-center gap-2">
                            <span>{p ? p.name : `Batter ${idx + 1}`}</span>
                            {!bat.isOut && <span className="text-[10px] text-emerald-400 font-bold">*not out</span>}
                          </td>
                          <td className="p-3 text-slate-400 italic">
                            {bat.isOut ? (bat.dismissalInfo || 'out') : 'not out'}
                          </td>
                          <td className="p-3 text-right font-black text-white font-mono text-sm">{bat.runs}</td>
                          <td className="p-3 text-right text-slate-300 font-mono">{bat.balls}</td>
                          <td className="p-3 text-right text-slate-300 font-mono">{bat.fours}</td>
                          <td className="p-3 text-right text-slate-300 font-mono">{bat.sixes}</td>
                          <td className="p-3 text-right text-amber-400 font-mono font-bold">{bat.strikeRate.toFixed(1)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Extras & Total summary */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-3">
                <div className="text-slate-300">
                  <strong>Extras: {currentInn.extras.total}</strong> (w {currentInn.extras.wides}, nb {currentInn.extras.noBalls}, b {currentInn.extras.byes}, lb {currentInn.extras.legByes}, pen {currentInn.extras.penalty})
                </div>
                <div className="font-mono text-sm font-black text-amber-400">
                  Total: {currentInn.totalRuns}/{currentInn.totalWickets} ({currentInn.oversCompletedStr} Overs)
                </div>
              </div>
            </div>

            {/* Fall of Wickets */}
            {currentInn.fallOfWickets && currentInn.fallOfWickets.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fall of Wickets</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {currentInn.fallOfWickets.map((fow) => (
                    <span 
                      key={fow.wicketNumber}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
                    >
                      <strong>{fow.teamScore}-{fow.wicketNumber}</strong> ({fow.playerName}, {fow.oversStr} ov)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bowling Card */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🎯 Bowling — {bowlingTeam?.name}</span>
              </h3>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Bowler</th>
                      <th className="p-3 text-right">Overs</th>
                      <th className="p-3 text-right">Maidens</th>
                      <th className="p-3 text-right">Runs</th>
                      <th className="p-3 text-right">Wickets</th>
                      <th className="p-3 text-right">Economy</th>
                      <th className="p-3 text-right">Dots</th>
                      <th className="p-3 text-right">Wides</th>
                      <th className="p-3 text-right">No-Balls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {currentInn.bowlingScorecard.map((bowl) => {
                      const p = allPlayers.find(pl => pl.id === bowl.playerId);
                      return (
                        <tr key={bowl.playerId} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-3 font-bold text-white">{p ? p.name : 'Bowler'}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-200">{bowl.overs}</td>
                          <td className="p-3 text-right font-mono text-slate-400">{bowl.maidens}</td>
                          <td className="p-3 text-right font-mono text-slate-200">{bowl.runsConceded}</td>
                          <td className="p-3 text-right font-mono font-black text-emerald-400 text-sm">{bowl.wickets}</td>
                          <td className="p-3 text-right font-mono font-bold text-amber-400">{bowl.economy.toFixed(2)}</td>
                          <td className="p-3 text-right font-mono text-slate-400">{bowl.dots}</td>
                          <td className="p-3 text-right font-mono text-slate-400">{bowl.wides}</td>
                          <td className="p-3 text-right font-mono text-slate-400">{bowl.noBalls}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">
            Innings has not started yet.
          </div>
        )}
      </div>
    </div>
  );
};
