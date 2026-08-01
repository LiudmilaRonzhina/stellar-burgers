import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  TConstructorState
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

describe('Редьюсер burgerConstructor', () => {
  const initialState: TConstructorState = {
    bun: null,
    ingredients: []
  };

  const bun: TIngredient = {
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
  };

  const main: TIngredient = {
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
  };

  const sauce: TIngredient = {
    _id: 'sauce-1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 100,
    price: 90,
    image: 'sauce.png',
    image_mobile: 'sauce-mobile.png',
    image_large: 'sauce-large.png'
  };

  test('возвращает начальное состояние при неизвестном экшене и state = undefined', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  test('обрабатывает addIngredient для булки', () => {
    const state = constructorReducer(initialState, addIngredient(bun));

    expect(state.bun).toEqual(bun);
    expect(state.ingredients).toEqual([]);
  });

  test('заменяет булку при повторном addIngredient', () => {
    const anotherBun: TIngredient = {
      ...bun,
      _id: 'bun-2',
      name: 'Флюоресцентная булка R2-D3'
    };

    const stateWithBun = constructorReducer(initialState, addIngredient(bun));
    const state = constructorReducer(stateWithBun, addIngredient(anotherBun));

    expect(state.bun).toEqual(anotherBun);
  });

  test('обрабатывает addIngredient для начинки', () => {
    const state = constructorReducer(initialState, addIngredient(main));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([
      {
        ...main,
        id: 'test-uuid'
      }
    ]);
  });

  test('обрабатывает removeIngredient', () => {
    const stateWithIngredients = constructorReducer(
      {
        bun: null,
        ingredients: [
          { ...main, id: 'test-uuid' },
          { ...sauce, id: 'sauce-uuid' }
        ]
      },
      removeIngredient('test-uuid')
    );

    expect(stateWithIngredients.ingredients).toEqual([
      { ...sauce, id: 'sauce-uuid' }
    ]);
  });

  test('обрабатывает moveIngredient', () => {
    const stateWithIngredients: TConstructorState = {
      bun: null,
      ingredients: [
        { ...main, id: 'main-uuid' },
        { ...sauce, id: 'sauce-uuid' }
      ]
    };

    const state = constructorReducer(
      stateWithIngredients,
      moveIngredient({ from: 0, to: 1 })
    );

    expect(state.ingredients).toEqual([
      { ...sauce, id: 'sauce-uuid' },
      { ...main, id: 'main-uuid' }
    ]);
  });

  test('обрабатывает clearConstructor', () => {
    const filledState: TConstructorState = {
      bun,
      ingredients: [{ ...main, id: 'test-uuid' }]
    };

    const state = constructorReducer(filledState, clearConstructor());

    expect(state).toEqual(initialState);
  });
});
