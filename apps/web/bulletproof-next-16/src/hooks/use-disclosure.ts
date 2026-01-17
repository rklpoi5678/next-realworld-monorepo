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

  //  queueMicrotask: 상태 변경 직후, 브라우저가 다음일을 하기 전 찰나에
  // onOpen 콜백을 실행하여  상태 업데이트이 외부 로직 사이의 충돌을 방지
  const open = () => {
    setIsOpen((prev) => {
      if (!prev) {
        // 이미 열려있지 않을때만 실행 (불필요한 실행방지)
        queueMicrotask(() => onOpen?.());
      }
      return true;
    });
  };

  const close = () => {
    setIsOpen((prev) => {
      if (prev) {
        queueMicrotask(() => onClose?.());
      }
      return false;
    });
  };

  const toggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      queueMicrotask(() => {
        if (next) onOpen?.();
        else onClose?.();
      });
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
