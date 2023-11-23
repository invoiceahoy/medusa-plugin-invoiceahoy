import {humanizeAmount, zeroDecimalCurrencies} from "medusa-core-utils"
import {BaseService} from "medusa-interfaces"
import {EventBusService, Logger, OrderService, Payment, RegionService, TotalsService} from "@medusajs/medusa";
import {InvoiceAhoyPluginOptions} from "src/types";
import {CreateInvoiceResponse, InvoiceAhoy as IaClient, Item} from "invoiceahoy";
import {EntityManager} from "typeorm";
import {Invoice} from "../models/invoice";

class InvoiceAhoy extends BaseService {

  protected readonly manager: EntityManager;
  protected readonly orderService_: OrderService;
  protected readonly totalsService_: TotalsService;
  protected readonly regionService_: RegionService;
  protected readonly eventBus_: EventBusService;
  protected readonly invoice2Model_: Invoice;
  protected readonly options_: InvoiceAhoyPluginOptions;
  protected readonly logger_: Logger;


  constructor(params: any, options: InvoiceAhoyPluginOptions) {
    super()
    const {manager, orderService, totalsService, regionService, logger, invoiceModel, eventBusService} = params;
    this.manager_ = manager
    this.logger_ = logger;
    this.orderService_ = orderService
    this.totalsService_ = totalsService
    this.invoice2Model_ = invoiceModel
    this.regionService_ = regionService
    this.eventBus_ = eventBusService
    this.options_ = options
  }

  async orderNotification(orderId) {
    const logger = this.logger_;
    this.logger_.debug(`Creating invoice for order ${orderId}`);

    const order = await this.orderService_.retrieve(orderId, {
      select: [
        "shipping_total",
        "discount_total",
        "tax_total",
        "refunded_total",
        "gift_card_total",
        "subtotal",
        "total",
      ],
      relations: [
        "customer",
        "billing_address",
        "shipping_address",
        "discounts",
        "discounts.rule",
        "shipping_methods",
        "shipping_methods.shipping_option",
        "payments",
        "fulfillments",
      ],
    })

    this.logger_.debug(order);
    const {
      subtotal,
      tax_total,
      discount_total,
      shipping_total,
      total,
      email,
      created_at,
      currency_code,
      billing_address,
      customer,
      payments,
    } = order


    const currencyCode = currency_code.toUpperCase()
    const getDisplayAmount = (amount) => {
      const humanAmount = humanizeAmount(amount, currencyCode)
      if (zeroDecimalCurrencies.includes(currencyCode.toLowerCase())) {
        return humanAmount
      }
      return Number(humanAmount.toFixed(2))
    }


    const items: Item[] = [];
    for (const lineItem of order.items) {
      const lineItemTotals = await this.totalsService_.getLineItemTotals(
        lineItem,
        order,
        {
          include_tax: true,
        }
      )

      this.logger_.debug(`Adding item to invoice: ${lineItem.title} ${lineItem.quantity} ${getDisplayAmount(lineItem.total)}`)
      items.push({
        name: lineItem.title,
        quantity: lineItem.quantity,
        unit_price: lineItem.unit_price,
        total: lineItem.total,
        discount_total: lineItem.discount_total,
        tax_total: lineItemTotals.tax_total,
      })
    }
    const activityId = logger.activity("Sending API request...")

    const client: IaClient = new IaClient(this.options_.api_key);

    const invoice = await client.invoices.create({
      logo_url: this.options_.logo_url,
      data: {
        currency: currencyCode,
        issue_date: created_at.toISOString(),
        due_date: created_at.toISOString(),
        notes: "",
        footer_text: "<p>Thank you for your business.</p>",
        business: {
          email: customer.email,
          contact_name: customer.first_name,
          name: billing_address.company,
          tax_id: "",
          address_1: billing_address.address_1,
          address_2: billing_address.address_2,
          city: billing_address.city,
          postal_code: billing_address.postal_code,
          region: billing_address.province,
        },
        customer: {
          email: email,
          name: customer.first_name,
          company: billing_address.company,
          tax_id: billing_address.country_code,
          address_1: billing_address.address_1,
          address_2: billing_address.address_2,
          city: billing_address.city,
          postal_code: billing_address.postal_code,
          region: billing_address.province,
        },
        payments: payments.map((p: Payment) => ({
          processor_id: p.provider_id,
          payment_type: null,
          currency: currencyCode,
          amount: p.amount,
          created_at: p.created_at.toISOString(),
          reference: p.provider_id
        })),
        items: items,
        sub_total: getDisplayAmount(subtotal),
        total: getDisplayAmount(total),
        tax_total: getDisplayAmount(tax_total),
        discount_total: (discount_total)
      }
    })
    logger.success(activityId, `Invoice created ${JSON.stringify(invoice)}`);
    await this.createInvoice(orderId, invoice);

    this.logger_.debug(`Emitting "invoice.created" for id=${invoice.id}`);
    await this.eventBus_.emit(
      "invoice.created",
      {invoice},
    )
  }

  async createInvoice(orderId: string, input: CreateInvoiceResponse) {
    this.logger_.debug(`Storing invoice in db..`);
    const invoiceRepo = this.manager_.getRepository(
      this.invoice2Model_
    );
    this.logger_.debug(`Storing invoice in db..`);
    const invoice = invoiceRepo.create()
    invoice.external_id = input.id;
    invoice.order_id = orderId;
    invoice.doc_number = input.doc_number;

    const result = await invoiceRepo.save(invoice);
    this.logger_.debug(`Created invoice record ${invoice.id}`);
    return result;
  }
}

export default InvoiceAhoy