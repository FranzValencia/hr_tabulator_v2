import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Event, EventUser } from '@/types/types';
import { useEffect, useState } from 'react';

interface PageProps {
    eventUsers: EventUser[];
}

const judge = ({ eventUsers }: PageProps) => {
    const [activeEvent, setActiveEvent] = useState<Event | undefined>(eventUsers[0].event);
    const [activeScores, setActiveScores] = useState(eventUsers[0].event?.scores);
    const [activeCriteria, setActiveCriteria] = useState(eventUsers[0].event?.criteria);
    const [activeContestants, setActiveContestants] = useState(eventUsers[0].event?.contestants);

    const handleEventSwitching = (eventToSwitch: EventUser) => {
        setActiveEvent(eventToSwitch.event);
        setActiveScores(eventToSwitch.event?.scores);
        setActiveCriteria(eventToSwitch.event?.criteria);
        setActiveContestants(eventToSwitch.event?.contestants);
    };

    useEffect(() => {
        console.log(eventUsers);
    }, [eventUsers]);

    return (
        <AuthenticatedLayout className="p-4">
            <div className="join">
                {eventUsers.map((eventUser, index) => (
                    <button
                        className={`btn join-item ${eventUser.event?.id === activeEvent?.id && 'btn-neutral'}`}
                        onClick={() => handleEventSwitching(eventUser)}
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
                            <th>Contestant</th>
                            {activeCriteria?.map((criterion, index) => (
                                <th key={index}>{criterion.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {activeContestants?.map((contestant, index) => (
                            <tr key={index}>
                                <th className="w-1/4">{contestant.name}</th>
                                {activeCriteria?.map((criterion, index) => (
                                    <th key={index} className="w-1/4">
                                        {
                                            activeScores?.find(
                                                (score) => score.criterion_id === criterion.id && contestant.id === score.contestant_id,
                                            )?.criterion_id
                                        }
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
};

export default judge;
