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
            // Get all scores for this criterion from this contestant
            const scoresForCriterion = contestant.scores?.filter((s) => s.criterion_id === criterion.id) ?? [];

            // Compute **average score for this criterion**
            const avgScore =
                scoresForCriterion.length > 0 ? scoresForCriterion.reduce((sum, s) => sum + (s.score ?? 0), 0) / scoresForCriterion.length : 0;

            // Apply criterion weight
            const weightedScore = avgScore * (criterion.weight / 100);

            // If no winner yet OR this contestant has higher score → replace winner
            if (!currentWinner || weightedScore > currentWinner.score) {
                return { contestant, score: weightedScore };
            }

            return currentWinner;
        }, null);
    };

    return (
        <>
            <h2 className="card-title text-xl font-bold uppercase">Categorical Winner</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    <tbody>
                        {activeCriteria &&
                            activeCriteria.map((criterion, index) => {
                                const winner = getCriterionWinner(criterion);
                                return (
                                    <tr key={index}>
                                        <th className="font-bold uppercase">{criterion.name}</th>
                                        <th className="font-bold uppercase">
                                            {winner ? `${winner.contestant.name} (${winner.score.toFixed(2)})` : 'no score'}
                                        </th>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default CategoricalWinnersComponents;
