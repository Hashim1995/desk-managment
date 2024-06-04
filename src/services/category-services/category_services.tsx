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

export interface IGetCategoryListResponse extends IGlobalResponse {
  totalCount: number;
  data: ISelectData[];
}

export class CategoryServices {
  // eslint-disable-next-line no-use-before-define
  private static instance: CategoryServices | null;

  private constructor() {}

  public static getInstance(): CategoryServices {
    if (!this.instance) {
      CategoryServices.instance = new CategoryServices();
    }
    return CategoryServices.instance!;
  }

  public async getCategorySelectList(
    onError?: ErrorCallBack
  ): Promise<IGetCategoryListResponse> {
    const res = await HttpUtil.get(
      '/Category/get-initial-data',
      null,
      false,
      onError
    );
    return res;
  }
}
