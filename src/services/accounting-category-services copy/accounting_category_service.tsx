/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

import { IGlobalResponse } from '@/models/common';

import {
  IAccountCategoryItem,
  IAddAccountCategoryForm,
  IGetAccountCategoryResponse,
  IUpdateAccountCategoryPayload
} from '@/modules/settings/entities/accounting-category/models';
import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
  //   IHTTPSParams
} from '../adapter-config/config';

export class AccountingCategoryServices {
  // eslint-disable-next-line no-use-before-define
  private static instance: AccountingCategoryServices | null;

  private constructor() {}

  public static getInstance(): AccountingCategoryServices {
    if (!this.instance) {
      AccountingCategoryServices.instance = new AccountingCategoryServices();
    }
    return AccountingCategoryServices.instance!;
  }

  public async getSingleAccountingCategory(
    id: string,
    onError?: ErrorCallBack
  ): Promise<IAccountCategoryItem> {
    const res = await HttpUtil.get(
      `/documentapprovalcycle/${id}`,
      null,
      false,
      onError
    );
    return res;
  }

  public async updateAccountigCategory(
    body: IUpdateAccountCategoryPayload,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/AccountingCategory`, body, onError);
    return res;
  }

  public async getAccountigCategories(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetAccountCategoryResponse> {
    const res = await HttpUtil.get(
      '/AccountingCategory',
      params,
      false,
      onError
    );
    return res;
  }

  public async changeStatus(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/AccountingCategory/${id}`, onError);
    return res;
  }

  public async addAccountigCategory(
    body: IAddAccountCategoryForm,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/AccountingCategory', body, onError);
    return res;
  }

  public async deleteAccountigCategory(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.delete(`/AccountingCategory/${id}`, onError);
    return res;
  }
}
