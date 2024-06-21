interface IReportItem {
  bookingId: number;
  userId: number;
  userName: string;
  deskId: number;
  deskName: string;
  deskOwnerName: string | null;
  roomId: number;
  roomName: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  deletedAt: string | null;
  operationType: 1 | 2;
  canCancel: boolean;
}

interface IBookingReportsResponse {
  totalCount: number;
  items: IReportItem[];
}

interface IReportFilter {
  startDate: any;
  endDate: any;
  operationType: any;
  roomName: string;
  deskName: string;
  deskOwnerName: string;
}

interface ICreateBook {
  userId: any;
  deskId: any;
  roomId?: any;
  startDate: any;
  endDate: any;
}

export type { IReportItem, IReportFilter, IBookingReportsResponse, ICreateBook };
