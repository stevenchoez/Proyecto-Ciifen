import { ServiceResponseBase } from './base/service-response-base';

export class ServiceResponse<T> extends ServiceResponseBase {
  obj: T;
}
