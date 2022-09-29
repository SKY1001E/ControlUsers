import { Component, OnInit } from '@angular/core';
import {User} from "../../Models/User";
import {UserService} from "../../services/user.service";
import {BlockUI, NgBlockUI} from "ng-block-ui";

@Component({
  selector: 'app-all-user-managment',
  templateUrl: './all-user-managment.component.html',
  styleUrls: ['./all-user-managment.component.scss']
})
export class AllUserManagmentComponent implements OnInit {
  @BlockUI('user-loader') blocUI: NgBlockUI
  public loaderMessage: string = 'loading...'
  public userList: User[]

  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.service.getAllUsers().subscribe((data: User[]) => {
      this.userList = data
      this.blocUI.stop();
    }, () => {
      this.blocUI.stop();
    })
  }
}
