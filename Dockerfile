FROM btwiuse/arch:bun

COPY . /app

WORKDIR /

RUN bash /app/setup-eliza

WORKDIR /app

RUN bun i

RUN bun run build

CMD ["elizaos", "start"]
