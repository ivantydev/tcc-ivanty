-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8mb4 ;
USE `mydb`;

-- -----------------------------------------------------
-- Table `mydb`.`Artistas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Artistas`;
CREATE TABLE IF NOT EXISTS `Artistas` (
  `id_artista` INT NOT NULL AUTO_INCREMENT,
  `senha_artista` VARCHAR(45) NOT NULL,
  `datanasc_artista` DATE NOT NULL,
  `nome_artista` VARCHAR(70) NOT NULL,
  `cpf_artista` VARCHAR(11) NOT NULL,
  `perfil_artista` VARCHAR(35) NOT NULL,
  `Contatos_id_contato` INT NOT NULL,
  `Enderecos_id_endereco` INT NOT NULL,
  `Caso_Empresa_id_caso_empresa` INT NOT NULL,
  PRIMARY KEY (`id_artista`),
  UNIQUE INDEX `id_artistas_UNIQUE` (`id_artista` ASC),
  UNIQUE INDEX `senha_artista_UNIQUE` (`senha_artista` ASC),
  UNIQUE INDEX `cpf_artista_UNIQUE` (`cpf_artista` ASC),
  UNIQUE INDEX `perfil_cliente_UNIQUE` (`perfil_artista` ASC),
  INDEX `fk_Artistas_Contatos1_idx` (`Contatos_id_contato` ASC),
  INDEX `fk_Artistas_Enderecos1_idx` (`Enderecos_id_endereco` ASC),
  INDEX `fk_Artistas_Caso_Empresa1_idx` (`Caso_Empresa_id_caso_empresa` ASC),
  CONSTRAINT `fk_Artistas_Contatos1`
    FOREIGN KEY (`Contatos_id_contato`)
    REFERENCES `Contatos` (`id_contato`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Artistas_Enderecos1`
    FOREIGN KEY (`Enderecos_id_endereco`)
    REFERENCES `Enderecos` (`id_endereco`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Artistas_Caso_Empresa1`
    FOREIGN KEY (`Caso_Empresa_id_caso_empresa`)
    REFERENCES `Caso_Empresa` (`id_caso_empresa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Caso_Empresa`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Caso_Empresa`;
CREATE TABLE IF NOT EXISTS `Caso_Empresa` (
  `id_caso_empresa` INT NOT NULL,
  `is_Empresa` TINYINT(1) NOT NULL,
  `razao_social_empresa` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id_caso_empresa`),
  UNIQUE INDEX `razao_social_empresa_UNIQUE` (`razao_social_empresa` ASC)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Categorias`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Categorias`;
CREATE TABLE IF NOT EXISTS `Categorias` (
  `id_categoria` INT NOT NULL,
  `titulo_categoria` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE INDEX `id_categoria_UNIQUE` (`id_categoria` ASC),
  UNIQUE INDEX `titulo_categoria_UNIQUE` (`titulo_categoria` ASC)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Clientes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Clientes`;
CREATE TABLE IF NOT EXISTS `Clientes` (
  `id_cliente` INT NOT NULL AUTO_INCREMENT,
  `senha_cliente` VARCHAR(100) DEFAULT NULL,
  `datanasc_cliente` DATE NOT NULL,
  `nome_cliente` VARCHAR(70) NOT NULL,
  `cpf_cliente` VARCHAR(11) NOT NULL,
  `perfil_cliente` VARCHAR(35) NOT NULL,
  `email_cliente` VARCHAR(70) NOT NULL,
  `telefone_cliente` VARCHAR(11) NOT NULL,
  `Enderecos_id_endereco` INT NOT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE INDEX `idcliente_UNIQUE` (`id_cliente` ASC),
  UNIQUE INDEX `Clientescol2_UNIQUE` (`perfil_cliente` ASC),
  UNIQUE INDEX `cpf_cliente_UNIQUE` (`cpf_cliente` ASC),
  INDEX `fk_Clientes_Enderecos1_idx` (`Enderecos_id_endereco` ASC),
  CONSTRAINT `fk_Clientes_Enderecos1`
    FOREIGN KEY (`Enderecos_id_endereco`)
    REFERENCES `Enderecos` (`id_endereco`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Destinatarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Destinatarios`;
CREATE TABLE IF NOT EXISTS `Destinatarios` (
  `id_destinatario` INT NOT NULL AUTO_INCREMENT,
  `nome_destinatario` VARCHAR(45) NOT NULL,
  `Contatos_id_contato` INT NOT NULL,
  `Enderecos_id_endereco` INT NOT NULL,
  PRIMARY KEY (`id_destinatario`),
  UNIQUE INDEX `id_destinatario_UNIQUE` (`id_destinatario` ASC),
  INDEX `fk_Destinatarios_Contatos1_idx` (`Contatos_id_contato` ASC),
  INDEX `fk_Destinatarios_Enderecos1_idx` (`Enderecos_id_endereco` ASC),
  CONSTRAINT `fk_Destinatarios_Contatos1`
    FOREIGN KEY (`Contatos_id_contato`)
    REFERENCES `Contatos` (`id_contato`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Destinatarios_Enderecos1`
    FOREIGN KEY (`Enderecos_id_endereco`)
    REFERENCES `Enderecos` (`id_endereco`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Enderecos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Enderecos`;
CREATE TABLE IF NOT EXISTS `Enderecos` (
  `id_endereco` INT NOT NULL AUTO_INCREMENT,
  `cep_endereco` VARCHAR(45) NOT NULL,
  `numero_endereco` VARCHAR(5) NOT NULL,
  `complemento_endereco` VARCHAR(200) NOT NULL,
  `tipo_endereco` VARCHAR(12) NOT NULL,
  PRIMARY KEY (`id_endereco`),
  UNIQUE INDEX `id_endereco_UNIQUE` (`id_endereco` ASC)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Pedidos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Pedidos`;
CREATE TABLE IF NOT EXISTS `Pedidos` (
  `id_pedidos` INT NOT NULL AUTO_INCREMENT,
  `data_pedido` DATETIME NOT NULL,
  `Clientes_id_cliente` INT NOT NULL,
  `Destinatarios_id_destinatario` INT NOT NULL,
  PRIMARY KEY (`id_pedidos`),
  UNIQUE INDEX `id_pedidos_UNIQUE` (`id_pedidos` ASC),
  INDEX `fk_Pedidos_Clientes1_idx` (`Clientes_id_cliente` ASC),
  INDEX `fk_Pedidos_Destinatarios2_idx` (`Destinatarios_id_destinatario` ASC),
  CONSTRAINT `fk_Pedidos_Clientes1`
    FOREIGN KEY (`Clientes_id_cliente`)
    REFERENCES `Clientes` (`id_cliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Pedidos_Destinatarios2`
    FOREIGN KEY (`Destinatarios_id_destinatario`)
    REFERENCES `Destinatarios` (`id_destinatario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Produtos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Produtos`;
CREATE TABLE IF NOT EXISTS `Produtos` (
  `id_prod_art` INT NOT NULL AUTO_INCREMENT,
  `qtde_estoque_prod_art` INT NOT NULL,
  `imagens_prod_art` VARCHAR(500) NOT NULL,
  `titulo_prod_art` VARCHAR(80) NOT NULL,
  `descricao_prod_art` VARCHAR(2000) NOT NULL,
  `valor_unitario_prod_art` DECIMAL(9,2) NOT NULL,
  `Categorias_id_categoria` INT NOT NULL,
  PRIMARY KEY (`id_prod_art`),
  UNIQUE INDEX `id_prod_art_UNIQUE` (`id_prod_art` ASC),
  UNIQUE INDEX `imagens_prod_art_UNIQUE` (`imagens_prod_art` ASC),
  INDEX `fk_Prod_art_Categorias1_idx` (`Categorias_id_categoria` ASC),
  CONSTRAINT `fk_Prod_art_Categorias1_new`
    FOREIGN KEY (`Categorias_id_categoria`)
    REFERENCES `Categorias` (`id_categoria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Subcategorias`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Subcategorias`;
CREATE TABLE IF NOT EXISTS `Subcategorias` (
  `id_subcategoria` INT NOT NULL,
  `titulo_subcategoria` VARCHAR(45) NOT NULL,
  `Categorias_id_categoria` INT NOT NULL,
  PRIMARY KEY (`id_subcategoria`),
  UNIQUE INDEX `id_subcategoria_UNIQUE` (`id_subcategoria` ASC),
  UNIQUE INDEX `titulo_subcategoria_UNIQUE` (`titulo_subcategoria` ASC),
  INDEX `fk_Subcategorias_Categorias1_idx` (`Categorias_id_categoria` ASC),
  CONSTRAINT `fk_Subcategorias_Categorias1`
    FOREIGN KEY (`Categorias_id_categoria`)
    REFERENCES `Categorias` (`id_categoria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Contatos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Contatos`;
CREATE TABLE IF NOT EXISTS `Contatos` (
  `id_contato` INT NOT NULL AUTO_INCREMENT,
  `email_contato` VARCHAR(45) NOT NULL,
  `telefone_contato` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_contato`),
  UNIQUE INDEX `id_contato_UNIQUE` (`id_contato` ASC),
  UNIQUE INDEX `email_contato_UNIQUE` (`email_contato` ASC),
  UNIQUE INDEX `telefone_contato_UNIQUE` (`telefone_contato` ASC)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Imagens`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Imagens`;
CREATE TABLE IF NOT EXISTS `Imagens` (
  `id_imagens` INT NOT NULL AUTO_INCREMENT,
  `caminho_imagens` VARCHAR(255) NOT NULL,
  `Produtos_id_prod_art` INT NOT NULL,
  PRIMARY KEY (`id_imagens`),
  UNIQUE INDEX `id_imagens_UNIQUE` (`id_imagens` ASC),
  INDEX `fk_Imagens_Produtos1_idx` (`Produtos_id_prod_art` ASC),
  CONSTRAINT `fk_Imagens_Produtos1`
    FOREIGN KEY (`Produtos_id_prod_art`)
    REFERENCES `Produtos` (`id_prod_art`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Cupons`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cupons`;
CREATE TABLE IF NOT EXISTS `Cupons` (
  `id_cupons` INT NOT NULL AUTO_INCREMENT,
  `codigo_cupom` VARCHAR(45) NOT NULL,
  `valor_cupom` DECIMAL(9,2) NOT NULL,
  `validade_cupom` DATE NOT NULL,
  PRIMARY KEY (`id_cupons`),
  UNIQUE INDEX `id_cupons_UNIQUE` (`id_cupons` ASC),
  UNIQUE INDEX `codigo_cupom_UNIQUE` (`codigo_cupom` ASC)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Detalhes_Pedido`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Detalhes_Pedido`;
CREATE TABLE IF NOT EXISTS `Detalhes_Pedido` (
  `Pedidos_id_pedidos` INT NOT NULL,
  `Produtos_id_prod_art` INT NOT NULL,
  `qtde_produtos` INT NOT NULL,
  `valor_unitario_det_ped` DECIMAL(9,2) NOT NULL,
  PRIMARY KEY (`Pedidos_id_pedidos`, `Produtos_id_prod_art`),
  INDEX `fk_Detalhes_Pedido_Pedidos1_idx` (`Pedidos_id_pedidos` ASC),
  INDEX `fk_Detalhes_Pedido_Produtos1_idx` (`Produtos_id_prod_art` ASC),
  CONSTRAINT `fk_Detalhes_Pedido_Pedidos1`
    FOREIGN KEY (`Pedidos_id_pedidos`)
    REFERENCES `Pedidos` (`id_pedidos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Detalhes_Pedido_Produtos1`
    FOREIGN KEY (`Produtos_id_prod_art`)
    REFERENCES `Produtos` (`id_prod_art`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Avaliacoes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Avaliacoes`;
CREATE TABLE IF NOT EXISTS `Avaliacoes` (
  `id_avaliacoes` INT NOT NULL AUTO_INCREMENT,
  `comentario_avaliacoes` VARCHAR(2000) NOT NULL,
  `nota_avaliacoes` DECIMAL(2,1) NOT NULL,
  `Pedidos_id_pedidos` INT NOT NULL,
  `Produtos_id_prod_art` INT NOT NULL,
  PRIMARY KEY (`id_avaliacoes`),
  UNIQUE INDEX `id_avaliacoes_UNIQUE` (`id_avaliacoes` ASC),
  INDEX `fk_Avaliacoes_Pedidos1_idx` (`Pedidos_id_pedidos` ASC),
  INDEX `fk_Avaliacoes_Produtos1_idx` (`Produtos_id_prod_art` ASC),
  CONSTRAINT `fk_Avaliacoes_Pedidos1`
    FOREIGN KEY (`Pedidos_id_pedidos`)
    REFERENCES `Pedidos` (`id_pedidos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Avaliacoes_Produtos1`
    FOREIGN KEY (`Produtos_id_prod_art`)
    REFERENCES `Produtos` (`id_prod_art`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- End of Schema `mydb`
-- -----------------------------------------------------

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;