interface IDesk {
  deskId?: number;
  clientId: string;
  name: string;
  positionX: number;
  positionY: number;
  ownerId: number;
  width?: string;
  height?: string;
  opacity?: number;
  isCircle?: boolean;
  backgroundColor?: string;
  isActive?: boolean;
}

interface IRooms {
  roomId: number;
  name: string;
  photoFileId: number | string | null;
  desks: IDesk[];
}

interface IRoomsCreate extends Pick<IRooms, 'name' | 'photoFileId'> {
  password: string;
}

export type { IRooms, IRoomsCreate, IDesk };
