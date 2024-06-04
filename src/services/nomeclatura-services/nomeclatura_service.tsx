/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

// import { IGlobalResponse } from '@/models/common';

import { IGetNomeclatureResponse } from '@/modules/nomenclatura/models';
import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
  //   IHTTPSParams
} from '../adapter-config/config';

export class NomeclaturaServices {
  // eslint-disable-next-line no-use-before-define
  private static instance: NomeclaturaServices | null;

  private constructor() {}

  public static getInstance(): NomeclaturaServices {
    if (!this.instance) {
      NomeclaturaServices.instance = new NomeclaturaServices();
    }
    return NomeclaturaServices.instance!;
  }

  // public async updateAccountigCategory(
  //   body: IUpdateAccountCategoryPayload,
  //   onError?: ErrorCallBack
  // ): Promise<IGlobalResponse> {
  //   const res = await HttpUtil.put(`/Nomeclatura`, body, onError);
  //   return res;
  // }

  public async getAllNomenclature(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetNomeclatureResponse> {
    const res = await HttpUtil.get(
      '/Nomenclature/get-filter',
      params,
      false,
      onError
    );
    return res;
  }

  public async getExportToExcel(onError?: ErrorCallBack) {
    const res = await HttpUtil.get(
      '/Nomenclature/export-excel',
      null,
      false,
      onError
    );
    return res;
  }
}
