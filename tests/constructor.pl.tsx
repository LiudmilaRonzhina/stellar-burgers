import { test, expect, Page } from '@playwright/test';
import path from 'path';

const HAR_PATH = path.join(__dirname, 'hars', 'api.har');
const API_URL_GLOB = '**/api/**';

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const ORDER_NUMBER = '12345';

async function disableDevOverlay(page: Page) {
  await page.addStyleTag({
    content:
      '#webpack-dev-server-client-overlay { display: none !important; pointer-events: none !important; }'
  });
}

async function openApp(page: Page) {
  await page.goto('/');
  await disableDevOverlay(page);
  await expect(page.getByText(BUN_NAME).first()).toBeVisible();
}

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(HAR_PATH, {
      url: API_URL_GLOB,
      update: false,
      notFound: 'abort'
    });
  });

  test('добавление булки и начинки в конструктор', async ({ page }) => {
    await openApp(page);

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page
      .locator('li')
      .filter({ hasText: BUN_NAME })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(page.getByText(`${BUN_NAME} (верх)`)).toBeVisible();
    await expect(page.getByText(`${BUN_NAME} (низ)`)).toBeVisible();
    await expect(page.getByText('Выберите булки')).not.toBeVisible();

    await page
      .locator('li')
      .filter({ hasText: MAIN_NAME })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(page.getByText('Выберите начинку')).not.toBeVisible();
    await expect(page.getByText(MAIN_NAME).nth(1)).toBeVisible();
  });

  test.describe('Модальное окно ингредиента', () => {
    test('открытие модального окна с данными выбранного ингредиента', async ({
      page
    }) => {
      await openApp(page);

      await page
        .locator('li')
        .filter({ hasText: BUN_NAME })
        .locator('a')
        .click();

      const modal = page.locator('#modals');
      await expect(modal.getByText('Детали ингредиента')).toBeVisible();
      await expect(modal.getByText(BUN_NAME)).toBeVisible();
      await expect(modal.getByText('Калории, ккал')).toBeVisible();
    });

    test('закрытие модального окна по клику на крестик', async ({ page }) => {
      await openApp(page);

      await page
        .locator('li')
        .filter({ hasText: BUN_NAME })
        .locator('a')
        .click();

      const modal = page.locator('#modals');
      await expect(modal.getByText('Детали ингредиента')).toBeVisible();

      await modal.locator('button').click();

      await expect(modal.getByText('Детали ингредиента')).not.toBeVisible();
    });

    test('закрытие модального окна по клику на оверлей', async ({ page }) => {
      await openApp(page);

      await page
        .locator('li')
        .filter({ hasText: BUN_NAME })
        .locator('a')
        .click();

      const modalRoot = page.locator('#modals');
      await expect(modalRoot.getByText('Детали ингредиента')).toBeVisible();

      await modalRoot.locator('div').first().click({ position: { x: 5, y: 5 } });

      await expect(
        modalRoot.getByText('Детали ингредиента')
      ).not.toBeVisible();
    });
  });

  test.describe('Создание заказа', () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem('refreshToken', 'test-refresh-token');
        document.cookie = 'accessToken=Bearer%20test-access-token; path=/';
      });
    });

    test('оформление заказа открывает модалку с номером и очищает конструктор', async ({
      page
    }) => {
      await openApp(page);

      await page
        .locator('li')
        .filter({ hasText: BUN_NAME })
        .getByRole('button', { name: 'Добавить' })
        .click();
      await page
        .locator('li')
        .filter({ hasText: MAIN_NAME })
        .getByRole('button', { name: 'Добавить' })
        .click();

      await expect(page.getByText(`${BUN_NAME} (верх)`)).toBeVisible();
      await expect(page.getByText('Выберите начинку')).not.toBeVisible();

      await page.getByRole('button', { name: 'Оформить заказ' }).click();

      const modal = page.locator('#modals');
      await expect(modal.getByText('идентификатор заказа')).toBeVisible();
      await expect(modal.getByText(ORDER_NUMBER)).toBeVisible();

      await expect(page.getByText(`${BUN_NAME} (верх)`)).not.toBeVisible();
      await expect(page.getByText('Выберите булки').first()).toBeVisible();
      await expect(page.getByText('Выберите начинку')).toBeVisible();

      await modal.locator('button').click();
      await expect(modal.getByText('идентификатор заказа')).not.toBeVisible();
      await expect(modal.getByText(ORDER_NUMBER)).not.toBeVisible();
    });
  });
});
