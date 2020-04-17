export interface IContact {
    userID?: string;
    name: string;
    isActive: boolean;
    telephone: string;
    roles: string[];
    picture:string;
    createdAt?:string;
    updatedAt?:string;
}

