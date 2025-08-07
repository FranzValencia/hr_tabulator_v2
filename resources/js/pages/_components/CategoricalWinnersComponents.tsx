import { Contestant, Criterion, Event } from '@/types/types';
import { useEffect, useState } from 'react';

const CategoricalWinnersComponents = ({ event }: { event: Event }) => {
    const [activeCriteria, setActiveCriteria] = useState<Criterion[]>(event.criteria ?? []);
    const [activeContestants, setActiveContestants] = useState<Contestant[]>(event.contestants ?? []);

    useEffect(() => {
        console.log(event);
    }, [event]);

    const getCriterionWinner = (criterion: Criterion) => {
        if (!activeContestants.length) return null;

        return activeContestants.reduce<{
            contestant: Contestant;
            score: number;
        } | null>((currentWinner, contestant) => {
            const scoresForCriterion = contestant.scores?.filter((s) => s.criterion_id === criterion.id) ?? [];
            const avgScore =
                scoresForCriterion.length > 0 ? scoresForCriterion.reduce((sum, s) => sum + (s.score ?? 0), 0) / scoresForCriterion.length : 0;

            const weightedScore = avgScore * (criterion.weight / 100);

            if (!currentWinner || weightedScore > currentWinner.score) {
                return { contestant, score: weightedScore };
            }

            return currentWinner;
        }, null);
    };

    return (
        <div className="card mt-4 h-fit w-full bg-base-100 shadow-sm card-md">
            <div className="card-body">
                <h2 className="mb-4 card-title text-xl font-bold uppercase">Categorical Winners</h2>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr className="text-sm font-bold uppercase">
                                <th className="font-bold uppercase">Criterion</th>
                                <th className="font-bold uppercase">Winner</th>
                                <th className="font-bold uppercase">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeCriteria && activeCriteria.length > 0 ? (
                                activeCriteria.map((criterion, index) => {
                                    const winner = getCriterionWinner(criterion);
                                    return (
                                        <tr key={index}>
                                            <td>{criterion.name}</td>
                                            <td>
                                                {(winner?.score ?? 0 > 0) ? (
                                                    <span className="font-semibold text-primary">{winner?.contestant.name}</span>
                                                ) : (
                                                    <span className="text-gray-500 italic">-</span>
                                                )}
                                            </td>
                                            <td>{winner ? winner.score.toFixed(2) : '-'}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-4 py-4 text-center text-gray-500 italic">
                                        No criteria available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CategoricalWinnersComponents;
