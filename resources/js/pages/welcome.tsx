import { useToast } from '@/context/ToastContext';
import { Criterion, Event } from '@/types/types';
import { Link, router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';

const welcome = ({ events }: { events: Event[] }) => {
    const [eventName, setEventName] = useState('');
    const [criteria, setCriteria] = useState<Criterion[]>([]);
    const [criterion, setCriterion] = useState<Criterion>({ name: '', weight: 0, id: 0 });

    const { showToast } = useToast();

    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
    const isDisabled = totalWeight !== 100;

    const onAddCriterion = () => {
        if (!criterion.name.trim()) return;

        setCriteria((prevData) => [
            ...prevData,
            {
                ...criterion,
                id: Date.now(),
            },
        ]);

        setCriterion({ name: '', weight: 0, id: 0 });
    };

    const onRemoveCriterion = (id: number) => {
        setCriteria((prev) => prev.filter((item) => item.id !== id));
    };

    const handleEventSubmit = async () => {
        await router.post(
            route('event.create', { event_name: eventName, criteria }),
            {},
            {
                onSuccess: () => {
                    (setCriteria([]), setCriterion({ name: '', weight: 0, id: 0 }), setEventName(''));
                    showToast('Event Created Successfully', 'success');
                },
            },
        );
    };

    return (
        <div className="flex h-screen justify-evenly p-8">
            <div className="card h-fit w-full max-w-xl bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="text-lg font-bold">New Event</div>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Event Name</legend>
                        <input type="text" className="input" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                    </fieldset>

                    <div className="text-lg font-bold">Criteria</div>

                    <div className="flex w-full gap-2">
                        <fieldset className="fieldset w-full">
                            <legend className="fieldset-legend">Criterion</legend>
                            <input
                                type="text"
                                className="input w-full"
                                value={criterion.name}
                                onChange={(e) => setCriterion({ ...criterion, name: e.target.value })}
                            />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Weight</legend>
                            <div className="flex">
                                <input
                                    type="number"
                                    className="input w-32"
                                    value={criterion.weight === 0 ? '' : criterion.weight > 100 - totalWeight ? 100 - totalWeight : criterion.weight}
                                    onChange={(e) =>
                                        setCriterion({
                                            ...criterion,
                                            weight:
                                                Number(e.target.value) === 0
                                                    ? 0
                                                    : Number(e.target.value) > 100 - totalWeight
                                                      ? 100 - totalWeight
                                                      : Number(e.target.value),
                                        })
                                    }
                                />

                                <button
                                    className="btn ml-4 btn-success"
                                    onClick={onAddCriterion}
                                    disabled={criterion.name === '' || criterion.weight === 0}
                                >
                                    Add
                                </button>
                            </div>
                        </fieldset>
                    </div>

                    {criteria.length > 0 && (
                        <div className="max-h-44 overflow-auto bg-base-200">
                            <table className="table-pin-rows table table-sm">
                                <thead>
                                    <tr>
                                        <th>Criterion</th>
                                        <th>Weight</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {criteria.map((criterion, index) => (
                                        <tr key={index}>
                                            <td>{criterion.name}</td>
                                            <td>{criterion.weight}% </td>
                                            <td className="text-end">
                                                <button className="btn btn-square btn-xs btn-error" onClick={() => onRemoveCriterion(criterion.id)}>
                                                    <X />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <button className="btn mt-8 btn-neutral" disabled={isDisabled || !eventName} onClick={() => handleEventSubmit()}>
                        Add Event
                    </button>
                </div>
            </div>
            <div className="card h-fit w-full max-w-xl bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="text-lg font-bold">Events</div>
                    <div className="overflow-x-auto border border-base-content/5 bg-base-100">
                        <table className="table table-zebra">
                            <tbody>
                                {events.map((event, index) => (
                                    <tr key={index}>
                                        <td>{event.name}</td>
                                        <td className="text-end">
                                            <div className="flex" />
                                            <Link href={route('admin', event.id)} className="btn btn-sm btn-neutral">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default welcome;
