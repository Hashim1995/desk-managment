/* eslint-disable no-unused-vars */
import {
  ICompanyDetailItem,
  IFileServerResponse,
  IGlobalResponse,
  selectOption
} from '@/models/common';
import { Dispatch, SetStateAction } from 'react';

interface IEdcDocsListOptions {
  value: number;
  label: string;
  receiverVoen: string;
  receiverName: string;
}

interface IEdcDocVersion {
  type: number;
  version: number;
}

interface IEdcDocsListOptionsResponse extends IGlobalResponse {
  Data: {
    Datas: IEdcDocsListOptions[];
  };
}

interface IEdcChangeLogItem {
  type: 1 | 2;
  name: string;
  value: {
    oldValue?: string | IFileServerResponse;
    newValue?: string | IFileServerResponse;
  };
}
interface IEdcChangeLogListItem {
  id: number;
  userName?: string;
  appointment?: string;
  date: string | Date;
  message?: string | null;
  file: IFileServerResponse | null;
  changeLog: IEdcChangeLogItem[];
}

interface IEdcChangeLogListItemResponse extends IGlobalResponse {
  Data: {
    Datas: IEdcChangeLogListItem[];
    TotalDataCount: number;
  };
}

interface IEdcItemRelationDoc {
  DocumentCode?: string;
  DocumentType?: string;
  DocumentTypeId?: number;
  Id?: number;
  isDraft?: boolean;
  CreatedDate?: string | Date;
}

interface Permission {
  viewButton: boolean;
  editButton: boolean;
  deleteButton: boolean;
  approveButton: boolean;
  rejectButton: boolean;
  returnButton: boolean;
}

interface IEdcListItem {
  ContractId?: number;
  Id?: number;
  DocumentCode?: string;
  Description?: string;
  DocumentTypeId?: number;
  DocumentType?: string;
  ProssesType?: number;
  DocumentStatusId?: number;
  DocumentStatus?: string;
  SenderLegalEntityId?: number;
  SenderLegalEntity?: string;
  RecieverLegalEntityId?: number;
  RecieverLegalEntity?: string;
  SenderLegalEntityVoen?: string;
  RecieverLegalEntityVoen?: string;
  CreatedDate?: string | Date;
  StartDate?: string | Date;
  ExpireDate?: string | Date;
  ContractDate?: string | Date;
  AgreementDate?: string | Date;
  RenewalDate?: string | Date;
  UpdatedDate?: string | Date;
  RelationDocs?: IEdcItemRelationDoc[];
  receiverUserId?: number | null;
  receiverUser?: selectOption[] | string | null | number;
  recieverForInfos?: number[] | null;
  contractNumber?: number | IEdcDocsListOptions;
  isDraft?: boolean;
  documentApprovalCycle?: selectOption | null;
  permission?: Permission;
  CanSign?: boolean;
  CanVerify?: boolean;
  CanReturn?: boolean;
  CanReject?: boolean;
  CanEdit?: boolean;
  CanSelectCirculation?: boolean;
  CanDelete?: boolean;
  ForInfo?: boolean;
  AlertClosed?: boolean;
}

interface IEdcListFilter {
  DocumentCode: string;
  SenderLegalEntityId: string;
  SenderLegalEntityVoen: string;
  RecieverLegalEntityId: string;
  RecieverLegalEntityVoen: string;
  StartDateRange?: string | Date[] | null;
  CreatedDateRange?: string | Date[] | null;
  ExpireDateRange?: string | Date[] | null;
  DocumentTypeId: selectOption | null;
  DocumentStatusId: selectOption | null;
  status: selectOption | null;
}
interface IGetEdcListResponse extends IGlobalResponse {
  Data: {
    Datas: IEdcListItem[];
    TotalDataCount: number;
  };
}
interface ICompanyDetailResponse extends IGlobalResponse {
  Data: ICompanyDetailItem;
}

// CONTRACT
interface IEdcContractTableFileListItem extends IFileServerResponse {
  type?: number;
}

interface IEdcGetByIdItem extends IEdcListItem {
  TableFileList: IEdcContractTableFileListItem[];
}
interface IGetEdcContractByIdResponse extends IGlobalResponse {
  Data: IEdcGetByIdItem;
}

interface IEdcContractFileUploadModalForm {
  fileType: null | selectOption[];
  fileList?: IFileServerResponse | IFileServerResponse[];
}

interface IEdcDocVersionResponse extends IGlobalResponse {
  Data: IFileServerResponse;
}
interface IEdcContractPayload {
  SenderLegalEntityVoen?: string;
  SenderLegalEntityName?: string;
  RecieverLegalEntityVoen: string;
  RecieverLegalEntityName: string;
  ProssesType: selectOption[] | string | null | number;
  StartDate: any;
  ExpireDate: any;
  RenewalDate: any;
  Description: string;
  tableFileList: IEdcContractTableFileListItem[];
  DocumentApprovalCycleId: selectOption | number | null;
}
interface IEdcContractForm
  extends IEdcContractFileUploadModalForm,
    IEdcContractPayload {}

// CONTRACT

// ADDITION
interface IEdcAdditionForm {
  SenderLegalEntityVoen: string;
  SenderLegalEntityName: string;
  RecieverLegalEntityVoen: string;
  DocumentTypeId?: number;
  RecieverLegalEntityName: string;
  StartDate: any;
  tableFileList: IEdcContractTableFileListItem[];
  Description: string;
  receiverUserId?: selectOption[] | string | null | number;
  receiverUser?: selectOption[] | string | null | number;
  recieverForInfos?: number[] | null;
  contractNumber?: number | IEdcDocsListOptions | null;
  DocumentApprovalCycleId?: selectOption | null | number;
  documentApprovalCycle?: selectOption[] | string | null | number;
}

interface IEdcActForm {
  SenderLegalEntityVoen: string;
  SenderLegalEntityName: string;
  RecieverLegalEntityVoen: string;
  DocumentTypeId?: number;
  RecieverLegalEntityName: string;
  StartDate: any;
  tableFileList: IEdcContractTableFileListItem[];
  Description: string;
  receiverUserId?: selectOption[] | string | null | number;
  receiverUser?: selectOption[] | string | null | number;
  recieverForInfos?: number[] | null;
  contractNumber?: number | IEdcDocsListOptions | null;
  DocumentApprovalCycleId?: selectOption | null | number;
}

interface IEdcInvoiceForm {
  SenderLegalEntityVoen: string;
  SenderLegalEntityName: string;
  RecieverLegalEntityVoen: string;
  DocumentTypeId?: number;
  RecieverLegalEntityName: string;
  StartDate: any;
  tableFileList: IEdcContractTableFileListItem[];
  Description: string;
  contractNumber?: number | IEdcDocsListOptions | null;
  DocumentApprovalCycleId?: selectOption | null | number;
  documentApprovalCycle?: selectOption | string | null | number;
}

interface IEdcAdditionFileUploadModalForm {
  fileList?: IFileServerResponse | IFileServerResponse[];
}

interface IEdcActFileUploadModalForm {
  fileList?: IFileServerResponse | IFileServerResponse[];
}

interface IEdcInvoiceFileUploadModalForm {
  fileList?: IFileServerResponse | IFileServerResponse[];
}

interface IGetEdcExtraByIdResponse extends IGlobalResponse {
  Data: IEdcGetByIdItem;
}

interface IDeleteEdcItemResponse extends IGlobalResponse {
  Data?: {
    message?: string | string[];
    id?: string | number;
  };
}

// eslint-disable-next-line no-shadow
export enum ButtonConfig {
  editButton = '0',
  deleteButton = '1',
  viewButton = '2',
  approveButton = '3',
  rejectButton = '4',
  returnButton = '5',
  signButton = '6',
  sendButton = '7'
}

interface RejectMessage {
  Message: string | null | undefined;
  fileId?: number | string | null;
}

interface IPermissionResponse extends IGlobalResponse {
  Data?: {
    message?: string | string[];
    id?: string | number;
  };
}

interface IGetTemplatesListResponse extends IGlobalResponse {
  Data: {
    TotalCount: number;
    Datas: selectOption[];
  };
}

interface IGetReceiverEntityStaff extends selectOption {
  permissionDto: {
    isFounder: boolean;
    documentCompilation: boolean;
    sendingDocument: boolean;
    editingser: boolean;
  };
}

interface IGetReceiverEntityStaffResponse extends IGlobalResponse {
  Data: {
    Datas: IGetReceiverEntityStaff[];
    TotalDataCount: number;
  };
}

interface IGetReceivingEntityEmployeesResponse extends IGlobalResponse {
  Data: {
    TotalCount: number;
    Datas: selectOption[];
  };
}

type ExcludeRootFromKeys<T> = {
  [K in keyof T]: K extends 'root' ? never : T[K];
};

interface IGetIdforPoolDocumentResponse extends IGlobalResponse {
  Data: {
    documentId: number;
    documentTypeId: number;
  };
}

interface SelectTemplatesForDocument {
  documentId?: number;
  documentApprovalCycleId?: number | null;
}

interface ISelectTemplatesForDocumentResponse extends IGlobalResponse {
  Data?: {
    message?: string | string[];
  };
}

interface IGetDocumentCountInPoolResponse extends IGlobalResponse {
  Data: {
    TotalDataCount: number;
  };
}
// ADDITION

export type {
  IEdcDocsListOptions,
  IEdcDocsListOptionsResponse,
  IEdcListItem,
  IGetEdcContractByIdResponse,
  IEdcContractPayload,
  IGetEdcExtraByIdResponse,
  IEdcItemRelationDoc,
  ICompanyDetailResponse,
  IEdcChangeLogItem,
  IEdcContractTableFileListItem,
  IEdcContractFileUploadModalForm,
  IGetEdcListResponse,
  IEdcListFilter,
  IEdcContractForm,
  IEdcAdditionForm,
  IEdcAdditionFileUploadModalForm,
  IEdcChangeLogListItem,
  IEdcActForm,
  IEdcActFileUploadModalForm,
  IEdcInvoiceForm,
  IEdcInvoiceFileUploadModalForm,
  IDeleteEdcItemResponse,
  IEdcChangeLogListItemResponse,
  IEdcDocVersion,
  IEdcDocVersionResponse,
  Permission,
  RejectMessage,
  IPermissionResponse,
  IGetTemplatesListResponse,
  IGetReceivingEntityEmployeesResponse,
  IGetReceiverEntityStaffResponse,
  ExcludeRootFromKeys,
  IGetIdforPoolDocumentResponse,
  SelectTemplatesForDocument,
  IGetDocumentCountInPoolResponse
};
