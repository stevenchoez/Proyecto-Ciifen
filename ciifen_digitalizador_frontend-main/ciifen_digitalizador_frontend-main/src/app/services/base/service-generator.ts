import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, of, TimeoutError } from 'rxjs';
import { ServiceResponse } from '../dto/service-response';
import { ServiceException } from './service-exception';
import { retryWhen, mergeMap, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export abstract class ServiceGenerator {
  private serverurl = environment.serverurl;

  protected buildurl(path: string) {
    return this.serverurl + path;
  }

  protected handleError(error: HttpErrorResponse) {
    if (error.status == 0 || error.status == 500 || error.status == 502) {
      return throwError(new ServiceException(error.status, error.error));
    }
    return throwError(error.error);
  }

  protected handleResponse(response: any) {
    const retorno = new ServiceResponse<any>();
    retorno.obj = response.body;
    retorno.codigo = response.status;
    return retorno;
  }

  retryWithBackoff(delayMs: number, maxRetry = 2, backoffMs = 1000) {
    let retries = maxRetry;
    return (src: Observable<any>) =>
      src.pipe(
        retryWhen((errors: Observable<any>) =>
          errors.pipe(
            mergeMap((error) => {
              if (retries-- > 0 && this.shouldRetry(error)) {
                const backoffTime = delayMs + (maxRetry - retries) * backoffMs;
                return of(error).pipe(delay(backoffTime));
              }
              return throwError(error);
            })
          )
        )
      );
  }

  shouldRetry(error: { status: number }) {
    return (
      error instanceof TimeoutError ||
      error.status === 0 ||
      error.status === 500 ||
      error.status === 502 ||
      error.status == 504
    );
  }
}
