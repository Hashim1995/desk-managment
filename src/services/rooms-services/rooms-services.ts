/* eslint-disable no-unused-vars */
/* eslint-disable default-param-last */
/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

import { IBookingReportsResponse, ICreateBook } from '@/modules/reports/types';
import {
  IDesk,
  IRoomByIdResponse,
  IRooms,
  IRoomsCreate
} from '@/modules/rooms/types';
import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
  // IHTTPSParams
} from '../adapter-config/config';

export class RoomsService {
  // eslint-disable-next-line no-use-before-define
  private static instance: RoomsService | null;

  private constructor() {}

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

  public async getReports(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IBookingReportsResponse> {
    const res = await HttpUtil.get('/Bookings', params, false, onError);
    return res;
  }

  public async getRoomById(
    id: string,
    onError?: ErrorCallBack
  ): Promise<IRoomByIdResponse> {
    const res = await HttpUtil.get(`/Rooms/${id}`, null, false, onError);
    return res;
  }

  public async getOwnerComboList(
    onError?: ErrorCallBack
  ): Promise<{ name: string; id: number }[]> {
    const res = await HttpUtil.get(`/Users/Compact`, null, false, onError);
    return res;
  }

  public async getDesksComboList(
    params?: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<{ name: string; id: number }[]> {
    const res = await HttpUtil.get(
      `/desks/Compact`,
      params || null,
      false,
      onError
    );
    return res;
  }

  public async getRoomsComboList(
    onError?: ErrorCallBack
  ): Promise<{ name: string; id: number }[]> {
    const res = await HttpUtil.get(`/rooms/Compact`, null, false, onError);
    return res;
  }

  public async saveDesk(
    payload: { roomId: number; desks: IDesk[] },
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.post('/desks', payload, onError);
    return res;
  }

  public async createBooking(
    payload: ICreateBook,
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.post('/bookings', payload, onError);
    return res;
  }

  public async cancelBook(id: number, onError?: ErrorCallBack): Promise<any> {
    const res = await HttpUtil.delete(`/bookings/${id}`, onError);
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

  public async delete(
    id: number,
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.delete(`Rooms/${id}`, onError);
    return res;
  }

  public async deleteDesk(
    id: number,
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.delete(`Desks/${id}`, onError);
    return res;
  }
}
