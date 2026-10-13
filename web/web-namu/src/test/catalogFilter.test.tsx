
import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';

import CatalogFilters from '../components/CatalogFilters';

const categories = [
  {slug: 'meditacao', name: 'Meditação'},
  {slug: 'yoga', name: 'Yoga'},
];

describe('Componente CatalogFilters', () => {
  it('deve exibir o campo de busca e as categorias', () => {
    render(
      <CatalogFilters
        categories={categories}
        search=""
        selectedCategory=""
        onSearchChange={vi.fn()}
        onCategoryChange={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('searchbox', {
        name: 'Buscar por título',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {name: 'Meditação'}),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {name: 'Yoga'}),
    ).toBeInTheDocument();
  });

  it('deve notificar quando o usuário digitar na busca', () => {
    const onSearchChange = vi.fn();

    render(
      <CatalogFilters
        categories={categories}
        search=""
        selectedCategory=""
        onSearchChange={onSearchChange}
        onCategoryChange={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    fireEvent.change(
      screen.getByRole('searchbox', {
        name: 'Buscar por título',
      }),
      {target: {value: 'Yoga'}},
    );

    expect(onSearchChange).toHaveBeenCalledWith('Yoga');
  });

  it('deve notificar quando uma categoria for selecionada', () => {
    const onCategoryChange = vi.fn();

    render(
      <CatalogFilters
        categories={categories}
        search=""
        selectedCategory=""
        onSearchChange={vi.fn()}
        onCategoryChange={onCategoryChange}
        onClear={vi.fn()}
      />,
    );

    fireEvent.change(
      screen.getByRole('combobox', {
        name: 'Filtrar por categoria',
      }),
      {target: {value: 'yoga'}},
    );

    expect(onCategoryChange).toHaveBeenCalledWith('yoga');
  });

  it('deve executar a ação de limpar filtros', () => {
    const onClear = vi.fn();

    render(
      <CatalogFilters
        categories={categories}
        search="Yoga"
        selectedCategory="yoga"
        onSearchChange={vi.fn()}
        onCategoryChange={vi.fn()}
        onClear={onClear}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {name: 'Limpar filtros'}),
    );

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
