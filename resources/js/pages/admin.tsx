import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { User } from '@/types';
import { Event } from '@/types/types';
import CategoricalWinnersComponents from './_components/CategoricalWinnersComponents';
import ContestantsComponent from './_components/ContestantsComponent';
import JudgesComponent from './_components/JudgesComponent';
import OverallRankingComponent from './_components/OverallRankingComponent';
import TotalScoreSheetComponent from './_components/TotalScoreSheetComponent';

interface Props {
    event: Event;
    judges_to_choose_from: User[];
}

const admin = ({ event, judges_to_choose_from }: Props) => {
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
                        <OverallRankingComponent event={event} />
                        <CategoricalWinnersComponents event={event} />
                        <TotalScoreSheetComponent event={event} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default admin;
