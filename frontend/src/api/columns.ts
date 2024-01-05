import { AxiosInstance } from 'axios';
import ColumnProjectType from '../types/project/columnProjectType';

export default function (instance: AxiosInstance) {
  return {
    getDetails(payload: { list: { [key: string]: string[] } }) {
      return instance.post<{ [key: string]: ColumnProjectType[] }>(`api/columns`, payload);
    }
  };
}
