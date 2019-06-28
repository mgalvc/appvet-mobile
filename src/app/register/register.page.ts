import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    private user = {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    };

    private errors: object;

    constructor(private global: GlobalService, private router: Router) { }

    ngOnInit() {
    }

    submit() {
        this.global.http.post(this.global.baseURL + '/clients', this.user)
            .subscribe((response) => {
                console.log(response);
                // @ts-ignore
                if (!response.success) {
                    // @ts-ignore
                    this.errors = response.errors;
                } else {
                    this.router.navigateByUrl('login');
                }
            }, (error) => {
                console.log(error);
            });
    }

    blankFields() {
        return this.user.name === '' || this.user.email === '' || this.user.password === '' || this.user.password_confirmation === '';
    }

}
