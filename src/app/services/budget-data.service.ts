import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface OnboardingStep {
    title: string;
    detail: string;
}

export interface SummaryCard {
    label: string;
    value: string;
    note: string;
}

export interface CategoryPlan {
    name: string;
    target: number;
    spent: number;
    trend: string;
    tone: 'mint' | 'ocean' | 'coral' | 'peach' | 'ink';
}

export interface TransactionItem {
    date: string;
    description: string;
    category: string;
    amount: number;
}

export interface GoalItem {
    name: string;
    target: number;
    saved: number;
}

export interface InsightItem {
    label: string;
    value: string;
    detail: string;
}

export interface ReportItem {
    label: string;
    value: string;
    hint: string;
}

export interface BudgetAppState {
    onboarded: boolean;
    brand: string;
    householdName: string;
    budgetName: string;
    budgetStyle: string;
    budgetMonth: string;
    safeToSpend: number;
    incomeFrequency: string;
    incomeAmount: number;
    homeStatus: string;
    relationshipStatus: string;
    hasKids: string;
    workStatus: string;
    ageRange: string;
    primaryGoal: string;
    onboardingSteps: OnboardingStep[];
    summaryCards: SummaryCard[];
    categories: CategoryPlan[];
    transactions: TransactionItem[];
    goals: GoalItem[];
    insights: InsightItem[];
    reports: ReportItem[];
}

export interface PlannerSummary {
    identity: {
        householdName: string;
        budgetName: string;
        budgetMonth: string;
    };
    money: {
        budgetStyle: string;
        incomeFrequency: string;
        incomeAmount: number;
    };
    profile: {
        homeStatus: string;
        relationshipStatus: string;
        hasKids: string;
        workStatus: string;
        ageRange: string;
        primaryGoal: string;
    };
    tips: string[];
}

const STORAGE_KEY = 'budget-app-state:v2';

@Injectable({
    providedIn: 'root'
})
export class BudgetDataService {
    private stateSubject = new BehaviorSubject<BudgetAppState>(this.loadState());
    public state$ = this.stateSubject.asObservable();

    public getState(): BudgetAppState {
        return this.stateSubject.value;
    }

    public reset(): BudgetAppState {
        const seeded = this.defaultState();
        this.setState(seeded);

        return seeded;
    }

    public setState(state: BudgetAppState): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        this.stateSubject.next(state);
    }

    public updateState(partial: Partial<BudgetAppState>): BudgetAppState {
        const next = { ...this.stateSubject.value, ...partial };
        this.setState(next);

        return next;
    }

    public getPlannerSummary(): PlannerSummary {
        const state = this.getState();
        const tips: string[] = [];

        if (state.budgetStyle) {
            tips.push(`Budget style: ${state.budgetStyle}.`);
        }

        if (state.incomeFrequency && state.incomeAmount > 0) {
            tips.push(`Income is ${state.incomeFrequency} at $${state.incomeAmount.toLocaleString('en-US')}.`);
        }

        if (state.primaryGoal) {
            tips.push(`Primary goal: ${state.primaryGoal}.`);
        }

        if (state.homeStatus === 'Renting') {
            tips.push('Consider adding Rent and Utilities categories first.');
        }

        if (state.homeStatus === 'Homeowner') {
            tips.push('Consider adding Mortgage, Insurance, and Maintenance categories.');
        }

        if (state.hasKids === 'Yes') {
            tips.push('Consider adding Childcare and Education categories.');
        }

        if (state.workStatus === 'Self-employed') {
            tips.push('Consider a Taxes category for quarterly or annual payments.');
        }

        return {
            identity: {
                householdName: state.householdName,
                budgetName: state.budgetName,
                budgetMonth: state.budgetMonth
            },
            money: {
                budgetStyle: state.budgetStyle,
                incomeFrequency: state.incomeFrequency,
                incomeAmount: state.incomeAmount
            },
            profile: {
                homeStatus: state.homeStatus,
                relationshipStatus: state.relationshipStatus,
                hasKids: state.hasKids,
                workStatus: state.workStatus,
                ageRange: state.ageRange,
                primaryGoal: state.primaryGoal
            },
            tips
        };
    }

    exportState(): string {
        return JSON.stringify(this.getState(), null, 2);
    }

    importState(payload: string): BudgetAppState {
        const parsed = JSON.parse(payload) as BudgetAppState;
        const normalized = this.normalizeState(parsed);
        this.setState(normalized);
        return normalized;
    }

    private loadState(): BudgetAppState {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            const seeded = this.defaultState();
            this.setState(seeded);
            return seeded;
        }

        try {
            return this.normalizeState(JSON.parse(raw) as BudgetAppState);
        } catch {
            const seeded = this.defaultState();
            this.setState(seeded);
            return seeded;
        }
    }

    private defaultState(): BudgetAppState {
        return {
            onboarded: false,
            brand: 'Budget Forge',
            householdName: '',
            budgetName: '',
            budgetStyle: '',
            budgetMonth: '',
            safeToSpend: 0,
            incomeFrequency: '',
            incomeAmount: 0,
            homeStatus: '',
            relationshipStatus: '',
            hasKids: '',
            workStatus: '',
            ageRange: '',
            primaryGoal: '',
            onboardingSteps: [],
            summaryCards: [],
            categories: [],
            transactions: [],
            goals: [],
            insights: [],
            reports: []
        };
    }


    private normalizeState(state: BudgetAppState): BudgetAppState {
        const legacyLife = (state as { lifeSituation?: string }).lifeSituation || '';
        const derivedHasKids = legacyLife.includes('kids') ? 'Yes' : '';
        const derivedRelationship = legacyLife.includes('Single')
            ? 'Single'
            : legacyLife.includes('Couple')
                ? 'Couple'
                : '';

        return {
            onboarded: Boolean(state.onboarded),
            brand: state.brand || 'Budget Forge',
            householdName: state.householdName || '',
            budgetName: state.budgetName || '',
            budgetStyle: state.budgetStyle || '',
            budgetMonth: state.budgetMonth || '',
            safeToSpend: Number.isFinite(state.safeToSpend) ? state.safeToSpend : 0,
            incomeFrequency: state.incomeFrequency || '',
            incomeAmount: Number.isFinite(state.incomeAmount) ? state.incomeAmount : 0,
            homeStatus: state.homeStatus || '',
            relationshipStatus: state.relationshipStatus || derivedRelationship,
            hasKids: state.hasKids || derivedHasKids,
            workStatus: state.workStatus || '',
            ageRange: state.ageRange || '',
            primaryGoal: state.primaryGoal || '',
            onboardingSteps: Array.isArray(state.onboardingSteps) ? state.onboardingSteps : [],
            summaryCards: Array.isArray(state.summaryCards) ? state.summaryCards : [],
            categories: Array.isArray(state.categories) ? state.categories : [],
            transactions: Array.isArray(state.transactions) ? state.transactions : [],
            goals: Array.isArray(state.goals) ? state.goals : [],
            insights: Array.isArray(state.insights) ? state.insights : [],
            reports: Array.isArray(state.reports) ? state.reports : []
        };
    }
}
