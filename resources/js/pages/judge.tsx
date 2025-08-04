import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Event } from '@/types/types';
import { useState } from 'react';

interface PageProps {
    events: Event[];
}

const judge = ({ events }: PageProps) => {
    const [activeEvent, setActiveEvent] = useState<Event>(events[0]);

    return (
        <AuthenticatedLayout className="p-4">
            <div className="join">
                {events.map((event, index) => (
                    <button
                        className={`btn join-item ${event.id === activeEvent.id && 'btn-neutral'}`}
                        onClick={() => setActiveEvent(event)}
                        key={index}
                    >
                        {event.name}
                    </button>
                ))}
            </div>

            <div className="my-4 bg-gradient-to-r from-base-300 to-transparent p-4 text-xl font-bold">{activeEvent.name}</div>

            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Job</th>
                            <th>Favorite Color</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        <tr>
                            <th>1</th>
                            <td>Cy Ganderton</td>
                            <td>Quality Control Specialist</td>
                            <td>Blue</td>
                        </tr>
                        {/* row 2 */}
                        <tr>
                            <th>2</th>
                            <td>Hart Hagerty</td>
                            <td>Desktop Support Technician</td>
                            <td>Purple</td>
                        </tr>
                        {/* row 3 */}
                        <tr>
                            <th>3</th>
                            <td>Brice Swyre</td>
                            <td>Tax Accountant</td>
                            <td>Red</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
};

export default judge;
