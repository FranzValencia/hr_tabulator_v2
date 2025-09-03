import { User } from '@/types';
import { Contestant, Criterion, Score } from '@/types/types';

interface Props {
    judge: User;
    contestants: Contestant[];
    criteria: Criterion[];
    pointBased: boolean;
}

type RankedEntry = {
    contestant: string;
    scores?: Score[];
    total_score: number;
    rank: number;
    displayedScores: number[]; // raw scores (point-based) or ranks (rank-based)
};

const JudgeScoresheet2 = ({ judge, contestants, criteria, pointBased }: Props) => {
    // Filter scores to only those from current judge
    const filteredContestants = contestants.map((contestant) => ({
        ...contestant,
        scores: contestant.scores?.filter((score) => score.judge_id === judge.id) ?? [],
    }));

    const totaledScores = (): RankedEntry[] => {
        let scoresheet: RankedEntry[] = [];

        if (pointBased) {
            // POINT-BASED: sum raw scores per contestant
            scoresheet = filteredContestants.map((contestant) => {
                const displayedScores = criteria.map((criterion) => {
                    const score = contestant.scores?.find((s) => s.criterion_id === criterion.id)?.score ?? 0;
                    return score;
                });

                const total_score = displayedScores.reduce((sum, score) => sum + score, 0);

                return {
                    contestant: contestant.name,
                    scores: contestant.scores,
                    total_score,
                    displayedScores,
                    rank: 0, // placeholder, will be set later
                };
            });

            // Sort descending (higher total = better rank)
            scoresheet.sort((a, b) => b.total_score - a.total_score);
        } else {
            // RANK-BASED: calculate per-criterion ranks and sum them
            const criterionRanks: Record<number, Record<string, number>> = {}; // criterion_id -> { contestantName: rank }

            criteria.forEach((criterion) => {
                const scoresForCriterion = filteredContestants.map((contestant) => {
                    const score = contestant.scores?.find((s) => s.criterion_id === criterion.id)?.score ?? 0;
                    return {
                        name: contestant.name,
                        score,
                    };
                });

                // Sort descending
                scoresForCriterion.sort((a, b) => b.score - a.score);

                const ranks: Record<string, number> = {};
                for (let i = 0; i < scoresForCriterion.length; i++) {
                    if (i > 0 && scoresForCriterion[i].score === scoresForCriterion[i - 1].score) {
                        ranks[scoresForCriterion[i].name] = ranks[scoresForCriterion[i - 1].name];
                    } else {
                        ranks[scoresForCriterion[i].name] = i + 1;
                    }
                }

                criterionRanks[criterion.id] = ranks;
            });

            // Now build scoresheet using rank values
            scoresheet = filteredContestants.map((contestant) => {
                const displayedScores: number[] = criteria.map((criterion) => {
                    return criterionRanks[criterion.id]?.[contestant.name] ?? 0;
                });

                const total_score = displayedScores.reduce((sum, rank) => sum + rank, 0);

                return {
                    contestant: contestant.name,
                    scores: contestant.scores,
                    total_score,
                    displayedScores,
                    rank: 0, // placeholder
                };
            });

            // Sort ascending (lower total = better rank)
            scoresheet.sort((a, b) => a.total_score - b.total_score);
        }

        // Assign final ranks with tie handling
        let lastScore: number | null = null;
        let lastRank = 0;
        let skip = 0;

        for (let i = 0; i < scoresheet.length; i++) {
            const entry = scoresheet[i];
            if (entry.total_score === lastScore) {
                skip++;
                entry.rank = lastRank;
            } else {
                const currentRank = lastRank + skip + 1;
                entry.rank = currentRank;
                lastRank = currentRank;
                skip = 0;
                lastScore = entry.total_score;
            }
        }

        return scoresheet;
    };

    const scores = totaledScores();

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
                                    {c.name} {pointBased ? '' : '(Rank)'}
                                </th>
                            ))}
                            <th>{pointBased ? 'Total Score' : 'Sum of Ranks'}</th>
                            <th>Final Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.contestant}</td>
                                {entry.displayedScores.map((val, i) => (
                                    <td key={i}>{val}</td>
                                ))}
                                <td>{entry.total_score}</td>
                                <td>{entry.rank}</td>
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
