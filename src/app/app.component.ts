import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { BudgetAppState, BudgetDataService } from './services/budget-data.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, HeaderComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
    public state: BudgetAppState;
    private destroyed$ = new Subject<void>();

    constructor(
        private dataService: BudgetDataService,
    ) {
        this.state = this.dataService.getState();
    }

    public ngOnInit(): void {
        this.dataService.state$
            .pipe(takeUntil(this.destroyed$))
            .subscribe((next) => {
                this.state = next;
            });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
