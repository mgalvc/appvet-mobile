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
    shippingInfo: any;

    constructor(private global: GlobalService, private cartService: CartService, public alertController: AlertController, public actionsController: ActionSheetController) {}

    change(event) {
        if (this.selectedSegment === 'open') {
            this.cartService.loadWaitingItemsFromBack();
            this.loadShippingInfo();
        } else if (this.selectedSegment === 'sent') {
            this.cartService.loadSentItemsFromBack();
        } else {
            this.cartService.loadReceivedItemsFromBack();
        }
    }

    ionViewDidEnter() {
        this.cartService.loadWaitingItemsFromBack();
        this.loadShippingInfo();
    }

    totalNumberPrice() {
        let total = 0;

        for (let item of this.cartService.openItems) {
            if (item.status === 'open' || item.status === 'sent_to_back')
                total += parseFloat(item.price.replace(',', '.')) * item.quantity;
        }

        return total;
    }

    totalPrice() {
        return this.totalNumberPrice().toFixed(2).toString().replace('.', ',');
    }

    loadShippingInfo() {
        let tax = this.cartService.getShippingTax(this.totalNumberPrice());
        console.log('taxa ' + tax);

        if (tax === 0) {
            this.shippingInfo = { color: 'success', text: 'Frete grátis!' };
        } else {
            this.shippingInfo = { color: 'danger', text: ` + R$ ${tax} de frete` };
        }
    }

    getStatus(status) {
        if (status === 'open' || status === 'sent_to_back') {
            return 'Em aberto';
        } else if (status === 'waiting') {
            return 'Aguardando';
        }
    }

    async receive(orderId) {
        const alert = await this.alertController.create({
            message: `Confirma o recebimento deste pedido?</b>`,
            buttons: [
                {
                    text: 'Não',
                    role: 'Cancel'
                },
                {
                    text: 'Sim',
                    handler: () => {
                        this.cartService.receiveOrder(orderId);
                    }
                }
            ]
        });

        await alert.present();
    }

    async confirm() {
        let alert;

        if (this.global.noAddress()) {
            alert = await this.alertController.create({
                message: `Vá até a aba <b>Meu Perfil</b> e termine de preencher seus dados antes de continuar!`,
            });
        } else {
            alert = await this.alertController.create({
                message: `Confirma o pedido a ser entregue no endereço <b>${this.global.address.split('//').join(', ')}?</b>`,
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
        }

        await alert.present();
        this.loadShippingInfo();
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
                        this.loadShippingInfo();
                    }
                },
                {
                    text: 'Remover',
                    icon: 'remove',
                    handler: () => {
                        this.cartService.removeOneFromItem(item.cartId)
                        this.loadShippingInfo();
                    }
                },
                {
                    text: 'Deletar',
                    icon: 'trash',
                    handler: () => {
                        this.cartService.deleteItem(item.cartId);
                        this.loadShippingInfo();
                    }
                }
            ]
        });

        await actions.present();
    }

}
