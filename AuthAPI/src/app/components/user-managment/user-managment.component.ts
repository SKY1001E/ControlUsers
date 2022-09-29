import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../Models/User";
import {BlockUI, NgBlockUI} from "ng-block-ui";

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.scss']
})
export class UserManagmentComponent implements OnInit {
  @BlockUI('user-loader') blocUI: NgBlockUI
  public loaderMessage: string = 'loading...'
  public userList: User[]

  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.service.getUserList().subscribe((data: User[]) => {
      this.userList = data
      this.blocUI.stop();
    }, () => {
      this.blocUI.stop();
    })
  }
}
