import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlannerForm } from '../../interfaces/planner';

@Component({
    selector: 'app-planner',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './planner.component.html',
    styleUrl: './planner.component.scss'
})
export class PlannerComponent {
    public plannerForm = new FormGroup<PlannerForm>({
        budgetMonth: new FormControl(this.currentMonth(), {
            nonNullable: true,
            validators: [Validators.required],
        }),
        incomeFrequency: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        incomeAmount: new FormControl(null, {
            nonNullable: false,
            validators: [
                Validators.required,
                Validators.min(1),
            ],
        })
    });

    public savePlanner(): void {
        if (this.plannerForm.invalid) {
            this.plannerForm.markAllAsTouched();
            return;
        }

        console.log('Planner Form: ', this.plannerForm.value);
    }

    private currentMonth(): string {
        const d = new Date();

        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
}
