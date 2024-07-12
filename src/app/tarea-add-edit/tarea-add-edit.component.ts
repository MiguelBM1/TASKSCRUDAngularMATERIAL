import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TareaService } from '../services/tarea.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IEstado, IPersona, ITarea } from '../services/interfaces/tareas.interface';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import 'moment/locale/fr';

@Component({
  selector: 'app-tarea-add-edit',
  templateUrl: './tarea-add-edit.component.html',
  styleUrls: ['./tarea-add-edit.component.css']
})
export class TareaAddEditComponent implements OnInit {
  public personas: IPersona[] = [];
  public estados: IEstado[] = [];
  tareaForm!: FormGroup;
  private readonly _fb = inject(FormBuilder);
  private readonly _tareaService = inject(TareaService);
  private readonly _dialogRef = inject(MatDialogRef<TareaAddEditComponent>);
  private readonly _snackBar = inject(MatSnackBar);

  TareaSeleccionada={} as ITarea;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string
) {
    this.tareaForm = this._fb.group({
      
      nombre: '',
      descripcion: '',
      fechaFinalizacion: '',
      estado: '1',
      persona: '',

    });
  }
  french() {
    this._locale = 'fr';
    this._adapter.setLocale(this._locale);
  }
  ngOnInit() {
    this.french();
    this.llenarComboPersonas();
    this.llenaComboEstados();
    console.log("estas son :"+this.personas);
    this.tareaForm.patchValue({
      nombre: this.data?.nombre,
      descripcion: this.data?.descripcion,
      fechaFinalizacion: this.data?.fechaFinalizacion,
      estado: this.data?.idEstado,
      persona: this.data?.idPersona,
    });

  }

  onFormSubmit() {

    if (this.tareaForm.valid) {
      if (this.data) {
        let tarea : ITarea = this.tareaForm.value;
        tarea.id= this.data.id;
        if(this.data.fechaFinalizacion === tarea.fechaFinalizacion){
          
        }else{
          tarea.fechaFinalizacion = this.tareaForm.value.fechaFinalizacion.format('YYYY-MM-DD');
        }
        
        this._tareaService
          .editarTarea(tarea)
          .subscribe({
            next: (val: any) => {
              this._snackBar.open('Tarea actualizada con exito!' , 'Cerrar', {
                duration: 2000,
              });
              
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else{
        this.tareaForm.value.fechaFinalizacion = this.tareaForm.value.fechaFinalizacion.format('YYYY-MM-DD');
        this.tareaForm.value.estado = '1';
        this._tareaService.agregarTarea(this.tareaForm.value).subscribe({
          next: (val: any) => {
            this._snackBar.open('Tassk agregada exitosamente!', 'Close', {
              duration: 2000,
            });
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }

  
 async llenarComboPersonas(){
  this._tareaService.getPersonas().subscribe(
    (response: IPersona[]) => {
      this.personas = response;
    },
    (error) => {
      console.error('Error al obtener personas:', error);
    }
  );
}

async llenaComboEstados(){
  this._tareaService.getEstados().subscribe(
    (response: IEstado[]) => {
      this.estados = response;
    },
    (error) => {
      console.error('Error al obtener estados:', error);
    }
  );
  }


}
