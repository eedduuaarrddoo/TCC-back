import api from "../services/api";

interface SampleData {
  location: string;
  //date: string;
  ph: number;
  depth: number;
  user_id: number;
}

export const createSample = async (data: SampleData) => {
  try {
    const response = await api.post("/sample/create/", data);
    return response.data; // Retorna os dados da API
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