import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {Role} from "../../Models/Role";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup
  public roles: Role[] = []

  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      fullName: new FormControl(null, [
        Validators.required
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    })

    this.getRoles();
  }

  onSubmit() {
    if(this.registerForm.invalid){
      return
    }

    console.log('onSubmit', this.roles);

    let fullName = this.registerForm.controls['fullName'].value;
    let email = this.registerForm.controls['email'].value;
    let password = this.registerForm.controls['password'].value;
    let role = this.roles.filter(x => x.isSelected)[0].role;

    this.service.register(fullName, email, password, role).subscribe((data: Object) => {
      this.registerForm.reset()
      this.roles.forEach(x => x.isSelected = false);
      console.log('response:', data)
    }, error => {
      console.log('error: ', error)
    })
  }

  getRoles() {
    this.service.getRoles().subscribe(roles => {
      this.roles = roles
    })
  }

  onRoleChange(role: string) {
    this.roles.forEach(x => {
      if(x.role == role) {
        x.isSelected = true;
      } else {
        x.isSelected = false;
      }
    })
  }
}
