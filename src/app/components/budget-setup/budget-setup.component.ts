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

    public constructor(
        private dataService: BudgetDataService,
    ) {
        //
    }

    public ngOnInit(): void {
        this.summary = this.dataService.getPlannerSummary();
    }
}
