/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  useDroppable,
  useSensors,
  useSensor,
  PointerSensor
} from '@dnd-kit/core';
import TableItem from './TableItem';
// import { restrictToGridAndBounds } from "./restrictToGridAndBounds";

interface Table {
  id: string;
  x: number;
  y: number;
  active: boolean;
  height: string;
  width: string;
}

interface IProps {
  photoUrl: {
    fileUrl: string;
    url: string;
  };
}
function GridCanvas({ photoUrl }: IProps) {
  const [tables, setTables] = useState<Table[]>([]);

  const [activeId, setActiveId] = useState<string | null | number>(null);

  useEffect(() => {
    const savedLayout = localStorage.getItem('layout');
    if (savedLayout) {
      setTables(JSON.parse(savedLayout));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('layout', JSON.stringify(tables));
  }, [tables]);

  const handleAddTable = () => {
    setTables([
      ...tables,
      {
        id: `${Date.now()}`,
        x: 0,
        y: 0,
        width: '200px',
        height: '200px',
        active: true
      }
    ]);
  };

  const handleRemoveTable = (id: string) => {
    setTables(tables.filter(table => table.id !== id));
  };

  const handleToggleTable = (id: string) => {
    setTables(
      tables.map(table =>
        table.id === id ? { ...table, active: !table.active } : table
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log(event, 'test');
    const { active, delta } = event;
    setActiveId(null);

    setTables(
      tables.map(table => {
        if (table.id === active.id) {
          let newX = table.x + delta.x;
          let newY = table.y + delta.y;

          const canvasWidth =
            document.getElementById('canvas')?.offsetWidth || 0;
          const canvasHeight =
            document.getElementById('canvas')?.offsetHeight || 0;

          const maxX = canvasWidth - 100; // assuming table width is 100px
          const maxY = canvasHeight - 100; // assuming table height is 100px

          // Ensure within boundaries
          newX = Math.max(0, Math.min(newX, maxX));
          newY = Math.max(0, Math.min(newY, maxY));

          // Ensure no overlap
          const isOverlapping = tables.some(
            otherTable =>
              otherTable.id !== table.id &&
              Math.abs(otherTable.x - newX) < 100 &&
              Math.abs(otherTable.y - newY) < 100
          );

          if (!isOverlapping) {
            return {
              ...table,
              x: newX,
              y: newY,
              height: table.height,
              width: table.width
            };
          }
        }
        return table;
      })
    );
  };

  const handleDragStart = (id: string | number) => {
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
        onClick={handleAddTable}
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
          {tables.map(table => (
            <TableItem
              key={table.id}
              table={table}
              onRemove={handleRemoveTable}
              onToggle={handleToggleTable}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default GridCanvas;
