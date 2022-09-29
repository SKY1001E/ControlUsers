import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs";
import {ResponseModel} from "../Models/ResponseModel";
import {ResponseCode} from "../enums/ResponseCode";
import {User} from "../Models/User";
import {Role} from "../Models/Role";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl: string = 'https://localhost:44398/'

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    const body = {
      Email: email,
      Password: password
    }

     return this.http.post<ResponseModel>(`${this.baseUrl}api/user/login`, body)
  }

  register(fullName: string, email: string, password: string, role: string) {
    const body = {
      FullName: fullName,
      Email: email,
      Password: password,
      Role: role
    }

    return this.http.post<ResponseModel>(`${this.baseUrl}api/user/registeruser`, body);
  }

  getAllUsers() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))

    const header = new HttpHeaders({
      'Authorization':`Bearer ${userInfo?.token}`
    })

    return this.http.get<ResponseModel>(`${this.baseUrl}api/user/GetAllUser`, {headers: header})
      .pipe(map( (res: any) => {
        let userList = new Array<User>()
        if(res.responseCode == ResponseCode.Ok)
        {
          if(res.dateSet)
          {
            res.dateSet.map((x: User) => {
              userList.push(new User(x.fullName, x.email, x.dateCreated, x.role))
            })
          }
        }
        return userList
      }))
  }

  getUserList() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))

    const header = new HttpHeaders({
      'Authorization':`Bearer ${userInfo?.token}`
    })

    return this.http.get<ResponseModel>(`${this.baseUrl}api/user/GetUserList`, {headers: header})
      .pipe(map( (res: any) => {
        let userList = new Array<User>()
        if(res.responseCode == ResponseCode.Ok)
        {
          if(res.dateSet)
          {
            res.dateSet.map((x: User) => {
              userList.push(new User(x.fullName, x.email, x.dateCreated, x.role))
            })
          }
        }
        return userList
      }))
  }

  getRoles() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))

    const header = new HttpHeaders({
      'Authorization':`Bearer ${userInfo?.token}`
    })

    return this.http.get<ResponseModel>(`${this.baseUrl}api/user/GetRoles`, {headers: header})
      .pipe(map( (res: any) => {
        let roleList = new Array<Role>()
        if(res.responseCode == ResponseCode.Ok)
        {
          if(res.dateSet)
          {
            res.dateSet.map((x: string) => {
              roleList.push(new Role(x))
            })
          }
        }
        return roleList
      }))
  }
}
