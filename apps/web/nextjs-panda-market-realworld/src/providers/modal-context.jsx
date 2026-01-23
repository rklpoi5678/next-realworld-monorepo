"use client"

import { createContext, useCallback, useContext, useState } from "react"

const DialogContext = createContext();

export default function DialogProvider({ children }) {
  const [dialogContent, setDialogContent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = useCallback((content) => {
    setDialogContent(content);
    setIsOpen(true)
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setDialogContent(null)
  }, [])

  return (
    <DialogContext.Provider value={{ isOpen, dialogContent, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  )
}

export const useDialog = () => useContext(DialogContext)