# InvoiceAhoy

Create invoices for Medusa orders.

[Website](https://invoiceahoy.com) | [Documentation](https://invoiceahoy.com/docs)



## Features

- Automatically create compliant PDF & HTML invoices from Medusa orders.
- Invoices are accessible from the Backend portal.
- The plugin is in active development. If you have any feature requests, please open an issue.

---

## Prerequisites

- [InvoiceAhoy account](https://invoiceahoy.com)
- [Medusa backend](https://docs.medusajs.com/development/backend/install)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-plugin-invoiceahoy
  ```

2\. Set the following environment variables in `.env`:

  ```bash
  INVOICEAHOY_API_KEY=<YOUR_INVOICEAHOY_API_KEY>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...
    {
        resolve: `medusa-plugin-invoiceahoy`,
        options: {
            logo_url: "https://invoiceahoy.com/ia_logo.svg",  // the logo to add to the invoice
            api_key: process.env.INVOICEAHOY_API_KEY, // required
        },
    },
]
  ```

---

## Test the Plugin

1\. Run the following command in the directory of the Medusa backend to run the backend:

  ```bash
  npm run start
  ```

2\. Place an order using a storefront or the [Store APIs](https://docs.medusajs.com/api/store).
If using the `Manual Payment` option, visit the `Backend Portal` and manually capture the payment.

3\. Verify that the invoice was created by checking your [InvoiceAhoy account](https://invoiceahoy.com/app) or the
Order in `Medusa Backend Portal`.

---

## Events

When an invoice is created, the "invoice.created" event is published with the invoice details.
This can be used to retrieve the invoice artifacts (pdf / html) and deliver it to
the customer in a downstream service.

## Other channels

- [GitHub Issues](https://github.com/invoiceahoy/medusa-plugin-invoiceahoy/issues)
- [InvoiceAhoy Blog](https://invoiceahoy.com/blog/)
