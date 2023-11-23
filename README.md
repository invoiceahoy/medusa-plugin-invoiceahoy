<p align="center">
  <a href="https://invoiceahoy.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://avatars.githubusercontent.com/u/151521744?s=100&v=4">
    <source media="(prefers-color-scheme: light)" srcset="https://avatars.githubusercontent.com/u/151521744?s=100&v=4">
    <img alt="InvoiceAhoy logo" src="https://avatars.githubusercontent.com/u/151521744?s=100&v=4">
    </picture>
  </a>
</p>
<h1 align="center">
  InvoiceAhoy
</h1>

<h4 align="center">
  <a href="https://invoiceahoy.com/docs">Documentation</a> |
  <a href="https://invoiceahoy.com">Website</a>
</h4>

<p align="center">
 A Medusa Commerce plugin to create invoices with InvoiceAhoy
</p>
<p align="center">
   <a href="https://discord.gg/6N92PHZh">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
</p>

# InvoiceAhoy <> Medusa

A Medusa Commerce plugin to create invoices with InvoiceAhoy.

The plugin subscribes to `order` events and creates an invoice for the order.

---

## Features

- Automatically create compliant PDF & HTML invoices from Medusa Orders
- Benefit from InvoiceAhoy's advanced invoicing features like localization

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

## Other channels

- [GitHub Issues](https://github.com/invoiceahoy/medusa-plugin-invoiceahoy/issues)
- [InvoiceAhoy Blog](https://invoiceahoy.com/blog/)
