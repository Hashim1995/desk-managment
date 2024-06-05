interface IStaff {
  id: number;
  createdAt: Date | string;
  createdAtFormatted: string;
  firstName: string;
  lastName: string;
  fullName: string;
  nickName?: string | null;
  email: string;
  phoneNumber?: string | null;
  photoFileId: number | string | null;
}

interface IStaffCreate
  extends Pick<IStaff, 'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'photoFileId'> {
  password: string;
}
interface IStaffUpdate extends Omit<IStaffCreate, 'password'> {
  id: number;
}

export type { IStaff, IStaffCreate, IStaffUpdate };
