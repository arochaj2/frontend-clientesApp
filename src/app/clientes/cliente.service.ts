import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from "./cliente";
import { Region } from "./region";
import { Observable,tap,throwError } from 'rxjs';
import { HttpClient,HttpEvent, HttpRequest } from '@angular/common/http';
import { map,catchError } from 'rxjs';
//import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe, formatDate, registerLocaleData } from '@angular/common';




@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  private urlEndPoint:string='http://localhost:8080/api/clientes'

  constructor(private http:HttpClient, private router:Router) { }

  getClientes(page: number): Observable<any>{

    //return of(CLIENTES);
       // return this.http.get(this.urlEndPoint).pipe( map(
   //   response=> response as Cliente[]
   // ));
     return this.http.get<Cliente[]>(this.urlEndPoint +'/page/'+ page).pipe(

      tap((response:any) =>{
        
        (response.content as Cliente[]).forEach(cliente=>{
          console.log(cliente.nombre);
        })
      }),

      map((response:any)=>{
       
         (response.content as Cliente[]).map(cliente =>{
          cliente.nombre=cliente.nombre.toUpperCase();

          //let datePipe = new DatePipe('es');
          //cliente.createAt=datePipe.transform(cliente.createAt,'EEEE dd, MMMM yyyy')//formatDate(cliente.createAt,'dd-MM-yyyy','en-US');
          return cliente;
        })
        return response;
      }),
      tap(response =>{
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      })
      
     );


  }

  create(cliente: Cliente):Observable<Cliente>{

    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((response:any)=> response.cliente as Cliente),
      catchError(e=>{


        // if(this.isNoAutirizado(e)){
        //   return throwError(e);
        // }

        if(e.status==400){
          return throwError(e);
        }

        if(e.error.mensaje){
          console.error(e.error.mensaje)
        }
        
    //    swal.fire(e.error.mensaje, e.error.Error, 'error')
        return throwError(e);
      })
    )

  }

  getCliente(id):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e=>{

        if(e.status!=401 && e.error.mensaje){
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }

        // if(this.isNoAutirizado(e)){
        //   return throwError(e);
        // }

        
        // swal.fire('Error al editar',e.error.mensaje,'error');

        return throwError(e);
      })

     );;
  }

  update(cliente:Cliente):Observable<any>{

    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente).pipe(
      catchError(e=>{

        // if(this.isNoAutirizado(e)){
        //   return throwError(e);
        // }

        if(e.status==400){
          return throwError(e);
        }

        if(e.error.mensaje){
          console.error(e.error.mensaje)
        }
     //   swal.fire(e.error.mensaje, e.error.Error, 'error')
        return throwError(e);
      })
    )
  }

  delete(id: number):Observable<Cliente>{




    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e=>{

        // if(this.isNoAutirizado(e)){
        //   return throwError(e);
        // }

        if(e.error.mensaje){
          console.error(e.error.mensaje)
        }
        // swal.fire(e.error.mensaje, e.error.Error, 'error')
        return throwError(e);
      })
    )
  }


  subirFoto(archivo: File, id):Observable<HttpEvent<{}>>{
    let formData= new FormData();


    formData.append("archivo", archivo);
    formData.append("id", id);

    // let httpHeaders = new HttpHeaders();
    // let token = this.authService.token;

    // if(token != null){
    //   httpHeaders=  httpHeaders.append('Authorization', 'Bearer '+token)
    // }

const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`,formData,{
 reportProgress: true,
//  headers: httpHeaders
})


    return this.http.request(req).pipe(
      //catchError(e =>{
        // this.isNoAutirizado(e);

        //return throwError(e);
    //  })
    );



  }

  getRegiones():Observable<Region[]>{

    return this.http.get<Region[]>(this.urlEndPoint+'/regiones').pipe(
      catchError(e =>{
        // this.isNoAutirizado(e);

        return throwError(e);
      })
    );

  }


  // private isNoAutirizado(e):boolean{

  //   if(e.status==401){
    
  //     if(this.authService.isAuthenticated()){
  //       this.authService.logout();
  //     }
  //     this.router.navigate(['login']);
  //     return true;
  //   }

  //   if(e.status ==403){
    
  //     Swal.fire('Acceso denegado',`Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`, 'warning')

  //     this.router.navigate(['/clientes']);
  //     return true;
  //   }


  //   return false;
  // }


  // private agregarAuthorizationHeader(){

  //   let token = this.authService.token;

  //   if(token != null){

  //     return this.httpHeaders.append('Authorization', 'Bearer '+token);
  //   }

  //   return this.httpHeaders;

  // }


}
