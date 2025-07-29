import { Event } from '@/types/types';

const admin = ({ event }: { event: Event }) => {
    return (
        <div className="flex h-screen p-4">
            <div>
                <div className="card w-96 bg-base-100 shadow-lg">
                    <div className="card-body">
                        <div className="overflow-x-auto">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Job</th>
                                        <th>Favorite Color</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>1</th>
                                        <td>Cy Ganderton</td>
                                        <td>Quality Control Specialist</td>
                                        <td>Blue</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div></div>
        </div>
    );
};

export default admin;
