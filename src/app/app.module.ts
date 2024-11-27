import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Necessário para chamadas HTTP
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    HttpClientModule, // Para trabalhar com APIs REST
    AppRoutingModule, // Configuração de rotas
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
