import { User } from './../../ui/interfaces/user';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    constructor(private httpClient: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    // Errors
    handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public getIPAddress() {
        return this.httpClient.get('https://api.ipify.org/?format=json');
    }

    login(userParams): Observable<any> {
        return this.httpClient.post(
            environment.baseURL + 'LoginProfiles/Authenticate', userParams
            // tslint:disable-next-line: no-shadowed-variable
        ).pipe(map(User => {
            localStorage.setItem('currentUser', JSON.stringify(User));
            //sessionStorage.setItem('currentUser', JSON.stringify(User));
            return User;
        }));
    }


    logout(user): Observable<any> {
        //let user = JSON.parse(localStorage.getItem('currentUser'));
        return this.httpClient.post(
          environment.baseURL + 'LoginProfiles/Logout',
          user
        );
      }

 
    setCompany(company: any) {
        let user = JSON.parse(localStorage.getItem('currentUser'));

        if (user !== null || user !== undefined) {
            user.companyId = company.companyId;
            user.countryId = company.countryId;
            user.company = company;
            localStorage.clear();
            localStorage.setItem('currentUser', JSON.stringify(user));
            location.reload();
        }
    }

    getCompanies(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + 'Generics/GetCompanies')
            .pipe(catchError(this.handleError));
    }

    getCompaniesForUser(userId: any): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + 'LoginProfiles/GetCompaniesForUser?userId=' + userId)
            .pipe(catchError(this.handleError));
    }


    
}
