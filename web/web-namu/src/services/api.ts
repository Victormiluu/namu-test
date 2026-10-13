
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Category {
  slug: string;
  name: string;
}

export interface Content {
  id: number;
  title: string;
  description: string;
  category: string;
  type: string;
  durationSeconds: number;
  instructor: string;
  thumbnailUrl: string;
  publishedAt: string;
  isFavorite: boolean;
}

export interface GetContentsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedContents {
  data: Content[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get("/categories");

  return response.data?.data ?? response.data;
}


export async function getContentById(id: number): Promise<Content> {
  const response = await api.get(`/contents/${id}`);

  const result = response.data?.data ?? response.data;

  return result as Content;
}

export async function addFavorite(contentId: number): Promise<void> {
  await api.post("/favorites", { contentId });
}

export async function removeFavorite(contentId: number): Promise<void> {
  await api.delete(`/favorites/${contentId}`);
}


export const getContents = async (
  params: GetContentsParams = {}
): Promise<PaginatedContents> => {
  const response = await api.get("/contents", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 9,
      ...(params.search ? { search: params.search } : {}),
      ...(params.category ? { category: params.category } : {}),
    },
  });

  const result = response.data;

  // Aceita tanto uma lista direta quanto { data: [...] }
  const items = Array.isArray(result)
    ? result
    : Array.isArray(result.data)
      ? result.data
      : Array.isArray(result.data?.data)
        ? result.data.data
        : [];

  // Algumas APIs retornam os dados da paginação em outro objeto.
  const pagination =
    result.pagination ??
    (Array.isArray(result.data) ? result : result.data ?? result);

  const page = Number(pagination.page ?? params.page ?? 1);
  const limit = Number(pagination.limit ?? params.limit ?? 9);
  const total = Number(pagination.total ?? items.length);
  const totalPages = Number(
    pagination.totalPages ??
      Math.max(1, Math.ceil(total / Math.max(limit, 1)))
  );

  return {
    data: items,
    page,
    limit,
    total,
    totalPages,
  };
  
};
