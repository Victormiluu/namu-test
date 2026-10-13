
import {describe, expect, it} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import {http, HttpResponse} from 'msw';

import HomeScreen from '../pages/home';
import {server} from './setup';

function renderHome() {
  return render(
    <MemoryRouter>
      <HomeScreen />
    </MemoryRouter>,
  );
}

describe('Integração da HomeScreen', () => {
  it('deve carregar e exibir os conteúdos da API simulada', async () => {
    renderHome();

    expect(
      await screen.findByRole('heading', {
        name: 'Meditação da compaixão',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Yoga para iniciantes',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('2 conteúdos encontrados'),
    ).toBeInTheDocument();
  });

  it('deve filtrar os resultados ao pesquisar por título', async () => {
    const user = userEvent.setup();

    renderHome();

    await screen.findByRole('heading', {
      name: 'Meditação da compaixão',
    });

    const searchInput = screen.getByRole('searchbox', {
      name: 'Buscar por título',
    });

    await user.type(searchInput, 'compaixão');

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: 'Meditação da compaixão',
        }),
      ).toBeInTheDocument();

      expect(
        screen.queryByRole('heading', {
          name: 'Yoga para iniciantes',
        }),
      ).not.toBeInTheDocument();
    });

    expect(
      await screen.findByText('1 conteúdo encontrado'),
    ).toBeInTheDocument();
  });

  it('deve atualizar os resultados quando uma categoria é selecionada', async () => {
    const user = userEvent.setup();

    renderHome();

    await screen.findByRole('heading', {
      name: 'Yoga para iniciantes',
    });

    await user.selectOptions(
      screen.getByRole('combobox', {
        name: 'Filtrar por categoria',
      }),
      'yoga',
    );

    expect(
      await screen.findByRole('heading', {
        name: 'Yoga para iniciantes',
      }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', {
          name: 'Meditação da compaixão',
        }),
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getByText('1 conteúdo encontrado'),
    ).toBeInTheDocument();
  });

  it('deve exibir o estado vazio quando a API não retorna resultados', async () => {
    const user = userEvent.setup();

    renderHome();

    await screen.findByRole('heading', {
      name: 'Meditação da compaixão',
    });

    await user.type(
      screen.getByRole('searchbox', {
        name: 'Buscar por título',
      }),
      'xyz sem resultados',
    );

    expect(
      await screen.findByRole('heading', {
        name: 'Nenhum conteúdo encontrado',
      }),
    ).toBeInTheDocument();
  });

  it('deve exibir uma mensagem de erro se a API falhar', async () => {
    server.use(
      http.get(
        'http://localhost:3333/contents',
        () =>
          HttpResponse.json(
            {message: 'Erro interno simulado'},
            {status: 500},
          ),
      ),
    );

    renderHome();

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent('Não conseguimos carregar os conteúdos');
  });
});
