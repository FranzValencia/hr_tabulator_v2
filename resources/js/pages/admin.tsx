import { User } from '@/types';
import { Event } from '@/types/types';
import JudgesComponent from './_components/JudgesComponent';
import ParticipantsComponent from './_components/ParticipantsComponent';

interface PageProps {
    event: Event;
    judges_to_choose_from: User[];
}

const admin = ({ event, judges_to_choose_from }: PageProps) => {
    return (
        <div className="flex h-screen p-4">
            <div>
                <JudgesComponent event={event} judges={judges_to_choose_from} />
                <div className="divider"></div>
                <ParticipantsComponent event={event} judges={judges_to_choose_from} />
            </div>
            <div></div>
        </div>
    );
};

export default admin;
