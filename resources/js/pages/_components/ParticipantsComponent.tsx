import { User } from '@/types';
import { Event } from '@/types/types';
import CreateParticipantModal from './CreateParticipantModal';

const ParticipantsComponent = ({ event, judges }: { event: Event; judges: User[] }) => {
    return (
        <div className="card w-md bg-base-100 shadow-lg">
            <div className="card-body">
                <div className="flex justify-between">
                    <div className="text-lg font-bold">{event.name} Participants</div>
                    <CreateParticipantModal btn_className="btn-xs" />
                </div>

                {(event.judges?.length ?? 0 > 0) ? (
                    <div className="max-h-52 overflow-auto">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.judges?.map((judge: User, index) => (
                                    <tr key={index}>
                                        <th>{judge.name}</th>
                                        <td>
                                            <button
                                                className="btn btn-xs btn-error"
                                                onClick={() => {
                                                    const modal = document.getElementById('deleteJudgeModal') as HTMLDialogElement | null;
                                                    if (modal) {
                                                        modal.showModal();
                                                    }
                                                }}
                                            >
                                                Remove
                                            </button>
                                            <dialog id="deleteJudgeModal" className="modal">
                                                <div className="modal-box max-w-sm">
                                                    <h3 className="text-lg font-bold">Remove Judge </h3>

                                                    <h1 className="mt-2 text-sm">
                                                        Are you sure you want to remove <span className="font-bold">{judge.name}</span> as Judge for{' '}
                                                        {event.name}?
                                                    </h1>
                                                    <div className="modal-action">
                                                        <form method="dialog">
                                                            {/* if there is a button in form, it will close the modal */}
                                                            <button className="btn">Cancel</button>
                                                            <button className="btn btn-error">Remove</button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </dialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-base-200 py-2 text-center text-xs font-bold text-base-content/25 uppercase">No Judges selected</div>
                )}
            </div>
        </div>
    );
};

export default ParticipantsComponent;
