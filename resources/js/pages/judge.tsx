import { useToast } from '@/context/ToastContext';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Event, EventUser, Score } from '@/types/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface PageProps {
    eventUsers: EventUser[];
}

const judge = ({ eventUsers }: PageProps) => {
    const { showToast } = useToast();

    const [activeEvent, setActiveEvent] = useState<Event | undefined>(eventUsers[0].event);
    const [activeScores, setActiveScores] = useState(eventUsers[0].event?.scores);
    const [activeCriteria, setActiveCriteria] = useState(eventUsers[0].event?.criteria);
    const [activeContestants, setActiveContestants] = useState(eventUsers[0].event?.contestants);

    const [prevScores, setPrevScores] = useState(eventUsers[0].event?.scores);

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

    const maxScore = 100;

    const handleScoreChange = (scoreId: number, newScore: number | null) => {
        setActiveScores((prevScores) => {
            if (!prevScores) return prevScores;

            return prevScores.map((score) => {
                if (score.id === scoreId) {
                    return {
                        ...score,
                        score: newScore === null ? null : Math.min(newScore, maxScore),
                    };
                }
                return score;
            });
        });
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
    //     console.log(eventUsers);
    // }, [eventUsers]);

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

            <div className="overflow-x-auto bg-base-100 shadow-sm">
                <table className="table">
                    {/* head */}
                    <thead className="bg-base-200">
                        <tr>
                            <th className="text-center">Contestant</th>
                            {activeCriteria?.map((criterion, index) => (
                                <th key={index} className="text-center uppercase">
                                    {criterion.name} ({criterion.weight})
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {activeContestants?.map((contestant, index) => (
                            <tr key={index}>
                                <th className="w-1/4 text-center">{contestant.name}</th>
                                {activeCriteria?.map((criterion, index) => {
                                    let scoreId = activeScores?.find(
                                        (score) => score.criterion_id === criterion.id && contestant.id === score.contestant_id,
                                    )?.id;
                                    let score =
                                        activeScores?.find((score) => score.criterion_id === criterion.id && contestant.id === score.contestant_id)
                                            ?.score ?? 0;

                                    return (
                                        <th key={index} className="w-1/4 text-center">
                                            <input
                                                type="number"
                                                className="input max-w-32 text-center"
                                                value={score > 0 ? score : ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    handleScoreChange(scoreId!, val === '' ? null : parseFloat(val));
                                                }}
                                            />
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="divider"></div>
                <div className="px-4 pb-5 text-end">
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
