import { User } from '@/types';
import { Contestant, Criterion, Event, Score } from '@/types/types';
import { useState } from 'react';

const TotalScoreSheetComponent = ({ event }: { event: Event }) => {
    const [eventCriteria] = useState<Criterion[]>(event.criteria ?? []);
    const [eventJudges] = useState<User[]>(event.judges ?? []);
    const [eventContestants] = useState<Contestant[]>(event.contestants ?? []);
    const [showJudgeNames] = useState(false);
    const maxScore = 100;

    // Create a lookup for scores: criterionId + judgeId -> score
    const getWeightedScore = (criterion: Criterion | undefined, score: Score, maxScore: number): number => {
        if (!criterion || !score.score || maxScore === 0) return 0;

        const normalized = score.score / maxScore; // Convert score to a value between 0 and 1
        const weightedScore = normalized * criterion.weight;

        return weightedScore;
    };

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

    // 2. Sort by average score (descending) and assign rank
    const rankedContestants = contestantScores
        .sort((a, b) => b.averageScore - a.averageScore)
        .map((entry, index) => ({
            ...entry,
            rank: index + 1,
        }));

    return (
        <div className="card mt-4 h-fit w-full bg-base-100 shadow-sm card-md">
            <div className="card-body">
                <h2 className="card-title text-xl font-bold uppercase">Final Scoresheet</h2>
                <div className="overflow-x-auto">
                    <table className="table table-fixed table-sm">
                        <thead>
                            <tr>
                                <th>Criteria</th>
                                {eventJudges.map((judge, index) => (
                                    <th className="text-center" key={judge.id}>
                                        {showJudgeNames ? judge.name : `Judge ${index + 1}`}
                                    </th>
                                ))}
                                <th className="text-center">Total</th>
                                <th className="text-center">Rank</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankedContestants.map(({ contestant, judgeScores, averageScore, rank }) => (
                                <tr key={contestant.id}>
                                    <td>{contestant.name}</td>

                                    {/* Each judge's total weighted score for this contestant */}
                                    {judgeScores.map((score, index) => (
                                        <td className="text-center" key={index}>
                                            {score.toFixed(2)}
                                        </td>
                                    ))}

                                    {/* Total average column */}
                                    <td className="text-center font-bold">{averageScore.toFixed(2)}</td>

                                    {/* Rank column */}
                                    <td className="text-center font-bold">{rank}</td>
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
