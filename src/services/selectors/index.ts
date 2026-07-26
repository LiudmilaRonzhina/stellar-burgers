import { RootState } from '../store';

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;

export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectBuns = (state: RootState) =>
  state.ingredients.ingredients.filter((item) => item.type === 'bun');

export const selectMains = (state: RootState) =>
  state.ingredients.ingredients.filter((item) => item.type === 'main');

export const selectSauces = (state: RootState) =>
  state.ingredients.ingredients.filter((item) => item.type === 'sauce');

export const selectIngredientById =
  (id: string | undefined) => (state: RootState) =>
    state.ingredients.ingredients.find((item) => item._id === id) || null;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectFeedOrders = (state: RootState) => state.feed.orders;

export const selectUserOrders = (state: RootState) => state.feed.userOrders;

export const selectFeed = (state: RootState) => ({
  total: state.feed.total,
  totalToday: state.feed.totalToday
});

export const selectFeedLoading = (state: RootState) => state.feed.loading;

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;

export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;

export const selectCurrentOrder = (state: RootState) =>
  state.order.currentOrder;

export const selectOrderFromStore = (number: number) => (state: RootState) =>
  state.feed.orders.find((order) => order.number === number) ||
  state.feed.userOrders.find((order) => order.number === number) ||
  (state.order.currentOrder?.number === number
    ? state.order.currentOrder
    : null);

export const selectUser = (state: RootState) => state.user.user;

export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;

export const selectUserLoading = (state: RootState) => state.user.loading;

export const selectUserError = (state: RootState) => state.user.error;
