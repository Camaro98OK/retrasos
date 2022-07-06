import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Estado } from '../interfaces/estados';
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

   getFiscalia(){
    let headers = new Headers().set('Type-conten', 'Aplication-json');
    return this.http.post<any>(`${this.url}/catComboFiscalia`,{headers});
    //dbComboDel
   }

   getDelegaciones(idDel: number) {
    let headers = new Headers().set('Type-conten', 'appication-json');
    return this.http.post<any>(`${this.url}/catComboDel/${idDel}`,{headers});
    //return this.http.post<any>(`${this.url}/catComboDel`,{headers});
    }

   getDelegacionesFiscalia(){
    let headers = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/catComboDelFis`, {headers});
   }

   getAreasCMI(){
    let headers = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/catComboAreasCmi`, {headers});
   }

   getEspecialidadesCmi(){
    let headers = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/catComboEspecialidades`, {headers});
   }

   getProductosCmi(){
    let headers = new Headers().set('Type-content', 'aplication-json');
    return this.http.post<any>(`${this.url}/catComboProductos`, {headers});
   }

   getActosCmi(){
    let headers = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/catComboActosInvestigacionCMI`, {headers});
   }
}

