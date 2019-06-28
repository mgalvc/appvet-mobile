import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.page.html',
    styleUrls: ['./filters.page.scss'],
})
export class FiltersPage implements OnInit {
    private filters = {
        category: 'Rações',
        //order: 'name'
    };

    private categories = [
        'Rações',
        'Coleiras',
        'Medicações',
        'Higiene e Estética',
        'Acessórios'
    ];

    private orders = [
        { display: 'Nome', value: 'name' },
        { display: 'Menor preço', value: 'cheap' },
        { display: 'Maior preço', value: 'expensive' }
    ];

    constructor(private modalController: ModalController, navParams: NavParams) {
        this.filters.category = navParams.data.category;
        //this.filters.order = navParams.data.order;
    }

    ngOnInit() {
    }

    closeFilters(filter) {
        if (filter) {
            this.modalController.dismiss(this.filters);
        } else {
            this.modalController.dismiss();
        }
    }
}
