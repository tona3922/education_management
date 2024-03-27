export class City {
  private name: string;
  private state: string;
  private country: string;
  constructor(name: string, state: string, country: string) {
    this.name = name;
    this.state = state;
    this.country = country;
  }
  toString() {
    return this.name + ", " + this.state + ", " + this.country;
  }
}
export class Person {
  name: string;
  email: string;
  password: string;
  role: string;
  constructor(name: string, email: string, password: string, role: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
export class Teacher extends Person {
  constructor(name: string, email: string, password: string, role: string) {
    super(name, email, password, role);
  }
  manageStudentByClass() {}
  getSchedule() {}
}
export class Student extends Person {
  constructor(name: string, email: string, password: string, role: string) {
    super(name, email, password, role);
  }
  registerCourse() {}
  getSchedule() {}
  getReport() {}
}
export class Admin extends Person {
  constructor(name: string, email: string, password: string, role: string) {
    super(name, email, password, role);
  }
  createAccount() {}
  manageStudent() {}
  manageTeacher() {}
  assignTeacher() {}
}
// Firestore data converter
// export const cityConverter = {
//   toFirestore: (city) => {
//     return {
//       name: city.name,
//       state: city.state,
//       country: city.country,
//     };
//   },
//   fromFirestore: (snapshot, options) => {
//     const data = snapshot.data(options);
//     return new City(data.name, data.state, data.country);
//   },
// };
