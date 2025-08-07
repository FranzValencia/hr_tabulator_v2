import { Contestant, Event } from '@/types/types';
import { useMemo, useState } from 'react';

const OverallRankingComponent = ({ event }: { event: Event }) => {
    const [contestants] = useState<Contestant[]>(event.contestants ?? []);

    // Compute overall ranking
    const rankedContestants = useMemo(() => {
        if (!contestants.length || !event.criteria?.length) return [];

        return contestants.map((contestant) => {
            // Compute overall weighted score
            const totalWeightedScore = event.criteria!.reduce((total, criterion) => {
                // Get all scores for this criterion from this contestant
                const scoresForCriterion = contestant.scores?.filter((s) => s.criterion_id === criterion.id) ?? [];

                const avgScore =
                    scoresForCriterion.length > 0 ? scoresForCriterion.reduce((sum, s) => sum + (s.score ?? 0), 0) / scoresForCriterion.length : 0;

                // Weighted score
                const weightedScore = avgScore * (criterion.weight / 100);

                return total + weightedScore;
            }, 0);

            return { contestant, score: totalWeightedScore };
        });
    }, [contestants, event.criteria]);

    return (
        <div className="card mt-4 h-fit w-full bg-base-100 shadow-sm card-md">
            <div className="card-body">
                <h2 className="card-title text-xl font-bold uppercase">Overall Ranking</h2>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="font-bold uppercase">Rank</th>
                                <th className="font-bold uppercase">Contestant</th>
                                <th className="font-bold uppercase">Overall Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankedContestants.length > 0 ? (
                                rankedContestants.map((item, index) => (
                                    <tr key={item.contestant.id}>
                                        <td>{parseFloat(item.score.toFixed(2)) > 0 ? index + 1 : '-'}</td>
                                        <td>{item.contestant.name}</td>
                                        <td>{item.score.toFixed(2)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center text-gray-500 italic">
                                        No scores available
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

export default OverallRankingComponent;
