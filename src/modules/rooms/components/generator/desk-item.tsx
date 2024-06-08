import { useDraggable } from '@dnd-kit/core';
import { Button, Dropdown, Menu } from 'antd';
import { DeleteOutlined, EditOutlined, DragOutlined } from '@ant-design/icons';
import { BiPen } from 'react-icons/bi';
import { IDesk } from '../../types';
import { Dispatch, SetStateAction } from 'react';

interface DeskItemProps {
  desk: IDesk;
  setShowEditDeskModal: Dispatch<SetStateAction<boolean>>;
  setSelectedDesk: Dispatch<SetStateAction<IDesk | undefined>>;
  // eslint-disable-next-line no-unused-vars
  onRemove: (id: IDesk) => void;
  // eslint-disable-next-line no-unused-vars
}

function DeskItem({
  desk,
  setShowEditDeskModal,
  setSelectedDesk,
  onRemove
}: DeskItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: desk?.clientId
  });

  const style = {
    backgroundColor: desk?.backgroundColor,
    width: `${desk?.width}px`,
    height: `${desk?.height}px`,
    opacity: `${desk?.opacity}%`,
    transform: `translate3d(${
      transform ? transform.x + desk.positionX : desk.positionX
    }px, ${transform ? transform.y + desk.positionY : desk.positionY}px, 0)`
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" disabled>
        {desk?.name}
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<EditOutlined />}
        onClick={() => {
          setSelectedDesk(desk);
          setShowEditDeskModal(true);
        }}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="3"
        icon={<DeleteOutlined />}
        onClick={() => {
          onRemove(desk);
          setSelectedDesk(desk);
        }}
      >
        Remove
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`absolute  rounded-full flex items-center justify-center shadow-md text-white `}
    >
      <Button
        {...listeners}
        shape="circle"
        icon={<DragOutlined />}
        type="primary"
        style={{
          backgroundColor: 'rgba(128, 128, 128, 0.6)',
          border: 'none'
        }}
      />
      <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
        <BiPen
          style={{
            backgroundColor: 'rgba(128, 128, 128, 0.6) '
          }}
          size={24}
          className="-right-3 absolute p-1 rounded-full"
        />
      </Dropdown>
    </div>
  );
}

export default DeskItem;
