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
import DeleteConfirmationModal from '@/components/display/DeleteConfirmationModal';
import { RoomsService } from '@/services/rooms-services/rooms-services';
import { toast } from 'react-toastify';
import { toastOptions } from '@/configs/global-configs';
import { t } from 'i18next';
import { Modal } from 'antd';

interface IProps {
  currentRoom: IRoomByIdResponse;
  setDeskList: Dispatch<SetStateAction<IDesk[]>>;
  deskList: IDesk[];
  ownersCombo: { name: string; id: number }[];
  photoUrl: {
    fileUrl: string;
    url: string;
  };
}
function GridCanvas({
  photoUrl,
  currentRoom,
  ownersCombo,
  deskList,
  setDeskList
}: IProps) {
  const [showAddDeskModal, setShowAddDeskModal] = useState<boolean>(false);
  const [showEditDeskModal, setShowEditDeskModal] = useState<boolean>(false);
  const [deleteBtnLoader, setDeleteBtnLoader] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string | null | number>(null);
  const [selectedDesk, setSelectedDesk] = useState<IDesk>();
  const [showDeleteStaffModal, setShowDeleteStaffModal] =
    useState<boolean>(false);

  // Delete document
  const deleteDocument = async (selectedDeskParam: IDesk) => {
    setDeleteBtnLoader(true);
    try {
      const res = await RoomsService.getInstance().deleteDesk(
        selectedDeskParam?.deskId || 0
      );
      if (res?.id) {
        setDeskList(
          deskList?.filter(
            desk => desk.deskId !== selectedDeskParam?.deskId?.toString()
          )
        );
        setDeskList(
          deskList?.filter(
            desk => desk.clientId !== selectedDeskParam?.clientId?.toString()
          )
        );
        toast.success(t('successTxt'), toastOptions);
        setShowDeleteStaffModal(false);
      }
    } catch (err) {
      console.log(err);
    }
    setDeleteBtnLoader(false);
  };

  const handleRemoveTable = (deskItem: IDesk) => {
    if (!deskItem?.deskId) {
      setDeskList(
        deskList.filter(desk => desk.clientId !== deskItem?.clientId)
      );
    } else {
      setShowDeleteStaffModal(true);
    }
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

          const maxX = canvasWidth - 10; // assuming desk width is 10px
          const maxY = canvasHeight - 10; // assuming desk height is 10px

          // Ensure within boundaries
          newX = Math.max(0, Math.min(newX, maxX));
          newY = Math.max(0, Math.min(newY, maxY));

          // Ensure no overlap
          const isOverlapping = deskList.some(
            otherTable =>
              otherTable.clientId !== desk.clientId &&
              Math.abs(otherTable.positionX - newX) < 10 &&
              Math.abs(otherTable.positionY - newY) < 10
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
        distance: 1
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
          className="relative bg-gray-100 border w-[1400px] h-[800px]"
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

      <Modal
        title={t('confirmTitle')}
        open={showDeleteStaffModal}
        onOk={() => {
          deleteDocument(selectedDesk!);
        }}
        onCancel={() => setShowDeleteStaffModal(false)}
        okText={t('yesTxt')}
        okButtonProps={{
          disabled: deleteBtnLoader,
          loading: deleteBtnLoader
        }}
        okType="danger"
        cancelText={t('noTxt')}
      >
        <p>{t('confirmDelete')}</p>
      </Modal>
    </div>
  );
}

export default GridCanvas;
