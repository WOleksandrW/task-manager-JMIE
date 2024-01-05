import { AxiosInstance } from 'axios';
import { DetailsNotedType, NotedItemUserType } from '../types/user/notedItemUserType';

export default function (instance: AxiosInstance) {
  return {
    getDetails(payload: { list: NotedItemUserType[] }) {
      return instance.post<DetailsNotedType[]>(`api/noted`, payload);
    }
  };
}
