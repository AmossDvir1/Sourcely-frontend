import React, { useState, useRef, useCallback } from 'react';
import { Box } from '@mui/material';

// Define the component's generic props
export interface VirtualTableProps<T> {
  items: T[];
  rowHeight: number; // Each row must have a fixed height
  height: number;    // The total height of the visible container
  selectedId: string | number | null;
  onRowClick: (item: T) => void;
  // Render Prop: A function that tells the table HOW to render a single row
  renderRow: (props: {
    item: T;
    style: React.CSSProperties;
    isSelected: boolean;
    onClick: () => void; 
  }) => React.ReactNode;
}

export const VirtualTable = <T extends { id: string | number }>({
  items,
  rowHeight,
  height,
  selectedId,
  onRowClick,
  renderRow,
}: VirtualTableProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // The core virtualization logic
  const startIndex = Math.floor(scrollTop / rowHeight);
  const visibleCount = Math.ceil(height / rowHeight);
  // Add a buffer of items to render above and below for smoother scrolling
  const buffer = 5;
  const endIndex = Math.min(items.length, startIndex + visibleCount + buffer);

  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return (
    <Box
      ref={containerRef}
      onScroll={handleScroll}
      sx={{
        height: `${height}px`,
        overflowY: 'auto',
        position: 'relative',
        border: '1px solid',
        borderColor: 'var(--color-border)',
        borderRadius: '8px',
      }}
    >
      {/* This invisible inner div creates the full scroll height */}
      <Box sx={{ height: `${items.length * rowHeight}px`, position: 'relative' }}>
        {visibleItems.map((item, index) => {
          const itemIndex = startIndex + index;
          // ✅ 2. CALL renderRow WITH THE CORRECT, SEPARATED PROPS
          return renderRow({
            item,
            isSelected: selectedId === item.id,
            style: {
              position: 'absolute',
              top: `${itemIndex * rowHeight}px`,
              left: 0,
              right: 0,
              height: `${rowHeight}px`,
            },
            // Pass the specific click handler for this row
            onClick: () => onRowClick(item),
          });
        })}
      </Box>
    </Box>
  );
};

export default VirtualTable;