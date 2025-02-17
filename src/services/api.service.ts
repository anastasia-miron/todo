import { ApiResponse } from "../typings/types";

const apiUrl = import.meta.env.VITE_API_URL;

class ApiService {

    private async request<Response = unknown>(url: string, init: RequestInit): Promise<ApiResponse<Response>> {
        try {
            const response = await fetch(apiUrl + url, {
                ...init,
                ...this.getRequestOptions()
            });
            const result: ApiResponse<Response> = await response.json();
            return result;
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Fetch data failed'
            }
        }
    }

    private getRequestOptions(): RequestInit {
        const token = localStorage.getItem('token');

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return { headers };
    }

    async get<Response = unknown>(url: string, init: RequestInit = {}): Promise<ApiResponse<Response>> {
        return this.request<Response>(url, { ...init, method: 'GET' });
    }

    async post<Response = unknown, Payload = unknown>(url: string, data: Payload, init: RequestInit = {}): Promise<ApiResponse<Response>> {
        return this.request<Response>(url, { ...init, method: 'POST', body: JSON.stringify(data) });
    }

    async put<Response = unknown, Payload = unknown>(url: string, data: Payload, init: RequestInit = {}): Promise<ApiResponse<Response>> {
        return this.request<Response>(url, { ...init, method: 'PUT', body: JSON.stringify(data) });
    }

    async delete<Response = unknown>(url: string, init: RequestInit = {}) {
        return this.request<Response>(url, { ...init, method: 'DELETE' });
    }
}

const apiService = new ApiService();

export default apiService;