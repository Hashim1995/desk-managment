/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
interface IGlobalResponse {
  errors: string | string[];
  isSuccess: boolean;
}

interface ICreateResponse extends IGlobalResponse {
  Data?: {
    Message?: string | string[];
    id?: string | number;
  };
}

interface selectOption {
  value: string | number;
  label: string;
}

interface IFileServerResponse {
  id: number;
  mimeType?: string | null;
  uploadDate?: Date | string | null;
  size?: number | null;
  name?: string | null;
  fileNameOnDisk?: string | null;
  fileUrl?: string | null;
  version?: number | string;
  totalVersion?: number | string;
}

interface ICompanyDetailItem {
  Voen: string;
  Id: number;
  Name: string;
  Email?: string;
  PhoneNumber?: string;
  FounderName: string;
  CreatedDate: string | Date;
  FounderSurname: string;
  FathersName: string;
  FinCode: string;
  Status: string;
  StatusId: number;
  ActivityField?: string;
  Address?: string;
}

interface ISelectData {
  id: number;
  name: string;
}
interface IModalProps {
  open: boolean;
  onClose: () => void;
}

export enum FolderTypes {
  ContractMainFile = 1,
  ContractSecretFile,
  AdditionalFile,
  handoverFile,
  invoiceFile,
  LegalEntityProfilePhoto,
  AuthPersonProfilePhoto
}

export enum LayoutLanguage {
  Azerbaijani = 'az',
  English = 'en',
  Russian = 'ru'
}

interface IAction {
  Key: string;
  Status: boolean;
}
interface IUserPermissions {
  can: IAction[];
  pages: IAction[];
}

export type {
  selectOption,
  ICreateResponse,
  ICompanyDetailItem,
  IFileServerResponse,
  IGlobalResponse,
  IModalProps,
  ISelectData,
  IUserPermissions
};
