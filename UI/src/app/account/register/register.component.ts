import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm : FormGroup = new FormGroup({});
  submitted = false;
  errorMessage: string[] = [];
  constructor(private accountService : AccountService, private sharedService: SharedService,
    private router : Router, private formBuilder: FormBuilder){
accountService.user$.pipe(take(1)).subscribe({
  next:(user: User | null) =>{
    if(user){
      this.router.navigateByUrl('/');
    }
  }
})
}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.registerForm = this.formBuilder.group({
      firstName: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      email: ['',[Validators.required, Validators.pattern('^[_a-z0-9-]+(.[a-z0-9-]+)@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$')]],
      password: ['',[Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
    })
  }

  register(){
    this.submitted = true;
    this.errorMessage = [];
   if(this.registerForm.valid){
   this.accountService.register(this.registerForm.value).subscribe({
    next:(response : any) => {
      this.sharedService.showNotification(true, response.value.title, response.value.message);

      this.router.navigateByUrl('/account/login');
    },
    error: error => {
      if(error.error.errors){
        this.errorMessage = error.error.errors;
      }
      else{
        this.errorMessage.push(error.error);
      }
    }
  })
}
   
}
}
