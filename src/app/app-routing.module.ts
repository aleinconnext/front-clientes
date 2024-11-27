import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteListaComponent } from './cliente-lista/cliente-lista.component';
import { ClienteFormularioComponent } from './cliente-formulario/cliente-formulario.component';

const routes: Routes = [
  { path: 'clientes', component: ClienteListaComponent },
  { path: 'cliente/:id', component: ClienteFormularioComponent },
  { path: 'cliente', component: ClienteFormularioComponent },
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
