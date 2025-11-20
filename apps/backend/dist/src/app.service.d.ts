import { Connection } from 'mongoose';
export declare class AppService {
    private readonly connection;
    private redis;
    constructor(connection: Connection);
    getHello(): string;
    getHealth(): Promise<any>;
}
