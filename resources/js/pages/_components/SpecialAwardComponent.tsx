import { SpecialAward } from '@/types/types';

const SpecialAwardComponent = ({ awards }: { awards: SpecialAward[] }) => {
    return (
        <div>
            <h2 className="card-title text-xl font-bold uppercase">Special Awards</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Award</th>
                            <th>Description</th>
                            <th>Winner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {awards.map((award) => (
                            <tr key={award.id}>
                                <th>{award.title}</th>
                                <td>{award.description ?? '-'}</td>
                                <td>{award.contestant?.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SpecialAwardComponent;
