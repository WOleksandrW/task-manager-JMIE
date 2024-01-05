import { AxiosInstance } from 'axios';

export default function (instance: AxiosInstance) {
  return {
    signIn(payload: { [key: string]: string }) {
      return instance.post<string>('func/auth', payload);
    },

    signUp(payload: { [key: string]: string }) {
      return instance.post<string>('api/users', payload);
    }
  };
}
