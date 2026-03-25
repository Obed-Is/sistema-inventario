FROM mysql:8.0

COPY ./sistema_inventario_db.sql /docker-entrypoint-initdb.d/