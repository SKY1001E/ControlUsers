import {ResponseCode} from "../enums/ResponseCode";

export class ResponseModel {
  public ResponseCode: ResponseCode = ResponseCode.NotSet
  public ResponseMessage: string
  public DateSet: any
}
