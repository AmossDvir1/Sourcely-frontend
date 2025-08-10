import React, { useState, useRef, useCallback } from 'react';

// Define the component's generic props
export interface VirtualTableProps<T> {
  items: T[];
  /**
   * The fixed height of each row in pixels. For responsiveness, you might
   * want to adjust this value based on screen size in the parent component.
   */
  rowHeight: number;
  /**
   * The total height of the visible container in pixels. This should be
   * managed responsively in the parent component to ensure it looks good
   * on different device sizes (e.g., smaller height on mobile).
   */
  height: number;
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

  // The core virtualization logic remains unchanged
  const startIndex = Math.floor(scrollTop / rowHeight);
  const visibleCount = Math.ceil(height / rowHeight);
  const buffer = 5;
  const endIndex = Math.min(items.length, startIndex + visibleCount + buffer);

  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return (
    // Converted the MUI Box to a standard div with Tailwind classes.
    // The dynamic height is now applied via the style attribute.
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="overflow-y-auto relative border border-[var(--color-border)] rounded-lg"
      style={{ height: `${height}px` }}
    >
      {/* This invisible inner div creates the full scroll height. Converted to a div for consistency. */}
      <div style={{ height: `${items.length * rowHeight}px`, position: 'relative' }}>
        {visibleItems.map((item, index) => {
          const itemIndex = startIndex + index;
          return renderRow({
            item,
            isSelected: selectedId === item.id,
            style: {
              position: 'absolute',
              top: `${itemIndex * rowHeight}px`,
              left: 0,
              right: 0,
              height: `${rowHeight}px`,
              // Add width 100% to ensure rows fill the container, which is a robust pattern.
              width: '100%',
            },
            onClick: () => onRowClick(item),
          });
        })}
      </div>
    </div>
  );
};

export default VirtualTable;