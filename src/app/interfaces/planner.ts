import { FormControl } from '@angular/forms';

export interface PlannerForm {
    budgetMonth: FormControl<string>;
    incomeFrequency: FormControl<string>;
    incomeAmount: FormControl<number | null>;
}
