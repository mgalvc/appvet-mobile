import {Component} from '@angular/core';
import {CartService} from '../services/cart.service';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {GlobalService} from '../services/global.service';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
    selectedSegment = 'open';
    items = [];

    constructor(private global: GlobalService, private cartService: CartService, public alertController: AlertController, public actionsController: ActionSheetController) {}

    change(event) {
        if (this.selectedSegment === 'open') {
            this.cartService.loadWaitingItemsFromBack();
        }
    }

    ionViewDidEnter() {
        this.cartService.loadWaitingItemsFromBack();
    }

    totalPrice() {
        let total = 0;

        for (let item of this.cartService.openItems) {
            if (item.status === 'open' || item.status === 'sent_to_back')
                total += parseFloat(item.price.replace(',', '.')) * item.quantity;
        }

        return total.toFixed(2).toString().replace('.', ',');
    }

    getStatus(status) {
        if (status === 'open' || status === 'sent_to_back') {
            return 'Em aberto';
        } else if (status === 'waiting') {
            return 'Aguardando';
        }
    }

    async confirm() {
        const alert = await this.alertController.create({
            message: `Confirma o pedido a ser entregue no endereço <b>${this.global.address}?</b>`,
            buttons: [
                {
                    text: 'Não',
                    role: 'Cancel'
                },
                {
                    text: 'Sim',
                    handler: () => {
                        this.cartService.confirmOpenItems();
                    }
                }
            ]
        });
        await alert.present();
    }

    noOpenItems() {
        return this.cartService.openItems.length === 0;
    }

    async openActions(item) {
        const actions = await this.actionsController.create({
            header: item.name,
            buttons: [
                {
                    text: 'Adicionar',
                    icon: 'add',
                    handler: () => {
                        this.cartService.addOneToItem(item.cartId);
                    }
                },
                {
                    text: 'Remover',
                    icon: 'remove',
                    handler: () => {
                        this.cartService.removeOneFromItem(item.cartId)
                    }
                },
                {
                    text: 'Deletar',
                    icon: 'trash',
                    handler: () => {
                        this.cartService.deleteItem(item.cartId);
                    }
                }
            ]
        });

        await actions.present();
    }

}
