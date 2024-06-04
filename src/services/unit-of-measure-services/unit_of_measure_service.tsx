/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

// import { IGlobalResponse } from '@/models/common';

import { IGlobalResponse, ISelectData } from '@/models/common';
import {
  ErrorCallBack,
  HttpUtil
  //   IHTTPSParams
} from '../adapter-config/config';

export interface IGetUnitOfMeasureListResponse extends IGlobalResponse {
  totalCount: number;
  data: ISelectData[];
}

export class UnitOfMeasureServices {
  // eslint-disable-next-line no-use-before-define
  private static instance: UnitOfMeasureServices | null;

  private constructor() {}

  public static getInstance(): UnitOfMeasureServices {
    if (!this.instance) {
      UnitOfMeasureServices.instance = new UnitOfMeasureServices();
    }
    return UnitOfMeasureServices.instance!;
  }

  // public async updateAccountigCategory(
  //   body: IUpdateAccountCategoryPayload,
  //   onError?: ErrorCallBack
  // ): Promise<IGlobalResponse> {
  //   const res = await HttpUtil.put(`/UnitOfMeasure`, body, onError);
  //   return res;
  // }

  public async getUnitOfMeasureSelect(
    onError?: ErrorCallBack
  ): Promise<IGetUnitOfMeasureListResponse> {
    const res = await HttpUtil.get(
      '/UnitOfMeasurement/get-initial-data',
      null,
      false,
      onError
    );
    return res;
  }
}
