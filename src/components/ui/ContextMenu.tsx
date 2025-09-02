"use client";

import React, { useEffect, useRef } from "react";

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  children: React.ReactNode;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  position,
  onClose,
  children,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-48"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {children}
    </div>
  );
};

interface ContextMenuItemProps {
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const ContextMenuItem: React.FC<ContextMenuItemProps> = ({
  onClick,
  icon,
  children,
}) => {
  return (
    <button
      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      onClick={onClick}
    >
      {icon && <span className="text-gray-500">{icon}</span>}
      {children}
    </button>
  );
};
