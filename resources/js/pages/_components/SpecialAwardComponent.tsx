import { useToast } from '@/context/ToastContext';
import { SpecialAward } from '@/types/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const SpecialAwardComponent = ({ awards, isPrinting }: { awards: SpecialAward[]; isPrinting: boolean }) => {
    const { showToast } = useToast();
    const [awardToDelete, setAwardToDelete] = useState<SpecialAward | null>(null);

    const handleDelete = async () => {
        await router.patch(
            route('remove.award', { special_award_id: awardToDelete?.id }),
            {},
            {
                onSuccess: () => {
                    showToast('Successfully Removed Award', 'success');
                    setAwardToDelete(null);
                    handleCloseDeleteModal();
                },
            },
        );
    };

    const handleOpenDeleteModal = () => {
        const modal = document.getElementById('deleteSpecialAwardModal') as HTMLDialogElement | null;
        if (modal) {
            modal.showModal();
        }
    };

    const handleCloseDeleteModal = () => {
        const modal = document.getElementById('deleteSpecialAwardModal') as HTMLDialogElement | null;
        if (modal) {
            modal.close();
        }
    };

    return (
        <div>
            <h2 className="card-title text-xl font-bold uppercase">Special Awards</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra table-sm">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Award</th>
                            <th>Winner</th>
                            <th>Description</th>
                            {!isPrinting && <th>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {awards.map((award) => (
                            <tr key={award.id}>
                                <th>{award.title}</th>
                                <td className="text-primary">🏅 {award.contestant?.name}</td>
                                <td>{award.description ?? '-'}</td>
                                {!isPrinting && (
                                    <td>
                                        <button
                                            className="btn btn-sm btn-error"
                                            onClick={() => {
                                                setAwardToDelete(award);
                                                handleOpenDeleteModal();
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <dialog id="deleteSpecialAwardModal" className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Remove Award?</h3>
                    <h1 className="my-4 text-sm">
                        Are you sure you want to remove <span className="font-bold">{awardToDelete?.title}</span> awarded to{' '}
                        <span className="font-bold"> {awardToDelete?.contestant?.name}</span>
                    </h1>
                    <div className="text-end">
                        <button className="btn btn-ghost" onClick={handleCloseDeleteModal}>
                            Cancel
                        </button>
                        <button className="btn btn-error" onClick={handleDelete}>
                            Confirm
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default SpecialAwardComponent;
