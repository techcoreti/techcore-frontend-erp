import { ApiError } from './api';
import api from './api';

export interface EstatisticasCrescimento {
	total_atual: number;
	novos_este_mes: number;
	crescimento_percentual: number;
	ativos: number;
	inativos: number;
	periodo: string;
}

class ClienteEstatisticasService {
	/**
	 * Busca estatísticas de crescimento de clientes
	 */
	async getEstatisticasCrescimento(): Promise<EstatisticasCrescimento> {
		try {
			const response = await api.get<EstatisticasCrescimento>('/clientes/estatisticas/crescimento');
			return response;
		} catch (error: unknown) {
			const apiError = error as ApiError;
			throw new Error(apiError.response?.data?.message || 'Erro ao buscar estatísticas de crescimento');
		}
	}
}

export const clienteEstatisticasService = new ClienteEstatisticasService();
