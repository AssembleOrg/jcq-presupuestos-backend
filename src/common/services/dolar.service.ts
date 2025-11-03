import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

export interface DolarBlueResponse {
  compra: number;
  venta: number;
  casa: string;
  nombre: string;
  moneda: string;
  fechaActualizacion: string;
}

@Injectable()
export class DolarService {
  private readonly dolarApiUrl = 'https://dolarapi.com/v1/dolares/blue';

  async getDolarBluePrice(): Promise<DolarBlueResponse> {
    try {
      const response = await axios.get<DolarBlueResponse>(this.dolarApiUrl, {
        timeout: 5000,
      });

      if (response.data) {
        return response.data;
      }

      throw new HttpException('No se pudo obtener el precio del dólar', 500);
    } catch (error) {
      console.error('Error al obtener precio del dólar:', error.message);
      throw new HttpException(
        'Error al obtener el precio del dólar desde la API',
        500,
      );
    }
  }
}

