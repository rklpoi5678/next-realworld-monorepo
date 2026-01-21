import Image from "next/image";

import CheckIcon from "@/assets/icons/ic_check.svg"

import { Button } from "../button";

export function DeleteDialog({ close, msg, deleteClick, children }) {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.7)] z-10">
      <div className='flex flex-col justify-center items-center bg-white shadow-xl w-74.5 p-6 max-w-md rounded-xl overflow-y-auto relative'>
        <div className="grid place-items-center w-6 h-6 bg-error-red rounded-full">
          <div className="relative w-3 h-3">
            <Image
              className="absolute"
              src={CheckIcon}
              alt="삭제중 다이얼 아이콘"
              fill
              unoptimized
            />
          </div>
        </div>
        <div className="pt-6 pb-8">
          <p className="text-gray-800 text-center font-pretendard font-medium leading-6.5">{msg}</p>
          {children}
        </div>

        <div className="flex flex-row gap-2">
          <Button intent="ghost" className='flex w-22 h-12 px-1.5 pt-3' onClick={close} >취소</Button>
          <Button intent="danger" className='flex w-22 h-12 px-1.5 pt-3' onClick={deleteClick} >네</Button>
        </div>
      </div>
    </div >
  );
}