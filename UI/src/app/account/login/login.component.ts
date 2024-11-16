import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';
import { take } from 'rxjs';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessage: string[] = [];
  reurnUrl: string  | null = null;

  constructor(private accountService : AccountService,
    private router : Router, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute){
      this.accountService.user$.pipe(take(1)).subscribe({
        next: (user : User | null) =>{
          if(user){
            this.router.navigateByUrl('/');
          }
          else{
              this.activatedRoute.queryParamMap.subscribe({
                next:(params: any) =>{
                  if(params){
                    this.reurnUrl = params.get('returnUrl');
                  }
                }
              })
          }
        }
      })

  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.loginForm = this.formBuilder.group({
      userName: ['',[Validators.required]],
      password: ['',[Validators.required]]
    })
  }

  login(){
    this.submitted = true;
    this.errorMessage = [];
   if(this.loginForm.valid){
    this.accountService.login(this.loginForm.value).subscribe({
      next:(response : any) => {
        if(this.reurnUrl){
          this.router.navigateByUrl(this.reurnUrl);
        }else{
        this.router.navigateByUrl('/');
        }
      },
      error: error => {
        if(error.error.errors){
          this.errorMessage = error.error.errors;
        }
        else{
          this.errorMessage.push(error.error);
        }
      }
   });
  }
}
}
