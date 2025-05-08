import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClsModRelHoja2 } from '../models/reluser';
import { ClsModDepartamento } from '../models/depto';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  url: string = environment.URlApiEditorial; // URL base desde el environment

  constructor(private http: HttpClient) { }

  postInfo(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}Departamento/Search`, data).pipe(
      map((res) =>{
        // Verificamos si 'result' está presente en la respuesta
        if (res && res.result) {
          return res.result.map((item: any) => ({
            name: item.name || '', // Asignamos valores por defecto si no existen
            id: item.id || 0,
            // departamento: item.departamento || '',
            
          })) as ClsModDepartamento[];
        }
        return [];
      })
    ); // Llama al endpoint con POST
  }
}
