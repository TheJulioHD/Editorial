import { SearchModel } from './../../models/pagination';
import { Component, OnInit } from '@angular/core';
import { ClsModRelHoja2 } from 'src/app/models/reluser';
import { UserService } from 'src/app/service/user.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sumByDaylost: { [key: string]: number } = {}; // Suma de hojas por día
  sumByDay: { [key: string]: number } = {}; // Suma de hojas por día
  // Suma de hojas por mes (YYYY-MM)
  sumByMonth: { [key: string]: number } = {};
  sumByMonthlost: { [key: string]: number } = {};
  sumByPersonlost: { [key: string]: number } = {};
  sumByPerson: { [key: string]: number } = {};
  userNames: { [key: string]: string } = {}; // Suma de hojas por persona
  totalSheets: number = 0; // Total de hojas en general
  totalSheetslost: number = 0; // Total de hojas en general
  totalSheetstotal: number = 0; // Total de hojas en general
  departamentos: ClsModRelHoja2[] = [];
  departamentos2: ClsModRelHoja2[] = [];
  currentPage: number = 1;
  rpp = 50;

  page: number = 1;
  pageLost: number = 1;

  keysPaginated: number[] = [];
  keysPaginatedLost: number[] = [];
  sortedDayKeys: string[] = [];
  sortedMonthKeys: string[] = [];


  constructor(private user: UserService) { }

  ngOnInit(): void {
    this.getData();
    const pagina: SearchModel = {
      pagina: this.currentPage,
      rpp: 100000000,
      textoBusqueda: ''

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
        this.sortedDayKeys = Object.keys(this.sumByDay).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        // Agrupar por mes (YYYY-MM)
        this.sumByMonth = this.departamentos.reduce((acc, curr) => {
          const dateKey = this.formatDate(curr.creationDate); // YYYY-MM-DD
          if (dateKey) {
            const monthKey = dateKey.slice(0, 7); // YYYY-MM
            acc[monthKey] = (acc[monthKey] || 0) + curr.cantidadHojas;
          }
          return acc;
        }, {} as { [key: string]: number });
        this.sortedMonthKeys = Object.keys(this.sumByMonth).sort((a, b) => new Date(a + '-01').getTime() - new Date(b + '-01').getTime());

        this.sumByDaylost = this.departamentos.reduce((acc, curr) => {
          const dateKey = this.formatDate(curr.creationDate); // Formato YYYY-MM-DD
          if (dateKey) {
            acc[dateKey] = (acc[dateKey] || 0) + curr.cantLostHojas;
          }
          return acc;
        }, {} as { [key: string]: number });
        // Agrupar perdidas por mes
        this.sumByMonthlost = this.departamentos.reduce((acc, curr) => {
          const dateKey = this.formatDate(curr.creationDate);
          if (dateKey) {
            const monthKey = dateKey.slice(0, 7);
            acc[monthKey] = (acc[monthKey] || 0) + curr.cantLostHojas;
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
          acc[curr.id] = (acc[curr.id] || 0) + curr.cantidadHojas;
          console.log(`ID: ${curr.id}, Hojas: ${curr.cantidadHojas}`);
          return acc;
        }, {} as { [key: number]: number });
        this.sumByPersonlost = this.departamentos.reduce((acc, curr) => {
          acc[curr.id] = (acc[curr.id] || 0) + curr.cantLostHojas;
          return acc;
        }, {} as { [key: number]: number });

        // Crear el mapa de nombres
        this.userNames = this.departamentos.reduce((acc, curr) => {
          acc[curr.id] = curr.name; // Asegúrate de que este campo exista
          return acc;
        }, {} as { [key: number]: string });

        // Calcular el total general de hojas
        this.totalSheets = this.departamentos.reduce((total, curr) => total + curr.cantidadHojas, 0);
        this.totalSheetslost = this.departamentos.reduce((total, curr) => total + curr.cantLostHojas, 0);
        this.totalSheetstotal = this.totalSheets + this.totalSheetslost;
        this.keysPaginated = Object.keys(this.sumByPerson).map(Number);
        this.keysPaginatedLost = Object.keys(this.sumByPersonlost).map(Number);

        // this.keysPaginatedByDay = Object.keys(this.sumByDay);
        // this.keysPaginatedByDayLost = Object.keys(this.sumByDaylost);

        console.log('Datos recibidos:', this.departamentos);
        console.log('Suma por día perdida:', this.sumByDaylost);
        console.log('Suma por día:', this.sumByDay);
        console.log('Suma por persona:', this.sumByPerson);
        console.log('Total de hojas:', this.totalSheets);
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
      }
    });
  }

  convertToLocal(dateFromSql: string): Date {
    return new Date(dateFromSql + 'Z');
  }


  getData() {
    const pagina: SearchModel = {
      pagina: this.currentPage,
      rpp: this.rpp,
      textoBusqueda: ''
    };

    this.user.postInfo(pagina).subscribe({
      next: (res: ClsModRelHoja2[]) => {
        this.departamentos2 = res;

        // Aquí va toda tu lógica para sumar por día, persona, total, etc...
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
      }
    });
  }

  nextPage() {
    this.currentPage++;
    this.getData();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getData();
    }
  }
  exportToExcel(): void {
    // Estructurar datos para exportar
    const sheetData = [
      { Título: 'Reporte de Hojas', Valor: '' },
      {},
      { Título: 'Suma por día de hojas perdidas:' },
      ...Object.entries(this.sumByDaylost).map(([date, sheets]) => ({
        Fecha: date,
        Hojas: sheets
      })),
      {},
      { Título: 'Suma por día:' },
      ...Object.entries(this.sumByDay).map(([date, sheets]) => ({
        Fecha: date,
        Hojas: sheets
      })),
      {},
      { Título: 'Suma por persona:' },
      ...Object.entries(this.sumByPerson).map(([userId, sheets]) => ({
        Usuario: this.userNames[userId] || userId,
        Hojas: sheets
      })),
      {},
      { Título: 'Suma por persona de hojas perdidas:' },
      ...Object.entries(this.sumByPersonlost).map(([userId, sheets]) => ({
        Usuario: this.userNames[userId] || userId,
        Hojas: sheets
      })),
      {},
      { Título: 'Detalle departamento:' },
      ...this.departamentos.map((res) => ({
        Usuario: this.userNames[res.idUsuario] || res.idUsuario,
        CantidadHojas: res.cantidadHojas,
        CantidadHojasPerdidas: res.cantLostHojas,
        FechaCreación: res.creationDate,
      })),
      { Título: 'Total General de Hojas usadas:', Hojas: this.totalSheets },
      { Título: 'Total General de Hojas Perdidas:', Hojas: this.totalSheetslost },
      { Título: 'Total General de Hojas:', Hojas: this.totalSheetstotal }
    ];

    // Crear una hoja de cálculo
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetData, { skipHeader: true });
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Reporte': worksheet },
      SheetNames: ['Reporte']
    };

    // Generar archivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Descargar archivo Excel
    this.downloadExcelFile(excelBuffer, 'Reporte_Hojas');
  }

  private downloadExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${fileName}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url); // Liberar memoria
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

