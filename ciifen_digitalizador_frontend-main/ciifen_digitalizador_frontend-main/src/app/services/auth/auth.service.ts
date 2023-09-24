import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, of, tap } from "rxjs";
import { User } from "src/app/models/auth/user.entity";
import { environment } from "src/environments/environment";
import { GlobalService } from "./global.service";

export interface AuthResponseData {
  username: string;
  token: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  urlBase = environment.serverurl;

  authenticated: boolean = false;
  mensaje: string;
  statusCode: number;

  constructor(private http: HttpClient, private globalData: GlobalService) {}

  login(username: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.urlBase + "autenticacion/login/", {
        username: username,
        password: password,
      })
      .pipe(
        tap((resData) => {
          // console.log(resData);

          this.setSession(resData);
        })
      );
  }

  private setSession(authResult: any) {
    let usuarioGlobalData = new User();
    usuarioGlobalData.access = authResult.access;

    this.globalData.user = usuarioGlobalData;
    localStorage.setItem("globaldata", JSON.stringify(this.globalData));
    localStorage.setItem("isLoggedin", "true");
  }

  logout() {
    localStorage.removeItem("globaldata");
  }

  public isLoggedIn() {
    if (localStorage.getItem("globaldata")) return true;
    return false;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
}
