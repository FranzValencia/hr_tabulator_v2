import { useToast } from '@/context/ToastContext';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Event, EventUser, Score } from '@/types/types';
import { router, usePage } from '@inertiajs/react';
import { useRef, useState, type KeyboardEvent } from 'react';

interface Props {
    eventUsers: EventUser[];
}

const DECIMAL_WARNING = 'Decimals are not allowed. Enter whole numbers only.';
const DECIMAL_KEYS = new Set(['.', ',', 'e', 'E', '+']);

const judge = ({ eventUsers }: Props) => {
    const { showToast } = useToast();
    const { user } = usePage<PageProps>().props.auth;
    const lastDecimalWarningAt = useRef(0);

    const [activeEvent, setActiveEvent] = useState<Event | undefined>(eventUsers[0].event);
    const [activeScores, setActiveScores] = useState(eventUsers[0].event?.scores);
    const [activeCriteria, setActiveCriteria] = useState(eventUsers[0].event?.criteria);
    const [activeContestants, setActiveContestants] = useState(eventUsers[0].event?.contestants);

    const [prevScores, setPrevScores] = useState(eventUsers[0].event?.scores);

    const warnDecimalsNotAllowed = () => {
        const now = Date.now();
        if (now - lastDecimalWarningAt.current < 1500) return;
        lastDecimalWarningAt.current = now;
        showToast(DECIMAL_WARNING, 'warning');
    };

    const handleEventSwitching = async (eventToSwitch: EventUser) => {
        setActiveScores(eventToSwitch.event?.scores);
        setPrevScores(eventToSwitch.event?.scores);
        setActiveEvent(eventToSwitch.event);
        setActiveCriteria(eventToSwitch.event?.criteria);
        setActiveContestants(eventToSwitch.event?.contestants);
    };

    const scoresChanged = (arr1: Score[], arr2: Score[]): boolean => {
        if (arr1.length !== arr2.length) return true;

        return arr1.some((score, idx) => score.id !== arr2[idx].id || score.score !== arr2[idx].score);
    };

    const handleScoreChange = (scoreId: number, newScore: number | null, maxScore: number) => {
        setActiveScores((prevScores) => {
            if (!prevScores) return prevScores;

            return prevScores.map((score) => {
                if (score.id === scoreId) {
                    return {
                        ...score,
                        score: newScore === null ? null : Math.min(Math.trunc(newScore), maxScore),
                    };
                }
                return score;
            });
        });
    };

    const handleScoreInputChange = (scoreId: number, rawValue: string, maxScore: number) => {
        if (rawValue === '') {
            handleScoreChange(scoreId, null, maxScore);
            return;
        }

        if (/[.,eE+]/.test(rawValue)) {
            warnDecimalsNotAllowed();
        }

        const parsed = parseInt(rawValue, 10);
        if (Number.isNaN(parsed)) return;

        handleScoreChange(scoreId, parsed, maxScore);
    };

    const handleScoreKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (DECIMAL_KEYS.has(e.key)) {
            e.preventDefault();
            warnDecimalsNotAllowed();
        }
    };

    const handleUpdateScores = async () => {
        await router.patch(
            route('update.scores', { scores: activeScores }),
            {},
            {
                onSuccess: () => {
                    showToast('Scores Saved', 'success');
                },
            },
        );
    };

    // useEffect(() => {
    //     console.log(user);
    // }, [user]);

    return (
        <AuthenticatedLayout className="p-4">
            <div className="join">
                {eventUsers.map((eventUser, index) => (
                    <button
                        className={`btn join-item ${eventUser.event?.id === activeEvent?.id && 'btn-neutral'}`}
                        onClick={async () => {
                            if (scoresChanged(prevScores ?? [], activeScores ?? [])) {
                                await handleUpdateScores();
                            }
                            await handleEventSwitching(eventUser);
                        }}
                        key={index}
                    >
                        {eventUser.event?.name}
                    </button>
                ))}
            </div>
            <div className="my-4 p-4 text-center text-4xl font-bold uppercase">{activeEvent?.name}</div>

            <div className="overflow-x-auto border border-base-content/5 bg-base-100 shadow">
                <table className="table w-full table-fixed">
                    {/* head */}
                    <thead>
                        <tr>
                            <th className="text-center">Contestant</th>
                            {activeCriteria?.map((criterion, index) => (
                                <th key={index} className="text-center text-wrap uppercase">
                                    <div className="flex flex-col">
                                        <div>{criterion.name}</div>
                                        <div>(1 - {criterion.weight})</div>
                                    </div>
                                </th>
                            ))}
                            <th className="text-center">Total Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeContestants?.map((contestant, index) => {
                            let contestantScores = activeScores?.filter((score) => score.contestant_id === contestant.id);

                            return (
                                <tr key={index} className="border-t border-base-content/15">
                                    <th className={`text-center`}>{contestant.name}</th>
                                    {activeCriteria?.map((criterion, index) => {
                                        let scoreId = activeScores?.find(
                                            (score) => score.criterion_id === criterion.id && contestant.id === score.contestant_id,
                                        )?.id;
                                        let score =
                                            activeScores?.find(
                                                (score) => score.criterion_id === criterion.id && contestant.id === score.contestant_id,
                                            )?.score ?? 0;

                                        return (
                                            <th key={index} className={`text-center`}>
                                                <input
                                                    type="number"
                                                    step={1}
                                                    min={0}
                                                    max={criterion.weight}
                                                    className="input max-w-32 text-center"
                                                    value={score > 0 ? score : ''}
                                                    onKeyDown={handleScoreKeyDown}
                                                    onChange={(e) => handleScoreInputChange(scoreId!, e.target.value, criterion.weight)}
                                                />
                                            </th>
                                        );
                                    })}
                                    <th className="text-center">
                                        {(() => {
                                            if (!activeCriteria || !contestantScores) return 0;

                                            // Calculate weighted sum
                                            const total = activeCriteria.reduce((sum, criterion) => {
                                                const score =
                                                    contestantScores.find((s) => s.criterion_id === criterion.id && s.contestant_id === contestant.id)
                                                        ?.score ?? 0;

                                                return sum + score;
                                                // Weight: assume criterion.weight is in %
                                                // return sum + score * (criterion.weight / 100);
                                            }, 0);

                                            return total; // Show 2 decimal places
                                            // return total.toFixed(2); // Show 2 decimal places
                                        })()}
                                    </th>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="flex items-center justify-between border-t border-base-300 bg-base-300/50 p-4">
                    <div className="ml-8 font-bold text-base-content/75 uppercase">Judged by: {user.name}</div>
                    <button
                        className="btn btn-wide btn-success"
                        disabled={!scoresChanged(activeScores ?? [], prevScores ?? [])}
                        onClick={() => {
                            handleUpdateScores();
                            setPrevScores(activeScores);
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default judge;
