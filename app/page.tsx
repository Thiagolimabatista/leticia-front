import { AnnouncementBar } from '@/components/announcement-bar'
import { ContactForm } from '@/components/contact-form'
import { HelpCenter } from '@/components/help-center'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { WhatsAppCta } from '@/components/whatsapp-cta'
import { WhatsAppFab } from '@/components/whatsapp-fab'

export default function Page() {
  return (
    <main>
      <AnnouncementBar />
      <SiteHeader />
      <HelpCenter>
        <ContactForm />
      </HelpCenter>
      <WhatsAppCta />
      <SiteFooter />
      <WhatsAppFab />
    </main>
  )
}
