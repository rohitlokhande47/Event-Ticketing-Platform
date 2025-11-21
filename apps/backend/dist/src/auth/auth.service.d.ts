import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
export declare class AuthService {
    private userModel;
    constructor(userModel: Model<User>);
    signup(name: string, email: string, password: string): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    signin(email: string, password: string): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
}
