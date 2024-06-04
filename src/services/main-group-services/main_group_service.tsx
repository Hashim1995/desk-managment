/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

import { IGlobalResponse } from '@/models/common';

import {
  IAddMainGroupForm,
  IGetMainGroupListResponse,
  IGetMainGroupResponse,
  IMainGroupItem,
  IUpdateMainGroupPayload
} from '@/modules/settings/entities/main-group/models';
import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
  //   IHTTPSParams
} from '../adapter-config/config';

export class MainGroupServices {
  // eslint-disable-next-line no-use-before-define
  private static instance: MainGroupServices | null;

  private constructor() {}

  public static getInstance(): MainGroupServices {
    if (!this.instance) {
      MainGroupServices.instance = new MainGroupServices();
    }
    return MainGroupServices.instance!;
  }

  public async getSingleMainGroup(
    id: string,
    onError?: ErrorCallBack
  ): Promise<IMainGroupItem> {
    const res = await HttpUtil.get(
      `/documentapprovalcycle/${id}`,
      null,
      false,
      onError
    );
    return res;
  }

  public async updateMainGroup(
    body: IUpdateMainGroupPayload,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/MainGroup`, body, onError);
    return res;
  }

  public async getMainGroups(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetMainGroupResponse> {
    const res = await HttpUtil.get('/MainGroup', params, false, onError);
    return res;
  }

  public async getMainSelectList(
    onError?: ErrorCallBack
  ): Promise<IGetMainGroupListResponse> {
    const res = await HttpUtil.get(
      '/MainGroup/get-initial-data',
      null,
      false,
      onError
    );
    return res;
  }

  // public async changeStatus(
  //   id: number,
  //   onError?: ErrorCallBack
  // ): Promise<IGlobalResponse> {
  //   const res = await HttpUtil.patch(
  //     `/documentapprovalcycle/changestatus/${id}`,
  //     onError
  //   );
  //   return res;
  // }

  public async addMainGroup(
    body: IAddMainGroupForm,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/MainGroup', body, onError);
    return res;
  }

  public async deleteMainGroup(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.delete(`/MainGroup/${id}`, onError);
    return res;
  }
}
