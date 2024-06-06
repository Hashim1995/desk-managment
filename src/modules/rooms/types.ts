

interface IDesk {
  id: number;
  name: string;
  positionX: number;
  positionY: number;
  ownerId: number;
  width: number;
  heigt: number
}

interface IRooms {
  roomId: number;
  name: string;
  photoFileId: number | string | null;
  desks: IDesk[]
}

interface IRoomsCreate
  extends Pick<
    IRooms,
    'name' | 'photoFileId'
  > {
  password: string;
}

export type { IRooms, IRoomsCreate, IDesk, };
