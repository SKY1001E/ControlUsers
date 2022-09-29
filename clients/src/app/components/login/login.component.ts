import { Component, OnInit } from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {User} from "../../Models/User";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup

  constructor(
    private service: UserService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    })
  }

  onSubmit() {
    if(this.loginForm.invalid){
      return
    }

    let email = this.loginForm.controls['email'].value;
    let password = this.loginForm.controls['password'].value;

    this.service.login(email, password).subscribe((data: any) => {
      if(data.responseCode == 1)
      {
        localStorage.setItem('userInfo', JSON.stringify(data.dateSet));
        let user = data.dateSet as User
        if(user.role == "Admin"){
          this.router.navigate(['/allUsers'])
        } else if(user.role == "User") {
          this.router.navigate(['/users'])
        } else {
          this.router.navigate(['/login'])
        }
      }
      console.log('response: ', data)

    }, error => {
      console.log('Error: ', error)
    })
  }
}
