export interface IResponseListObject<T> {
    status: number;
    message: string;
    body: T[];
}

export interface IResponseObject<T> {
    status: number;
    message: string;
    body: T;
}