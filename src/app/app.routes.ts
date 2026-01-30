import { Routes } from '@angular/router';
import { BudgetSetupComponent } from './components/budget-setup/budget-setup.component';
import { PlannerComponent } from './components/planner/planner.component';

export const routes: Routes = [
    {
        path: '',
        component: PlannerComponent,
    },
    {
        path: 'budget-setup',
        component: BudgetSetupComponent,
    },
];
