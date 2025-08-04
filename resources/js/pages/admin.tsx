import { User } from '@/types';
import { Event } from '@/types/types';
import { MoveLeft } from 'lucide-react';
import ContestantsComponent from './_components/ContestantsComponent';
import JudgesComponent from './_components/JudgesComponent';

interface PageProps {
    event: Event;
    judges_to_choose_from: User[];
}

const admin = ({ event, judges_to_choose_from }: PageProps) => {
    return (
        <div className="flex h-screen">
            <div className="w-full max-w-md overflow-auto bg-base-200 p-4 shadow-lg">
                <button
                    className="btn btn-sm"
                    onClick={() => {
                        window.history.back();
                    }}
                >
                    <MoveLeft />
                </button>
                <div className="divider" />
                <JudgesComponent event={event} judges={judges_to_choose_from} />
                <div className="divider" />
                <ContestantsComponent event={event} />
            </div>
            <div className="w-full overflow-auto"></div>
        </div>
    );
};

export default admin;
