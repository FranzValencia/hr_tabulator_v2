import { User } from '@/types';
import { Event } from '@/types/types';

interface PageProps {
    event: Event;
    judges: User[];
}

const admin = ({ event, judges }: PageProps) => {
    return (
        <div className="flex h-screen p-4">
            <div>
                <div className="card w-96 bg-base-100 shadow-lg">
                    <div className="card-body">
                        <div className="overflow-x-auto">
                            <table className="table table-xs">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Username</th>
                                        <th>Password</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {judges.map((judge, index) => (
                                        <tr key={index}>
                                            <th>{judge.name}</th>
                                            <td>{judge.username}</td>
                                            <td>{judge.plain_password}</td>
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
            </div>
            <div></div>
        </div>
    );
};

export default admin;
