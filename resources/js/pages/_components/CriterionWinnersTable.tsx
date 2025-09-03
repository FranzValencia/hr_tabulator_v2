import { Contestant, Criterion } from '@/types/types';
import React from 'react';

interface CriterionWinnersTableProps {
    contestants: Contestant[];
    criteria: Criterion[];
    pointBased: boolean;
}

const CriterionWinnersTable: React.FC<CriterionWinnersTableProps> = ({ contestants, criteria, pointBased }) => {
    const getWinnersPerCriterion = () => {
        return criteria.map((criterion) => {
            // For each contestant, collect all scores for this criterion from all judges
            const scores = contestants.map((contestant) => {
                const scoresForCriterion = contestant.scores?.filter((s) => s.criterion_id === criterion.id && typeof s.score === 'number') ?? [];

                const totalScore = scoresForCriterion.reduce((sum, s) => sum + (s.score ?? 0), 0);
                const numberOfJudges = scoresForCriterion.length;

                const averageScore = numberOfJudges > 0 ? totalScore / numberOfJudges : 0;

                return {
                    name: contestant.name,
                    averageScore,
                };
            });

            // Sort descending (higher average = better)
            scores.sort((a, b) => b.averageScore - a.averageScore);

            const topScore = scores[0]?.averageScore ?? 0;

            // Get all contestants with top average
            const winners = scores.filter((s) => s.averageScore === topScore).map((s) => s.name);

            return {
                criterionName: criterion.name,
                winners,
                scoreOrRank: pointBased ? topScore.toFixed(2) : 1,
            };
        });
    };

    const winners = getWinnersPerCriterion();

    return (
        <div className="mt-8">
            <h3 className="mb-2 text-lg font-bold uppercase">Winners Per Criterion</h3>
            <div className="overflow-x-auto">
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Criterion</th>
                            <th>Winner(s)</th>
                            <th>{pointBased ? 'Avg. Score' : 'Rank'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {winners.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.criterionName}</td>
                                <td>🏅 {item.winners.join(', ')}</td>
                                <td>{item.scoreOrRank}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CriterionWinnersTable;
