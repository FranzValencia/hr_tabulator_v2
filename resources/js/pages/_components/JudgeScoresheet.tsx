import { User } from '@/types';
import { Contestant, Criterion } from '@/types/types';
import { useMemo, useState } from 'react';

const JudgeScoresheet = ({
    judge,
    criteria,
    contestants,
    pointBased,
}: {
    judge: User;
    criteria: Criterion[];
    contestants: Contestant[];
    pointBased: boolean;
}) => {
    const [givenScores] = useState(judge.scores_given ?? []);

    // rank per criterion (descending), with tie handling
    const rankPerCriterion = useMemo(() => {
        return criteria.map((criterion) => {
            const scoresForCriterion = contestants.map((contestant) => {
                const scoreObj = givenScores.find((s) => s.contestant_id === contestant.id && s.criterion_id === criterion.id);
                return { contestantId: contestant.id, score: scoreObj?.score ?? 0 };
            });

            const sorted = [...scoresForCriterion].sort((a, b) => b.score - a.score);

            let lastScore: number | null = null;
            let lastRank = 0;
            let skipRank = 1;
            const ranksMap = new Map<number, number>();

            sorted.forEach(({ contestantId, score }) => {
                if (lastScore === null || score < lastScore) {
                    lastRank += skipRank;
                    skipRank = 1;
                } else {
                    skipRank++;
                }
                ranksMap.set(contestantId, lastRank);
                lastScore = score;
            });

            return ranksMap;
        });
    }, [criteria, contestants, givenScores]);

    // average weighted score per contestant
    const contestantAverages = useMemo(() => {
        const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0) || 1;

        return contestants.map((contestant) => {
            const weightedSum = criteria.reduce((sum, criterion) => {
                const scoreObj = givenScores.find((s) => s.contestant_id === contestant.id && s.criterion_id === criterion.id);
                const score = scoreObj?.score ?? 0;
                return sum + score * criterion.weight;
            }, 0);
            const weightedAvg = weightedSum / totalWeight;
            return { contestantId: contestant.id, average: weightedAvg };
        });
    }, [contestants, criteria, givenScores]);

    // ranks based on average scores descending, tie handled
    const averageRanks = useMemo(() => {
        const sorted = [...contestantAverages].sort((a, b) => b.average - a.average);

        let lastAvg: number | null = null;
        let lastRank = 0;
        let skipRank = 1;
        const ranksMap = new Map<number, number>();

        sorted.forEach(({ contestantId, average }) => {
            if (lastAvg === null || average < lastAvg) {
                lastRank += skipRank;
                skipRank = 1;
            } else {
                skipRank++;
            }
            ranksMap.set(contestantId, lastRank);
            lastAvg = average;
        });

        return ranksMap;
    }, [contestantAverages]);

    // sum of ranks (per criterion) per contestant for rank-based mode
    const sumOfRanks = useMemo(() => {
        if (pointBased) return null;

        return contestants.map((contestant) => {
            let sumRanks = 0;
            for (let i = 0; i < criteria.length; i++) {
                const rank = rankPerCriterion[i].get(contestant.id) ?? 0;
                sumRanks += rank;
            }
            return { contestantId: contestant.id, sumRanks };
        });
    }, [pointBased, contestants, criteria, rankPerCriterion]);

    // final ranks based on sumOfRanks (ascending), tie handled
    const finalRanks = useMemo(() => {
        if (pointBased) return null;

        const sorted = [...(sumOfRanks ?? [])].sort((a, b) => a.sumRanks - b.sumRanks);

        let lastSum: number | null = null;
        let lastRank = 0;
        let skipRank = 1;
        const ranksMap = new Map<number, number>();

        sorted.forEach(({ contestantId, sumRanks }) => {
            if (lastSum === null || sumRanks > lastSum) {
                lastRank += skipRank;
                skipRank = 1;
            } else {
                skipRank++;
            }
            ranksMap.set(contestantId, lastRank);
            lastSum = sumRanks;
        });

        return ranksMap;
    }, [pointBased, sumOfRanks]);

    return (
        <div>
            <h2 className="card-title text-xl font-bold uppercase">{judge.name}</h2>
            <div className="overflow-x-auto">
                <table className="table table-xs">
                    <thead>
                        <tr>
                            <th>Contestant</th>
                            {criteria.map((c, index) => (
                                <th key={index} className="text-center text-wrap capitalize">
                                    {c.name} ({c.weight}%)
                                </th>
                            ))}
                            {pointBased ? (
                                <>
                                    <th className="text-center">Average</th>
                                    <th className="text-center">Rank</th>
                                </>
                            ) : (
                                <>
                                    <th className="text-center">Sum of Ranks</th>
                                    <th className="text-center">Final Rank</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {contestants.map((contestant, rowIndex) => {
                            const avgObj = contestantAverages.find((c) => c.contestantId === contestant.id);
                            const avgScore = avgObj?.average ?? 0;
                            const rank = averageRanks.get(contestant.id);
                            const sumRanksObj = sumOfRanks?.find((c) => c.contestantId === contestant.id);
                            const sumRanks = sumRanksObj?.sumRanks ?? 0;
                            const finalRank = finalRanks?.get(contestant.id);

                            return (
                                <tr key={rowIndex}>
                                    <th>{contestant.name}</th>
                                    {criteria.map((criterion, colIndex) => {
                                        const scoreObj = givenScores.find(
                                            (s) => s.contestant_id === contestant.id && s.criterion_id === criterion.id,
                                        );
                                        const score = scoreObj?.score ?? 0;

                                        if (pointBased) {
                                            return (
                                                <td className="text-center" key={colIndex}>
                                                    {score > 0 ? score : '-'}
                                                </td>
                                            );
                                        } else {
                                            const rankPerCrit = rankPerCriterion[colIndex].get(contestant.id);
                                            return (
                                                <td className="text-center" key={colIndex}>
                                                    {rankPerCrit ?? '-'}
                                                </td>
                                            );
                                        }
                                    })}
                                    {pointBased ? (
                                        <>
                                            <td className="text-center font-bold">{avgScore.toFixed(2)}</td>
                                            <td className="text-center font-bold">{rank ?? '-'}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="text-center font-bold">{sumRanks}</td>
                                            <td className="text-center font-bold">{finalRank ?? '-'}</td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* Explanation footer */}
            <div className="mt-4 text-xs text-gray-600 italic md:text-sm">
                {pointBased ? (
                    <>
                        Scores are computed using the <strong>Point-Based</strong> method. Each criterion score given by the judge is summed and
                        averaged across all criteria. The contestant with the highest average score gets the top rank.
                    </>
                ) : (
                    <>
                        Scores are computed using the <strong>Rank-Based</strong> method. For each criterion, contestants are sorted by their score
                        from highest to lowest. The highest score gets Rank 1. Contestants with the same score share the same rank, and total ranks
                        across criteria are summed to determine the final ranking — the lowest total rank wins.
                    </>
                )}
            </div>
            <div className="flex justify-end">
                <div className="mt-6 w-fit text-center">
                    <span className="text-xs font-bold uppercase">{judge.name}</span>
                    <div className="w-64 border-t-1 text-center text-xs">
                        <div>Judge Signature</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JudgeScoresheet;
