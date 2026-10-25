export type TipoEvento = 'PRODUCTION' | 'QUALITY';

export interface EventoRequest {
  eventId: string;
  timestamp: string;
  type: TipoEvento;
  description: string;
}

export interface EventoResponse {
  message?: string;
  eventId?: string;
  status?: string;
  receivedAt?: string;
}

export interface Evento extends EventoRequest {
  status?: string;
  receivedAt?: string;
}
