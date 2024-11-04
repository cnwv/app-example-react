class TelegramValidator {
    constructor() {
        this.validated = false;
    }

    async init() {
        // Проверяем, запущено ли приложение в Telegram
        if (!window.Telegram?.WebApp) {
            this.handleNonTelegramUser();
            return false;
        }

        try {
            const initData = window.Telegram.WebApp.initData;
            if (!initData) {
                this.handleNonTelegramUser();
                return false;
            }

            const isValid = await this.validateWithServer(initData);
            if (!isValid) {
                this.handleNonTelegramUser();
                return false;
            }

            this.validated = true;
            return true;
        } catch (error) {
            console.error('Validation error:', error);
            this.handleNonTelegramUser();
            return false;
        }
    }

    async validateWithServer(initData) {
        try {
            const response = await fetch('https://dry-foxes-kneel.loca.lt/validate-telegram-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ initData })
            });

            if (!response.ok) {
                throw new Error('Validation failed');
            }

            const data = await response.json();
            return data.valid;
        } catch (error) {
            console.error('Server validation error:', error);
            return false;
        }
    }

    handleNonTelegramUser() {
        // Скрываем содержимое страницы
        document.body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                text-align: center;
                padding: 20px;
                background-color: #f8f9fa;
            ">
                <div>
                    <h1 style="color: #dc3545; margin-bottom: 20px;">
                        Доступ запрещен (403)
                    </h1>
                    <p style="color: #6c757d;">
                        Это приложение доступно только через Telegram.
                    </p>
                </div>
            </div>
        `;
    }

    isValidated() {
        return this.validated;
    }
}

// Использование:
const telegramValidator = new TelegramValidator();

// При загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    const isValid = await telegramValidator.init();
    if (!isValid) {
        // Страница уже заменена на сообщение об ошибке
        return;
    }
    // Продолжаем инициализацию вашего приложения
    initApp();
});

function initApp() {
    // Здесь ваш код инициализации приложения
    console.log('App initialized for Telegram user');
}