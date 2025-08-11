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
    scores?: Score[];
    contestants?: Contestant[];
}

export interface EventUser {
    id: number;
    event_id: number;
    user_id: number;
    scores?: Score[];
    event?: Event;
    criteria?: Criterion[];
    status: 'active' | 'in-active';
    // event?: Event;
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
    event_user_id: number;
    contestant_id: number;
    criterion_id: number;
    judge_id: number;
    score: number | null;
    event?: Event;
    judge?: User;
    contestant?: Contestant;
    criterion?: Criterion;
}
