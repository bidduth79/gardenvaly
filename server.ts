/**
 * @file server.ts
 * @description Main server entry point for Gardenvaly — by Hasna Hena.
 * Mounts hardened Express REST API, security middleware, and Vite middlewares.
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './server/routes/index.ts';
import { errorHandler} from './server/middleware/errorHandler.ts';
import {
  securityHeadersMiddleware, inputSanitizationMiddleware, apiRateLimiter} from './server/middleware/security.ts';
import { ENV} from './server/config/env.ts';

import fs from 'fs';
import { seoService} from './server/services/seoService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = ENV.PORT || 3000;

  // 1. Trust proxy for Cloud Run and reverse proxies (essential for accurate IP rate limiting)
  app.set('trust proxy', 1);

  // 2. Security Headers (Clickjacking, MIME Sniffing, XSS protection)
  app.use(securityHeadersMiddleware);

  // 3. Hardened CORS configuration
  app.use(
    cors({
      origin: true, // Reflects the request origin while allowing pre-configured requests
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
      credentials: true,
      maxAge: 86400, // 24 hours preflight cache
    })
  );

  // 4. Request Body Parsers with payload size limits to protect against DoS attacks
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // 5. Input Sanitization (strips malicious injections and script tags)
  app.use(inputSanitizationMiddleware);

  // 6. REST API Routes with global API rate limiter
  app.use('/api', apiRateLimiter, apiRouter);

  // 7. SEO Endpoints: robots.txt and sitemap.xml
  app.get('/robots.txt', (req, res) => {
    const baseUrl = seoService.getBaseUrl(req);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(seoService.generateRobotsTxt(baseUrl));
  });

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = seoService.getBaseUrl(req);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(seoService.generateSitemapXml(baseUrl));
  });

  // Google Search Console HTML verification file handler
  app.get(/^\/google([a-zA-Z0-9_-]+)\.html$/, (req, res, next) => {
    const requestedToken = req.params[0];
    const configuredToken = (ENV.GOOGLE_SITE_VERIFICATION || '').replace(/^google-site-verification=/i, '');
    if (configuredToken && requestedToken === configuredToken) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(`google-site-verification: google${configuredToken}.html`);
    }
    next();
  });

  // 8. Frontend Integration with SEO-aware Head Injection
  if (process.env.NODE_ENV !== 'production') {
    // Development: Vite middleware integration with dynamic HTML head transform
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.get('*', async (req, res, next) => {
      // Skip API, Vite internal asset routes, and direct asset files with file extensions
      if (
        req.path.startsWith('/api') ||
        req.path.startsWith('/@') ||
        req.path.startsWith('/node_modules') ||
        /\.(js|mjs|ts|tsx|css|json|ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/i.test(req.path)
      ) {
        return next();
      }
      try {
        const templatePath = path.resolve(__dirname, 'index.html');
        if (!fs.existsSync(templatePath)) return next();
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);

        const baseUrl = seoService.getBaseUrl(req);
        const lang = req.query.lang === 'en' ? 'en' : 'bn';
        const seoData = seoService.getPageSeoData(req.path, lang, baseUrl);
        const html = seoService.injectSeoIntoHtml(template, seoData);

        res.status(seoData.statusCode || 200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production: Serve static assets with dynamic HTML head injection
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath, { index: false }));

    app.get('*', (req, res, next) => {
      if (
        req.path.startsWith('/api') ||
        /\.(js|mjs|css|json|ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/i.test(req.path)
      ) {
        return next();
      }
      const indexPath = path.join(distPath, 'index.html');
      if (!fs.existsSync(indexPath)) return next();

      try {
        const template = fs.readFileSync(indexPath, 'utf-8');
        const baseUrl = seoService.getBaseUrl(req);
        const lang = req.query.lang === 'en' ? 'en' : 'bn';
        const seoData = seoService.getPageSeoData(req.path, lang, baseUrl);
        const html = seoService.injectSeoIntoHtml(template, seoData);

        res.status(seoData.statusCode || 200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(html);
      } catch (err) {
        next(err);
      }
    });
  }

  // 9. Centralized Error Handling
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 Gardenvaly Server active on http://0.0.0.0:${PORT}`);
    console.log(`📡 REST API mounted at http://0.0.0.0:${PORT}/api`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
