//ESSE VAI SER O CONTROLLER DO MENU ADMIN

import api from "../services/api";

interface SampleData {
  location: string;
  ph: number;
  depth: number;
  user_id: number;
  atributo1?: string;
  atributo2?: number | null;
  atributo3?: number | null;
}

export interface UserData {
  username: string;
  email: string;
  password: string;
  is_admin: boolean;
}


export const createSample = async (data: SampleData) => {
  try {
    const response = await api.post("/sample/create/", data);
    return response.data; 
  } catch (error: any) {
    console.error("Erro ao cadastrar amostra:", error.response?.data || error);
    throw error.response?.data || "Erro desconhecido";
  }
};

export const getAllSamples = async () => {
  try {
    const response = await api.get("/sample/listall"); // Corrigido para GET
    return response.data; // Retorna os dados da API corretamente
  } catch (error) {
    console.error("Erro ao carregar amostras:", error);
    return [];
  }
};

export const deleteSample = async (ids: number[]) => {
  try {
    const response = await api.delete("/sample/delete/", {
      data: { ids }, // Envia a lista de IDs no corpo da requisição
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao deletar amostra(s):", error.response?.data || error);
    throw error.response?.data || "Erro desconhecido";
  }
};

export const updateSample = async (id: number, updatedData: Partial<SampleData>) => {
  try {
    const response = await api.put(`/sample/update/${id}/`, updatedData);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar amostra:", error.response?.data || error);
    throw error.response?.data || "Erro desconhecido";
  }
};


export const editUser = async (id: number, updatedData: Partial<UserData>) => {
  try {
    const response = await api.put(`/update/${id}/`, updatedData);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao editar usuário:", error.response?.data || error);
    throw error.response?.data || "Erro desconhecido";
  }
};


export const deleteUser = async (id: number) => {
  try {
    const response = await api.delete(`/delete/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao deletar usuário:", error.response?.data || error);
    throw error.response?.data || "Erro desconhecido";
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("/allusers/");
    return response.data; 
  } catch (error: any) {
    console.error("Erro ao buscar usuários:", error.response?.data || error);
    throw error.response?.data || "Erro desconhecido";
  }
};


export const getSampleDetails = async (sampleId: number) => {
  try {
    const response = await api.get(`sample/sampledetail/${sampleId}/`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar detalhes:", error.response?.data || error);
    throw error.response?.data || "Erro ao carregar detalhes";
  }
};


export const getUserSamplesIds = async (userId: number): Promise<number[]> => {
  try {
    const response = await api.get(`sample/usersamples/${userId}/`);
    return response.data.samples_ids; 
  } catch (error: any) {
    console.error("Erro ao buscar IDs das amostras:", error.response?.data || error);
    throw error.response?.data || "Erro ao buscar amostras do usuário";
  }
};

export const searchSamplesByLocation = async (location: string) => {
  try {
    const response = await api.get(`/sample/search/location/`, {
      params: { location }, // Envia o parâmetro de busca via query string
    });
    return response.data; // Retorna a lista de amostras encontradas
  } catch (error: any) {
    console.error("Erro ao buscar amostras por localização:", error.response?.data || error);
    throw error.response?.data || "Erro ao buscar por localização";
  }
};
