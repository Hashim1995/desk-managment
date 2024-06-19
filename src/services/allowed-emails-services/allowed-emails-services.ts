/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IAllowedEmailResponse, IAllowedEmailsCreate, IAllowedEmailsUpdate } from '@/modules/allowed-emails/types';

import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
  // IHTTPSParams
} from '../adapter-config/config';

export class AllowedEmailsService {
  // eslint-disable-next-line no-use-before-define
  private static instance: AllowedEmailsService | null;

  private constructor() { }

  public static getInstance(): AllowedEmailsService {
    if (!this.instance) {
      AllowedEmailsService.instance = new AllowedEmailsService();
    }
    return AllowedEmailsService.instance!;
  }

  public async getAllowedEmailsList(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IAllowedEmailResponse> {
    const res = await HttpUtil.get('/AllowedEmails', params, false, onError);
    return res;
  }

  public async createAllowedEmailsMain(
    payload: IAllowedEmailsCreate,
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.post('/AllowedEmails', payload, onError);
    return res;
  }

  public async updateAllowedEmailsMain(
    payload: IAllowedEmailsUpdate,
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.put('/AllowedEmails', payload, onError);
    return res;
  }


  public async delete(id: number, onError?: ErrorCallBack): Promise<any> {
    const res = await HttpUtil.delete(`AllowedEmails/${id}`, onError);
    return res;
  }
}
