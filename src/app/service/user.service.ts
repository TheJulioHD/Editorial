import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClsModRelHoja2 } from '../models/reluser';
import { SearchModel } from '../models/pagination';
import { ClsModUser } from '../models/user';
import { ClsModRelHoja } from '../models/relhoja';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url: string = environment.URlApiEditorial; // URL base desde el environment

  constructor(private http: HttpClient) { }

  postInfo(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}User/Search2`, data).pipe(
      map((res) =>{
        // Verificamos si 'result' está presente en la respuesta
        if (res && res.result) {
          return res.result.map((item: any) => ({
            name: item.name || '', // Asignamos valores por defecto si no existen
            id: item.id || 0,
            control: item.control || 0,
            departamento: item.departamento || '',
            creationDate: item.creationDate || '',
            cantidadHojas: item.cantidadHojas || 0,
            idUsuario: item.idUsuario || 0
          })) as ClsModRelHoja2[];
        }
        return [];
      })
    ); // Llama al endpoint con POST
  }

  getall(data: SearchModel): Observable<any> {
    return this.http.post<any>(`${this.url}User/Search`, data).pipe(
      map((res) => {

        if(res && res.result) {
          return res.result.map((item: any) => ({
            id: item.id || 0,
            name: item.name || '',
            idDepartamento: item.idDepartamento || 0,
            control: item.control || 0,
          })) as ClsModUser
        }
        return [];
      })
    );
  }

  add2(data: ClsModRelHoja){
    return this.http.post<any>(`${this.url}User/add2`, data)
  }
  
}
