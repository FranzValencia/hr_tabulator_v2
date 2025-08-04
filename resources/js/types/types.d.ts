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
    contestants?: Contestant[];
}

export interface Contestant {
    id: number;
    event_id: number;
    name: string;
    event?: Event;
    scores?: Score[];
}

export interface Score {
    id: number;
    event_id: number;
    judge_id: number;
    contestant_id: number;
    criterion_id: number;
    score: number | null;
    event?: Event;
    judge?: User;
    contestant?: Contestant;
    criterion?: Criterion;
}
