export default class LoginFormData {
  constructor(
    public username: string,
    public password: string,
    public fullname: string
  ) {}

  updateFields(update: Partial<LoginFormData>): LoginFormData {
    return new LoginFormData(
      update.username ?? this.username,
      update.password ?? this.password,
      update.fullname ?? this.fullname
    );
  }
}