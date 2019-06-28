import { Injectable, OnInit } from '@angular/core';
import {GlobalService} from './global.service';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    items: Item[] = [];
    openItems: Item[] = [];
    waitingItems: Item[] = [];
    private indexes = 0;

    constructor(private global: GlobalService) { }

    ngOnInit() {
        this.loadWaitingItemsFromBack();
    }

    loadWaitingItemsFromBack() {
        this.waitingItems = [];
        let url = `${this.global.baseURL}/clients/${this.global.id}/waiting_items`;
        //console.log(url);
        this.global.http.get(url, this.global.getHeader())
            .subscribe((response) => {
                // @ts-ignore
                for (let item of response.items) {
                    // @ts-ignore
                    this.waitingItems.unshift(new Item(null, item.id, item.name, item.price, item.picture, item.quantity, item.status));
                }
                console.log('done');
            }, (error) => {
                console.log(error);
            });
    }

    getNewIndex() {
        return this.indexes++;
    }

    addItem(id, name, price, picture, quantity) {
        console.log('entrou');
        let newItem = new Item(this.getNewIndex(), id, name, price, picture, quantity, Status.OPEN);
        let index = this.openItems.findIndex((item) => {
           return item.id === newItem.id && item.status === newItem.status;
        });
        if (index > -1) {
            this.openItems[index].quantity += 1;
        } else {
            this.openItems.unshift(newItem)
        }
    }

    addOneToItem(id) {
        let index = this.openItems.findIndex((item) => {
            return item.cartId === id;
        });
        this.openItems[index].quantity += 1;
    }

    removeOneFromItem(id) {
        let index = this.openItems.findIndex((item) => {
            return item.cartId === id;
        });

        if (this.openItems[index].quantity === 1) {
            this.openItems.splice(index, 1);
            return 1;
        } else {
            this.openItems[index].quantity -= 1;
        }

        return 0;
    }

    deleteItem(id) {
        let index = this.openItems.findIndex((item) => {
            return item.cartId === id;
        });
        this.openItems.splice(index, 1);
    }

    confirmOpenItems() {
        let itemsToSend = [];
        let totalPrice = 0;

        for (let item of this.openItems) {
            item.status = Status.SENT_TO_BACK;
            itemsToSend.push({ id: item.id, quantity: item.quantity, price: item.price })
            totalPrice += parseFloat(item.price.replace(',', '.')) * item.quantity;
        }

        let body = {
            items: itemsToSend,
            status: 'waiting',
            price: totalPrice,
            client_id: this.global.id,
            delivery_address: this.global.address
        };

        this.global.http.post(this.global.baseURL + '/orders', body, this.global.getHeader())
            .subscribe((response) => {
                this.openItems = [];
                this.loadWaitingItemsFromBack();
            }, (error) => {
                console.log(error);
        });
    }
}

enum Status {
    OPEN = 'open',
    WAITING = 'waiting',
    SENT_TO_BACK = 'sent_to_back',
    SENT = 'sent',
    RECEIVED = 'received'
}

class Item {
    id: number;
    name: string;
    price: string;
    quantity: number;
    picture: string;
    status: Status;
    cartId: number;

    constructor(cartdId, id, name, price, picture, q, status) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.picture = picture;
        this.quantity = q;
        this.status = status;
        this.cartId = cartdId;
    }
}