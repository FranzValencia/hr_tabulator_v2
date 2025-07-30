import { User } from '@/types';
import { Event } from '@/types/types';
import JudgesComponent from './_components/JudgesComponent';

interface PageProps {
    event: Event;
    judges: User[];
}

const admin = ({ event, judges }: PageProps) => {
    return (
        <div className="flex h-screen p-4">
            <div>
                <JudgesComponent event={event} judges={judges} />
            </div>
            <div></div>
        </div>
    );
};

export default admin;
