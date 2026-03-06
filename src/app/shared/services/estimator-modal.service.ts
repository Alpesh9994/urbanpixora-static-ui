import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EstimatorModalService {
    private readonly _isOpen = signal(false);

    // Expose as readonly signal
    readonly isOpen = this._isOpen.asReadonly();

    open() {
        this._isOpen.set(true);
        // Lock body scroll when modal is open
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }

    close() {
        this._isOpen.set(false);
        // Restore body scroll
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }

    toggle() {
        if (this._isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }
}
