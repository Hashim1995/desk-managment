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

export interface IGetScaleAndSizeListResponse extends IGlobalResponse {
  totalCount: number;
  data: ISelectData[];
}

export class ScaleAndSizeServices {
  // eslint-disable-next-line no-use-before-define
  private static instance: ScaleAndSizeServices | null;

  private constructor() {}

  public static getInstance(): ScaleAndSizeServices {
    if (!this.instance) {
      ScaleAndSizeServices.instance = new ScaleAndSizeServices();
    }
    return ScaleAndSizeServices.instance!;
  }

  public async getScaleAndSizeSelect(
    onError?: ErrorCallBack
  ): Promise<IGetScaleAndSizeListResponse> {
    const res = await HttpUtil.get(
      '/ScaleSize/get-initial-data',
      null,
      false,
      onError
    );
    return res;
  }
}
