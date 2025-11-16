export default class User {
  constructor(
    private readonly _id: string,
    private readonly _email: string,
    private readonly _passwordHash: string,
    private readonly _createdAt: Date,
  ) {}

  static create(email: string, passwordHash: string): User {
    const id = crypto.randomUUID();

    if (!email || !this.validateEmail(email)) {
      throw new Error('Formato de e-mail inválido');
    }

    if (!passwordHash) {
      throw new Error('Senha é obrigatória');
    }

    return new User(id, email, passwordHash, new Date());
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  getPasswordHash(): string {
    return this._passwordHash;
  }

  private static validateEmail(email: string): boolean {
    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailValidation.test(email);
  }
}
