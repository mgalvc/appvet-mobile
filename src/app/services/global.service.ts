import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import {ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    public baseURL: string;
    public httpHeaders: object;
    public token: string;
    public id: number;
    public address: string;
    public phone: string;
    public shippingInfo: any;

    constructor(public http: HttpClient, public storage: Storage, private toast: ToastController) {
        // this.baseURL = 'http://localhost:3000';
        this.baseURL = 'http://10.0.0.111:3000';
        this.httpHeaders = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    async showMessage(type, message) {
        const t = await this.toast.create({
            message: message,
            color: type,
            duration: 1500
        });
        t.present();
    }

    setToken(token) {
        this.token = token;
    }

    setId(id) {
        this.id = id;
    }

    setAddress(address) {
        this.address = address;
    }

    noAddress() {
        return this.address === null || this.address.trim() === '';
    }

    setPhone(phone) {
        this.phone = phone;
    }

    getHeader() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            })
        };
    }
}
