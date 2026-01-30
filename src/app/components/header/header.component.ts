import { Component, Input } from '@angular/core';
import { BudgetAppState } from '../../services/budget-data.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    @Input() public state: BudgetAppState | null = null;
}
