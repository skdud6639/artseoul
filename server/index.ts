import 'dotenv/config';
import express from 'express';
import { resolve } from 'node:path';
import { createInquiryApp } from './app.ts';

const { app, close } = createInquiryApp();
const staticPath = resolve('dist');
app.use(express.static(staticPath, { index: false, dotfiles: 'deny' }));
app.get('*', (_req, res) => {
  res.sendFile(resolve(staticPath, 'index.html'));
});
const server = app.listen(3000, '0.0.0.0', () => {
  console.info('ART SEOUL server listening on port 3000');
});
server.on('error', (error) => {
  close();
  console.error('Unable to start ART SEOUL server:', error.message);
  process.exitCode = 1;
});
function shutdown() {
  server.close(() => {
    close();
    process.exitCode = 0;
  });
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
