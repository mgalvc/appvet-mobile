import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AlertController} from '@ionic/angular';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

    constructor(public authService: AuthService, public alertController: AlertController) {}

    logout() {
        this.authService.logout();
    }

    async changeNameAlert() {
        const alert = await this.alertController.create({
            header: 'Qual o seu nome?',
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    value: this.authService.user.name
                }
            ],
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        console.log('confirmou alteração de nome');
                    }
                }
            ]
        });

        await alert.present();
        const { data } = await alert.onDidDismiss();

        if (data.values.name) {
            this.authService.changeName(data.values.name);
        } else {
            console.log('inseriu inválido');
        }
    }

    async changeEmailAlert() {
        const alert = await this.alertController.create({
            header: 'Qual o seu e-mail?',
            inputs: [
                {
                    name: 'email',
                    type: 'email',
                    value: this.authService.user.email
                }
            ],
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        console.log('confirmou alteração de email');
                    }
                }
            ]
        });

        await alert.present();
        const { data } = await alert.onDidDismiss();

        if (data.values.email) {
            this.authService.changeEmail(data.values.email);
        } else {
            console.log('inseriu inválido');
        }
    }

    async changeAddressAlert() {
        let address = this.authService.user.address.split('//');
        const alert = await this.alertController.create({
            header: 'Qual o seu endereço?',
            inputs: [
                {
                    name: 'street',
                    type: 'text',
                    placeholder: 'Rua',
                    value: address[0]
                },
                {
                    name: 'number',
                    type: 'text',
                    placeholder: 'Número',
                    value: address[1]
                },
                {
                    name: 'neighborhood',
                    type: 'text',
                    placeholder: 'Bairro',
                    value: address[2]
                }
            ],
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        console.log('confirmou alteração de endereço');
                    }
                }
            ]
        });

        await alert.present();
        const { data } = await alert.onDidDismiss();

        if (data.values.street && data.values.neighborhood && data.values.number) {
            this.authService.changeAddress(`${data.values.street}//${data.values.number}//${data.values.neighborhood}`);
        } else {
            console.log('inseriu inválido');
        }
    }

    async changePhoneAlert() {
        const alert = await this.alertController.create({
            header: 'Qual o seu novo telefone?',
            inputs: [
                {
                    name: 'phone',
                    type: 'text',
                    value: this.authService.user.phone
                }
            ],
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        console.log('confirmou alteração de telefone');
                    }
                }
            ]
        });

        await alert.present();
        const { data } = await alert.onDidDismiss();

        if (data.values.phone) {
            this.authService.changePhone(data.values.phone);
        } else {
            console.log('inseriu inválido');
        }
    }

}
