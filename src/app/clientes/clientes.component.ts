import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  public paginador:any
  clienteSeleccionado:Cliente;
  authService: AuthService;

  constructor(private clienteService: ClienteService, 
    private activatedRoute: ActivatedRoute,
    public modalService:ModalService, 
    public authServ:AuthService) { 

      this.authService=authServ;
    }

  ngOnInit(): void {

   

    this.activatedRoute.paramMap.subscribe( params => {
    let page:number = +params.get('page');

          if(!page){
            page=0;
          }

          this.clienteService.getClientes(page).pipe(
            tap(response=>{
              console.log('ClientesComponent: tap 3');
              (response.content as Cliente[]).forEach(cliente=>{console.log(cliente.nombre) });
            })
          ) .subscribe(response=> {
            this.clientes=response.content as Cliente[];
            this.paginador=response;
          });
        }
    );
  
        this.modalService.notificarUpload.subscribe(cliente =>{
          this.clientes.map(clienteOriginal =>{
            if(cliente.id== clienteOriginal.id){
              clienteOriginal.foto=cliente.foto;
            }
            return clienteOriginal;
          })
        })
  }


  
  delete(cliente:Cliente):void{

    Swal.fire({
      title: 'Estas seguro?',
      text: `Seguro que desea elminar al cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, elimiar!',
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {

this.clienteService.delete(cliente.id).subscribe(
  response=>{

    this.clientes=this.clientes.filter(cli=>cli!== cliente)

    Swal.fire(
      'Cliente elminado!',
      `Cliente ${cliente.nombre} ${cliente.apellido}  eliminado con éxito`,
      'success'
    )
  }
)


      }
    })


  }

  abrirModal(cliente: Cliente){
    this.clienteSeleccionado=cliente;
    this.modalService.abrirModal();
  }

}
