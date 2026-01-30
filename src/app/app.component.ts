import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { BudgetAppState, BudgetDataService } from './services/budget-data.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ReactiveFormsModule, HeaderComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    public state: BudgetAppState;

    public wizardForm = new FormGroup({
        householdName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        budgetName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        budgetStyle: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        budgetMonth: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        incomeFrequency: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        incomeAmount: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] })
    });

    constructor(
        private dataService: BudgetDataService,
    ) {
        this.state = this.dataService.getState();
        this.syncWizard();
    }

    percent(spent: number, target: number): number {
        if (target <= 0) {
            return 0;
        }
        return Math.min(100, Math.round((spent / target) * 100));
    }

    formatMoney(amount: number): string {
        return `$${amount.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}`;
    }

    formatAmount(amount: number): string {
        const abs = Math.abs(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return amount >= 0 ? `+$${abs}` : `-$${abs}`;
    }

    public completeWizard(): void {
        if (this.wizardForm.invalid) {
            this.wizardForm.markAllAsTouched();
            return;
        }
        const value = this.wizardForm.getRawValue();
        this.state = this.dataService.updateState({
            onboarded: true,
            householdName: value.householdName ?? '',
            budgetName: value.budgetName ?? '',
            budgetStyle: value.budgetStyle ?? '',
            budgetMonth: value.budgetMonth ?? '',
            incomeFrequency: value.incomeFrequency ?? '',
            incomeAmount: Number(value.incomeAmount) || 0
        });
        this.syncWizard();
    }

    public resetState(): void {
        this.state = this.dataService.reset();
        this.syncWizard();
    }

    private syncWizard(): void {
        this.wizardForm.patchValue({
            householdName: this.state.householdName,
            budgetName: this.state.budgetName,
            budgetStyle: this.state.budgetStyle,
            budgetMonth: this.state.budgetMonth,
            incomeFrequency: this.state.incomeFrequency,
            incomeAmount: this.state.incomeAmount
        });

        if (this.state.onboarded) {
            this.wizardForm.disable({ emitEvent: false });
        } else {
            this.wizardForm.enable({ emitEvent: false });
        }
    }
}
