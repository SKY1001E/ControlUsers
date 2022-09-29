export class User {
  public fullName: string
  public email: string
  public dateCreated: Date
  public role: string

  constructor(fullName: string, email: string, dateCreated: Date, role: string) {
    this.fullName = fullName
    this.email = email
    this.dateCreated = dateCreated
    this.role = role
  }
}
