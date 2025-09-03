import { User } from '@/types';
import { Contestant, Criterion } from '@/types/types';
import React from 'react';

interface Props {
    contestants: Contestant[];
    criteria: Criterion[];
    judges: User[];
    pointBased: boolean;
}

const OverallWinnersTable: React.FC<Props> = ({ contestants, criteria, judges, pointBased }) => {
    const calculateScores = () => {
        return contestants.map((contestant) => {
            const judgeValues: number[] = [];

            if (pointBased) {
                judges.forEach((judge) => {
                    let total = 0;
                    criteria.forEach((criterion) => {
                        const score = contestant.scores?.find((s) => s.judge_id === judge.id && s.criterion_id === criterion.id)?.score ?? 0;
                        total += score;
                    });
                    judgeValues.push(total);
                });

                const average = judgeValues.length > 0 ? judgeValues.reduce((a, b) => a + b, 0) / judgeValues.length : 0;

                return {
                    name: contestant.name,
                    judgeValues,
                    total: average,
                };
            } else {
                // For rank-based, calculate rank per judge
                judges.forEach((judge) => {
                    const ranking = contestants.map((c) => {
                        let scoreSum = 0;
                        criteria.forEach((criterion) => {
                            const s = c.scores?.find((sc) => sc.judge_id === judge.id && sc.criterion_id === criterion.id)?.score ?? 0;
                            scoreSum += s;
                        });
                        return { name: c.name, total: scoreSum };
                    });

                    // Sort descending
                    ranking.sort((a, b) => b.total - a.total);

                    // Assign ranks with ties
                    const ranks: Record<string, number> = {};
                    let lastScore: number | null = null;
                    let currentRank = 1;
                    let skip = 0;

                    for (let i = 0; i < ranking.length; i++) {
                        const { name, total } = ranking[i];
                        if (total === lastScore) {
                            skip++;
                            ranks[name] = currentRank;
                        } else {
                            currentRank = currentRank + skip;
                            ranks[name] = currentRank;
                            lastScore = total;
                            skip = 1;
                        }
                    }

                    judgeValues.push(ranks[contestant.name] ?? 0);
                });

                const totalRank = judgeValues.reduce((a, b) => a + b, 0);

                return {
                    name: contestant.name,
                    judgeValues,
                    total: totalRank,
                };
            }
        });
    };

    const scored = calculateScores();

    // Sort
    scored.sort((a, b) => (pointBased ? b.total - a.total : a.total - b.total));

    // Assign final ranks (with tie handling)
    const ranked = [];
    let lastScore: number | null = null;
    let lastRank = 0;
    let skip = 0;

    for (let i = 0; i < scored.length; i++) {
        const entry = scored[i];
        if (entry.total === lastScore) {
            skip++;
            ranked.push({ ...entry, rank: lastRank });
        } else {
            const currentRank = lastRank + skip + 1;
            ranked.push({ ...entry, rank: currentRank });
            lastRank = currentRank;
            skip = 0;
            lastScore = entry.total;
        }
    }

    return (
        <div className="mt-8">
            <h3 className="mb-2 text-lg font-bold uppercase">Overall Winners</h3>
            <div className="overflow-x-auto">
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Contestant</th>
                            {judges.map((j) => (
                                <th key={j.id}>Judge {j.name}</th>
                            ))}
                            <th>{pointBased ? 'Avg. Score' : 'Total Rank'}</th>
                            <th>Final Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranked.map((entry, idx) => (
                            <tr key={idx}>
                                <td>{entry.name}</td>
                                {entry.judgeValues.map((val, i) => (
                                    <td key={i}>{pointBased ? val.toFixed(2) : val}</td>
                                ))}
                                <td>{pointBased ? entry.total.toFixed(2) : entry.total}</td>
                                <td>{entry.rank}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OverallWinnersTable;
