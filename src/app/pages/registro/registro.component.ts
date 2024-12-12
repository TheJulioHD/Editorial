import { ClsModRelHoja } from './../../models/relhoja';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchModel } from 'src/app/models/pagination';
import { ClsModUser } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  typeaheadForm: FormGroup | undefined;
  typeaheadForm2: FormGroup | undefined;
  // suggestions: string[] = ['Angular', 'React', 'Vue', 'Svelte', 'Bootstrap', 'Tailwind'];
  suggestions: any[] = [];
  filteredSuggestions: string[] = [];
  results: ClsModUser[]=[] ; // Almacena los datos obtenidos de la API
  id: number = 0;

  constructor(private user: UserService) {}

  ngOnInit(): void {
    this.typeaheadForm = new FormGroup({
      searchTerm: new FormControl(''),
    });

    this.typeaheadForm2 = new FormGroup({
      cant: new FormControl('', Validators.required), // Ajusta las validaciones según sea necesario
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value.trim().length >= 0) {
      this.filteredSuggestions = [];
      const paginationData: SearchModel = {
        pagina: 1,
        rpp: 10, // Adjust as needed for pagination
        textoBusqueda: target.value
      };
  
      // Call the service to fetch results based on search term
      this.user.getall(paginationData).subscribe({
        next: (response) => {
          this.results = response; // Ensure response is handled
          this.filteredSuggestions = this.results.map((item: any) => item.name); // Adjust field to match response structure
          console.log('Datos obtenidos:', this.filteredSuggestions);
          // this.id = this.results.map((item: any) => item.id);
          this.id = this.results.length > 0 ? this.results[0].id : 0; // Cambia "id" al campo correcto
          console.log('ID seleccionado:', this.id);
        },
        error: (err) => {
          console.error('Error al obtener datos:', err);
        }
      });
    } 
  }

  selectSuggestion(suggestion: string): void {
    this.typeaheadForm!.get('searchTerm')?.setValue(suggestion);

    // Crear el objeto de paginación
    

    // Llamar al método del servicio

    // Limpia las sugerencias
    this.filteredSuggestions = [];
  }

  enviar() {
    if (this.typeaheadForm2?.valid) {
      const user3: ClsModRelHoja = {
        cantidadHojas:this.typeaheadForm2.value.cant,
        idUsuario: this.id
      }
  
      // Llama al servicio add2
      this.user.add2(user3).subscribe({
        next: (response) => {
          console.log('Datos enviados correctamente:', response);
        },
        error: (err) => {
          console.error('Error al enviar datos:', err);
        },
      });
  
      console.log(
        `${this.typeaheadForm2.value.cant.trim()} prueba ${this.id}`
      );
    } else {
      console.log('Formulario inválido');
    }
  }
  

}
