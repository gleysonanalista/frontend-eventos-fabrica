import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Evento, EventoRequest, TipoEvento } from './evento.model';
import { EventoService } from './evento.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  tipo: TipoEvento = 'PRODUCTION';
  eventId = '';
  descricao = '';
  eventos: Evento[] = [];
  carregando = false;
  enviando = false;
  mensagem = '';
  tipoMensagem: 'sucesso' | 'erro' | '' = '';
  consultaDisponivel = true;
  excluindoId: string | null = null;

  constructor(private readonly eventoService: EventoService) {}

  ngOnInit(): void {
    this.carregarEventos();
  }

  cadastrarEvento(): void {
    this.limparMensagem();

    const eventIdLimpo = this.eventId.trim();
    if (eventIdLimpo.length !== 8) {
      this.exibirErro('O EVENT_ID deve conter exatamente 8 caracteres.');
      return;
    }

    const descricaoLimpa = this.descricao.trim();
    if (!descricaoLimpa) {
      this.exibirErro('Informe a descrição do evento.');
      return;
    }

    const evento: EventoRequest = {
      eventId: eventIdLimpo,
      timestamp: new Date().toISOString().slice(0, 19),
      type: this.tipo,
      description: descricaoLimpa
    };

    this.enviando = true;
    this.eventoService.cadastrar(evento).subscribe({
      next: (resposta) => {
        this.exibirSucesso(resposta?.message || `Evento ${evento.eventId} cadastrado com sucesso.`);
        this.eventId = '';
        this.descricao = '';
        this.enviando = false;
        this.carregarEventos();
      },
      error: (erro: HttpErrorResponse) => {
        this.enviando = false;
        if (erro.status === 409) {
          this.exibirErro(erro.error?.message || 'Este evento já foi processado. Não é permitido cadastrar duplicados.');
        } else if (erro.status === 400) {
          this.exibirErro(erro.error?.message || 'Os dados enviados são inválidos. Verifique os campos.');
        } else if (erro.status === 0) {
          this.exibirErro('Não foi possível conectar à API. Confirme se o backend está rodando em http://localhost:8080.');
        } else {
          this.exibirErro(erro.error?.message || `Erro ao cadastrar o evento (HTTP ${erro.status}).`);
        }
      }
    });
  }

  carregarEventos(): void {
    this.carregando = true;
    this.eventoService.listar().subscribe({
      next: (dados) => {
        this.eventos = Array.isArray(dados) ? dados : [];
        this.consultaDisponivel = true;
        this.carregando = false;
      },
      error: (erro: HttpErrorResponse) => {
        this.carregando = false;
        this.consultaDisponivel = false;
        this.eventos = [];
        if (erro.status === 404 || erro.status === 405) {
          this.mensagem = 'A consulta ainda não está disponível: implemente GET /api/events no backend.';
        } else if (erro.status === 0) {
          this.mensagem = 'Não foi possível conectar à API. Inicie o backend e tente novamente.';
        } else {
          this.mensagem = `Não foi possível consultar os eventos (HTTP ${erro.status}).`;
        }
        this.tipoMensagem = 'erro';
      }
    });
  }

  excluirEvento(evento: Evento): void {
    if (this.excluindoId) return;

    const confirmou = window.confirm(`Deseja realmente excluir o evento ${evento.eventId}?`);
    if (!confirmou) return;

    this.limparMensagem();
    this.excluindoId = evento.eventId;
    this.eventoService.excluir(evento.eventId).subscribe({
      next: (resposta) => {
        this.excluindoId = null;
        this.exibirSucesso(resposta?.message || `Evento ${evento.eventId} excluído com sucesso.`);
        this.eventos = this.eventos.filter(e => e.eventId !== evento.eventId);
      },
      error: (erro: HttpErrorResponse) => {
        this.excluindoId = null;
        if (erro.status === 404) {
          this.exibirErro(erro.error?.message || `O evento ${evento.eventId} não foi encontrado. Ele pode já ter sido excluído.`);
          this.eventos = this.eventos.filter(e => e.eventId !== evento.eventId);
        } else if (erro.status === 0) {
          this.exibirErro('Não foi possível conectar à API. Confirme se o backend está rodando em http://localhost:8080.');
        } else {
          this.exibirErro(erro.error?.message || `Erro ao excluir o evento (HTTP ${erro.status}).`);
        }
      }
    });
  }

  limparMensagem(): void {
    this.mensagem = '';
    this.tipoMensagem = '';
  }

  private exibirSucesso(texto: string): void {
    this.mensagem = texto;
    this.tipoMensagem = 'sucesso';
  }

  private exibirErro(texto: string): void {
    this.mensagem = texto;
    this.tipoMensagem = 'erro';
  }


  formatarData(data?: string): string {
    if (!data) return '—';
    const valor = new Date(data);
    return Number.isNaN(valor.getTime()) ? data : valor.toLocaleString('pt-BR');
  }
}
