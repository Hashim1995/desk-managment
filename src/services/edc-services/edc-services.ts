/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { ICreateResponse, IGlobalResponse } from '@/models/common';
import {
  ICompanyDetailResponse,
  IDeleteEdcItemResponse,
  IEdcAdditionForm,
  IEdcChangeLogListItemResponse,
  IEdcContractPayload,
  IEdcDocsListOptionsResponse,
  IEdcDocVersionResponse,
  IEdcInvoiceForm,
  IGetDocumentCountInPoolResponse,
  IGetEdcContractByIdResponse,
  IGetEdcExtraByIdResponse,
  IGetEdcListResponse,
  IGetIdforPoolDocumentResponse,
  IGetReceiverEntityStaffResponse,
  // IGetReceivingEntityEmployeesResponse,
  IGetTemplatesListResponse,
  IPermissionResponse,
  RejectMessage,
  SelectTemplatesForDocument
} from '@/modules/rooms/models';
import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
} from '../adapter-config/config';

export class EdcServies {
  // eslint-disable-next-line no-use-before-define
  private static instance: EdcServies | null;

  private constructor() {}

  public static getInstance(): EdcServies {
    if (!this.instance) {
      EdcServies.instance = new EdcServies();
    }
    return EdcServies.instance!;
  }

  public async getEdcList(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetEdcListResponse> {
    const res = await HttpUtil.get(
      '/legalentity/uniondocuments',
      params,
      false,
      onError
    );
    return res;
  }

  public async getEdcChangeLog(
    id: string,
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IEdcChangeLogListItemResponse> {
    const res = await HttpUtil.get(
      `/document/docflow/${id}`,
      params,
      false,
      onError
    );
    return res;
  }

  public async getByVoen(
    voen: string,
    onError?: ErrorCallBack
  ): Promise<ICompanyDetailResponse> {
    const res = await HttpUtil.get(
      `/legalentity/getByVoen/${voen}`,
      null,
      false,
      onError
    );
    return res;
  }

  public async createContractMain(
    payload: IEdcContractPayload,
    onError?: ErrorCallBack
  ): Promise<ICreateResponse> {
    const res = await HttpUtil.post('/document/contract', payload, onError);
    return res;
  }

  public async createContractDraft(
    payload: IEdcContractPayload,
    onError?: ErrorCallBack
  ): Promise<ICreateResponse> {
    const res = await HttpUtil.post('/draft/contract', payload, onError);
    return res;
  }

  public async getContractById(
    id: string,
    params: IHTTPSParams[],
    isDraft: boolean,
    onError?: ErrorCallBack
  ): Promise<IGetEdcContractByIdResponse> {
    const res = await HttpUtil.get(
      isDraft ? `/draft/contract/${id}` : `/document/contract/${id}`,
      params,
      false,
      onError
    );
    return res;
  }

  public async getDocByVersion(
    id: string,
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IEdcDocVersionResponse> {
    const res = await HttpUtil.get(
      `/document/getfile/${id}`,
      params,
      false,
      onError
    );
    return res;
  }

  public async updateContractMain(
    id: string,
    isDraft: boolean,
    payload: IEdcContractPayload,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(
      isDraft ? `/draft/submitcontract/${id}` : `/document/contract/${id}`,
      payload,
      onError
    );
    return res;
  }

  public async getDocsListOptions(
    onError?: ErrorCallBack
  ): Promise<IEdcDocsListOptionsResponse> {
    const res = await HttpUtil.get(
      '/legalentity/contracts',
      null,
      false,
      onError
    );
    return res;
  }

  public async updateContractDraft(
    id: string,
    isDraft: boolean,
    payload: IEdcContractPayload,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(
      isDraft ? `/draft/contract/${id}` : `/document/contracttodraft/${id}`,
      payload,
      onError
    );
    return res;
  }

  public async createAdditionMain(
    payload: IEdcAdditionForm,
    onError?: ErrorCallBack
  ): Promise<ICreateResponse> {
    const res = await HttpUtil.post(`/document/extra`, payload, onError);
    return res;
  }

  public async updateAdditionMain(
    id: string | undefined,
    isDraft: boolean,
    payload: IEdcAdditionForm,
    onError?: ErrorCallBack
  ): Promise<ICreateResponse> {
    const res = await HttpUtil.put(
      isDraft ? `/draft/submitextra/${id}` : `/document/extra/${id}`,
      payload,
      onError
    );
    return res;
  }

  public async createActMain(
    payload: IEdcAdditionForm,
    onError?: ErrorCallBack
  ): Promise<ICreateResponse> {
    const res = await HttpUtil.post(`/document/extra`, payload, onError);
    return res;
  }

  public async updateActMain(
    id: string | undefined,
    isDraft: boolean,
    payload: IEdcAdditionForm,
    onError?: ErrorCallBack
  ): Promise<ICreateResponse> {
    const res = await HttpUtil.put(
      isDraft ? `/draft/submitextra/${id}` : `/document/extra/${id}`,
      payload,
      onError
    );
    return res;
  }

  public async deleteDocument(
    id: number | undefined,
    onError?: ErrorCallBack
  ): Promise<IDeleteEdcItemResponse> {
    const res = await HttpUtil.delete(`/document/${id}`, onError);
    return res;
  }

  public async deleteExtra(
    id: number | undefined,
    onError?: ErrorCallBack
  ): Promise<IDeleteEdcItemResponse> {
    const res = await HttpUtil.delete(`/draft/${id}`, onError);
    return res;
  }

  public async createInvoiceMain(
    payload: IEdcInvoiceForm,
    onError?: ErrorCallBack
  ): Promise<ICreateResponse> {
    const res = await HttpUtil.post(`/document/extra`, payload, onError);
    return res;
  }

  public async updateInvoiceMain(
    id: string | undefined,
    isDraft: boolean,
    payload: IEdcInvoiceForm,
    onError?: ErrorCallBack
  ): Promise<ICreateResponse> {
    const res = await HttpUtil.put(
      isDraft ? `/draft/submitextra/${id}` : `/document/extra/${id}`,
      payload,
      onError
    );
    return res;
  }

  public async createAdditionDraft(
    payload: IEdcAdditionForm,
    onError?: ErrorCallBack
  ): Promise<ICreateResponse> {
    const res = await HttpUtil.post(`/draft/extra`, payload, onError);
    return res;
  }

  public async updateAdditionDraft(
    id: string | undefined,
    isDraft: boolean,
    payload: IEdcAdditionForm,
    onError?: ErrorCallBack
  ): Promise<ICreateResponse> {
    const res = await HttpUtil.put(
      isDraft ? `draft/extra/${id}` : `/document/extratodraft/${id}`,
      payload,
      onError
    );
    return res;
  }

  public async createActDraft(
    payload: IEdcAdditionForm,
    onError?: ErrorCallBack
  ): Promise<ICreateResponse> {
    const res = await HttpUtil.post(`/draft/extra`, payload, onError);
    return res;
  }

  public async updateActDraft(
    id: string | undefined,
    isDraft: boolean,
    payload: IEdcAdditionForm,
    onError?: ErrorCallBack
  ): Promise<ICreateResponse> {
    const res = await HttpUtil.put(
      isDraft ? `draft/extra/${id}` : `/document/extratodraft/${id}`,
      payload,
      onError
    );
    return res;
  }

  public async createInvoiceDraft(
    payload: IEdcInvoiceForm,
    onError?: ErrorCallBack
  ): Promise<ICreateResponse> {
    const res = await HttpUtil.post(`/draft/extra`, payload, onError);
    return res;
  }

  public async updateInvoiceDraft(
    id: string | undefined,
    isDraft: boolean,
    payload: IEdcInvoiceForm,
    onError?: ErrorCallBack
  ): Promise<ICreateResponse> {
    const res = await HttpUtil.put(
      isDraft ? `/draft/extra/${id}` : `/document/extratodraft/${id}`,
      payload,
      onError
    );
    return res;
  }

  public async getExtraById(
    id: string,
    params: IHTTPSParams[],
    isDraft: boolean,
    onError?: ErrorCallBack
  ): Promise<IGetEdcExtraByIdResponse> {
    const res = await HttpUtil.get(
      isDraft ? `/draft/extra/${id}` : `/document/extra/${id}`,
      params,
      false,
      onError
    );
    return res;
  }

  public async approveDoc(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IPermissionResponse> {
    const res = await HttpUtil.put(`/document/aprove/${id}`, null, onError);
    return res;
  }

  public async rejectDoc(
    id: number,
    body: RejectMessage,
    onError?: ErrorCallBack
  ): Promise<IPermissionResponse> {
    const res = await HttpUtil.put(`/document/reject/${id}`, body, onError);
    return res;
  }

  public async returntDoc(
    id: number,
    body: RejectMessage,
    onError?: ErrorCallBack
  ): Promise<IPermissionResponse> {
    const res = await HttpUtil.put(`/document/return/${id}`, body, onError);
    return res;
  }

  public async signDoc(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IPermissionResponse> {
    const res = await HttpUtil.put(`/document/sign/${id}`, null, onError);
    return res;
  }

  public async getTemplatesList(
    onError?: ErrorCallBack
  ): Promise<IGetTemplatesListResponse> {
    const res = await HttpUtil.get(
      '/documentapprovalcycle/getallfordocument',
      null,
      false,
      onError
    );
    return res;
  }

  public async getReceivingEntityEmployeesList(
    voen: string,
    onError?: ErrorCallBack
  ): Promise<IGetReceiverEntityStaffResponse> {
    const res = await HttpUtil.get(
      `/legalentity/authorizedpersonsfordocumentcycle/${voen}`,
      null,
      false,
      onError
    );
    return res;
  }

  public async getIdforPoolDocument(
    onError?: ErrorCallBack
  ): Promise<IGetIdforPoolDocumentResponse> {
    const res = await HttpUtil.get(
      `/document/takedocument`,
      null,
      false,
      onError
    );
    return res;
  }

  public async selectTemplateForDocument(
    body: SelectTemplatesForDocument,
    onError?: ErrorCallBack
  ): Promise<IPermissionResponse> {
    const res = await HttpUtil.put(
      `/document/addcirculationtodocument`,
      body,
      onError
    );
    return res;
  }

  public async getDocumentCountInPool(
    onError?: ErrorCallBack
  ): Promise<IGetDocumentCountInPoolResponse> {
    const res = await HttpUtil.get(
      `/document/documentcountinpool`,
      null,
      false,
      onError
    );
    return res;
  }
}
