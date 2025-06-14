import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.baseUrl;

  private users = [
    {
      id: 1,
      username: 'Amy Elsner',
      avatar:
        'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
      email: 'amy@elsner.com',
      first_name: 'Amy',
      last_name: 'Elsner',
      role: 'Product Manager',
      department: 'Engineering',
      contact_number: '0917-123-4567',
      status: 'Active',
    },
    {
      id: 2,
      username: 'John Doe',
      avatar:
        'https://primefaces.org/cdn/primeng/images/demo/avatar/johndoe.png',
      email: 'john@doe.com',
      first_name: 'John',
      last_name: 'Doe',
      role: 'Developer',
      department: 'IT',
      contact_number: '0917-234-5678',
      status: 'Inactive',
    },
    {
      id: 3,
      username: 'Jane Smith',
      avatar:
        'https://primefaces.org/cdn/primeng/images/demo/avatar/janesmith.png',
      email: 'jane@smith.com',
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'QA Engineer',
      department: 'Quality Assurance',
      contact_number: '0917-345-6789',
      status: 'Active',
    },
    {
      id: 4,
      username: 'Michael Brown',
      avatar:
        'https://primefaces.org/cdn/primeng/images/demo/avatar/michaelbrown.png',
      email: 'michael@brown.com',
      first_name: 'Michael',
      last_name: 'Brown',
      role: 'Designer',
      department: 'Design',
      contact_number: '0917-456-7890',
      status: 'Active',
    },
    {
      id: 5,
      username: 'Lisa White',
      avatar:
        'https://primefaces.org/cdn/primeng/images/demo/avatar/lisawhite.png',
      email: 'lisa@white.com',
      first_name: 'Lisa',
      last_name: 'White',
      role: 'HR Manager',
      department: 'Human Resources',
      contact_number: '0917-567-8901',
      status: 'Inactive',
    },
    {
      id: 6,
      username: 'Robert Green',
      avatar:
        'https://primefaces.org/cdn/primeng/images/demo/avatar/robertgreen.png',
      email: 'robert@green.com',
      first_name: 'Robert',
      last_name: 'Green',
      role: 'Support',
      department: 'Customer Service',
      contact_number: '0917-678-9012',
      status: 'Active',
    },
    {
      id: 7,
      username: 'Emily Black',
      avatar:
        'https://primefaces.org/cdn/primeng/images/demo/avatar/emilyblack.png',
      email: 'emily@black.com',
      first_name: 'Emily',
      last_name: 'Black',
      role: 'Marketing Lead',
      department: 'Marketing',
      contact_number: '0917-789-0123',
      status: 'Active',
    },
    {
      id: 8,
      username: 'David Lee',
      avatar:
        'https://primefaces.org/cdn/primeng/images/demo/avatar/davidlee.png',
      email: 'david@lee.com',
      first_name: 'David',
      last_name: 'Lee',
      role: 'Finance Analyst',
      department: 'Finance',
      contact_number: '0917-890-1234',
      status: 'Inactive',
    },
    {
      id: 9,
      username: 'Sophia King',
      avatar:
        'https://primefaces.org/cdn/primeng/images/demo/avatar/sophiaking.png',
      email: 'sophia@king.com',
      first_name: 'Sophia',
      last_name: 'King',
      role: 'Operations',
      department: 'Operations',
      contact_number: '0917-901-2345',
      status: 'Active',
    },
    {
      id: 10,
      username: 'Chris Young',
      avatar:
        'https://primefaces.org/cdn/primeng/images/demo/avatar/chrisyoung.png',
      email: 'chris@young.com',
      first_name: 'Chris',
      last_name: 'Young',
      role: 'Admin',
      department: 'Administration',
      contact_number: '0917-012-3456',
      status: 'Active',
    },
  ];

  constructor(private http: HttpClient) {}

  getAllUsers() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return { subscribe: (cb: any) => cb([]) };
    }
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(`${this.baseUrl}/users/`, { headers });
  }

  getUser() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return { subscribe: (cb: any) => cb({}) };
    }
    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(`${this.baseUrl}/profile/`, { headers });
  }
}
