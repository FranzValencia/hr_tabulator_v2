import { User } from '@/types';
import { Event } from '@/types/types';
import { router } from '@inertiajs/react';
import CreateJudgeModal from './CreateJudgeModal';

const JudgesComponent = ({ event, judges }: { event: Event; judges: User[] }) => {
    const handleJudgeRemoval = async (user_id: number, event_id: number) => {
        await router.delete(route('event.remove.judge', { event_id, user_id }));
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="card w-md bg-base-100 shadow-lg">
                <div className="card-body">
                    <div className="flex justify-between">
                        <div className="text-lg font-bold">Judges</div>
                        <CreateJudgeModal btn_className="btn-xs" event_id={event.id} />
                    </div>
                    {judges.length > 0 ? (
                        <div className="max-h-52 overflow-auto">
                            <table className="table-pin-rows table bg-base-200 table-xs">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Username</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {judges.map((judge, index) => (
                                        <tr key={index}>
                                            <th>{judge.name}</th>
                                            <td>{judge.username}</td>
                                            <td>
                                                {/* Open the modal using document.getElementById('ID').showModal() method */}
                                                <button
                                                    className="btn btn-xs btn-success"
                                                    onClick={() => {
                                                        const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
                                                        if (modal) {
                                                            modal.showModal();
                                                        }
                                                    }}
                                                >
                                                    Add
                                                </button>
                                                <dialog id="my_modal_1" className="modal">
                                                    <div className="modal-box max-w-sm">
                                                        <h3 className="text-lg font-bold">Add Judge </h3>

                                                        <h1 className="mt-2 text-sm">
                                                            Add <span className="font-bold">{judge.name}</span> as Judge for {event.name}?
                                                        </h1>
                                                        <div className="modal-action">
                                                            <form method="dialog">
                                                                {/* if there is a button in form, it will close the modal */}
                                                                <button className="btn">Cancel</button>
                                                                <button
                                                                    className="btn btn-success"
                                                                    onClick={() =>
                                                                        router.post(
                                                                            route('event.add.judge', { event_id: event.id, user_id: judge.id }),
                                                                        )
                                                                    }
                                                                >
                                                                    Add
                                                                </button>
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
                        <div className="bg-base-200 py-2 text-center text-xs font-bold text-base-content/25 uppercase">No Judge created</div>
                    )}
                    <div className="divider my-0" />
                    <div className="text-lg font-bold">{event.name} Judges</div>
                    {(event.judges?.length ?? 0 > 0) ? (
                        <div className="max-h-52 overflow-auto">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Username</th>
                                        <th>Password</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {event.judges?.map((judge: User, index) => (
                                        <tr key={index}>
                                            <th>{judge.name}</th>
                                            <td>{judge.username}</td>
                                            <td>{judge.plain_password}</td>
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
                                                            Are you sure you want to remove <span className="font-bold">{judge.name}</span> as Judge
                                                            for {event.name}?
                                                        </h1>
                                                        <div className="modal-action">
                                                            <form method="dialog">
                                                                {/* if there is a button in form, it will close the modal */}
                                                                <button className="btn">Cancel</button>
                                                                <button
                                                                    className="btn btn-error"
                                                                    onClick={() => handleJudgeRemoval(judge.id, event.id)}
                                                                >
                                                                    Remove
                                                                </button>
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
        </div>
    );
};

export default JudgesComponent;
