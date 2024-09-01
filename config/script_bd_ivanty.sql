-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema bxohkcfjzaajxnfbayyw
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema bxohkcfjzaajxnfbayyw
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bxohkcfjzaajxnfbayyw` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `bxohkcfjzaajxnfbayyw` ;

-- -----------------------------------------------------
-- Table `bxohkcfjzaajxnfbayyw`.`clientes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bxohkcfjzaajxnfbayyw`.`Clientes` (
  `id_cliente` INT NOT NULL AUTO_INCREMENT,
  `senha_cliente` VARCHAR(100) NOT NULL,
  `datanasc_cliente` DATE NOT NULL,
  `nome_cliente` VARCHAR(70) NOT NULL,
  `cpf_cliente` VARCHAR(11) NOT NULL,
  `perfil_cliente` VARCHAR(35) NULL DEFAULT NULL,
  `email_cliente` VARCHAR(70) NOT NULL,
  `telefone_cliente` VARCHAR(11) NOT NULL,
  `tipo_cliente` ENUM('cliente', 'artista', 'adm') NOT NULL DEFAULT 'cliente',
  `foto_cliente` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE INDEX `id_cliente_UNIQUE` (`id_cliente` ASC) VISIBLE,
  UNIQUE INDEX `cpf_cliente_UNIQUE` (`cpf_cliente` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 30
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `bxohkcfjzaajxnfbayyw`.`enderecos`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `bxohkcfjzaajxnfbayyw`.`Enderecos` (
  `id_endereco` INT NOT NULL AUTO_INCREMENT,
  `cep_endereco` VARCHAR(45) NOT NULL,
  `numero_endereco` VARCHAR(5) NOT NULL,
  `complemento_endereco` VARCHAR(200) NULL DEFAULT NULL,
  `tipo_endereco` VARCHAR(12) NOT NULL,
  PRIMARY KEY (`id_endereco`),
  UNIQUE INDEX `id_endereco_UNIQUE` (`id_endereco` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bxohkcfjzaajxnfbayyw`.`obras`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bxohkcfjzaajxnfbayyw`.`Obras` (
  `id_obra` INT NOT NULL AUTO_INCREMENT,
  `titulo_obra` VARCHAR(100) NOT NULL,
  `descricao_obra` TEXT NOT NULL,
  `ano_criacao` YEAR NOT NULL,
  `id_cliente` INT NOT NULL,
  `imagem_obra` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id_obra`),
  UNIQUE INDEX `id_obra_UNIQUE` (`id_obra` ASC) VISIBLE,
  INDEX `fk_Obras_Clientes1_idx` (`id_cliente` ASC) VISIBLE,
  CONSTRAINT `fk_Obras_Clientes1`
    FOREIGN KEY (`id_cliente`)
    REFERENCES `bxohkcfjzaajxnfbayyw`.`Clientes` (`id_cliente`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
