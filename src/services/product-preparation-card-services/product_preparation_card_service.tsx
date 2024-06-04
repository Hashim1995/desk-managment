/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

import { IGlobalResponse, ISelectData } from '@/models/common';

import {
  IAddProductPreparationCardForm,
  IGetProductPreparationCardResponse,
  IProductPreparationCardItem,
  IUpdateProductPreparationCardPayload
} from '@/modules/settings/entities/product-preparation-card/models';
import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
  //   IHTTPSParams
} from '../adapter-config/config';

export interface IGetProductPreparationListResponse extends IGlobalResponse {
  totalCount: number;
  data: ISelectData[];
}

export class ProductPreparationCardServices {
  // eslint-disable-next-line no-use-before-define
  private static instance: ProductPreparationCardServices | null;

  private constructor() {}

  public static getInstance(): ProductPreparationCardServices {
    if (!this.instance) {
      ProductPreparationCardServices.instance =
        new ProductPreparationCardServices();
    }
    return ProductPreparationCardServices.instance!;
  }

  public async getSingleProductPreparationCard(
    id: string,
    onError?: ErrorCallBack
  ): Promise<IProductPreparationCardItem> {
    const res = await HttpUtil.get(
      `/documentapprovalcycle/${id}`,
      null,
      false,
      onError
    );
    return res;
  }

  public async updateProductPreparationCard(
    body: IUpdateProductPreparationCardPayload,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/ProductPreparationCard`, body, onError);
    return res;
  }

  public async getProductPreparationCards(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetProductPreparationCardResponse> {
    const res = await HttpUtil.get(
      '/ProductPreparationCard',
      params,
      false,
      onError
    );
    return res;
  }

  public async getProductPreparationSelect(
    onError?: ErrorCallBack
  ): Promise<IGetProductPreparationListResponse> {
    const res = await HttpUtil.get(
      '/ProductPreparationCard/get-initital-data',
      null,
      false,
      onError
    );
    return res;
  }

  public async changeStatus(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/ProductPreparationCard/${id}`, onError);
    return res;
  }

  public async addProductPreparationCard(
    body: IAddProductPreparationCardForm,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/ProductPreparationCard', body, onError);
    return res;
  }

  public async deleteProductPreparationCard(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.delete(`/ProductPreparationCard/${id}`, onError);
    return res;
  }
}
