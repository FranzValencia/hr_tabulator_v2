import { User } from '@/types';
import { Contestant, Event, Score } from '@/types/types';
import { useState } from 'react';

const TotalScoreSheetComponent = ({ event }: { event: Event }) => {
    const [eventScores] = useState<Score[]>(event.scores ?? []);
    const [eventJudges] = useState<User[]>(event.judges ?? []);
    const [eventContestants] = useState<Contestant[]>(event.contestants ?? []);
    const [showJudgeNames] = useState(false);

    // Create a lookup for scores: criterionId + judgeId -> score
    const getJudgeOverallScore = (judge: User, event: Event) => {
        let judgeScores = event.scores?.filter((score) => score.judge);
    };

    return (
        <div className="card mt-4 h-fit w-full bg-base-100 shadow-sm card-md">
            <div className="card-body">
                <h2 className="card-title text-xl font-bold uppercase">Total Scoresheet</h2>
                <div className="overflow-x-auto">
                    <table className="table table-fixed table-xs">
                        <thead>
                            <tr>
                                <th>Criteria</th>
                                {eventJudges.map((judge, index) => (
                                    <th className="text-center" key={judge.id}>
                                        {showJudgeNames ? judge.name : `Judge ${index + 1}`}
                                    </th>
                                ))}
                                <th className="text-center">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventContestants.map((contestant, index) => (
                                <tr key={index}>
                                    <td>{contestant.name}</td>
                                    {eventJudges.map((judge, index) => {
                                        return (
                                            <td className="text-center" key={index}>
                                                {judge.scores_given?.find((score) => score.contestant_id === contestant.id)?.score}

                                                {showJudgeNames ? judge.name : `Judge ${index + 1}`}
                                            </td>
                                        );
                                    })}
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
