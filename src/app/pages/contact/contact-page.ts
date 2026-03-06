import { Component, signal, inject } from '@angular/core';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { FooterComponent } from '../../shared/components/footer/footer';
import { SeoService } from '../../shared/services/seo.service';
import { EstimatorComponent } from '../../shared/components/estimator/estimator';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ScrollRevealDirective, FooterComponent, EstimatorComponent],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss'
})
export class ContactPageComponent {
  private seo = inject(SeoService);

  constructor() {
    this.seo.set({
      title: 'Get in Touch',
      description: 'Have a project in mind? Contact UrbanPixora — we respond within 24 hours and are ready to help bring your digital vision to life.',
      path: '/contact',
    });
  }

  readonly info = [
    { icon: '📍', label: 'Studio Location', value: 'Surat, Gujarat, India' },
    { icon: '📧', label: 'Email Us', value: 'hello@urbanpixora.com' },
    { icon: '📱', label: 'Call / WhatsApp', value: '+91 98XXX XXXXX' },
    { icon: '⏰', label: 'Working Hours', value: 'Mon – Sat, 9am – 6pm IST' },
  ];
}
