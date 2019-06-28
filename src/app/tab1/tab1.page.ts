import { Component } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { AuthService } from '../services/auth.service';
import {ModalController, NavController} from '@ionic/angular';
import { FiltersPage } from '../filters/filters.page';
import {ProductPage} from '../product/product.page';
import {NavigationExtras, Router} from '@angular/router';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    private products: any;
    private filteredProducts: any;
    private token: string;
    private filters = {
        category: '',
        order: 'name'
    };
    private searchTerm = '';

    constructor(private global: GlobalService, public modalController: ModalController, public router: Router) {
        //this.loadProducts();
    }

    doSearch() {
        if (this.searchTerm != '') {
            this.filteredProducts = this.products.filter(item => {
                return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
            });
        } else {
            this.filteredProducts = this.products;
        }
    }

    processDirection() {
        if (this.filters.order === 'expensive') {
            return 'desc';
        }

        return 'asc';
    }

    processColumn() {
        if (this.filters.order === 'name') {
            return 'name';
        }

        return 'price';
    }

    filtersToShow() {
        return this.filters.category || this.filterByPrice();
    }

    filterByPrice() {
        return this.filters.order != 'name';
    }

    displayOrder() {
        return this.filters.order === 'cheap' ? 'Menor preço' : 'Maior preço';
    }

    buildURL() {
        let direction = `?direction=${this.processDirection()}`;
        let column = `&column=${this.processColumn()}`;
        let category = this.filters.category ? `&category=${this.filters.category}` : '';
        return `/products${direction}${column}${category}`;
    }

    loadProducts() {
        this.global.http.get(this.global.baseURL + this.buildURL(), this.global.getHeader())
            .subscribe((response) => {
                // @ts-ignore
                this.products = response.products;
                this.filteredProducts = this.products;
                this.searchTerm = '';
            }, (error) => {
                console.log(error);
                if (error.status === 401) {
                    this.router.navigateByUrl('login');
                }
            });
    }

    async doRefresh(event) {
        await this.loadProducts();
        event.target.complete();
    }

    async openFilters() {
        console.log('pediu pra abrir modal');
        const modal = await this.modalController.create({
            component: FiltersPage,
            componentProps: this.filters
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
        if (data) {
            this.filters = data;
            this.loadProducts();
        }
    }

    selectProduct(selected) {
        this.router.navigateByUrl('/product/' + selected.id);
    }

    ngOnInit() {
        this.global.storage.get('user').then((value) => {
            console.log('found in storage ' + value.token);
            this.global.setToken(value.token);
            this.loadProducts();
        }).catch((error) => {
            console.log(error);
        });
    }

}
