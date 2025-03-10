import {Models} from "node-appwrite";
export type Workspace = Models.Document &{
    name: string;
    ImageUrl: string;
    inviteCode: string;
    userId: string;
}