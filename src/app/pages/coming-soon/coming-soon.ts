import { Component, inject } from '@angular/core';
import { SeoService } from '../../shared/services/seo.service';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [],
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.scss',
})
export class ComingSoonComponent {
  private seo = inject(SeoService);

  constructor() {
    this.seo.set({
      title: 'Coming Soon',
      description: 'We are crafting something amazing. Stay tuned for updates from UrbanPixora.',
      path: '/coming-soon',
    });
  }
}
