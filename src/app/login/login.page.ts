import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    private email: string;
    private password: string;

    constructor(
        private authService: AuthService,
        private router: Router,
        private global: GlobalService,
        private toastController: ToastController
    ) {}

    ngOnInit() {
    }

    async showToast(msg: string) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 5000,
            color: 'danger'
        });
        toast.present();
    }

    login() {
        this.global.http.post(this.global.baseURL + '/auth/client/login',
            {
                email: this.email,
                password: this.password
            })
            .subscribe((response) => {
                console.log(response);
                // @ts-ignore
                if (response.success) {
                    console.log('cool');
                    this.authService.saveUser(response);
                    this.router.navigateByUrl('');
                } else {
                    // @ts-ignore
                    console.log(response.error);
                    // @ts-ignore
                    this.showToast(response.error);
                }
            }, (error) => {
                console.log(error);
            });
    }

    blankFields() {
        return this.email === '' || this.password === '';
    }

}
