import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BudgetDataService, PlannerSummary } from '../../services/budget-data.service';

@Component({
    selector: 'app-budget-setup',
    standalone: true,
    imports: [RouterLink, DecimalPipe],
    templateUrl: './budget-setup.component.html',
    styleUrl: './budget-setup.component.scss'
})
export class BudgetSetupComponent implements OnInit {
    public summary: PlannerSummary | null = null;
    public effects: string[] = [];

    public constructor(
        private dataService: BudgetDataService,
    ) {
        //
    }

    public ngOnInit(): void {
        this.summary = this.dataService.getPlannerSummary();
        this.effects = this.buildEffects(this.summary);
    }

    private buildEffects(summary: PlannerSummary | null): string[] {
        if (!summary) {
            return [];
        }
        const effects: string[] = [];

        if (summary.profile.primaryGoal) {
            effects.push(`Goal focus: ${summary.profile.primaryGoal}.`);
        }

        if (summary.money.budgetStyle) {
            effects.push(`Budget style reminder: ${summary.money.budgetStyle}.`);
        }

        if (summary.money.incomeFrequency && summary.money.incomeAmount > 0) {
            effects.push(`Income context: ${summary.money.incomeFrequency} at $${summary.money.incomeAmount.toLocaleString('en-US')}.`);
        }

        if (summary.profile.homeStatus === 'Renting') {
            effects.push('Housing tip: add Rent and Utilities categories.');
        }

        if (summary.profile.homeStatus === 'Homeowner') {
            effects.push('Housing tip: add Mortgage, Insurance, and Maintenance categories.');
        }

        if (summary.profile.hasKids === 'Yes') {
            effects.push('Family tip: add Childcare and Education categories.');
        }

        if (summary.profile.workStatus === 'Self-employed') {
            effects.push('Work tip: add a Taxes category for quarterly or annual payments.');
        }

        if (summary.profile.workStatus === 'Student') {
            effects.push('Student tip: add Tuition, Books, and Transportation categories.');
        }

        if (summary.profile.workStatus === 'Retired') {
            effects.push('Retirement tip: review Healthcare and Fixed-income categories.');
        }

        return effects;
    }
}
