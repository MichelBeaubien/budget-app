import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createPlannerForm, PlannerPreset, PlannerPresetId, PLANNER_PRESETS } from '../../helpers/quick-planner';
import { BudgetAppState, BudgetDataService } from '../../services/budget-data.service';

@Component({
    selector: 'app-planner',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './planner.component.html',
    styleUrl: './planner.component.scss'
})
export class PlannerComponent implements OnInit {
    public hasSaved = false;

    public presets: PlannerPreset[] = PLANNER_PRESETS;

    public selectedPresetId: PlannerPresetId | null = null;

    public readonly budgetStyleDescriptions: Record<string, string> = {
        'Zero-based': 'Assign every dollar to a category so income minus expenses equals zero.',
        '50/30/20': 'Split income into needs (50%), wants (30%), and savings or debt (20%).',
        Envelope: 'Put a fixed amount into each category and stop spending when it is empty.',
        Custom: 'No preset rules. You decide the targets and structure.'
    };

    public plannerForm = createPlannerForm();

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
            budgetStyle: value.budgetStyle,
            budgetMonth: value.budgetMonth,
            incomeFrequency: value.incomeFrequency,
            incomeAmount: Number(value.incomeAmount) || 0,
            homeStatus: value.homeStatus,
            relationshipStatus: value.relationshipStatus,
            hasKids: value.hasKids,
            workStatus: value.workStatus,
            ageRange: value.ageRange,
            primaryGoal: value.primaryGoal
        });

        this.syncForm(next);
        this.hasSaved = true;
        void this.router.navigate(['/budget-setup']);
    }

    public resetPlanner(): void {
        this.dataService.reset();

        this.plannerForm.reset({
            householdName: '',
            budgetName: '',
            budgetStyle: '',
            budgetMonth: '',
            incomeFrequency: '',
            incomeAmount: 0,
            homeStatus: '',
            relationshipStatus: '',
            hasKids: '',
            workStatus: '',
            ageRange: '',
            primaryGoal: ''
        });
        this.selectedPresetId = null;
        this.hasSaved = false;
    }

    public applyPreset(): void {
        const preset = this.presets.find((item) => item.id === this.selectedPresetId);
        if (!preset) {
            return;
        }
        this.plannerForm.reset(preset.values);
    }

    public get budgetStyleNote(): string {
        const style = this.plannerForm.get('budgetStyle')?.value ?? '';

        return this.budgetStyleDescriptions[style] ?? '';
    }

    private syncForm(state: BudgetAppState): void {
        if (!this.hasPlannerData(state)) {
            return;
        }
        this.plannerForm.patchValue({
            householdName: state.householdName,
            budgetName: state.budgetName,
            budgetStyle: state.budgetStyle,
            budgetMonth: state.budgetMonth,
            incomeFrequency: state.incomeFrequency,
            incomeAmount: state.incomeAmount,
            homeStatus: state.homeStatus,
            relationshipStatus: state.relationshipStatus,
            hasKids: state.hasKids,
            workStatus: state.workStatus,
            ageRange: state.ageRange,
            primaryGoal: state.primaryGoal
        });
    }

    private hasPlannerData(state: BudgetAppState): boolean {
        return Boolean(
            state.onboarded ||
            state.householdName ||
            state.budgetName ||
            state.budgetStyle ||
            state.budgetMonth ||
            state.incomeFrequency ||
            state.incomeAmount ||
            state.homeStatus ||
            state.relationshipStatus ||
            state.hasKids ||
            state.workStatus ||
            state.ageRange ||
            state.primaryGoal
        );
    }
}
