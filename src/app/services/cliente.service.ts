import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  // private apiUrl = 'http://localhost:3000/clientes';
  private apiUrl = 'https://api-clientes-olive.vercel.app/clientes';

  constructor(private http: HttpClient) {}
  

  getClientes(filtros?: any): Observable<any> {
    return this.http.get(this.apiUrl, { params: filtros });
  }

  getClienteById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?id=${id}`);
  }

  addCliente(cliente: any): Observable<any> { 
    return this.http.post(this.apiUrl, cliente);
  }

  updateCliente(id: number, cliente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  buscarEndereco(cep: string): Observable<any> {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
  }
  
}
