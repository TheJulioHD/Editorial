import { SearchModel } from './../../models/pagination';
import { Component, OnInit } from '@angular/core';
import { ClsModRelHoja2 } from 'src/app/models/reluser';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sumByDay: { [key: string]: number } = {}; // Suma de hojas por día
  sumByPerson: { [key: string]: number } = {}; 
  userNames: { [key: number]: string } = {}; // Suma de hojas por persona
  totalSheets: number = 0; // Total de hojas en general
  departamentos: ClsModRelHoja2[] = [];

  constructor(private user: UserService) { }

  ngOnInit(): void {
    const pagina: SearchModel ={
      pagina: 1,
      rpp:1000,
      textoBusqueda:''

    };
    this.user.postInfo(pagina).subscribe({
      next: (res: ClsModRelHoja2[]) => {
        this.departamentos = res;

        // Sumar hojas por día
        this.sumByDay = this.departamentos.reduce((acc, curr) => {
          const dateKey = this.formatDate(curr.creationDate); // Formato YYYY-MM-DD
          if (dateKey) {
            acc[dateKey] = (acc[dateKey] || 0) + curr.cantidadHojas;
          }
          return acc;
        }, {} as { [key: string]: number });
        // this.sumByDay = this.departamentos.reduce((acc, curr) => {
        //   const dateKey = new Date(curr.creationDate).toISOString().split('T')[0]; // Formato YYYY-MM-DD
        //   acc[dateKey] = (acc[dateKey] || 0) + curr.cantidadHojas;
        //   return acc;
        // }, {} as { [key: string]: number });

        // Sumar hojas por persona
        this.sumByPerson = this.departamentos.reduce((acc, curr) => {
          acc[curr.idUsuario] = (acc[curr.idUsuario] || 0) + curr.cantidadHojas;
          return acc;
        }, {} as { [key: number]: number });

         // Crear el mapa de nombres
         this.userNames = this.departamentos.reduce((acc, curr) => {
          acc[curr.idUsuario] = curr.name; // Asegúrate de que este campo exista
          return acc;
        }, {} as { [key: number]: string });

        // Calcular el total general de hojas
        this.totalSheets = this.departamentos.reduce((total, curr) => total + curr.cantidadHojas, 0);

        console.log('Datos recibidos:', this.departamentos);
        console.log('Suma por día:', this.sumByDay);
        console.log('Suma por persona:', this.sumByPerson);
        console.log('Total de hojas:', this.totalSheets);
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
      }
    });
  }

  formatDate(dateString: string): string | null {
    // Asegurarse de que la fecha sea válida
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null; // Si la fecha no es válida, devolver null
    }
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  getKeys2(obj: any): string[] {
    return Object.keys(obj);
  }
  
  getKeys(obj: { [key: number]: number }): number[] {
    return Object.keys(obj).map(key => +key); // Convertir claves a números
  }
}

