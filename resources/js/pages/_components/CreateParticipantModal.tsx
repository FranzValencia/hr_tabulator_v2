import { useState } from 'react';

interface ComponentProps {
    btn_className?: string;
}

const CreateParticipantModal = ({ btn_className }: ComponentProps) => {
    const [participant, setParticipant] = useState('');

    const closeModal = () => {
        const modal = document.getElementById('createParticipantModal') as HTMLDialogElement | null;

        if (modal) {
            modal.close();
        }
    };

    return (
        <>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <button
                className={`btn btn-success ${btn_className}`}
                onClick={() => {
                    const modal = document.getElementById('createParticipantModal') as HTMLDialogElement | null;

                    if (modal) {
                        modal.showModal();
                    }
                }}
            >
                New Participant
            </button>
            <dialog id="createParticipantModal" className="modal">
                <form className="modal-box max-w-sm">
                    <h3 className="text-lg font-bold">Create Participant</h3>
                    <div className="flex flex-col">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Participant name</legend>
                            <input
                                type="text"
                                className="input w-full"
                                required
                                value={participant}
                                onChange={(e) => setParticipant(e.target.value)}
                            />
                        </fieldset>
                    </div>
                    <div className="divider"></div>
                    <div className="text-end">
                        <button
                            type="button"
                            className="btn"
                            onClick={() => {
                                closeModal();
                                // clearInputs();
                            }}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-success">
                            Create
                        </button>
                    </div>
                </form>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
};

export default CreateParticipantModal;
