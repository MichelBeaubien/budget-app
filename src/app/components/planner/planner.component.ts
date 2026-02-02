import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetAppState, BudgetDataService } from '../../services/budget-data.service';

@Component({
    selector: 'app-planner',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './planner.component.html',
    styleUrl: './planner.component.scss'
})
export class PlannerComponent implements OnInit {
    public hasSaved = false;

    public plannerForm = new FormGroup({
        householdName: new FormControl('Beaubien', { nonNullable: true, validators: [Validators.required] }),
        budgetName: new FormControl('Primary Budget', { nonNullable: true, validators: [Validators.required] }),
        budgetMonth: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        incomeFrequency: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        incomeAmount: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] })
    });

    public constructor(
        private dataService: BudgetDataService,
        private router: Router
    ) {
        //
    }

    public ngOnInit(): void {
        const snapshot = this.dataService.getState();
        this.syncForm(snapshot);
        this.hasSaved = snapshot.onboarded;
    }

    public savePlanner(): void {
        if (this.plannerForm.invalid) {
            this.plannerForm.markAllAsTouched();
            return;
        }

        const value = this.plannerForm.getRawValue();
        const next = this.dataService.updateState({
            onboarded: true,
            householdName: value.householdName,
            budgetName: value.budgetName,
            budgetMonth: value.budgetMonth,
            incomeFrequency: value.incomeFrequency,
            incomeAmount: Number(value.incomeAmount) || 0
        });

        this.syncForm(next);
        this.hasSaved = true;
        void this.router.navigate(['/budget-setup']);
    }

    public resetPlanner(): void {
        this.dataService.reset();
        this.plannerForm.reset({
            householdName: 'Beaubien',
            budgetName: 'Primary Budget',
            budgetMonth: this.currentMonthValue(),
            incomeFrequency: '',
            incomeAmount: 0
        });
        this.hasSaved = false;
    }

    private syncForm(state: BudgetAppState): void {
        this.plannerForm.patchValue({
            householdName: state.householdName || 'Beaubien',
            budgetName: state.budgetName || 'Primary Budget',
            budgetMonth: state.budgetMonth || this.currentMonthValue(),
            incomeFrequency: state.incomeFrequency,
            incomeAmount: state.incomeAmount
        });
    }

    private currentMonthValue(): string {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    }
}
