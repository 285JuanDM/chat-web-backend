FROM node:20

WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar la carpeta Prisma antes del resto del código (para cache)
COPY prisma ./prisma

# Generar Prisma Client
RUN npx prisma generate

# Copiar el resto del código
COPY . .

EXPOSE 3000

# Primer comando: sincronizar schema a PostgreSQL
# Segundo comando: iniciar servidor Node
CMD npx prisma db push && npm start
