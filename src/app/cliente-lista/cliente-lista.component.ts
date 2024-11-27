import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-lista.component.html',
  styleUrls: ['./cliente-lista.component.css'],
})
export class ClienteListaComponent implements OnInit {
  clientes: any[] = [];
  tipoFiltro: string = '';
  valorFiltro: string = '';
  loading: boolean = false;

  constructor(private clienteService: ClienteService, private router: Router) {}

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.loading = true;
    this.clienteService.getClientes().subscribe(
      (data) => {
        this.clientes = data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar clientes',
          text:
            error.error?.message ||
            'Ocorreu um problema ao buscar os dados. Por favor, tente novamente mais tarde.',
        });
      }
    );
  }

  aplicarFiltro() {
    if (!this.tipoFiltro || !this.valorFiltro) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Por favor, selecione o tipo de filtro e insira um valor.',
      });
      return;
    }

    const filtros: any = {};
    filtros[this.tipoFiltro] = this.valorFiltro;

    this.loading = true;
    this.clienteService.getClientes(filtros).subscribe(
      (data) => {
        this.clientes = data;
        this.loading = false;
        if (this.clientes.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Nenhum cliente encontrado',
            text: 'A consulta não retornou resultados.',
          });
        }
      },
      (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro ao buscar clientes',
          text:
            error.error?.message ||
            'Ocorreu um problema ao realizar a busca. Por favor, tente novamente.',
        });
      }
    );
  }

  limparFiltro() {
    this.tipoFiltro = '';
    this.valorFiltro = '';
    this.carregarClientes();
  }

  novoCliente() {
    this.router.navigate(['/cliente']);
  }

  editarCliente(id: number) {
    this.router.navigate([`/cliente/${id}`]);
  }

  deletarCliente(id: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação excluirá o cliente permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.deleteCliente(id).subscribe(
          (response) => {
            this.carregarClientes();
            Swal.fire({
              icon: 'success',
              title: 'Cliente excluído',
              text: response.message || 'O cliente foi excluído com sucesso.',
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao excluir cliente',
              text:
                error.error?.message ||
                'Não foi possível excluir o cliente. Por favor, tente novamente.',
            });
          }
        );
      }
    });
  }
}
