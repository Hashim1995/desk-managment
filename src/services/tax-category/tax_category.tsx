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

export interface IGetTaxCategoryListResponse extends IGlobalResponse {
  totalCount: number;
  data: ISelectData[];
}

export class TaxCategoryServices {
  // eslint-disable-next-line no-use-before-define
  private static instance: TaxCategoryServices | null;

  private constructor() {}

  public static getInstance(): TaxCategoryServices {
    if (!this.instance) {
      TaxCategoryServices.instance = new TaxCategoryServices();
    }
    return TaxCategoryServices.instance!;
  }

  // public async updateAccountigCategory(
  //   body: IUpdateAccountCategoryPayload,
  //   onError?: ErrorCallBack
  // ): Promise<IGlobalResponse> {
  //   const res = await HttpUtil.put(`/TaxCategory`, body, onError);
  //   return res;
  // }

  public async getTaxCategorySelect(
    onError?: ErrorCallBack
  ): Promise<IGetTaxCategoryListResponse> {
    const res = await HttpUtil.get(
      '/TaxCategory/get-initial-data',
      null,
      false,
      onError
    );
    return res;
  }
}
