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
}

interface IStaffCreate
  extends Pick<IStaff, 'firstName' | 'lastName' | 'email' | 'phoneNumber'> {
  password: string;
}
interface IStaffUpdate extends IStaffCreate {
  id: number;
}

export type { IStaff, IStaffCreate, IStaffUpdate };
