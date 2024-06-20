-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Contatos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Contatos` (
  `id_contato` INT NOT NULL AUTO_INCREMENT,
  `celular_contato` VARCHAR(11) NOT NULL,
  `email_contato` VARCHAR(70) NOT NULL,
  `tipo_contato` VARCHAR(12) NOT NULL,
  PRIMARY KEY (`id_contato`),
  UNIQUE INDEX `id_contato_UNIQUE` (`id_contato` ASC) VISIBLE,
  UNIQUE INDEX `celular_contato_UNIQUE` (`celular_contato` ASC) VISIBLE,
  UNIQUE INDEX `email_contato_UNIQUE` (`email_contato` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Enderecos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Enderecos` (
  `id_endereco` INT NOT NULL AUTO_INCREMENT,
  `cep_endereco` VARCHAR(45) NOT NULL,
  `numero_endereco` VARCHAR(5) NOT NULL,
  `complemento_endereco` VARCHAR(200) NOT NULL,
  `tipo_endereco` VARCHAR(12) NOT NULL,
  PRIMARY KEY (`id_endereco`),
  UNIQUE INDEX `id_endereco_UNIQUE` (`id_endereco` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Clientes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Clientes` (
  `id_cliente` INT NOT NULL AUTO_INCREMENT,
  `senha_cliente` VARCHAR(45) NOT NULL,
  `datanasc_cliente` DATE NOT NULL,
  `nome_cliente` VARCHAR(70) NOT NULL,
  `cpf_cliente` VARCHAR(11) NOT NULL,
  `perfil_cliente` VARCHAR(35) NOT NULL,
  `Contatos_id_contato` INT NOT NULL,
  `Enderecos_id_endereco` INT NOT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE INDEX `idcliente_UNIQUE` (`id_cliente` ASC) VISIBLE,
  UNIQUE INDEX `Clientescol2_UNIQUE` (`perfil_cliente` ASC) VISIBLE,
  UNIQUE INDEX `cpf_cliente_UNIQUE` (`cpf_cliente` ASC) VISIBLE,
  INDEX `fk_Clientes_Contatos1_idx` (`Contatos_id_contato` ASC) VISIBLE,
  INDEX `fk_Clientes_Enderecos1_idx` (`Enderecos_id_endereco` ASC) VISIBLE,
  CONSTRAINT `fk_Clientes_Contatos1`
    FOREIGN KEY (`Contatos_id_contato`)
    REFERENCES `mydb`.`Contatos` (`id_contato`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Clientes_Enderecos1`
    FOREIGN KEY (`Enderecos_id_endereco`)
    REFERENCES `mydb`.`Enderecos` (`id_endereco`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Destinatarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Destinatarios` (
  `id_destinatario` INT NOT NULL AUTO_INCREMENT,
  `nome_destinatario` VARCHAR(45) NOT NULL,
  `Contatos_id_contato` INT NOT NULL,
  `Enderecos_id_endereco` INT NOT NULL,
  PRIMARY KEY (`id_destinatario`),
  UNIQUE INDEX `id_destinatario_UNIQUE` (`id_destinatario` ASC) VISIBLE,
  INDEX `fk_Destinatarios_Contatos1_idx` (`Contatos_id_contato` ASC) VISIBLE,
  INDEX `fk_Destinatarios_Enderecos1_idx` (`Enderecos_id_endereco` ASC) VISIBLE,
  CONSTRAINT `fk_Destinatarios_Contatos1`
    FOREIGN KEY (`Contatos_id_contato`)
    REFERENCES `mydb`.`Contatos` (`id_contato`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Destinatarios_Enderecos1`
    FOREIGN KEY (`Enderecos_id_endereco`)
    REFERENCES `mydb`.`Enderecos` (`id_endereco`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Categorias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Categorias` (
  `id_categoria` INT NOT NULL,
  `titulo_categoria` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE INDEX `id_categoria_UNIQUE` (`id_categoria` ASC) VISIBLE,
  UNIQUE INDEX `titulo_categoria_UNIQUE` (`titulo_categoria` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Subcategorias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Subcategorias` (
  `id_subcategoria` INT NOT NULL,
  `titulo_subactegoria` VARCHAR(45) NOT NULL,
  `Categorias_id_categoria` INT NOT NULL,
  PRIMARY KEY (`id_subcategoria`),
  UNIQUE INDEX `id_subcategoria_UNIQUE` (`id_subcategoria` ASC) VISIBLE,
  UNIQUE INDEX `titulo_subactegoria_UNIQUE` (`titulo_subactegoria` ASC) VISIBLE,
  INDEX `fk_Subcategorias_Categorias1_idx` (`Categorias_id_categoria` ASC) VISIBLE,
  CONSTRAINT `fk_Subcategorias_Categorias1`
    FOREIGN KEY (`Categorias_id_categoria`)
    REFERENCES `mydb`.`Categorias` (`id_categoria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Pedidos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Pedidos` (
  `id_pedidos` INT NOT NULL AUTO_INCREMENT,
  `data_pedido` DATETIME NOT NULL,
  `Clientes_id_cliente` INT NOT NULL,
  `Destinatarios_id_destinatario` INT NOT NULL,
  PRIMARY KEY (`id_pedidos`),
  UNIQUE INDEX `id_pedidos_UNIQUE` (`id_pedidos` ASC) VISIBLE,
  INDEX `fk_Pedidos_Clientes1_idx` (`Clientes_id_cliente` ASC) VISIBLE,
  INDEX `fk_Pedidos_Destinatarios2_idx` (`Destinatarios_id_destinatario` ASC) VISIBLE,
  CONSTRAINT `fk_Pedidos_Clientes1`
    FOREIGN KEY (`Clientes_id_cliente`)
    REFERENCES `mydb`.`Clientes` (`id_cliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Pedidos_Destinatarios2`
    FOREIGN KEY (`Destinatarios_id_destinatario`)
    REFERENCES `mydb`.`Destinatarios` (`id_destinatario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Produtos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Produtos` (
  `id_prod_art` INT NOT NULL AUTO_INCREMENT,
  `qtde_estoque_prod_art` INT NOT NULL,
  `imagens_prod_art` VARCHAR(500) NOT NULL,
  `titulo_prod_art` VARCHAR(80) NOT NULL,
  `descricao_prod_art` VARCHAR(2000) NOT NULL,
  `valor_unitario_prod_art` DECIMAL(9,2) NOT NULL,
  `Categorias_id_categoria` INT NOT NULL,
  PRIMARY KEY (`id_prod_art`),
  UNIQUE INDEX `id_prod_art_UNIQUE` (`id_prod_art` ASC) VISIBLE,
  UNIQUE INDEX `imagens_prod_art_UNIQUE` (`imagens_prod_art` ASC) VISIBLE,
  INDEX `fk_Prod_art_Categorias1_idx` (`Categorias_id_categoria` ASC) VISIBLE,
  CONSTRAINT `fk_Prod_art_Categorias1_new` FOREIGN KEY (`Categorias_id_categoria`) REFERENCES `mydb`.`Categorias` (`id_categoria`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Caso_Empresa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Caso_Empresa` (
  `id_caso_empresa` INT NOT NULL,
  `is_Empresa` TINYINT(1) NOT NULL,
  `razao_social_empresa` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id_caso_empresa`),
  UNIQUE INDEX `razao_social_empresa_UNIQUE` (`razao_social_empresa` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Artistas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Artistas` (
  `id_artista` INT NOT NULL AUTO_INCREMENT,
  `senha_artista` VARCHAR(45) NOT NULL,
  `datanasc_artista` DATE NOT NULL,
  `nome_artista` VARCHAR(70) NOT NULL,
  `cpf_artista` VARCHAR(11) NOT NULL,
  `perfil_artista` VARCHAR(35) NOT NULL,
  `Contatos_id_contato` INT NOT NULL,
  `Enderecos_id_endereco` INT NOT NULL,
  `Caso_Empresa_id_caso_empresa` INT NOT NULL,
  UNIQUE INDEX `id_artistas_UNIQUE` (`id_artista` ASC) VISIBLE,
  PRIMARY KEY (`id_artista`),
  UNIQUE INDEX `senha_artista_UNIQUE` (`senha_artista` ASC) VISIBLE,
  UNIQUE INDEX `cpf_artista_UNIQUE` (`cpf_artista` ASC) VISIBLE,
  UNIQUE INDEX `perfil_cliente_UNIQUE` (`perfil_artista` ASC) VISIBLE,
  INDEX `fk_Artistas_Contatos1_idx` (`Contatos_id_contato` ASC) VISIBLE,
  INDEX `fk_Artistas_Enderecos1_idx` (`Enderecos_id_endereco` ASC) VISIBLE,
  INDEX `fk_Artistas_Caso_Empresa1_idx` (`Caso_Empresa_id_caso_empresa` ASC) VISIBLE,
  CONSTRAINT `fk_Artistas_Contatos1`
    FOREIGN KEY (`Contatos_id_contato`)
    REFERENCES `mydb`.`Contatos` (`id_contato`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Artistas_Enderecos1`
    FOREIGN KEY (`Enderecos_id_endereco`)
    REFERENCES `mydb`.`Enderecos` (`id_endereco`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Artistas_Caso_Empresa1`
    FOREIGN KEY (`Caso_Empresa_id_caso_empresa`)
    REFERENCES `mydb`.`Caso_Empresa` (`id_caso_empresa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Pedidos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Pedidos` (
  `id_pedidos` INT NOT NULL AUTO_INCREMENT,
  `data_pedido` DATETIME NOT NULL,
  `Clientes_id_cliente` INT NOT NULL,
  `Destinatarios_id_destinatario` INT NOT NULL,
  PRIMARY KEY (`id_pedidos`),
  UNIQUE INDEX `id_pedidos_UNIQUE` (`id_pedidos` ASC) VISIBLE,
  INDEX `fk_Pedidos_Clientes1_idx` (`Clientes_id_cliente` ASC) VISIBLE,
  INDEX `fk_Pedidos_Destinatarios2_idx` (`Destinatarios_id_destinatario` ASC) VISIBLE,
  CONSTRAINT `fk_Pedidos_Clientes1`
    FOREIGN KEY (`Clientes_id_cliente`)
    REFERENCES `mydb`.`Clientes` (`id_cliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Pedidos_Destinatarios2`
    FOREIGN KEY (`Destinatarios_id_destinatario`)
    REFERENCES `mydb`.`Destinatarios` (`id_destinatario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;