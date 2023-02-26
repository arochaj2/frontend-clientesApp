import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { FacturaService } from 'src/app/facturas/services/factura.service';
import { Factura } from 'src/app/facturas/models/factura';
import Swal from 'sweetalert2';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html'
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo:string="Detalle del cliente";
  fotoSeleccionada:File;
  progreso:number=0;
  modalService:ModalService;
  authService:AuthService;



  constructor(private clienteService:ClienteService,
    public modalService1:ModalService, public authService1:AuthService,
      private facturaService:FacturaService) { 
      this.modalService=modalService1;
      this.authService=authService1;
  
     }

  ngOnInit(): void {


  }

  seleccionarFoto(event){

    
    this.fotoSeleccionada= event.target.files[0];
    this.progreso=0;
    console.log(this.fotoSeleccionada);

    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      swal.fire('Error seleccionar imagen: ', 'El archivo debe ser del tipo imagen', 'error');
      this.fotoSeleccionada=null;
    }
  }

  subirFoto(){

    if(!this.fotoSeleccionada){
      swal.fire('Error Upload:', 'Debe seleccionar una foto', 'error');
    }else{


    this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
    .subscribe(event =>{

      if(event.type=== HttpEventType.UploadProgress){
        this.progreso = Math.round((event.loaded/event.total)*100);
      }else if(event.type === HttpEventType.Response){
        let response:any = event.body;
        this.cliente=response.Cliente as Cliente;

        this.modalService.notificarUpload.emit(this.cliente);
        swal.fire('La foto se ha subido completamente', response.mensaje, 'success')


      }

      // this.cliente=cliente;

      
    });
  }
}

cerrarModal(){
  this.modalService.cerrarModal();
  this.fotoSeleccionada=null;
  this.progreso=0;
}

delete(factura:Factura):void{

  Swal.fire({
    title: 'Estas seguro?',
    text: `Seguro que desea elminar la factura ${factura.descripcion}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, elimiar!',
    cancelButtonText: 'No, cancelar!',
  }).then((result) => {
    if (result.isConfirmed) {

this.facturaService.delete(factura.id).subscribe(
response=>{

  this.cliente.facturas=this.cliente.facturas.filter(f => f !== factura)

  Swal.fire(
    'Factura elminada!',
    `Factura ${factura.descripcion}  eliminada con éxito`,
    'success'
  )
}
)


    }
  })



}
}
