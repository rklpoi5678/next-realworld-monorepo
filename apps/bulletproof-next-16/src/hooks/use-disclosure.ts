// 모달,드로어,아코디언처럼 켜짐/꺼짐 상태에 useState대신 재사용할수있게 만든 훅
'use client';
import { useState } from 'react';

type UseDisclosureOptions = {
  initial?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

/**
 * react-compiler사용중이므로 useCallback, useMemo
 * 수동으로 작성할요가 없습니다.
 */
export function useDisclosure(options: UseDisclosureOptions = {}) {
  const { initial = false, onOpen, onClose } = options;

  const [isOpen, setIsOpen] = useState(initial);

  const open = () => {
    setIsOpen((prev) => {
      if (!prev && onOpen) onOpen();
      return true;
    });
  };

  const close = () => {
    setIsOpen((prev) => {
      if (prev && onClose) onClose();
      return false;
    });
  };

  const toggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && onOpen) onOpen();
      if (!next && onClose) onClose();
      return next;
    });
  };

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
}
