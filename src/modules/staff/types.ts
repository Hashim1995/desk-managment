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
  ownedDesks?: any
}

interface IStaffCreate
  extends Pick<
    IStaff,
    'firstName' | 'lastName' | 'email' | 'ownedDesks' | 'phoneNumber' | 'photoFileId'
  > {
  password: string;
}
interface IStaffUpdate extends Omit<IStaffCreate, 'password'> {
  id: number;
}
interface IStaffChangePassword {
  userId: number;
  newPassword: string;
}

export type { IStaff, IStaffCreate, IStaffUpdate, IStaffChangePassword };
