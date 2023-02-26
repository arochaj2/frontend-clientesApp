import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente:Cliente = new Cliente;
  titulo:string="Crear Cliente";
  regiones: Region[]

  errores:string[];


  constructor(private clienteService:ClienteService,
    private router:Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();

    this.clienteService.getRegiones().subscribe(regiones=>this.regiones=regiones)
  }


cargarCliente():void{
  this.activatedRoute.params.subscribe(params=> {
    let id= params['id']
    if(id){
      this.clienteService.getCliente(id).subscribe( cliente=> this.cliente=cliente )
    }
  }
    )
}


public create(): void {
this.clienteService.create(this.cliente).subscribe(
  cliente => {this.router.navigate(['/clientes'])

  swal.fire('Nuevo cliente',`El cliente ${cliente.nombre} ha sido creado con éxito!`,'success')

}, err=>{
  this.errores=err.error.Error as string[];

  console.error('Código del error desde el backend: '+err.status);
  console.error(err.error.Error);
  
}
)
}


public update():void{

  this.cliente.facturas=null; // <-- evita el error recursivo cuando intentamos actualizar un cliente

  this.clienteService.update(this.cliente).subscribe(
    json => {
      this.router.navigate(['/clientes']);
      swal.fire('Cliente Actualizado',`${json.mensaje}: ${json.cliente.nombre}`,'success')
    }, err=>{
      this.errores=err.error.Error as string[];
    
      console.error('Código del error desde el backend: '+err.status);
      console.error(err.error.Error);
      
    }
  )
}

compararRegion(o1:Region, o2:Region):boolean{

  if(o1 === undefined && o2=== undefined){
    return true;
  }
  
  return o1== null || o2== null || o1=== undefined || o2=== undefined? false: o1.id==o2.id
}

}
