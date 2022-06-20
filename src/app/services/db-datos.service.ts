import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Unidad } from '../interfaces/unidades'

@Injectable({
  providedIn: 'root'
})
export class DbDatosService {
  url = 'https://localhost:3000/admin';


  constructor(private http: HttpClient) {
    console.log('Esta funcionanado la interface')
   }
   getUnidad(){
    let header = new HttpHeaders().set('Type-content', 'application-json');
    return this.http.get<any>(`${this.url}/catUnidades`, {headers: header});
   }

   getEstados(){
    let header = new HttpHeaders().set('Type-content', 'application-json');
    return this.http.get<any>(`${this.url}/catEstados`, {headers: header});
   }



}

