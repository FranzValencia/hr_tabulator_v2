import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { User } from '@/types';
import { Event } from '@/types/types';
import ContestantsComponent from './_components/ContestantsComponent';
import JudgesComponent from './_components/JudgesComponent';

interface PageProps {
    event: Event;
    judges_to_choose_from: User[];
}

const admin = ({ event, judges_to_choose_from }: PageProps) => {
    return (
        <AuthenticatedLayout className="flex">
            <div className="w-full max-w-md overflow-auto bg-base-200 p-4 shadow-lg">
                <JudgesComponent event={event} judges={judges_to_choose_from} />
                <div className="divider" />
                <ContestantsComponent event={event} />
            </div>
            <div className="flex w-full justify-center overflow-auto p-8">
                <div className="card h-fit w-full bg-base-100 shadow-sm card-md">
                    <div className="card-body">
                        <h2 className="card-title">Categorical Winner</h2>
                        <div className="flex flex-col gap-4">
                            {event.criteria && event.criteria.map((criterion, index) => <div key={index}>{criterion.name}</div>)}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default admin;
