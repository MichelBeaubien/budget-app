import { Injectable } from '@angular/core';

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
    onboardingSteps: OnboardingStep[];
    summaryCards: SummaryCard[];
    categories: CategoryPlan[];
    transactions: TransactionItem[];
    goals: GoalItem[];
    insights: InsightItem[];
    reports: ReportItem[];
}

const STORAGE_KEY = 'budget-app-state:v2';

@Injectable({
    providedIn: 'root'
})
export class BudgetDataService {
    getState(): BudgetAppState {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            const seeded = this.defaultState();
            this.setState(seeded);
            return seeded;
        }

        try {
            return JSON.parse(raw) as BudgetAppState;
        } catch {
            const seeded = this.defaultState();
            this.setState(seeded);
            return seeded;
        }
    }

    setState(state: BudgetAppState): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    updateState(partial: Partial<BudgetAppState>): BudgetAppState {
        const next = { ...this.getState(), ...partial };
        this.setState(next);
        return next;
    }

    reset(): BudgetAppState {
        const seeded = this.defaultState();
        this.setState(seeded);
        return seeded;
    }

    seedDemo(): BudgetAppState {
        const seeded = this.demoState();
        this.setState(seeded);
        return seeded;
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
            onboardingSteps: [],
            summaryCards: [],
            categories: [],
            transactions: [],
            goals: [],
            insights: [],
            reports: []
        };
    }

    private demoState(): BudgetAppState {
        return {
            onboarded: true,
            brand: 'Budget Forge',
            householdName: 'Rivera Household',
            budgetName: 'Family Budget',
            budgetStyle: 'Zero-based',
            budgetMonth: 'January 2026',
            safeToSpend: 1240,
            incomeFrequency: 'Bi-weekly',
            incomeAmount: 1980,
            onboardingSteps: [],
            summaryCards: [
                { label: 'Planned income', value: '$5,480', note: '3 paychecks' },
                { label: 'Planned expenses', value: '$4,240', note: '74% allocated' },
                { label: 'Sinking funds', value: '$620', note: '4 goals active' },
                { label: 'Household roles', value: 'Owner + 2 editors', note: 'Shared budget' }
            ],
            categories: [
                { name: 'Housing', target: 1650, spent: 1625, trend: 'steady', tone: 'mint' },
                { name: 'Groceries', target: 620, spent: 488, trend: 'ahead', tone: 'ocean' },
                { name: 'Transportation', target: 420, spent: 366, trend: 'steady', tone: 'coral' },
                { name: 'Debt payoff', target: 540, spent: 540, trend: 'complete', tone: 'ink' },
                { name: 'Lifestyle', target: 360, spent: 302, trend: 'steady', tone: 'peach' }
            ],
            transactions: [
                {
                    date: 'Jan 28',
                    description: 'Metro Supermarket',
                    category: 'Groceries',
                    amount: -84.12
                },
                {
                    date: 'Jan 26',
                    description: 'Paycheck - Horizon Labs',
                    category: 'Income',
                    amount: 1980.0
                },
                {
                    date: 'Jan 25',
                    description: 'City Power',
                    category: 'Utilities',
                    amount: -142.3
                },
                {
                    date: 'Jan 23',
                    description: 'Streamline Credit',
                    category: 'Debt',
                    amount: -270.0
                }
            ],
            goals: [
                { name: 'Emergency fund', target: 6000, saved: 3120 },
                { name: 'Summer travel', target: 2200, saved: 880 },
                { name: 'Laptop upgrade', target: 1400, saved: 420 }
            ],
            insights: [
                {
                    label: 'Safe to spend',
                    value: '$1240',
                    detail: 'After bills and savings allocations.'
                },
                {
                    label: 'Bills covered',
                    value: '92%',
                    detail: 'Rent, utilities, subscriptions, debt.'
                },
                {
                    label: 'Flexible buffer',
                    value: '$188',
                    detail: 'Unassigned funds for the month.'
                }
            ],
            reports: [
                { label: 'Housing vs income', value: '30%', hint: 'Target under 32%' },
                { label: 'Savings rate', value: '14%', hint: 'Goal 12% minimum' },
                { label: 'Debt payoff', value: '8 months', hint: 'On track' }
            ]
        };
    }

    private normalizeState(state: BudgetAppState): BudgetAppState {
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
