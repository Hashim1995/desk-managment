import { useDraggable } from '@dnd-kit/core';
import { Button, Dropdown, Menu } from 'antd';
import { DeleteOutlined, EditOutlined, DragOutlined } from '@ant-design/icons';
import { BiPen } from 'react-icons/bi';

interface TableItemProps {
  table: {
    id: string;
    x: number;
    y: number;
    active: boolean;
  };
  // eslint-disable-next-line no-unused-vars
  onRemove: (id: string) => void;
  // eslint-disable-next-line no-unused-vars
  onToggle: (id: string) => void;
}

function TableItem({ table, onRemove, onToggle }: TableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: table.id
  });

  const style = {
    transform: `translate3d(${transform ? transform.x + table.x : table.x}px, ${
      transform ? transform.y + table.y : table.y
    }px, 0)`
  };

  const backgroundColorClass = table.active
    ? 'bg-green-600 bg-opacity-60'
    : 'bg-red-600 bg-opacity-60';

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        icon={<EditOutlined />}
        onClick={() => onToggle(table.id)}
      >
        {table.active ? 'Disable' : 'Enable'}
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<DeleteOutlined />}
        onClick={() => onRemove(table.id)}
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
      className={`absolute w-20 h-20 rounded-full flex items-center justify-center shadow-md text-white ${backgroundColorClass}`}
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

export default TableItem;
