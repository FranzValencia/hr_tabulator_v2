import { Contestant, Event } from '@/types/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import CreateContestantModal from './CreateContestantModal';

const ContestantsComponent = ({ event }: { event: Event }) => {
    const [selectedParticipant, setSelectedParticipant] = useState<Contestant | null>(null);

    const handleDelete = async () => {
        if (!selectedParticipant) return;
        await router.delete(route('remove.contestant', { contestant_id: selectedParticipant.id }));
        setSelectedParticipant(null);
        const modal = document.getElementById('deleteContestantModal') as HTMLDialogElement | null;
        modal?.close();
    };

    return (
        <div className="card w-full bg-base-100 shadow-lg">
            <div className="card-body">
                <div className="flex justify-between">
                    <div className="text-lg font-bold">{event.name} Participants</div>
                    <CreateContestantModal event_id={event.id} btn_className="btn-xs" />
                </div>

                {(event.contestants?.length ?? 0) > 0 ? (
                    <div className="max-h-52 overflow-auto">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.contestants?.map((participant: Contestant, index) => (
                                    <tr key={index}>
                                        <th>{participant.name}</th>
                                        <td className="flex justify-end">
                                            <button
                                                className="btn btn-xs btn-error"
                                                onClick={() => {
                                                    setSelectedParticipant(participant);
                                                    const modal = document.getElementById('deleteContestantModal') as HTMLDialogElement | null;
                                                    modal?.showModal();
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-base-200 py-2 text-center text-xs font-bold text-base-content/25 uppercase">No Participants</div>
                )}
            </div>

            {/* Single Delete Modal */}
            <dialog id="deleteContestantModal" className="modal">
                <div className="modal-box max-w-sm">
                    <h3 className="text-lg font-bold">Remove Participant</h3>

                    <h1 className="mt-2 text-sm">
                        Are you sure you want to remove <span className="font-bold">{selectedParticipant?.name}</span> as Participant for {event.name}
                        ?
                    </h1>

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Cancel</button>
                            <button type="button" className="btn btn-error" onClick={handleDelete}>
                                Remove
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default ContestantsComponent;
