import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  setToken(user): void {
    localStorage.setItem('currentUser', user);
  }

  checkRole(roleId): boolean {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const role = user.roles.filter(f => f.roleId === roleId);
    if (role.length === 0) {
      return false;
    } else {
      return role[0].granted;
    }
  }

  setUser(user): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  setSlabs(data): void {
    localStorage.setItem('slabs', JSON.stringify(data));
  }

  getSlabs(): any[] {
    return JSON.parse(localStorage.getItem('slabs'));
  }

  setInvoiceHistory(data): void {
    localStorage.setItem('invoices', JSON.stringify(data));
  }

  getInvoiceHistory(data): void {
    return JSON.parse(localStorage.getItem('invoices'));
  }

  clearStorage() {
    localStorage.clear();
  }



  getUser(): any {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  isLogged() {
    return localStorage.getItem('currentUser') != null;
  }

  setCompany(company): void {
    localStorage.setItem('currentCompany', JSON.stringify(company));
  }

  getCompany(): any {
    return JSON.parse(localStorage.getItem('currentCompany'));
  }
}
