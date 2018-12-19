export default function makeErrorResponse(errorCode: number, errorMsg: string) {
  return {
    statusCode: errorCode,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      message: errorMsg
    })
  };
}
