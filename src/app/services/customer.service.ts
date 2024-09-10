import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { user } from '../interfaces/user';

type userModified={
  email:string,
  password:string
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private myAppUrl: string;
  private myApiUrl: string;
  behaviorSubject = new BehaviorSubject<any>('');
 
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/customers'
  }

  customers: user[] = [];
  private customer: BehaviorSubject<user[]> = new BehaviorSubject<user[]>([]);


  getSalesUser(id: number) {
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}/${id}`)
  }

  updateCustomers(dni: string, user: userModified) {
    return this.http.patch(`${this.myAppUrl}${this.myApiUrl}/${dni}`, user)
  }

  getCustomers() {
    this.http.get<user[]>(`${this.myAppUrl}${this.myApiUrl}`).subscribe((value) => {
      this.customers = value
      this.customer.next(this.customers);
    });
    return this.customer.asObservable();
  }


}
