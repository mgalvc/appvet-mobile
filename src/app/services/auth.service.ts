import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import {Router} from '@angular/router';
import {CartService} from './cart.service';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    public user: User;

    constructor(private global: GlobalService, private cart: CartService, private router: Router) {
        this.user = new User();
    }

    hasValidToken() {
        return new Promise((resolve, reject) => {
            this.global.http.get(this.global.baseURL + '/auth/check', this.global.getHeader())
                .subscribe((response) => {
                    // @ts-ignore
                    resolve(response.success);
                }, (error) => {
                    reject(error.status === 401);
                })
        });
    }

    getToken() {
        return this.user.token;
    }

    saveUser(data) {
        this.user.setData(data);

        // store it to further access
        this.storeData();
    }

    storeData() {
        this.global.storage.set('user', this.user);
        this.global.setToken(this.user.token);
        this.global.setId(this.user.id);
        this.global.setAddress(this.user.address);
        this.global.setPhone(this.user.phone);
    }

    // load() {
    //     this.global.storage.get('user').then(value => {
    //         console.log('found in storage ' + value.token);
    //         this.user.setData(value);
    //         this.global.setToken(value.token);
    //         this.global.http.get(this.global.baseURL + '/auth/check', this.global.getHeader())
    //             .subscribe(response => {
    //                 console.log(response);
    //                 // @ts-ignore
    //                 if (response.success) {
    //                     this.router.navigateByUrl('');
    //                 } else {
    //                     console.log(response);
    //                 }
    //             }, error => {
    //                 if (error.status === 401) {
    //                     this.router.navigateByUrl('login');
    //                 }
    //             })
    //     })
    // }

    async loadData() {
        await this.global.storage.get('user').then((value) => {
            this.user.setData(value);
            this.global.setToken(value.token);
            this.global.setId(value.id);
            this.global.setAddress(value.address);
            this.global.setPhone(value.phone);
        }).catch((error) => {
            console.log(error);
        });
    }

    logout() {
        this.global.storage.remove('user').then((value) => {
            console.log('removeu dados');
            console.log(value);
            this.router.navigateByUrl('login');
        }).catch((error) => {
            console.log(error);
        })
    }

    changeName(name) {
        this.global.http.put(`${this.global.baseURL}/clients/${this.global.id}`, { name: name }, this.global.getHeader())
            .subscribe((response) => {
                console.log(response);
                // @ts-ignore
                if (response.success) {
                    this.user.name = name;
                    this.storeData();
                }
            }, (error) => {
                console.log(error)
            })
    }

    changeEmail(email) {
        this.global.http.put(`${this.global.baseURL}/clients/${this.global.id}`, { email: email }, this.global.getHeader())
            .subscribe((response) => {
                console.log(response);
                // @ts-ignore
                if (response.success) {
                    this.user.email = email;
                    this.storeData();
                }
            }, (error) => {
                console.log(error)
            })
    }

    changeAddress(address) {
        this.global.http.put(`${this.global.baseURL}/clients/${this.global.id}`, { address: address }, this.global.getHeader())
            .subscribe((response) => {
                console.log(response);
                // @ts-ignore
                if (response.success) {
                    this.user.address = address;
                    this.storeData();
                }
            }, (error) => {
                console.log(error)
            })
    }

    changePhone(phone) {
        this.global.http.put(`${this.global.baseURL}/clients/${this.global.id}`, { phone: phone }, this.global.getHeader())
            .subscribe((response) => {
                console.log(response);
                // @ts-ignore
                if (response.success) {
                    this.user.phone = phone;
                    this.storeData();
                }
            }, (error) => {
                console.log(error)
            })
    }
}

class User {
    name: string;
    email: string;
    token: string;
    id: number;
    address: string;
    phone: string;

    setData(data) {
        this.name = data.name;
        this.email = data.email;
        this.token = data.token;
        this.id = data.id;
        this.address = data.address;
        this.phone = data.phone;
    }
}
