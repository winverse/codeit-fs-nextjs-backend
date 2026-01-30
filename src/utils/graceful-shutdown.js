export const setupGracefulShutdown = (server, prisma) => {
  const shutdown = async (signal) => {
    console.log(`\n${signal} 신호를 받았습니다. 서버를 종료합니다...`);

    server.close(async () => {
      console.log('HTTP 서버가 종료되었습니다.');

      await prisma.$disconnect();
      console.log('데이터베이스 연결이 종료되었습니다.');

      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};
