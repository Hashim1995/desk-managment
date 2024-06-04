/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IStaff, IStaffCreate, IStaffUpdate } from '@/modules/staff/types';

import {
  ErrorCallBack,
  HttpUtil,
  // IHTTPSParams
} from '../adapter-config/config';

export class StaffService {
  // eslint-disable-next-line no-use-before-define
  private static instance: StaffService | null;

  private constructor() { }

  public static getInstance(): StaffService {
    if (!this.instance) {
      StaffService.instance = new StaffService();
    }
    return StaffService.instance!;
  }

  public async getStaffList(
    // params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IStaff[]> {
    const res = await HttpUtil.get(
      '/Users',
      null,
      false,
      onError
    );
    return res;
  }




  public async createStaffMain(
    payload: IStaffCreate,
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.post('/Users', payload, onError);
    return res;
  }


  public async updateStaffMain(
    payload: IStaffUpdate,
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.put(
      '/Users',
      payload,
      onError
    );
    return res;
  }

  public async delete(id: number, onError?: ErrorCallBack): Promise<any> {
    const res = await HttpUtil.delete(`Users/${id}`, onError);
    return res;
  }



}
