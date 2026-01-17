import { NextResponse } from 'next/server';

export const apiResponse = (
  success,
  message,
  data = null,
  status,
  errors = null,
) => {
  return NextResponse.json({ success, message, data, errors }, { status });
};
