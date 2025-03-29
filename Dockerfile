FROM btwiuse/arch:elizaos

COPY . /app

WORKDIR /app

RUN bun i

RUN bun run build

EXPOSE 3000

CMD echo | elizaos start
