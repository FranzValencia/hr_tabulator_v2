import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { User } from '@/types';
import { Event } from '@/types/types';
import { useState } from 'react';
import CategoricalWinnersComponents from './_components/CategoricalWinnersComponents';
import ContestantsComponent from './_components/ContestantsComponent';
import JudgesComponent from './_components/JudgesComponent';
import TotalScoreSheetComponent from './_components/TotalScoreSheetComponent';

interface Props {
    event: Event;
    judges_to_choose_from: User[];
}

const Admin = ({ event, judges_to_choose_from }: Props) => {
    const [pointBased, setPointBased] = useState(true);

    return (
        <AuthenticatedLayout className="flex h-screen">
            {/* Left Sidebar (scrollable) */}
            <div className="w-full max-w-md overflow-y-auto bg-base-200 p-4 shadow-lg">
                <JudgesComponent event={event} judges={judges_to_choose_from} />
                <div className="divider" />
                <ContestantsComponent event={event} />
            </div>

            {/* Right Panel (fixed top + scrollable content) */}
            <div className="flex h-full flex-1 flex-col">
                {/* Top Fixed Controls */}
                <div className="flex items-center gap-2 border-b border-base-300 bg-base-100 p-4">
                    <fieldset className="fieldset w-fit rounded-box border border-base-300 bg-base-100 p-4">
                        <label className="label cursor-pointer gap-2">
                            <input type="checkbox" checked={pointBased} onChange={() => setPointBased(!pointBased)} className="toggle" />
                            <span className="label-text">Point based</span>
                        </label>
                    </fieldset>
                    <button className="btn btn-success">Print</button>
                </div>

                {/* Scrollable Long Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="card h-fit w-full bg-base-100 shadow-sm">
                        <div className="card-body space-y-8 p-8">
                            <TotalScoreSheetComponent event={event} pointBased={pointBased} />
                            <CategoricalWinnersComponents event={event} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Admin;
