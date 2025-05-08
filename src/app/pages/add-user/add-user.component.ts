import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClsModDepartamento } from 'src/app/models/depto';
import { SearchModel } from 'src/app/models/pagination';
import { ClsModUser } from 'src/app/models/user';
import { DepartamentoService } from 'src/app/service/departamento.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  typeaheadForm: FormGroup | undefined;
  filteredSuggestions: string[] = [];  // Puedes llenar este array con los datos que desees
  suggestions: string[] = [];
  results: ClsModDepartamento[]=[] ; 
  id: number = 0;

  constructor(private fb: FormBuilder,
    private user: DepartamentoService,
  private usario: UserService  ) {}

  ngOnInit(): void {
    // Inicializamos el formulario reactivo
    this.typeaheadForm = this.fb.group({
      searchTerm: ['', Validators.required],
      name: ['', Validators.required],

      control: [null, Validators.required],
    });
  }

  // Método que maneja la entrada de búsqueda
 
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
      this.user.postInfo(paginationData).subscribe({
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

  // Método para seleccionar una sugerencia
  selectSuggestion(suggestion: string): void {
    this.typeaheadForm!.patchValue({
      searchTerm: suggestion
    });
    this.filteredSuggestions = []; // Limpiar las sugerencias después de seleccionar
  }

  // Método para enviar el formulario (se puede agregar la lógica que necesites)
  onSubmit(): void {
    if (this.typeaheadForm!.valid) {
      const user3: ClsModUser = {
        control:  this.typeaheadForm?.value.control,
        name: this.typeaheadForm?.value.name,
        idDepartamento: this.id,
        id: 0

        
      }

      this.usario.add(user3).subscribe({
        next: (response) => {
          console.log('Datos enviados correctamente:', response);
          window.location.reload();
        },
        error: (err) => {
          console.error('Error al enviar datos:', err);
        },
      });
      const formData = this.typeaheadForm!.value;
      console.log(formData);
    } else {
      console.log("Formulario no válido");
    }
  }
}
