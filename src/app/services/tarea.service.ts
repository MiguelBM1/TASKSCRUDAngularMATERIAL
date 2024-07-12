import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from './helper'; 
import { ITarea } from './interfaces/tareas.interface';
@Injectable({
  providedIn: 'root',
})
export class TareaService {
  
  constructor(private http: HttpClient)
  { }

  public getTareas(): Observable<any>{
    
    return this.http.get<any>(baseUrl+"tarea");

  }  

  public tareaById(tarea: ITarea): Observable<any> {
    return this.http.get<any>(baseUrl + "tarea/" + `${tarea.id}`);
  }

  agregarTarea(tarea: ITarea){
    const url = `${baseUrl}tarea`;
    return this.http.post(url, tarea);
  }

  editarTarea(tarea: ITarea){
    const url = `${baseUrl}tarea/${tarea.id}`;
    return this.http.put(url, tarea);
  }

  eliminarTarea(tarea: ITarea){
    const url = `${baseUrl}tarea/${tarea.id}`;
    return this.http.delete(url);
  }


  getPersonas(): Observable<any>{
    return this.http.get<any>(baseUrl+"tarea/personas");
  }  

    getEstados(): Observable<any>{
      return this.http.get<any>(baseUrl+"tarea/estados");
    }

    editarEstadoTarea(tarea: ITarea){
      const url = `${baseUrl}tarea/estado/${tarea.id}`;
      return this.http.put(url, tarea.id);
    }

}
