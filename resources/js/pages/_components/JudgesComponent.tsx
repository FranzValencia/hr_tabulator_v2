import { User } from '@/types';
import { Event } from '@/types/types';
import { router } from '@inertiajs/react';

const JudgesComponent = ({ event, judges }: { event: Event; judges: User[] }) => {
    return (
        <div className="card w-96 bg-base-100 shadow-lg">
            <div className="card-body">
                <div className="text-lg font-bold">Add Judges</div>
                <div className="overflow-x-auto">
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
                                                <h3 className="text-lg font-bold">Add Judge</h3>
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
                                                                router.post(route('event.add.judge', { event_id: event.id, user_id: judge.id }))
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
                <div className="text-lg font-bold">Event Judges</div>
                <div className="overflow-x-auto">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Password</th>
                            </tr>
                        </thead>
                        <tbody>
                            {event.judges?.map((judge: User, index) => (
                                <tr key={index}>
                                    <th>{judge.name}</th>
                                    <td>{judge.username}</td>
                                    <td>{judge.plain_password}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default JudgesComponent;
