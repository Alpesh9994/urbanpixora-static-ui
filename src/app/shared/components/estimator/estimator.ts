import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import emailjs from '@emailjs/browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-estimator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estimator.html',
  styleUrl: './estimator.scss',
  animations: [
    trigger('stepAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class EstimatorComponent {
  @Input() asModal = false;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  currentStep = 1;
  totalSteps = 4;
  isSubmitting = false;
  isSuccess = false;

  // The main reactive form structure
  estimatorForm: FormGroup = this.fb.group({
    // Step 1: Services (Multi-select)
    services: this.fb.group({
      webDesign: [false],
      webOptimization: [false],
      basicSEO: [false],
      branding: [false],
      graphicsDesign: [false]
    }),

    // Step 2: Web Design Specifics (Only shown if webDesign is true)
    webType: [''],

    // Step 3: Budget & Timeline
    timeline: ['', Validators.required],
    budget: ['', Validators.required],

    // Step 4: Contact Info
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    details: ['']
  });

  // Helper getters
  get f() { return this.estimatorForm.controls; }
  get services() { return this.estimatorForm.get('services') as FormGroup; }
  get needsWebDesign() { return this.services.get('webDesign')?.value === true; }

  // Navigation
  nextStep() {
    // Validate current step before proceeding
    if (this.currentStep === 1) {
      // Must select at least one service
      const hasService = Object.values(this.services.value).some(val => val === true);
      if (!hasService) return; // Add error handling UI if needed

      // If they didn't select web design, jump to step 3
      if (!this.needsWebDesign) {
        this.currentStep = 3;
        return;
      }
    }

    if (this.currentStep === 2) {
      if (!this.f['webType'].value) return; // Must select webType
    }

    if (this.currentStep === 3) {
      if (!this.f['timeline'].value || !this.f['budget'].value) return;
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep === 3 && !this.needsWebDesign) {
      this.currentStep = 1; // Jump back over step 2
      return;
    }

    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  setService(key: string) {
    const control = this.services.get(key);
    if (control) {
      control.setValue(!control.value);
    }
  }

  onSubmit() {
    if (this.estimatorForm.invalid) {
      this.estimatorForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Format the services array for the email template
    const selectedServices = Object.entries(this.services.value)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => {
        const labels: Record<string, string> = {
          webDesign: 'Web Design & Dev',
          webOptimization: 'Website Optimization',
          basicSEO: 'Basic SEO',
          branding: 'Branding',
          graphicsDesign: 'Graphics Design'
        };
        return labels[key];
      })
      .join(', ');

    const templateParams = {
      from_name: this.f['name'].value,
      from_email: this.f['email'].value,
      company: this.f['company'].value || 'Not provided',
      services: selectedServices,
      web_type: this.f['webType'].value || 'N/A',
      timeline: this.f['timeline'].value,
      budget: this.f['budget'].value,
      message: this.f['details'].value || 'No additional details provided.'
    };

    emailjs.send(
      environment.emailjs.serviceId,
      environment.emailjs.templateId,
      templateParams,
      {
        publicKey: environment.emailjs.publicKey,
      }
    ).then(
      () => {
        this.isSubmitting = false;
        this.isSuccess = true;
      },
      (error) => {
        this.isSubmitting = false;
        alert('Oops! Something went wrong sending your request. Please try again or contact us directly on WhatsApp.');
        console.error('EmailJS Error:', error);
      }
    );
  }

  onClose(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.close.emit();
  }
}
