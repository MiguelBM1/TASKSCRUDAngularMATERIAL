import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TareaService } from './services/tarea.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';
import { IEstado, IPersona, ITarea } from './services/interfaces/tareas.interface';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { TareaAddEditComponent } from './tarea-add-edit/tarea-add-edit.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  filtroEstado: string = '';
   estados: IEstado[] = [];

  tareas: ITarea[] = [];
  formTarea!:FormGroup;
  submitted:boolean=false;
  TareaSeleccionada = {
  } as ITarea;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly _tareaService = inject(TareaService);
  constructor(
    private _dialog: MatDialog,
    private _coreService: CoreService
  ) {}


  ngOnInit(): void {
    this.getTareas();
    this.llenaComboEstados();
  }
  async getTareas(){

    this._tareaService.getTareas().subscribe((response: ITarea[]) => {
    this.tareas = response;
      });
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

  /*
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteTarea(id: number) {
    this._tareaService.deleteTarea(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Tarea deleted!', 'done');
        this.getTareaList();
      },
      error: console.log,
    });
  }

 
  */
  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(TareaAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTareas();
        }
      },
    });
  }


  openEditForm(data: any) {
    const dialogRef = this._dialog.open(TareaAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTareas();
        }
      },
    });
  }

  deleteTarea(tarea: ITarea){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success', // Color verde para el botón de confirmación
        cancelButton: 'btn btn-danger'    // Color rojo para el botón de cancelación
      },
      buttonsStyling: true  // Deshabilitar el estilo de botones de SweetAlert para usar el estilo de Bootstrap
    });

    swalWithBootstrapButtons.fire({
      title: 'Estas seguro de eliminar ?',
      text: "No podras revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._tareaService.eliminarTarea(tarea).subscribe(resp =>{
          Swal.fire('Eliminado!','La tarea ha sido eliminada.','success');
          
          this.getTareas();
        },
        (err:any)=>{
          Swal.fire({
            icon:'error',
            title:'Error',
            text:'Error al eliminar hable con el admin',
          });
        });
      } else if ( result.isDenied) {
        Swal.fire('Cancelado','Tu tarea esta segura','info');
      }
  });
      
  }

  filtrarTareasPorEstado(estadoId: string): ITarea[] {
    let tareasFiltradas: ITarea[] = [];
  
  // Filtrar por estado
  if (!estadoId) {
    tareasFiltradas = this.tareas; // Si no se ha seleccionado un estado, devuelve todas las tareas
  } else {
    tareasFiltradas = this.tareas.filter(tarea => tarea.idEstado == estadoId);
  }

  tareasFiltradas.sort((a, b) => {
    const fechaA = new Date(a.fechaFinalizacion).getTime();
    const fechaB = new Date(b.fechaFinalizacion).getTime();
    return fechaA - fechaB;
  });

 

  return tareasFiltradas;
  }

}
