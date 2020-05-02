import {ObjectID} from 'mongodb';

export interface IUser {
  _id: ObjectID;
  email: string;
  name: string;
  firstName: string;
  alias: string;
  active: boolean;
}