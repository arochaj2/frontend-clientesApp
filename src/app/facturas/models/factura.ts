import { Cliente } from "src/app/clientes/cliente";
import { ItemFactura } from "./item-factura";

export class Factura {

    id:number;
    descripcion:string;
    observacion:string;
    items: Array<ItemFactura>=[];
    total:number;
    createAt:String;
    cliente:Cliente

    calcularGranTotal():number{

        this.total=0;

        this.items.forEach((item:ItemFactura) => {
            this.total+=item.calcularImporte();
        } );

        return this.total;
    }

}
