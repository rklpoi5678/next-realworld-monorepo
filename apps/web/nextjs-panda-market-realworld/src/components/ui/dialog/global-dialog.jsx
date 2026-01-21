"use client"
import { useDialog } from "@/providers/modal-context";

export function GlobalDialog() {
  const { isOpen, dialogContent, closeDialog } = useDialog()

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.7)] z-10">
      <div className='flex flex-col justify-center bg-white shadow-xl w-full max-w-md max-h-[90vh] h-62.5 rounded-lg overflow-y-auto relative'>
        <div className="p-6">
          <p className="text-gray-800 text-center text-lg font-pretendard font-medium">
            {dialogContent}
          </p>
        </div>

        <div className="p-4 flex justify-center">
          <button
            className="rounded-lg w-full h-12 py-3 px-6 text-center bg-blue-500 hover:bg-blue-600 font-pretendard text-base font-semibold text-white transition duration-200"
            onClick={closeDialog}
          >
            확인
          </button>
        </div>
      </div>
    </div >
  );
}