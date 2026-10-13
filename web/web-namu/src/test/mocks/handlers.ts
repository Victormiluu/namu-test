
import {http, HttpResponse} from 'msw';

export const mockCategories = [
  {slug: 'meditacao', name: 'Meditação'},
  {slug: 'yoga', name: 'Yoga'},
  {slug: 'nutricao', name: 'Nutrição'},
];

export const mockContents = [
  {
    id: 21,
    title: 'Meditação da compaixão',
    description:
      'Prática guiada de bondade amorosa para você e para os outros.',
    category: 'meditacao',
    type: 'audio',
    durationSeconds: 780,
    instructor: 'Marina Duarte',
    thumbnailUrl: 'https://example.com/namu-21.jpg',
    publishedAt: '2026-09-20T09:00:00Z',
    isFavorite: false,
  },
  {
    id: 22,
    title: 'Yoga para iniciantes',
    description: 'Uma prática leve para começar o dia.',
    category: 'yoga',
    type: 'video',
    durationSeconds: 1800,
    instructor: 'Ana Souza',
    thumbnailUrl: 'https://example.com/namu-22.jpg',
    publishedAt: '2026-09-21T09:00:00Z',
    isFavorite: false,
  },
];

export const handlers = [
  http.get('http://localhost:3333/categories', () => {
    return HttpResponse.json({
      data: mockCategories,
    });
  }),

  http.get('http://localhost:3333/contents', ({request}) => {
    const url = new URL(request.url);

    const search = (
      url.searchParams.get('search') ?? ''
    ).toLocaleLowerCase('pt-BR');

    const category = url.searchParams.get('category') ?? '';
    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 9);

    let filtered = [...mockContents];

    if (search) {
      filtered = filtered.filter(content =>
        content.title.toLocaleLowerCase('pt-BR').includes(search),
      );
    }

    if (category) {
      filtered = filtered.filter(
        content => content.category === category,
      );
    }

    const total = filtered.length;
    const safeLimit = Math.max(limit, 1);
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    const start = (page - 1) * safeLimit;

    return HttpResponse.json({
      data: filtered.slice(start, start + safeLimit),
      page,
      limit: safeLimit,
      total,
      totalPages,
    });
  }),

  http.get('http://localhost:3333/contents/:id', ({params}) => {
    const id = Number(params.id);

    if (id === 13) {
      return HttpResponse.json(
        {message: 'Conteúdo não encontrado'},
        {status: 404},
      );
    }

    const content = mockContents.find(item => item.id === id);

    if (!content) {
      return HttpResponse.json(
        {message: 'Conteúdo não encontrado'},
        {status: 404},
      );
    }

    return HttpResponse.json({data: content});
  }),

  http.post('http://localhost:3333/favorites', () => {
    return new HttpResponse(null, {status: 204});
  }),

  http.delete('http://localhost:3333/favorites/:contentId', () => {
    return new HttpResponse(null, {status: 204});
  }),
];
