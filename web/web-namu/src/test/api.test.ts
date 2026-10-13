
import {describe, expect, it} from 'vitest';

import {
  getCategories,
  getContents,
  getContentById,
} from '../services/api';

describe('Serviço da API', () => {
  it('deve carregar as categorias', async () => {
    const categories = await getCategories();

    expect(categories).toHaveLength(3);
    expect(categories[0]).toEqual({
      slug: 'meditacao',
      name: 'Meditação',
    });
  });

  it('deve carregar os conteúdos e os dados de paginação', async () => {
    const result = await getContents({
      page: 1,
      limit: 9,
    });

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.data[0].title).toBe(
      'Meditação da compaixão',
    );
  });

  it('deve enviar o termo de busca e filtrar pelo título', async () => {
    const result = await getContents({
      page: 1,
      limit: 9,
      search: 'compaixão',
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe(21);
  });

  it('deve filtrar os conteúdos por categoria', async () => {
    const result = await getContents({
      page: 1,
      limit: 9,
      category: 'yoga',
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].category).toBe('yoga');
  });

  it('deve retornar lista vazia quando não houver correspondências', async () => {
    const result = await getContents({
      page: 1,
      limit: 9,
      search: 'conteúdo inexistente',
    });

    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('deve carregar os detalhes de um conteúdo pelo ID', async () => {
    const content = await getContentById(21);

    expect(content.id).toBe(21);
    expect(content.title).toBe('Meditação da compaixão');
    expect(content.instructor).toBe('Marina Duarte');
  });

  it('deve propagar o erro quando o conteúdo não existe', async () => {
    await expect(getContentById(13)).rejects.toBeDefined();
  });
});
