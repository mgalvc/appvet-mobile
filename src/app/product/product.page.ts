import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GlobalService} from '../services/global.service';
import {CartService} from '../services/cart.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.page.html',
    styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
    product: object;

    constructor(private route: ActivatedRoute, private global: GlobalService, private router: Router, private cart: CartService) {
    }

    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.global.http.get(`${this.global.baseURL}/products/${id}`, this.global.getHeader())
            .subscribe(response => {
                this.product = response;
            }, error => {
                console.log(error);
                if (error.status === 401) {
                    this.router.navigateByUrl('login');
                }
            });
    }

    addToCart() {
        // @ts-ignore
        this.cart.addItem(this.product.id, this.product.name, this.product.price, this.product.picture, 1);
    }

}
