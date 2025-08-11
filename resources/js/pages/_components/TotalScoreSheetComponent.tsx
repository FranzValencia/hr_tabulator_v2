import { User } from '@/types';
import { Contestant, Criterion, Event, Score } from '@/types/types';
import { useMemo, useState } from 'react';

type RankedResult = {
    contestant: Contestant;
    judgeScores: number[]; // average scores per judge
    judgeRanks?: number[]; // ranks per judge (only for ranked-based)
    averageScore: number; // average of judgeScores
    totalRank?: number; // sum of judgeRanks (only for ranked-based)
    finalRank: number;
};

// Calculate weighted average score for a list of scores based on criteria weights
export const getAverage = (scores: Score[], criteria: Criterion[]) => {
    const totalCriteriaWeight = 100;

    return (
        scores.reduce((acc, score) => {
            const weight = criteria.find((c) => c.id === score.criterion_id)?.weight ?? 0;
            return acc + ((score.score ?? 0) * weight) / totalCriteriaWeight;
        }, 0) || 0
    );
};

const TotalScoreSheetComponent = ({ event, pointBased }: { event: Event; pointBased: boolean }) => {
    const [eventCriteria] = useState<Criterion[]>(event.criteria ?? []);
    const [eventJudges] = useState<User[]>(event.judges ?? []);
    const [eventContestants] = useState<Contestant[]>(event.contestants ?? []);
    const [showJudgeNames] = useState(false);

    // Calculate point-based results: average scores + final rank by average
    const pointBasedResults: Omit<RankedResult, 'finalRank'>[] = useMemo(() => {
        return eventContestants.map((contestant) => {
            const judgeScores = eventJudges.map((judge) => {
                const scores = contestant.scores?.filter((score) => score.judge_id === judge.id && score.contestant_id === contestant.id);
                return getAverage(scores ?? [], eventCriteria);
            });
            const averageScore = judgeScores.length ? judgeScores.reduce((a, b) => a + b, 0) / judgeScores.length : 0;
            return { contestant, judgeScores, averageScore };
        });
    }, [eventContestants, eventJudges, eventCriteria]);

    // Helper: assign ranks for a single judge's scores (descending order, handle ties)
    const rankScores = (scores: number[]) => {
        // Create array of { index, score } to remember original position
        const indexedScores = scores.map((score, i) => ({ score, i }));
        // Sort descending by score
        indexedScores.sort((a, b) => b.score - a.score);

        const ranks = new Array(scores.length).fill(0);
        let lastScore: number | null = null;
        let lastRank = 0;
        let skipRank = 1;

        indexedScores.forEach(({ score, i }, idx) => {
            if (lastScore === null || score < lastScore) {
                lastRank += skipRank;
                skipRank = 1;
            } else {
                skipRank++;
            }
            ranks[i] = lastRank;
            lastScore = score;
        });

        return ranks;
    };

    // Calculate ranked-based results:
    // 1. For each judge, get average scores for contestants
    // 2. For each judge, rank contestants based on average score
    // 3. Sum ranks per contestant for total rank
    // 4. Assign final rank based on total rank with tie handling
    const rankedBasedResults: RankedResult[] = useMemo(() => {
        // Step 1: collect scores per judge
        const judgeScoresMatrix = eventJudges.map((judge) =>
            eventContestants.map((contestant) => {
                const scores = contestant.scores?.filter((score) => score.judge_id === judge.id && score.contestant_id === contestant.id);
                return getAverage(scores ?? [], eventCriteria);
            }),
        );

        // Step 2: rank contestants per judge
        const judgeRanksMatrix = judgeScoresMatrix.map(rankScores);

        // Step 3: sum ranks per contestant
        const totalRanks = eventContestants.map((_, idx) => judgeRanksMatrix.reduce((sum, ranks) => sum + ranks[idx], 0));

        // Step 4: assign final rank by totalRank with tie handling
        type TempRes = {
            contestant: Contestant;
            judgeScores: number[];
            judgeRanks: number[];
            totalRank: number;
        };
        const tempResults: TempRes[] = eventContestants.map((contestant, idx) => ({
            contestant,
            judgeScores: judgeScoresMatrix.map((scores) => scores[idx]),
            judgeRanks: judgeRanksMatrix.map((ranks) => ranks[idx]),
            totalRank: totalRanks[idx],
        }));

        // Sort ascending by totalRank (lower is better)
        tempResults.sort((a, b) => a.totalRank - b.totalRank);

        let lastTotalRank: number | null = null;
        let lastFinalRank = 0;
        let skipRank = 1;

        return tempResults.map((res) => {
            if (lastTotalRank === null || res.totalRank > lastTotalRank) {
                lastFinalRank += skipRank;
                skipRank = 1;
            } else {
                skipRank++;
            }
            lastTotalRank = res.totalRank;
            return {
                contestant: res.contestant,
                judgeScores: res.judgeScores,
                judgeRanks: res.judgeRanks,
                averageScore: 0, // Not relevant in ranked mode, but kept for type consistency
                totalRank: res.totalRank,
                finalRank: lastFinalRank,
            };
        });
    }, [eventContestants, eventJudges, eventCriteria]);

    // Decide which results to use based on pointBased flag
    const resultsToDisplay = pointBased ? rankedResults(pointBasedResults) : rankedBasedResults;

    // Helper to assign final rank for point-based results (same as before)
    function rankedResults(results: Omit<RankedResult, 'finalRank'>[]): RankedResult[] {
        const sorted = [...results].sort((a, b) => b.averageScore - a.averageScore);

        let lastScore: number | null = null;
        let lastRank = 0;
        let skipRank = 1;

        return sorted.map((res) => {
            if (lastScore === null || res.averageScore < lastScore) {
                lastRank += skipRank;
                skipRank = 1;
            } else {
                skipRank++;
            }
            lastScore = res.averageScore;
            return { ...res, finalRank: lastRank };
        });
    }

    return (
        <div>
            <div>
                <h2 className="card-title text-xl font-bold uppercase">Final Scoresheet</h2>
                <div className="overflow-x-auto">
                    <table className="table table-fixed table-sm">
                        <thead>
                            <tr>
                                <th>Contestant</th>
                                {eventJudges.map((judge, i) => (
                                    <th className="text-center" key={judge.id}>
                                        {showJudgeNames ? judge.name : `Judge ${i + 1}`}
                                    </th>
                                ))}
                                <th className="text-center">{pointBased ? 'Average Score' : 'Total Rank'}</th>
                                <th className="text-center">Final Rank</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultsToDisplay.map(({ contestant, judgeScores, judgeRanks, averageScore, totalRank, finalRank }, idx) => (
                                <tr key={idx}>
                                    <td className="font-bold">{contestant.name}</td>
                                    {pointBased
                                        ? judgeScores.map((score, i) => (
                                              <td className="text-center" key={i}>
                                                  {score > 0 ? score.toFixed(2) : '-'}
                                              </td>
                                          ))
                                        : judgeRanks?.map((rank, i) => (
                                              <td className="text-center" key={i}>
                                                  {rank > 0 ? rank : '-'}
                                              </td>
                                          ))}
                                    <td className="text-center">{pointBased ? (averageScore > 0 ? averageScore.toFixed(2) : '-') : totalRank}</td>
                                    <td className="text-center">{finalRank}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TotalScoreSheetComponent;
