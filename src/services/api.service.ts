import { ApiResponse } from "../typings/types";

const apiUrl = import.meta.env.VITE_API_URL;

class ApiService {

    private getRequestOptions(): RequestInit {
        const token = localStorage.getItem('token');

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }

        if(token) {
            headers.Authorization =`Bearer ${token}`;
        }

        return {headers};
    }

    async get<Response = unknown>(url: string, init: RequestInit = {}): Promise<ApiResponse<Response>> {
        const response = await fetch(apiUrl + url, {
            ...init,
            ...this.getRequestOptions(),
            method: 'GET',
        });
        const result: ApiResponse<Response> = await response.json();
        return result;
    }

    async post<Response = unknown, Payload = unknown>(url: string, data: Payload, init: RequestInit = {}): Promise<ApiResponse<Response>> {
        const response = await fetch(apiUrl + url, {
            ...init,
            ...this.getRequestOptions(),
            method: 'POST',
            body: JSON.stringify(data)
        });
        const result: ApiResponse<Response> = await response.json();
        return result;
    }

    async put<Response = unknown, Payload = unknown>(url: string, data: Payload, init: RequestInit = {}): Promise<ApiResponse<Response>> {
        const response = await fetch(apiUrl + url, {
            ...init,
            ...this.getRequestOptions(),
            method: 'PUT',
            body: JSON.stringify(data)
        });
        const result: ApiResponse<Response> = await response.json();
        return result;
    }

    async delete<Response = unknown>(url: string, init: RequestInit = {}) {
        const response = await fetch(apiUrl + url, {
            ...init,
            ...this.getRequestOptions(),
            method: 'DELETE',
        });
        const result: ApiResponse<Response> = await response.json();
        return result;
    }
}

const apiService = new ApiService();

export default apiService;