import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Event } from '@/types/types';
import { useEffect } from 'react';

interface PageProps {
    events: Event[];
}

const judge = ({ events }: PageProps) => {
    useEffect(() => {
        console.log(events);
    }, [events]);

    return (
        <AuthenticatedLayout>
            {events.map((event, index) => (
                <div key={index}>{event.name}</div>
            ))}
        </AuthenticatedLayout>
    );
};

export default judge;
