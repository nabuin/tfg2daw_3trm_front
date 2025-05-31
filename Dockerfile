# version de node que tengo en mi pc y que se que funciona
FROM node:18 as construccion

WORKDIR /app

# copia de los archivos de configuracion 
COPY package*.json ./

# instalacion de dependencias del package.json y package-lock.json del paso anterior
RUN npm i

# copiar todos los archivos de la raiz (primer punto) al directorio actual (segundo punto)
COPY . .

# ejecucion en modo producion, previamente asegurarse de tener  build --mode production en package.json
RUN npm run build 

# Etapa de producción
FROM nginx:alpine as produccion

# Copiar los archivos ya montados en la ruta default del nginx para mostrar las paginas (habrá que crear y cambiar un fichero .conf del nginx para manejar bien las rutas por defecto)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=construccion /app/dist /usr/share/nginx/html

# puerto de la derecha en el docker run, cuando se le añada certificado ssl habrá q cambiarlo al 443
EXPOSE 80

# Comando para iniciar el nginx
CMD ["nginx", "-g", "daemon off;"]
