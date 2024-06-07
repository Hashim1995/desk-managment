/* eslint-disable no-unused-vars */
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
  DndContext,
  DragEndEvent,
  useDroppable,
  useSensors,
  useSensor,
  PointerSensor,
  UniqueIdentifier
} from '@dnd-kit/core';
import AddDeskModal from './add-desk-modal';
import { IDesk, IRoomByIdResponse, IRooms } from '../../types';
import DeskItem from './desk-item';
import EditDeskModal from './edit-desk-modal';

interface IProps {
  currentRoom: IRoomByIdResponse;
  setDeskList: Dispatch<SetStateAction<IDesk[]>>;
  deskList: IDesk[]
  ownersCombo: { name: string; id: number }[];
  photoUrl: {
    fileUrl: string;
    url: string;
  };
}
function GridCanvas({ photoUrl, currentRoom, ownersCombo, deskList, setDeskList }: IProps) {
  const [showAddDeskModal, setShowAddDeskModal] = useState<boolean>(false);
  const [showEditDeskModal, setShowEditDeskModal] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string | null | number>(null);
  const [selectedDesk, setSelectedDesk] = useState<IDesk>();

  // useEffect(() => {
  //   const savedLayout = localStorage.getItem('layout');
  //   if (savedLayout) {
  //     setTables(JSON.parse(savedLayout));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem('layout', JSON.stringify(tables));
  // }, [deskList]);

  const handleRemoveTable = (id: UniqueIdentifier) => {
    setDeskList(deskList.filter(desk => desk.clientId !== id));
  };



  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    setActiveId(null);

    console.log(active, 'hashim-active');
    console.log(delta, 'hashim-delta');

    setDeskList(
      deskList.map(desk => {
        if (desk.clientId === active.id) {
          let newX = desk.positionX + delta.x;
          let newY = desk.positionY + delta.y;

          const canvasWidth =
            document.getElementById('canvas')?.offsetWidth || 0;
          const canvasHeight =
            document.getElementById('canvas')?.offsetHeight || 0;

          const maxX = canvasWidth - 100; // assuming desk width is 100px
          const maxY = canvasHeight - 100; // assuming desk height is 100px

          // Ensure within boundaries
          newX = Math.max(0, Math.min(newX, maxX));
          newY = Math.max(0, Math.min(newY, maxY));

          // Ensure no overlap
          const isOverlapping = deskList.some(
            otherTable =>
              otherTable.clientId !== desk.clientId &&
              Math.abs(otherTable.positionX - newX) < 100 &&
              Math.abs(otherTable.positionY - newY) < 100
          );

          if (!isOverlapping) {
            return {
              ...desk,
              positionX: newX,
              positionY: newY,
              height: desk.height,
              width: desk.width
            };
          }
        }
        return desk;
      })
    );
  };

  const handleDragStart = (id: UniqueIdentifier) => {
    setActiveId(id);
  };

  const { setNodeRef } = useDroppable({
    id: 'canvas'
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  );

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowAddDeskModal(true)}
        className="bg-blue-500 mb-4 px-4 py-2 rounded text-white"
      >
        Add Table
      </button>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => handleDragStart(active.id)}
        // modifiers={[restrictToGridAndBounds]}
      >
        <div
          id="canvas"
          ref={setNodeRef}
          style={{
            backgroundImage: `url(${photoUrl?.url})`,
            backgroundRepeat: 'no-repeat'
          }}
          className="relative bg-gray-100 border w-[1400px] h-[700px]"
        >
          {deskList.map(desk => (
            <DeskItem
              key={desk?.clientId || desk?.deskId}
              desk={desk}
              onRemove={handleRemoveTable}
              setSelectedDesk={setSelectedDesk}
              setShowEditDeskModal={setShowEditDeskModal}
            />
          ))}
        </div>
      </DndContext>

      {showAddDeskModal && (
        <AddDeskModal
          setShowAddDeskModal={setShowAddDeskModal}
          // setRefreshComponent={setRefreshComponent}
          ownersCombo={ownersCombo}
          showAddDeskModal={showAddDeskModal}
          setDeskList={setDeskList}
        />
      )}
      {showEditDeskModal && (
        <EditDeskModal
          setShowEditDeskModal={setShowEditDeskModal}
          showEditDeskModal={showEditDeskModal}
          selectedDesk={selectedDesk!}
          setDeskList={setDeskList}
          ownersCombo={ownersCombo}
        />
      )}
    </div>
  );
}

export default GridCanvas;
