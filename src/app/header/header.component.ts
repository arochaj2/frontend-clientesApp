import {Component} from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';

@Component({selector: 'app-header',
templateUrl: './header.component.html'})
export class HeaderComponent {

title : string='App Angular';

public authService:AuthService;

constructor(public authService1:AuthService, private router: Router){
    this.authService=authService1
}

logout():void{

    let username=this.authService.usuario.username;

    this.authService.logout();

    Swal.fire('logout', `Hola ${username}, ha cerrado sesión con exito!`,'success')

    this.router.navigate(['/login'])
}

}