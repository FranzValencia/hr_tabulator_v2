import { User } from '@/types';
import { Contestant, Criterion, Event } from '@/types/types';
import { useEffect, useState } from 'react';

const EPSILON = 0.0001;

const CategoricalWinnersComponents = ({ event: eventFromProps, pointBased }: { event: Event; pointBased: boolean }) => {
    useEffect(() => {
        setActiveCriteria(eventFromProps.criteria ?? []);
        setActiveContestants(eventFromProps.contestants ?? []);
    }, [eventFromProps]);

    const [activeCriteria, setActiveCriteria] = useState<Criterion[]>([]);
    const [activeContestants, setActiveContestants] = useState<Contestant[]>([]);

    const getCriterionWinners = (criterion: Criterion) => {
        if (!activeContestants.length) return [];

        // Calculate avg score per contestant for this criterion
        const scoredContestants = activeContestants.map((contestant) => {
            const scoresForCriterion = contestant.scores?.filter((s) => s.criterion_id === criterion.id) ?? [];
            const avgScore =
                scoresForCriterion.length > 0 ? scoresForCriterion.reduce((sum, s) => sum + (s.score ?? 0), 0) / scoresForCriterion.length : 0;
            const weightedScore = avgScore * (criterion.weight / 100);

            return { contestant, avgScore, weightedScore, scores: scoresForCriterion };
        });

        if (pointBased) {
            // POINT-BASED: highest weighted score wins
            let maxScore = Math.max(...scoredContestants.map((c) => c.weightedScore));
            return scoredContestants.filter(({ weightedScore }) => Math.abs(weightedScore - maxScore) < EPSILON);
        } else {
            // RANK-BASED: assign ranks by avgScore (highest score gets rank 1)
            const sorted = [...scoredContestants].sort((a, b) => b.avgScore - a.avgScore);
            let currentRank = 1;
            let prevScore: number | null = null;

            sorted.forEach((item, index) => {
                if (prevScore !== null && Math.abs(item.avgScore - prevScore) > EPSILON) {
                    currentRank = index + 1; // next rank
                }
                (item as any).rank = currentRank;
                prevScore = item.avgScore;
            });

            // Find lowest rank
            const minRank = Math.min(...sorted.map((c: any) => c.rank));
            return sorted.filter((c: any) => c.rank === minRank);
        }
    };

    return (
        <div>
            <h2 className="mb-4 card-title text-xl font-bold uppercase">Categorical Winners</h2>

            <table className="table table-zebra table-xs md:table-md">
                <thead>
                    <tr className="text-sm font-bold uppercase">
                        <th>Criterion</th>
                        <th>Winner(s)</th>
                        <th>Judge Scores</th>
                        <th>Average</th>
                        {!pointBased && <th>Rank</th>}
                        {pointBased && <th>Weighted Score</th>}
                    </tr>
                </thead>
                <tbody>
                    {activeCriteria.length > 0 ? (
                        activeCriteria.map((criterion, index) => {
                            const winners = getCriterionWinners(criterion);

                            return (
                                <tr key={index} className="align-top">
                                    <td>
                                        {criterion.name} <span className="text-sm font-bold text-base-content/50">({criterion.weight}%)</span>
                                    </td>
                                    <td>
                                        {winners.length > 0 ? (
                                            <ul className="space-y-1 text-sm font-semibold text-primary">
                                                {winners.map(({ contestant }, idx) => (
                                                    <li key={idx} className="capitalize">
                                                        🏅 {contestant.name}{' '}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-gray-500 italic">-</span>
                                        )}
                                    </td>
                                    <td>
                                        {winners.length > 0 ? (
                                            <ul className="space-y-3 text-xs">
                                                {winners.map(({ contestant, scores }, idx) => (
                                                    <li key={idx}>
                                                        <div className="font-medium">{contestant.name}:</div>
                                                        <ul className="pl-2">
                                                            {scores.map((score, i) => {
                                                                const judge = eventFromProps.judges?.find((j) =>
                                                                    j.event_users?.some((eu: User) => eu.id === score.event_user_id),
                                                                );
                                                                return (
                                                                    <li key={i} className="flex gap-2">
                                                                        <span className="capitalize">{judge?.name ?? 'Unknown Judge'}:</span>
                                                                        <span>{score.score}</span>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-gray-500 italic">-</span>
                                        )}
                                    </td>
                                    <td>{winners.length > 0 ? winners[0].avgScore.toFixed(2) : <span className="text-gray-500 italic">-</span>}</td>
                                    {!pointBased && (
                                        <td>{winners.length > 0 ? (winners as any)[0].rank : <span className="text-gray-500 italic">-</span>}</td>
                                    )}
                                    {pointBased && (
                                        <td>
                                            {winners.length > 0 ? (
                                                winners[0].weightedScore.toFixed(2)
                                            ) : (
                                                <span className="text-gray-500 italic">-</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={pointBased ? 5 : 6} className="py-4 text-center text-gray-500 italic">
                                No criteria available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="mt-4 text-xs text-gray-600 italic md:text-sm">
                {pointBased ? (
                    <>
                        <span className="font-semibold">Point-Based Scoring:</span> For each criterion, the <em>average score</em> from all judges is
                        multiplied by its
                        <em> weight percentage</em> to determine the <em>weighted score</em>. The contestant with the{' '}
                        <strong>highest total weighted score</strong> wins.
                    </>
                ) : (
                    <>
                        <span className="font-semibold">Rank-Based Scoring:</span> For each criterion, contestants are sorted by their{' '}
                        <em>average score</em> from all judges. The highest average receives <strong>Rank&nbsp;1</strong>. Contestants with the same
                        average score share the same rank. The <strong>lowest total rank</strong> across all criteria determines the winner.
                    </>
                )}
            </div>
            {/* Footer Explanation
            <div className="mt-4 text-xs text-gray-600 italic md:text-sm">
                {pointBased ? (
                    <>
                        <span className="font-semibold">Point-Based Scoring:</span> For each criterion, the <em>average score</em> from all judges is
                        multiplied by its
                        <em> weight percentage</em> to determine the <em>weighted score</em>. The contestant with the{' '}
                        <strong>highest total weighted score</strong> wins.
                    </>
                ) : (
                    <>
                        <span className="font-semibold">Rank-Based Scoring:</span> For each criterion, contestants are sorted by their{' '}
                        <em>average score</em> from all judges. The highest average receives <strong>Rank&nbsp;1</strong>. Contestants with the same
                        average score share the same rank. The <strong>lowest total rank</strong> across all criteria determines the winner.
                    </>
                )}
            </div> */}
        </div>
    );
};

export default CategoricalWinnersComponents;
