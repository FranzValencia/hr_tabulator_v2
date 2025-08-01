export interface Criterion {
    id: number;
    name: string;
    weight: number;
}

export interface Event {
    id: number;
    name: string;
    status: 'active' | 'in-active';
    criteria?: Criterion[];
    judges?: User[];
    participants?: Participant[];
}

export interface Participant {
    id: number;
    event_id: number;
    name: string;
    event?: Event;
}
