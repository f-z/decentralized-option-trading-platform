import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

const USER_KEY = 'user_key';

@Injectable()
export class UserService {
  private currentUser: User;

  constructor() {
    this.currentUser = this.loadState() || null;
  }

  private loadState(): User {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

  private saveState(): void {
    localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser));
  }

  // returning a copy of the stored user, if it is not null (if logged in)
  getUser(): any {
    if (this.currentUser == null) {
      return null;
    }

    // returning copy for added security
    return { ...this.currentUser };
  }

  setUser(user: User): void {
    this.currentUser = user;
    this.saveState();
  }

  logout(ID: string): void {
    delete this.currentUser[ID];
    this.saveState();
  }
}

export interface User {
  username: string;
  password: string;
  email: string;
  region: string;
}
