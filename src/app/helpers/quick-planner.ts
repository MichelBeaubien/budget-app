import { FormControl, FormGroup, Validators } from '@angular/forms';

export type PlannerPresetId =
  | 'starter'
  | 'renting-kids-fulltime'
  | 'homeowner-no-kids-self-employed'
  | 'single-renting-student'
  | 'couple-homeowner-retired';

export type PlannerPreset = {
  id: PlannerPresetId;
  label: string;
  values: {
    householdName: string;
    budgetName: string;
    budgetStyle: string;
    budgetMonth: string;
    incomeFrequency: string;
    incomeAmount: number;
    homeStatus: string;
    relationshipStatus: string;
    hasKids: string;
    workStatus: string;
    ageRange: string;
    primaryGoal: string;
  };
};

export const PLANNER_PRESETS: PlannerPreset[] = [
  {
    id: 'starter',
    label: 'Starter (simple baseline)',
    values: {
      householdName: 'Household',
      budgetName: 'Monthly Budget',
      budgetStyle: 'Custom',
      budgetMonth: '2026-02',
      incomeFrequency: 'Monthly',
      incomeAmount: 4000,
      homeStatus: 'Renting',
      relationshipStatus: 'Couple',
      hasKids: 'No',
      workStatus: 'Full-time',
      ageRange: '35 to 44',
      primaryGoal: 'Stay on track'
    }
  },
  {
    id: 'renting-kids-fulltime',
    label: 'Renting + kids (full-time)',
    values: {
      householdName: 'Family Household',
      budgetName: 'Family Budget',
      budgetStyle: 'Zero-based',
      budgetMonth: '2026-02',
      incomeFrequency: 'Bi-weekly',
      incomeAmount: 2100,
      homeStatus: 'Renting',
      relationshipStatus: 'Couple',
      hasKids: 'Yes',
      workStatus: 'Full-time',
      ageRange: '35 to 44',
      primaryGoal: 'Save more money'
    }
  },
  {
    id: 'homeowner-no-kids-self-employed',
    label: 'Homeowner + no kids (self-employed)',
    values: {
      householdName: 'Home Household',
      budgetName: 'Primary Budget',
      budgetStyle: 'Envelope',
      budgetMonth: '2026-02',
      incomeFrequency: 'Monthly',
      incomeAmount: 5200,
      homeStatus: 'Homeowner',
      relationshipStatus: 'Couple',
      hasKids: 'No',
      workStatus: 'Self-employed',
      ageRange: '45 to 54',
      primaryGoal: 'Reduce my debt'
    }
  },
  {
    id: 'single-renting-student',
    label: 'Single + renting (student)',
    values: {
      householdName: 'Student Budget',
      budgetName: 'Campus Budget',
      budgetStyle: '50/30/20',
      budgetMonth: '2026-02',
      incomeFrequency: 'Monthly',
      incomeAmount: 1200,
      homeStatus: 'Renting',
      relationshipStatus: 'Single',
      hasKids: 'No',
      workStatus: 'Student',
      ageRange: '18 to 24',
      primaryGoal: 'Create my first budget'
    }
  },
  {
    id: 'couple-homeowner-retired',
    label: 'Couple + homeowner (retired)',
    values: {
      householdName: 'Retirement Budget',
      budgetName: 'Fixed Income Plan',
      budgetStyle: 'Custom',
      budgetMonth: '2026-02',
      incomeFrequency: 'Monthly',
      incomeAmount: 3200,
      homeStatus: 'Homeowner',
      relationshipStatus: 'Couple',
      hasKids: 'Yes',
      workStatus: 'Retired',
      ageRange: '65 to 69',
      primaryGoal: 'Stay on track'
    }
  }
];

export const createPlannerForm = (presetId: PlannerPresetId = 'starter') => {
  const preset = PLANNER_PRESETS.find((item) => item.id === presetId) ?? PLANNER_PRESETS[0];
  const values = preset.values;

  return new FormGroup({
    householdName: new FormControl(values.householdName, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    budgetName: new FormControl(values.budgetName, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    budgetStyle: new FormControl(values.budgetStyle, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    budgetMonth: new FormControl(values.budgetMonth, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    incomeFrequency: new FormControl(values.incomeFrequency, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    incomeAmount: new FormControl(values.incomeAmount, {
      nonNullable: true,
      validators: [Validators.min(0)]
    }),
    homeStatus: new FormControl(values.homeStatus, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    relationshipStatus: new FormControl(values.relationshipStatus, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    hasKids: new FormControl(values.hasKids, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    workStatus: new FormControl(values.workStatus, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    ageRange: new FormControl(values.ageRange, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    primaryGoal: new FormControl(values.primaryGoal, {
      nonNullable: true,
      validators: [Validators.required]
    })
  });
};
