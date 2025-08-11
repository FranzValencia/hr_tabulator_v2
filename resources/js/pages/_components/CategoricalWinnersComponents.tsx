import { User } from '@/types';
import { Contestant, Criterion, Event } from '@/types/types';
import { useState } from 'react';

const EPSILON = 0.0001;

const CategoricalWinnersComponents = ({ event }: { event: Event }) => {
    const [activeCriteria, setActiveCriteria] = useState<Criterion[]>(event.criteria ?? []);
    const [activeContestants, setActiveContestants] = useState<Contestant[]>(event.contestants ?? []);

    const getCriterionWinners = (criterion: Criterion) => {
        if (!activeContestants.length) return [];

        let maxScore = 0;
        const scoredContestants = activeContestants.map((contestant) => {
            const scoresForCriterion = contestant.scores?.filter((s) => s.criterion_id === criterion.id) ?? [];
            const avgScore =
                scoresForCriterion.length > 0 ? scoresForCriterion.reduce((sum, s) => sum + (s.score ?? 0), 0) / scoresForCriterion.length : 0;
            const weightedScore = avgScore * (criterion.weight / 100);
            if (weightedScore > maxScore) maxScore = weightedScore;

            return { contestant, weightedScore, avgScore, scores: scoresForCriterion };
        });

        return scoredContestants.filter(({ weightedScore }) => Math.abs(weightedScore - maxScore) < EPSILON);
    };

    return (
        <div>
            <h2 className="mb-4 card-title text-xl font-bold uppercase">Categorical Winners</h2>
            <div className="overflow-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr className="text-sm font-bold uppercase">
                            <th>Criterion</th>
                            <th>Judge Scores</th>
                            <th>Average</th>
                            <th>Weighted Score</th>
                            <th>Winner(s)</th>
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
                                                <ul className="space-y-3 text-sm">
                                                    {winners.map(({ contestant, scores }, idx) => (
                                                        <li key={idx}>
                                                            <div className="font-medium">{contestant.name}:</div>
                                                            <ul className="pl-2">
                                                                {scores.map((score, i) => {
                                                                    const judge = event.judges?.find((j) =>
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
                                        <td>
                                            {winners.length > 0 ? winners[0].avgScore.toFixed(2) : <span className="text-gray-500 italic">-</span>}
                                        </td>
                                        <td>
                                            {winners.length > 0 ? (
                                                winners[0].weightedScore.toFixed(2)
                                            ) : (
                                                <span className="text-gray-500 italic">-</span>
                                            )}
                                        </td>
                                        <td>
                                            {winners.length > 0 ? (
                                                <ul className="space-y-1 text-sm font-semibold text-primary">
                                                    {winners.map(({ contestant }, idx) => (
                                                        <li key={idx}>{contestant.name}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-gray-500 italic">-</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-4 text-center text-gray-500 italic">
                                    No criteria available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoricalWinnersComponents;
