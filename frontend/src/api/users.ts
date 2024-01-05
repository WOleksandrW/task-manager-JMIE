import { AxiosInstance } from 'axios';
import UserType from '../types/user/userType';

export default function (instance: AxiosInstance) {
  return {
    getAllData(query?: string) {
      return instance.get<UserType[]>(`api/users/${query ?? ''}`);
    },

    getSeveral(payload: { list: string[] }) {
      return instance.post<UserType[]>('api/users/several', payload);
    }
  };
}
