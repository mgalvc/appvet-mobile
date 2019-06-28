import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

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

    constructor(public http: HttpClient, public storage: Storage) {
        // this.baseURL = 'http://localhost:3000';
        this.baseURL = 'http://10.0.0.111:3000';
        this.httpHeaders = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    setToken(token) {
        this.token = token;
    }

    setId(id) {
        this.id = 1;
    }

    setAddress(address) {
        this.address = address;
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
