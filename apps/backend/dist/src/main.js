"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const port = process.env.PORT || 3001;
    const host = process.env.HOST || '0.0.0.0';
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3002',
            'https://web-pi-seven-74.vercel.app',
            'https://web-es8c4bnwx-rohit-lokhandes-projects.vercel.app',
            process.env.FRONTEND_URL
        ].filter(Boolean),
        credentials: true,
    });
    await app.listen(port, host);
    console.log(`\n✅ Backend API running at http://${host}:${port}\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map