import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento, EventoRequest, EventoResponse } from './evento.model';

@Injectable({ providedIn: 'root' })
export class EventoService {
  // O proxy.conf.json encaminha /api para http://localhost:8080.
  private readonly apiUrl = '/api/events';

  constructor(private readonly http: HttpClient) {}

  cadastrar(evento: EventoRequest): Observable<EventoResponse> {
    return this.http.post<EventoResponse>(this.apiUrl, evento);
  }

  listar(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }

  // Ajuste a URL aqui se o seu endpoint DELETE for diferente.
  excluir(eventId: string): Observable<EventoResponse | null> {
    return this.http.delete<EventoResponse | null>(`${this.apiUrl}/${encodeURIComponent(eventId)}`);
  }
}
