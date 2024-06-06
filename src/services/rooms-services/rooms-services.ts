/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */


import { IRooms, IRoomsCreate } from '@/modules/rooms/types';
import {
  ErrorCallBack,
  HttpUtil
  // IHTTPSParams
} from '../adapter-config/config';

export class RoomsService {
  // eslint-disable-next-line no-use-before-define
  private static instance: RoomsService | null;

  private constructor() { }

  public static getInstance(): RoomsService {
    if (!this.instance) {
      RoomsService.instance = new RoomsService();
    }
    return RoomsService.instance!;
  }

  public async getRoomsList(
    // params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IRooms[]> {
    const res = await HttpUtil.get('/Rooms', null, false, onError);
    return res;
  }

  public async createRoomsMain(
    payload: IRoomsCreate,
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.post('/Rooms', payload, onError);
    return res;
  }

  public async updateRoomsMain(
    payload: any,
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.put('/Users', payload, onError);
    return res;
  }


  public async delete(id: number, onError?: ErrorCallBack): Promise<any> {
    const res = await HttpUtil.delete(`Users/${id}`, onError);
    return res;
  }
}
