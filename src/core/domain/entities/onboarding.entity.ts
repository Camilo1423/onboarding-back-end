export class Onboarding {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly meetingUrl: string,
    public readonly collaboratorIds?: string[],
    public readonly createdAt?: string,
    public readonly updatedAt?: string,
  ) {}

  static create(
    name: string,
    description: string,
    startDate: string,
    endDate: string,
    meetingUrl: string,
    collaboratorIds?: string[],
    id?: string,
  ): Onboarding {
    const now = new Date();
    return new Onboarding(
      id ?? crypto.randomUUID(),
      name,
      description,
      startDate,
      endDate,
      meetingUrl,
      collaboratorIds ?? [],
      now.toString(),
      now.toString(),
    );
  }
}

export type OnboardingType = 'technical' | 'welcome';
