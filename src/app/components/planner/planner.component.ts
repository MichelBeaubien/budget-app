import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-planner',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './planner.component.html',
    styleUrl: './planner.component.scss'
})
export class PlannerComponent {
    public plannerForm = new FormGroup({
        month: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        incomeFrequency: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        incomeAmount: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] })
    });

    public savePlanner(): void {
        if (this.plannerForm.invalid) {
            this.plannerForm.markAllAsTouched();
        }
    }
}
