import { User } from '@/types';
import { Contestant, Criterion } from '@/types/types';

interface Props {
    judge: User;
    contestants: Contestant[];
    criteria: Criterion[];
}

const JudgeScoresheet2 = ({ judge, contestants, criteria }: Props) => {
    const totaledScores = () => {
        let scoresheet = contestants.map((contestant) => {
            return {
                contestant: contestant.name,
                scores: contestant.scores,
                total_score: contestant.scores?.reduce((total, score) => total + (score?.score ?? 0), 0),
            };
        });

        // Sort by total_score in descending order (highest score first)
        scoresheet.sort((a, b) => (b.total_score ?? 0) - (a.total_score ?? 0));

        return scoresheet;
    };

    return (
        <div>
            <h2 className="card-title text-xl font-bold uppercase">{judge.name}</h2>
            <div className="overflow-x-auto">
                <table className="table table-xs">
                    <thead>
                        <tr>
                            <th>Contestant</th>
                            {criteria.map((c) => (
                                <th key={c.id} className="capitalize">
                                    {c.name}
                                </th>
                            ))}
                            <th>Total Score</th>
                            <th>Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        {totaledScores().map((entry, index) => (
                            <tr key={index}>
                                <th>{entry.contestant}</th>
                                {entry.scores?.map((score) => (
                                    <th key={score.id}>{score.score}</th>
                                ))}
                                <th>{entry.total_score}</th>
                                <th>{index + 1}</th>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

export default JudgeScoresheet2;
