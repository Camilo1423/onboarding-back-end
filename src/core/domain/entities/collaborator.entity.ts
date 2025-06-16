export class Collaborator {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly entryDate: string,
    public readonly technicalOnboardingDone: boolean,
    public readonly welcomeOnboardingDone: boolean,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}

  static create(
    fullName: string,
    email: string,
    entryDate: string,
    id?: string,
    technicalOnboardingDone: boolean = false,
    welcomeOnboardingDone: boolean = false,
  ): Collaborator {
    const now = new Date();
    return new Collaborator(
      id ?? crypto.randomUUID(),
      fullName,
      email,
      entryDate,
      technicalOnboardingDone,
      welcomeOnboardingDone,
      now.toString(),
      now.toString(),
    );
  }

  update(
    fullName?: string,
    email?: string,
    entryDate?: string,
    technicalOnboardingDone?: boolean,
    welcomeOnboardingDone?: boolean,
  ): Collaborator {
    return new Collaborator(
      this.id,
      fullName ?? this.fullName,
      email ?? this.email,
      entryDate ?? this.entryDate.toString(),
      technicalOnboardingDone ?? this.technicalOnboardingDone,
      welcomeOnboardingDone ?? this.welcomeOnboardingDone,
      this.createdAt,
      new Date().toString(),
    );
  }
}
