import InvoiceAhoy from "../services/invoice-ahoy";
import {EventBusService} from "@medusajs/medusa";

class OrderSubscriber {
    readonly invoiceAhoyService_: InvoiceAhoy
    readonly eventBus_: EventBusService

    constructor({ invoiceAhoyService, eventBusService }) {
        this.invoiceAhoyService_ = invoiceAhoyService

        this.eventBus_ = eventBusService

        this.eventBus_.subscribe("order.payment_captured", async ({ id }) => {
            await this.invoiceAhoyService_.orderNotification(id)
        })
    }
}

export default OrderSubscriber