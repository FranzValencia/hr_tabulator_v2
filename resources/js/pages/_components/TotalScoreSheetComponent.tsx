import { User } from '@/types';
import { Contestant, Criterion, Event, Score } from '@/types/types';
import { useState } from 'react';

const TotalScoreSheetComponent = ({ event, pointBased }: { event: Event; pointBased: boolean }) => {
    const [eventCriteria] = useState<Criterion[]>(event.criteria ?? []);
    const [eventJudges] = useState<User[]>(event.judges ?? []);
    const [eventContestants] = useState<Contestant[]>(event.contestants ?? []);
    const [showJudgeNames] = useState(false);
    const maxScore = 100;

    const getWeightedScore = (criterion: Criterion | undefined, score: Score, maxScore: number): number => {
        if (!criterion || !score.score || maxScore === 0) return 0;
        const normalized = score.score / maxScore;
        return normalized * criterion.weight;
    };

    // Step 1: Compute point-based scores for sorting
    const contestantScores = eventContestants.map((contestant) => {
        const judgeScores = eventJudges.map((judge) => {
            const total =
                judge.scores_given
                    ?.filter((score) => score.contestant_id === contestant.id)
                    .reduce((sum, score) => {
                        const criterion = eventCriteria.find((c) => c.id === score.criterion_id);
                        return sum + getWeightedScore(criterion, score, maxScore);
                    }, 0) ?? 0;
            return total;
        });

        const averageScore = judgeScores.length > 0 ? judgeScores.reduce((sum, s) => sum + s, 0) / judgeScores.length : 0;

        return {
            contestant,
            judgeScores,
            averageScore,
        };
    });

    // Step 2: Sort by point-based average scores regardless of mode
    const sortedByPointScore = contestantScores
        .sort((a, b) => b.averageScore - a.averageScore)
        .map((entry, index) => ({
            ...entry,
            finalRank: index + 1,
        }));

    // Step 3: For rank-based mode, compute judge-wise rankings
    const judgeRanks: Record<number, { contestantId: number; rank: number }[]> = {};

    const rankWithTies = (entries: { contestantId: number; total: number }[]) => {
        const sorted = [...entries].sort((a, b) => b.total - a.total);
        let ranks: { contestantId: number; rank: number }[] = [];
        let currentRank = 1;

        for (let i = 0; i < sorted.length; i++) {
            if (i > 0 && sorted[i].total === sorted[i - 1].total) {
                ranks.push({ ...sorted[i], rank: ranks[i - 1].rank });
            } else {
                ranks.push({ ...sorted[i], rank: currentRank });
            }
            currentRank++;
        }

        return ranks;
    };

    if (!pointBased) {
        eventJudges.forEach((judge) => {
            const scores = eventContestants.map((contestant) => {
                const total =
                    judge.scores_given
                        ?.filter((score) => score.contestant_id === contestant.id)
                        .reduce((sum, score) => {
                            const criterion = eventCriteria.find((c) => c.id === score.criterion_id);
                            return sum + getWeightedScore(criterion, score, maxScore);
                        }, 0) ?? 0;

                return { contestantId: contestant.id, total };
            });

            judgeRanks[judge.id] = rankWithTies(scores);
        });
    }

    // Step 4: Prepare final data for UI rendering
    const finalDisplay = sortedByPointScore.map((entry) => {
        let displayJudgeScores: (number | string)[] = [];

        if (pointBased) {
            displayJudgeScores = entry.judgeScores.map((score) => score.toFixed(2));
        } else {
            displayJudgeScores = eventJudges.map((judge) => {
                const rankEntry = judgeRanks[judge.id]?.find((r) => r.contestantId === entry.contestant.id);
                return rankEntry ? `#${rankEntry.rank}` : '#-';
            });
        }

        const totalRank = !pointBased
            ? displayJudgeScores.reduce((sum: number, val) => {
                  if (typeof val === 'string') {
                      const num = parseInt(val.replace('#', '')) || 0;
                      return sum + num;
                  }
                  return sum + val;
              }, 0)
            : 0;

        return {
            contestant: entry.contestant,
            judgeDisplay: displayJudgeScores,
            averageScore: entry.averageScore,
            totalRank,
            finalRank: entry.finalRank,
        };
    });

    return (
        <div>
            <h2 className="card-title text-xl font-bold uppercase">Final Scoresheet</h2>
            <div className="overflow-x-auto">
                <table className="table table-fixed table-sm">
                    <thead>
                        <tr>
                            <th>Contestant</th>
                            {eventJudges.map((judge, index) => (
                                <th className="text-center" key={judge.id}>
                                    {showJudgeNames ? judge.name : `Judge ${index + 1}`}
                                </th>
                            ))}
                            <th className="text-center">{pointBased ? 'Average Score' : 'Total Rank'}</th>
                            <th className="text-center">Final Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        {finalDisplay.map(({ contestant, judgeDisplay, averageScore, totalRank, finalRank }) => (
                            <tr key={contestant.id}>
                                <td>{contestant.name}</td>

                                {judgeDisplay.map((val, index) => (
                                    <td className="text-center" key={index}>
                                        {val}
                                    </td>
                                ))}

                                <td className="text-center font-bold">{pointBased ? averageScore.toFixed(2) : totalRank}</td>

                                <td className="text-center font-bold">{finalRank}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TotalScoreSheetComponent;
