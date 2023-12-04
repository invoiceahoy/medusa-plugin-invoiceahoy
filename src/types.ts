export type InvoiceAhoyPluginOptions = {
  api_key: string
  logo_url?: string
  send?: {
    enabled: boolean
    from?: string
    cc?: string[]
    subject: string
  }
}