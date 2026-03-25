-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sistema_inventario
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias`
--
CREATE DATABASE IF NOT EXISTS sistema_inventario;
USE sistema_inventario;

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text,
  `estado` tinyint DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'otra','sdaaaaaaa',-1),(2,'cpmprobado','ahora no skdnaksda',-1),(3,'holaasds','ajajjajaja',-1),(4,'Bebidas','Bebidas enlatadas y desechables Bebidas enlatadas y desechables Bebidas enlatadas y desechables ',-1),(5,'Prueba','sdaaaaaaa',-1),(6,'actua ahora','ahora no',-1),(7,'actua ahora','ahora no',-1),(8,'actua ahora','ahora no',-1),(9,'funciona?','ahora no',-1),(10,'hahahaha2','asdasadsasdasadsasdasadsasdasadsasdasadsasdasadsasdasadsasdasadsasdasadsasdasads',1),(11,'hahahah','ahora no skdnaksda',1),(12,'actuuu','e mmmmmmmmm',-1),(13,'asasdsdsdw2','asdasdad',-1),(14,'actuu','sdsds',1),(15,'no se mass','adasasasda',1),(16,'una nm','sajdnajdnajsd',-1),(17,'no mas mas','moda sidjasd asjdnasd',-1),(18,'noasndaodnaj','asdinasjda',-1),(19,'Bebidas','bebidas enlatadas y de vidrio',1);
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalles_movimiento`
--

DROP TABLE IF EXISTS `detalles_movimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_movimiento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `sub_total` decimal(10,2) NOT NULL,
  `id_producto` int NOT NULL,
  `id_movimiento` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_producto` (`id_producto`),
  KEY `id_movimiento` (`id_movimiento`),
  CONSTRAINT `detalles_movimiento_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`),
  CONSTRAINT `detalles_movimiento_ibfk_2` FOREIGN KEY (`id_movimiento`) REFERENCES `movimientos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_movimiento`
--

LOCK TABLES `detalles_movimiento` WRITE;
/*!40000 ALTER TABLE `detalles_movimiento` DISABLE KEYS */;
INSERT INTO `detalles_movimiento` VALUES (1,1,1.00,1.00,12,5),(2,1,2.00,2.00,5,5),(3,10,2.00,20.00,9,6),(4,6,1.00,6.00,12,7),(5,4,12.00,48.00,14,8),(6,1,2.00,2.00,5,8),(7,1,13.00,13.00,13,8),(8,8,1.00,8.00,12,9),(9,4,2.00,8.00,8,10),(10,6,1.00,6.00,12,11),(11,1,1.00,1.00,12,12);
/*!40000 ALTER TABLE `detalles_movimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_movimiento`
--

DROP TABLE IF EXISTS `estado_movimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_movimiento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_movimiento`
--

LOCK TABLES `estado_movimiento` WRITE;
/*!40000 ALTER TABLE `estado_movimiento` DISABLE KEYS */;
INSERT INTO `estado_movimiento` VALUES (2,'Cancelado'),(1,'Completado'),(4,'Pendiente'),(3,'Rechazado');
/*!40000 ALTER TABLE `estado_movimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientos`
--

DROP TABLE IF EXISTS `movimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `total_movimiento` decimal(10,2) NOT NULL,
  `descripcion` text,
  `estado_registro` tinyint DEFAULT '1',
  `id_tipo_movimiento` int NOT NULL,
  `id_estado_movimiento` int NOT NULL,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_tipo_movimiento` (`id_tipo_movimiento`),
  KEY `id_estado_movimiento` (`id_estado_movimiento`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`id_tipo_movimiento`) REFERENCES `tipos_movimiento` (`id`),
  CONSTRAINT `movimientos_ibfk_2` FOREIGN KEY (`id_estado_movimiento`) REFERENCES `estado_movimiento` (`id`),
  CONSTRAINT `movimientos_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos`
--

LOCK TABLES `movimientos` WRITE;
/*!40000 ALTER TABLE `movimientos` DISABLE KEYS */;
INSERT INTO `movimientos` VALUES (1,'2026-02-03 14:58:56',7.00,'Venta desde panel',1,1,1,10),(2,'2026-02-03 15:02:24',2.00,'Venta desde panel',1,1,1,10),(5,'2026-02-03 15:08:59',3.00,'Venta desde panel',1,1,1,10),(6,'2026-02-03 15:10:30',20.00,'Venta desde panel',1,1,1,10),(7,'2026-02-03 16:28:05',6.00,'ajajajajaj',1,1,1,10),(8,'2026-02-03 16:51:10',63.00,'Venta desde panel',1,1,1,10),(9,'2026-02-03 16:51:19',8.00,'Venta desde panel',1,1,1,10),(10,'2026-02-04 21:52:58',8.00,'jajajajaja',1,1,1,27),(11,'2026-02-04 22:43:42',6.00,'Venta desde panel',1,1,1,10),(12,'2026-02-04 22:43:42',1.00,'Venta desde panel',1,1,1,10);
/*!40000 ALTER TABLE `movimientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(10) NOT NULL,
  `nombre` varchar(70) NOT NULL,
  `costo_compra` decimal(10,2) NOT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `estado` tinyint DEFAULT '1',
  `stock` int DEFAULT '0',
  `stock_limite` int DEFAULT '0',
  `create_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id_categoria` int NOT NULL,
  `id_unidad` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_categoria` (`id_categoria`),
  KEY `id_unidad` (`id_unidad`),
  KEY `idx_productos_codigo` (`codigo`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id`),
  CONSTRAINT `productos_ibfk_3` FOREIGN KEY (`id_unidad`) REFERENCES `unidades_medida` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'0001','Caja de jabones',0.70,1.00,-1,15,7,'2026-01-27 17:17:11','2026-01-29 17:42:03',14,3),(5,'0002','Arroz',1.50,2.00,1,18,10,'2026-01-27 17:20:43','2026-02-03 16:51:10',14,1),(6,'0004','Papas',1.50,2.00,1,20,10,'2026-01-27 17:22:20','2026-01-28 17:32:56',15,1),(7,'0003','Cocacola',1.50,2.00,0,20,10,'2026-01-27 17:23:20','2026-01-28 17:40:01',15,1),(8,'0005','Pepsi',1.50,2.00,1,16,10,'2026-01-27 17:26:50','2026-02-04 21:52:58',14,1),(9,'0023','Jabon',1.50,2.00,-1,10,10,'2026-01-28 17:21:42','2026-02-03 16:37:13',14,1),(11,'0001','Caja de jabones',0.70,1.00,-1,15,7,'2026-01-29 00:19:56','2026-01-29 17:42:06',14,3),(12,'0001','Caja de jabones editr',0.69,1.00,1,49,7,'2026-01-29 00:35:43','2026-02-14 22:43:01',14,2),(13,'0026','cositas',0.50,1.00,1,25,22,'2026-01-29 16:46:50','2026-02-14 22:39:45',10,3),(14,'0029','aisjdnajdsn',12.00,12.00,1,8,12,'2026-01-29 16:47:12','2026-02-03 16:51:10',13,2),(15,'0033','Cepillos',7.00,8.00,1,3,4,'2026-01-29 16:47:52','2026-02-14 23:08:16',10,3),(16,'0044','123123111',4.00,5.00,1,12,12,'2026-01-29 16:48:08','2026-02-14 22:40:20',10,2),(17,'8998','ajsn',2.00,3.00,1,49,200,'2026-02-04 21:55:13','2026-02-14 22:40:30',15,3);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(150) NOT NULL,
  `nombre_encargado` varchar(150) DEFAULT NULL,
  `telefono_empresa` varchar(20) DEFAULT NULL,
  `telefono_encargado` varchar(20) DEFAULT NULL,
  `correo_empresa` varchar(150) DEFAULT NULL,
  `direccion` text,
  `estado` tinyint DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo_empresa` (`correo_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token_hash` text NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `expired_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `refresh_token_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

LOCK TABLES `refresh_token` WRITE;
/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
INSERT INTO `refresh_token` VALUES (14,'$2b$10$DOX4a3eaBhT19sqn63pthuVzMEWXBiOevdOohFL61rYfrLFyxsUVy',10,'2000-12-12 06:00:00'),(18,'$2b$10$0JeUAT6tKQnefLWWqWcJe.fdCkWYMFsQyik4wj511gfX8ELMvLaZG',11,'2000-12-12 06:00:00'),(19,'$2b$10$XIq.BHnzh9pF6qVLuhm2X.ztE/e3otjJuDsDq92u/QrDU0CxfjQW.',12,'2000-12-12 06:00:00'),(20,'$2b$10$jsjLFQOYlkOUfIxABat.huEwSnYyPT4vawWWhwJJJarDWOdGlhOP6',14,'2000-12-12 06:00:00'),(21,'$2b$10$ALeKdHorNNL6G8hG9W9CJO9nYlurlLhZdeyH8lzAuXvOl3JjrBlT.',1,'2000-12-12 06:00:00'),(22,'$2b$10$UsiRorbrKZt.6nwgmw0aj.ejOAuJRoAFXXTSp3gz9jTamDJFczz7O',27,'2000-12-12 06:00:00');
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador'),(3,'Bodega'),(2,'Cajero');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_movimiento`
--

DROP TABLE IF EXISTS `tipos_movimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_movimiento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tipo` (`tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_movimiento`
--

LOCK TABLES `tipos_movimiento` WRITE;
/*!40000 ALTER TABLE `tipos_movimiento` DISABLE KEYS */;
INSERT INTO `tipos_movimiento` VALUES (1,'Venta');
/*!40000 ALTER TABLE `tipos_movimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unidades_medida`
--

DROP TABLE IF EXISTS `unidades_medida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unidades_medida` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `estado` tinyint DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidades_medida`
--

LOCK TABLES `unidades_medida` WRITE;
/*!40000 ALTER TABLE `unidades_medida` DISABLE KEYS */;
INSERT INTO `unidades_medida` VALUES (1,'kilogramo',-1),(2,'libra',1),(3,'Unidad',1),(4,'aja',-1);
/*!40000 ALTER TABLE `unidades_medida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `estado` tinyint DEFAULT '1',
  `create_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id_rol` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'actualizado2','$2b$10$DC0t6AcVIBtRbTau4WW9ROmZLGoC5Vzzgi38Oxtmm97Ua1r44fHDq','actu2@gmail.com','23245262',-1,'2025-12-06 00:07:52','2026-01-12 23:13:05',3),(9,'Obed Isai aquino martinez','$2b$10$bEKCn0ie5VTahXaoMHTF8utBkG3jJ0NCbdY1d4NWyRZ7tqCLmVP7q','correo@gmail.com','79485241',-1,'2025-12-06 16:53:20','2026-01-14 15:59:13',2),(10,'Administrador global','$2b$10$a1a3A4caXdRvEye/NVWkZ.QvT68eZ6AK4J61KpX05nLLfGCesXfji','admin@gmail.com','21212828',1,'2025-12-09 21:37:14','2026-01-14 16:04:06',1),(11,'Prueba de nuevo usuario Prueba de nuevo usuario Prueba de nuevo usuario','$2b$10$WcacNewXT5dSGcA.Spy7TuTNLVt22B5Aju.XbUg3NfC0Opl..KULS','bodega@gmail.com','21212821',-1,'2025-12-15 00:32:39','2026-01-26 16:44:04',3),(12,'Cajero nuevo','$2b$10$/TdJBjS046M.ON.J/qPQ0O4qAoyPOjJDa7w9QXT9879gpccL20sbK','cajero@gmail.com','21212820',-1,'2026-01-01 22:22:09','2026-01-14 15:59:08',2),(13,'vamooooooooooo','$2b$10$ftPLrV5DAWHAd1nr5QMVHeI9Ugv.qFKX0xuBUMS7ybis6mqplPGn6','adasdsadda123@gmail.com','21212828',1,'2026-01-05 18:49:42','2026-01-23 23:03:11',1),(14,'prueba','$2b$10$1IdaRq2pJEHVQB9R0M3n5.5N0v4J1LJFfK8Xgo2w1X4IpRh1JZETi','pruebaklk@gmail.com','21212323',-1,'2026-01-08 14:32:42','2026-01-26 16:43:58',3),(15,'sadasda','$2b$10$YM.V.WOx9Ihqx0CqkhlIme3aMoz8osSd/FpW4TqhxVj7ZNqMdT.Ci','as123123das@gmail.com','70232123',-1,'2026-01-08 14:37:22','2026-01-14 15:42:24',3),(16,'asdasda','$2b$10$/dW/a4THCzeGLjtI3jih9OKI2u7ijtWMg/mh8I3qdk9GyvNG12euK','bodega2@gmail.com','21212324',-1,'2026-01-12 20:37:34','2026-01-26 16:38:34',3),(20,'uno mas','$2b$10$Dy4SFL3ukiy//jK82L0jFeI1W0FUij45lybiB/MlB5.S5O58BNdsK','mas@gmail.com','79787622',-1,'2026-01-14 16:25:01','2026-01-14 16:25:44',3),(21,'otra pruebva','$2b$10$sAP1/4WLm9xRIqT7RooxluPfm28e309mql2nwFZHZ3oMkRSxZw4gG','asdasd@gmail.com','21282637',-1,'2026-01-26 16:36:52','2026-01-26 16:37:01',3),(22,'asdasdadsa','$2b$10$Qm1k97.YaSUZ56Ysuz75Ru.vW.E6AnxXX9r.LF2UNHDIXAQ3S8ggS','dasda@gmail.com','29282726',1,'2026-01-26 16:38:24','2026-01-26 16:38:24',1),(23,'dasdadsada','$2b$10$Qztf7D4odRvxy2vkHpaDkeiNAVMGhnFTiY7CtTBjVnQpob7uIR/p2','asdasdad@gmail.com','23212222',-1,'2026-01-26 16:41:11','2026-01-26 16:42:45',3),(24,'asdasda','$2b$10$NN4OT10GgktF2FnZdml1K.X4K97qrRfFUYJrkw9sCQ71lLNBkVPey','sd1231@gmail.com','27282727',1,'2026-01-26 16:43:03','2026-01-26 16:43:03',1),(25,'sdadasd','$2b$10$ji9sbBIvJbH81ULYqSRPUeMLeT/ikry5TVJ9LTXYlwUHkD/J7HT0O','asweq2@gmail.com','22242563',1,'2026-01-26 16:43:34','2026-01-26 16:43:34',1),(27,'emplooyed','$2b$10$BFwnYRFj5LM2MA5t560u0Ohkpjl6igGZ2cive4859shCX.aT7NaTG','empleado@gmail.com','23909878',1,'2026-02-03 16:52:19','2026-02-03 16:52:19',3);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-24 22:33:11
