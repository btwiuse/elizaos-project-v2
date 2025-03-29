FROM btwiuse/arch:dev

COPY . /app

WORKDIR /app

RUN bun i

RUN bun run build

CMD ["bun", "start"]
