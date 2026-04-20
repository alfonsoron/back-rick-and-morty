export function successResponse<T>(message: string, data: T) {
  return {
    header: {
      message,
      resultCode: 0,
    },
    data,
  };
}

export function errorResponse(message: string, resultCode = 1) {
  return {
    header: {
      message,
      resultCode,
    },
  };
}
