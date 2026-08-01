import ingredientsReducer, {
  fetchIngredients,
  TIngredientsState
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('Редьюсер ingredients', () => {
  const initialState: TIngredientsState = {
    ingredients: [],
    loading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: 'bun-1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'bun.png',
      image_mobile: 'bun-mobile.png',
      image_large: 'bun-large.png'
    },
    {
      _id: 'main-1',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'main.png',
      image_mobile: 'main-mobile.png',
      image_large: 'main-large.png'
    }
  ];

  test('возвращает начальное состояние при неизвестном экшене и state = undefined', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  test('обрабатывает fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      {
        ...initialState,
        error: 'Старая ошибка'
      },
      fetchIngredients.pending('', undefined)
    );

    expect(state).toEqual({
      ingredients: [],
      loading: true,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      {
        ...initialState,
        loading: true
      },
      fetchIngredients.fulfilled(mockIngredients, '', undefined)
    );

    expect(state).toEqual({
      ingredients: mockIngredients,
      loading: false,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      {
        ...initialState,
        loading: true
      },
      fetchIngredients.rejected(new Error('Ошибка сети'), '', undefined)
    );

    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual([]);
    expect(state.error).toBe('Ошибка сети');
  });
});
