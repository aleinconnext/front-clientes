import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cliente-formulario.component.html',
  styleUrls: ['./cliente-formulario.component.css'],
})
export class ClienteFormularioComponent implements OnInit {
  clienteForm: FormGroup;
  isEdit: boolean = false;
  loading: boolean = false;
  tipoPessoa: string = 'fisica';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private fb: FormBuilder
  ) {
    this.clienteForm = this.fb.group({
      id: [null],
      tipoPessoa: ['fisica', Validators.required],
      cpf_cnpj: ['', [Validators.required, this.cpfCnpjValidator.bind(this)]],
      nome: ['', [Validators.required]],
      telefone: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(11),
        ],
      ],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      logradouro: ['', [Validators.required]],
      complemento: [''],
      unidade: [''],
      bairro: ['', [Validators.required]],
      localidade: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      regiao: [''],
      ibge: [''],
      ddd: [''],
      siafi: [''],
      observacoes: [''],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.clienteForm.get('cpf_cnpj')?.disable();
      this.carregarCliente(parseInt(id, 10));
    } else {
      this.isEdit = false;
      this.clienteForm.get('cpf_cnpj')?.enable();
    }
  }

  onTipoPessoaChange(tipo: string) {
    this.tipoPessoa = tipo;
    this.clienteForm.get('cpf_cnpj')?.updateValueAndValidity();
  }

  carregarCliente(id: number) {
    this.loading = true;

    this.clienteService.getClientes({ id }).subscribe(
      (clientes) => {
        if (clientes.length > 0) {
          this.clienteForm.patchValue(clientes[0]);

          // Garantir que os  controles sejam validados
          Object.keys(this.clienteForm.controls).forEach((field) => {
            const control = this.clienteForm.get(field);
            if (control) {
              control.markAsTouched();
              control.updateValueAndValidity();
            }
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Cliente não encontrado',
            text: 'O cliente solicitado não existe.',
          });
          this.router.navigate(['/clientes']);
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar cliente',
          text:
            error.error?.message ||
            'Ocorreu um problema ao carregar os dados do cliente.',
        });
        this.router.navigate(['/clientes']);
      }
    );
  }

  salvarCliente() {
    if (this.clienteForm.invalid) {
      // Obter mensagens de erro
      const mensagensErro = this.getMensagensErro();

      Swal.fire({
        icon: 'warning',
        title: 'Formulário Inválido',
        html: `<ul style="list-style-type: none; padding: 0;">${mensagensErro
          .map((msg) => `<li>${msg}</li>`)
          .join('')}</ul>`,
      });
      return;
    }

    const cliente = this.clienteForm.value;
    this.loading = true;

    if (this.isEdit) {
      this.clienteService.updateCliente(cliente.id, cliente).subscribe(
        () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Cliente Atualizado',
            text: 'Os dados do cliente foram atualizados com sucesso.',
          });
          this.router.navigate(['/clientes']);
        },
        (error) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Erro ao atualizar cliente',
            text:
              error.error?.message ||
              'Ocorreu um problema ao atualizar o cliente.',
          });
        }
      );
    } else {
      this.clienteService.addCliente(cliente).subscribe(
        () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Cliente Cadastrado',
            text: 'O cliente foi cadastrado com sucesso.',
          });
          this.router.navigate(['/clientes']);
        },
        (error) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar cliente',
            text:
              error.error?.message ||
              'Ocorreu um problema ao cadastrar o cliente.',
          });
        }
      );
    }
  }

  getMensagensErro(): string[] {
    const mensagensErro = [];
    const controls = this.clienteForm.controls;

    for (const name in controls) {
      const control = controls[name];
      if (control.invalid) {
        switch (name) {
          case 'cpf_cnpj':
            if (control.hasError('required'))
              mensagensErro.push('O CPF/CNPJ é obrigatório.');
            if (control.hasError('cpfCnpjInvalido'))
              mensagensErro.push('O CPF/CNPJ informado é inválido.');
            break;
          case 'nome':
            if (control.hasError('required'))
              mensagensErro.push('O Nome é obrigatório.');
            break;
          case 'telefone':
            if (control.hasError('required'))
              mensagensErro.push('O Telefone é obrigatório.');
            if (control.hasError('minlength'))
              mensagensErro.push('O Telefone deve ter pelo menos 10 dígitos.');
            if (control.hasError('maxlength'))
              mensagensErro.push('O Telefone deve ter no máximo 11 dígitos.');
            break;
          case 'cep':
            if (control.hasError('required'))
              mensagensErro.push('O CEP é obrigatório.');
            if (control.hasError('pattern'))
              mensagensErro.push(
                'O CEP deve estar no formato 00000-000 ou apenas números.'
              );
            break;
          case 'logradouro':
            if (control.hasError('required'))
              mensagensErro.push('O Logradouro é obrigatório.');
            break;
          case 'bairro':
            if (control.hasError('required'))
              mensagensErro.push('O Bairro é obrigatório.');
            break;
          case 'localidade':
            if (control.hasError('required'))
              mensagensErro.push('A Localidade é obrigatória.');
            break;
          case 'uf':
            if (control.hasError('required'))
              mensagensErro.push('A UF é obrigatória.');
            break;
          case 'estado':
            if (control.hasError('required'))
              mensagensErro.push('O Estado é obrigatório.');
            break;
          default:
            mensagensErro.push(`O campo ${name} é inválido.`);
        }
      }
    }
    return mensagensErro;
  }

  buscarEnderecoPorCep() {
    const cep = this.clienteForm.get('cep')?.value;

    if (!cep || cep.length !== 8) {
      Swal.fire({
        icon: 'warning',
        title: 'CEP Inválido',
        text: 'Por favor, insira um CEP válido com 8 dígitos.',
      });
      return;
    }

    this.clienteService.buscarEndereco(cep).subscribe(
      (endereco) => {
        if (endereco.erro) {
          Swal.fire({
            icon: 'error',
            title: 'CEP Não Encontrado',
            text: 'Não foi possível encontrar o endereço para o CEP informado.',
          });
          return;
        }

        this.clienteForm.patchValue({
          logradouro: endereco.logradouro,
          complemento: endereco.complemento,
          bairro: endereco.bairro,
          localidade: endereco.localidade,
          uf: endereco.uf,
          estado: endereco.uf,
          regiao: endereco.regiao || '',
          ibge: endereco.ibge || '',
          ddd: endereco.ddd || '',
          siafi: endereco.siafi || '',
        });
      },
      () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao buscar endereço',
          text: 'Não foi possível conectar ao serviço de busca de CEP.',
        });
      }
    );
  }

  cpfCnpjValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) return null;

    const isValid =
      this.tipoPessoa === 'fisica'
        ? this.validarCPF(value)
        : this.validarCNPJ(value);

    return isValid ? null : { cpfCnpjInvalido: true };
  }

  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0,
      resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf[10]);
  }

  validarCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14) return false;

    if (/^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho++;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === parseInt(digitos.charAt(1));
  }

  salvarEVoltar() {
    this.salvarCliente();
    this.router.navigate(['/clientes']);
  }

  novoCliente() {
    this.router.navigate(['/cliente']);
  }

  cancelar() {
    this.router.navigate(['/clientes']);
  }
}
