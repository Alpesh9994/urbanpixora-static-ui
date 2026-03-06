import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './shared/components/header/header';
import { OverlayMenuComponent } from './shared/components/overlay-menu/overlay-menu';
import { SmoothScrollService } from './shared/services/smooth-scroll.service';
import { CustomCursorComponent } from './shared/components/custom-cursor/custom-cursor';
import { WhatsappButtonComponent } from './shared/components/whatsapp-button/whatsapp-button';
import { routeTransitionAnimations } from './shared/animations/route-animations';
import { EstimatorComponent } from './shared/components/estimator/estimator';
import { EstimatorModalService } from './shared/services/estimator-modal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, OverlayMenuComponent, CustomCursorComponent, WhatsappButtonComponent, EstimatorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [routeTransitionAnimations]
})
export class App implements OnInit {
  isStandaloneRoute = signal(false);
  estimatorModal = inject(EstimatorModalService);

  constructor(
    private smoothScroll: SmoothScrollService,
    private router: Router
  ) { }

  ngOnInit() {
    this.removeGlobalLoader();

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      const url = e.urlAfterRedirects;

      const isStandalone = url.startsWith('/admin') || url.startsWith('/start-project');
      this.isStandaloneRoute.set(isStandalone);

      if (url.startsWith('/admin')) {
        // Destroy Lenis so the admin panel uses native browser scroll
        this.smoothScroll.destroy();
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        return;
      }

      // Public site: ensure Lenis is running
      this.smoothScroll.init();
      this.smoothScroll.scrollToTop();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.smoothScroll.resize();
          setTimeout(() => this.smoothScroll.resize(), 300);
        });
      });
    });

    // Check on first load (before any navigation event)
    const initialUrl = this.router.url;
    if (initialUrl.startsWith('/admin') || initialUrl.startsWith('/start-project')) {
      this.isStandaloneRoute.set(true);
      if (initialUrl.startsWith('/admin')) {
        this.smoothScroll.destroy();
      }
    } else {
      this.smoothScroll.init();
    }
  }

  getRouteAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.isActivated
      ? outlet.activatedRoute.snapshot.url.join('/')
      : null;
  }

  private removeGlobalLoader() {
    const loader = document.getElementById('global-loader');
    if (loader && !loader.classList.contains('loader-fade-out')) {
      // Add a tiny delay so the gorgeous loader is visible for at least a fraction of a second even on fast loads
      setTimeout(() => {
        loader.classList.add('loader-fade-out');
        setTimeout(() => loader.remove(), 500);
      }, 500);
    }
  }
}
