import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/common/globals';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private dataService: DataService)  {
  }

  // confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  setToken(user): void {
    localStorage.setItem('currentUser', user);
  }

  checkRole(roleId): boolean {
      //Save Role
      const user = JSON.parse(localStorage.getItem('currentUser'));
      let model = {
        id: user.id,
        companyId: user.companyId,
        userId: user.userId,
        roleId: roleId,
        granted: false
      }

    const role = user.roles.filter(f => f.roleId === roleId);
    if (role.length > 0) {
      model.granted = role[0].granted;
    } 
    //this.dataService.updateRoleCheck(model).subscribe(data => {},(error) => {});
    //GlobalConstants.rolesAudits.push(model);
    return model.granted;
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
