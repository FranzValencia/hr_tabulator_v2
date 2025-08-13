import { useToast } from '@/context/ToastContext';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { User } from '@/types';
import { Event, SpecialAward } from '@/types/types';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CategoricalWinnersComponents from './_components/CategoricalWinnersComponents';
import ContestantsComponent from './_components/ContestantsComponent';
import JudgesComponent from './_components/JudgesComponent';
import JudgeScoresheet from './_components/JudgeScoresheet';
import SpecialAwardComponent from './_components/SpecialAwardComponent';
import TotalScoreSheetComponent from './_components/TotalScoreSheetComponent';

interface Props {
    event: Event;
    judges_to_choose_from: User[];
}

const admin = ({ event, judges_to_choose_from }: Props) => {
    const [pointBased, setPointBased] = useState(true);
    const { showToast } = useToast();

    // NEW AWARD STATES
    const [specialAwards] = useState<SpecialAward[]>(event.special_awards ?? []);
    const [awardTitle, setAwardTitle] = useState('');
    const [awardDescription, setAwardDescription] = useState('');
    const [awardAwardee, setAwardAwardee] = useState<number | null>(null);

    const handleAwardeeSelection = (id: number) => {
        setAwardAwardee((prevId) => (prevId === id ? null : id));
    };

    const openNewAwardModal = () => {
        const modal = document.getElementById('newAwardModal') as HTMLDialogElement | null;
        if (modal) {
            modal.showModal();
        }
    };

    const closeNewAwardModal = () => {
        const modal = document.getElementById('newAwardModal') as HTMLDialogElement | null;
        if (modal) {
            modal.close();
        }
    };

    const handleCreateAward = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await router.post(
            route('create.award', { award_title: awardTitle, award_description: awardDescription, event_id: event.id, contestant_id: awardAwardee }),
            {},
            {
                onSuccess: () => {
                    closeNewAwardModal();
                    clearForm();
                    showToast('Successfully added award!', 'success');
                },
            },
        );
    };

    const clearForm = () => {
        setAwardAwardee(null);
        setAwardTitle('');
        setAwardDescription('');
    };

    return (
        <AuthenticatedLayout className="flex">
            {/* SCROLLABLE LONG CONTENT */}
            <div className="w-full max-w-md overflow-auto bg-base-200 p-4 shadow-lg">
                <JudgesComponent event={event} judges={judges_to_choose_from} />
                <div className="divider" />
                <ContestantsComponent event={event} />
            </div>

            <div className="flex h-full w-full flex-col">
                {/* Fixed Top Controls */}
                <div className="flex items-center justify-between gap-2 bg-base-100 p-4">
                    <div className="flex items-center gap-2">
                        <fieldset className="fieldset w-fit rounded-box border border-base-300 bg-base-100 p-4">
                            <label className="label cursor-pointer gap-2">
                                <input type="checkbox" checked={pointBased} onChange={() => setPointBased(!pointBased)} className="toggle" />
                                <span className="label-text">{pointBased ? 'Point' : 'Rank'} based</span>
                            </label>
                        </fieldset>
                        <button className="btn bg-base-200" onClick={openNewAwardModal}>
                            Add award <Plus size={14} />{' '}
                        </button>
                    </div>

                    <button className="btn btn-success">Print</button>
                </div>

                {/* Scrollable Content */}
                <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-base-100 p-8">
                    <div className="card h-fit w-full card-xs">
                        <div className="card-body">
                            <div className="flex flex-col gap-8">
                                <TotalScoreSheetComponent event={event} pointBased={pointBased} />
                                <CategoricalWinnersComponents event={event} pointBased={pointBased} />
                                <SpecialAwardComponent awards={specialAwards} />
                                <div className="divider my-0"></div>
                            </div>
                        </div>
                    </div>

                    {event.judges?.map((judge, index) => (
                        <div className="card h-fit w-full card-xs" key={index}>
                            <div className="card-body">
                                <div className="flex flex-col gap-8">
                                    <div className="divider my-0"></div>
                                    <TotalScoreSheetComponent event={event} pointBased={pointBased} />
                                    <CategoricalWinnersComponents event={event} pointBased={pointBased} />
                                    <SpecialAwardComponent awards={specialAwards} />
                                    <JudgeScoresheet
                                        key={index}
                                        judge={judge}
                                        criteria={event.criteria ?? []}
                                        contestants={event.contestants ?? []}
                                        pointBased={pointBased}
                                    />
                                    <div className="divider my-0"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <dialog id="newAwardModal" className="modal">
                <form onSubmit={(e) => handleCreateAward(e)} className="modal-box max-w-sm">
                    <h3 className="text-lg font-bold">Special award</h3>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Award</legend>
                        <input required type="text" className="input w-full" value={awardTitle} onChange={(e) => setAwardTitle(e.target.value)} />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Description</legend>
                        <textarea
                            className="textarea w-full"
                            placeholder="( Optional )"
                            value={awardDescription}
                            onChange={(e) => setAwardDescription(e.target.value)}
                            required
                        ></textarea>
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Select awardee</legend>
                        {event.contestants?.map((contestant, index) => (
                            <div
                                key={index}
                                className={`cursor-pointer rounded p-2 capitalize hover:bg-base-300 ${awardAwardee === contestant.id ? 'bg-base-300' : 'bg-base-300/50'}`}
                                onClick={() => handleAwardeeSelection(contestant.id)}
                            >
                                {contestant.name}
                            </div>
                        ))}
                    </fieldset>
                    <div className="divider" />
                    <div className="text-end">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => {
                                closeNewAwardModal();
                                clearForm();
                            }}
                        >
                            Cancel
                        </button>
                        <button className="btn btn-success" type="submit" disabled={!awardAwardee}>
                            Save
                        </button>
                    </div>
                </form>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </AuthenticatedLayout>
    );
};

export default admin;
