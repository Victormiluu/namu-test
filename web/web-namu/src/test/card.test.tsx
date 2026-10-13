
import {describe, expect, it} from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import Card from '../components/Card';

const content = {
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
};

function renderCard() {
  return render(
    <MemoryRouter>
      <Card content={content} categoryName="Meditação" />
    </MemoryRouter>,
  );
}

describe('Componente Card', () => {
  it('deve exibir título, categoria, tipo e duração', () => {
    renderCard();

    expect(
      screen.getByRole('heading', {
        name: 'Meditação da compaixão',
      }),
    ).toBeInTheDocument();

    expect(screen.getByText('Meditação')).toBeInTheDocument();
    expect(screen.getByText('Áudio')).toBeInTheDocument();
    expect(screen.getByText('13 min')).toBeInTheDocument();
  });

  
it('deve navegar para a página de detalhes do conteúdo', () => {
  const { container } = renderCard();

  expect(within(container).getByRole('link')).toHaveAttribute(
    'href',
    '/contents/21',
  );
});

it('deve usar o título do conteúdo como texto alternativo da imagem', () => {
  const { container } = renderCard();

  expect(
    within(container).getByRole('img', {
      name: 'Meditação da compaixão',
    }),
  ).toHaveAttribute('src', 'https://example.com/namu-21.jpg');
});

it('deve esconder a imagem quando ocorrer um erro de carregamento', () => {
  const { container } = renderCard();

  const image = within(container).getByRole('img', {
    name: 'Meditação da compaixão',
  });

  fireEvent.error(image);

  expect(image).toHaveStyle({ display: 'none' });
});

});
