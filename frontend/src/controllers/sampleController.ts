//ESSE VAI SER O CONTROLLER DO MENU ADMIN

import api from "../services/api";

/*interface SampleData {
  user_id: number;
  location: string;
  ph: number;
  depth: number;
  espacamento?: string;
  arvore?: string;
  porcentagem?: string;
  observacao?: string;
  espacamento2?: string;
  altura?: string;
  profundidade_info?: string;
  vertice?: string;
  talhao?: string;
  parcela?: string;
  tratamento?: string;
  identificacao?: string;
  ac?: string;
  anexo1?: string; 
  anexo2?: string;
  metodologia?: number | null; 
}*/

export interface UserData {
  username: string;
  email: string;
  password: string;
  is_admin: boolean;
}

export interface MetodologiaData {
  id: number;
  nome: string;
  material: string;
  metodos: string;
  referencias: string;
  criado_em: string; 
}

export interface DiscoSampleData {
  id: number;
  parcelas: string;
  quantidade: number;
  porcentagem: string;
  observacao?: string;
  //metodologia: number;
  criado_em: string;
}

export const createSample = async (formData: FormData) => {
  return api.post("/sample/create/", formData, {
   
  });
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

export const updateSample = async (id: number, formData: FormData) => {
  return api.put(`/sample/update/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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

// CREATE
export const createMetodologia = async (formData: FormData) => {
  try {
    const response = await api.post("/metodologia/create/", formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar metodologia:", error.response?.data || error);
    throw error.response?.data || "Erro desconhecido";
  }
};

// LIST ALL
export const getAllMetodologias = async () => {
  try {
    const response = await api.get("/metodologia/listall/");
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar metodologias:", error);
    return [];
  }
};

// GET DETAILS
export const getMetodologiaDetails = async (id: number) => {
  try {
    const response = await api.get(`/metodologia/detail/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar detalhes da metodologia:", error.response?.data || error);
    throw error.response?.data || "Erro ao carregar detalhes";
  }
};

// UPDATE
export const updateMetodologia = async (id: number, formData: FormData) => {
  try {
    const response = await api.put(`/metodologia/update/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar metodologia:", error.response?.data || error);
    throw error.response?.data || "Erro desconhecido";
  }
};

// DELETE (múltiplas)
export const deleteMetodologias = async (ids: number[]) => {
  try {
    const response = await api.delete("/metodologia/delete/", {
      data: { ids },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao deletar metodologia(s):", error.response?.data || error);
    throw error.response?.data || "Erro desconhecido";
  }
};

// SEARCH BY MATERIAL
export const searchMetodologiasByMaterial = async (material: string) => {
  try {
    const response = await api.get("/metodologia/search/material/", {
      params: { material },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar metodologias por material:", error.response?.data || error);
    throw error.response?.data || "Erro ao buscar por material";
  }
};

////////////////////////////////DISCSAMPLES//////////////////////////////////
// CREATE
export const createDiscoSample = async (formData: FormData) => {
  try {
    const response = await api.post("/discsamples/create/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar DiscoSample:", error.response?.data || error);
    throw error.response?.data || "Erro desconhecido";
  }
};

// LIST ALL
export const getAllDiscoSamples = async () => {
  try {
    const response = await api.get("/discsamples/list/");
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar DiscoSamples:", error);
    return [];
  }
};

// GET DETAILS
export const getDiscSampleDetails = async (id: number) => {
  try {
    const response = await api.get(`/discsamples/detail/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar detalhes do DiscoSample:", error.response?.data || error);
    throw error.response?.data || "Erro ao carregar detalhes";
  }
};

// UPDATE
export const updateDiscoSample = async (id: number, formData: FormData) => {
  try {
    const response = await api.put(`/discsamples/update/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar DiscoSample:", error.response?.data || error);
    throw error.response?.data || "Erro desconhecido";
  }
};

// DELETE (múltiplas)
export const deleteDiscoSamples = async (ids: number[]) => {
  try {
    const response = await api.delete("/discsamples/delete/", {
      data: { ids },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao deletar DiscoSample(s):", error.response?.data || error);
    throw error.response?.data || "Erro desconhecido";
  }
};