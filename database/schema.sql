CREATE TABLE tb_barista 
    ( 
     barista_id   INTEGER  NOT NULL , 
     barista_name VARCHAR (50)  NOT NULL , 
     shift        VARCHAR (20)  NOT NULL , 
     phone_number VARCHAR (15) 
    ) 
;

ALTER TABLE tb_barista 
    ADD CONSTRAINT tb_barista_PK PRIMARY KEY ( barista_id ) ;

CREATE TABLE tb_customer 
    ( 
     customer_id   INTEGER  NOT NULL , 
     customer_name VARCHAR (50)  NOT NULL , 
     email         VARCHAR (50) , 
     phone         VARCHAR (20) , 
     points        INTEGER 
    ) 
;

ALTER TABLE tb_customer 
    ADD CONSTRAINT tb_customer_PK PRIMARY KEY ( customer_id ) ;

CREATE TABLE tb_ing 
    ( 
     ing_id    INTEGER  NOT NULL , 
     ing_name  VARCHAR (50)  NOT NULL , 
     stock_qty INTEGER NOT NULL , 
     unit      VARCHAR (10) 
    ) 
;

ALTER TABLE tb_ing 
    ADD CONSTRAINT tb_ing_PK PRIMARY KEY ( ing_id ) ;

CREATE TABLE tb_meja 
    ( 
     meja_id    INTEGER  NOT NULL , 
     nomor_meja INTEGER , 
     kapasitas  INTEGER , 
     status     VARCHAR (20) 
    ) 
;

ALTER TABLE tb_meja 
    ADD CONSTRAINT tb_meja_PK PRIMARY KEY ( meja_id ) ;

CREATE TABLE tb_order 
    ( 
     order_id                INTEGER  NOT NULL , 
     order_date              DATE  NOT NULL , 
     total_price             INTEGER NOT NULL , 
     status                  VARCHAR (20) , 
     tb_customer_customer_id INTEGER  NOT NULL , 
     tb_barista_barista_id   INTEGER  NOT NULL , 
     tb_meja_meja_id         INTEGER  NOT NULL 
    ) 
;

ALTER TABLE tb_order 
    ADD CONSTRAINT tb_order_PK PRIMARY KEY ( order_id ) ;

CREATE TABLE tb_order_detail 
    ( 
     order_detail_id       INTEGER  NOT NULL , 
     qty                   INTEGER , 
     price                 INTEGER NOT NULL , 
     subtotal              INTEGER , 
     tb_product_product_id VARCHAR (50)  NOT NULL , 
     tb_order_order_id     INTEGER  NOT NULL 
    ) 
;

ALTER TABLE tb_order_detail 
    ADD CONSTRAINT tb_order_detail_PK PRIMARY KEY ( order_detail_id ) ;

CREATE TABLE tb_product 
    ( 
     product_id   VARCHAR (50)  NOT NULL , 
     product_name VARCHAR (50) , 
     category     VARCHAR (50)  NOT NULL , 
     price        INTEGER NOT NULL , 
     description  VARCHAR (100) 
    ) 
;

ALTER TABLE tb_product 
    ADD CONSTRAINT tb_product_PK PRIMARY KEY ( product_id ) ;

CREATE TABLE tb_product_ing 
    ( 
     qty_used              INTEGER , 
     tb_product_product_id VARCHAR (50)  NOT NULL , 
     tb_ing_ing_id         INTEGER  NOT NULL 
    ) 
;

ALTER TABLE tb_product_ing 
    ADD CONSTRAINT tb_product_ing_PK PRIMARY KEY ( tb_product_product_id, tb_ing_ing_id ) ;

ALTER TABLE tb_order_detail 
    ADD CONSTRAINT tb_order_detail_tb_order_FK FOREIGN KEY 
    ( 
     tb_order_order_id
    ) 
    REFERENCES tb_order 
    ( 
     order_id
    ) 
;

ALTER TABLE tb_order_detail 
    ADD CONSTRAINT tb_order_detail_tb_product_FK FOREIGN KEY 
    ( 
     tb_product_product_id
    ) 
    REFERENCES tb_product 
    ( 
     product_id
    ) 
;

ALTER TABLE tb_order 
    ADD CONSTRAINT tb_order_tb_barista_FK FOREIGN KEY 
    ( 
     tb_barista_barista_id
    ) 
    REFERENCES tb_barista 
    ( 
     barista_id
    ) 
;

ALTER TABLE tb_order 
    ADD CONSTRAINT tb_order_tb_customer_FK FOREIGN KEY 
    ( 
     tb_customer_customer_id
    ) 
    REFERENCES tb_customer 
    ( 
     customer_id
    ) 
;

ALTER TABLE tb_order 
    ADD CONSTRAINT tb_order_tb_meja_FK FOREIGN KEY 
    ( 
     tb_meja_meja_id
    ) 
    REFERENCES tb_meja 
    ( 
     meja_id
    ) 
;

ALTER TABLE tb_product_ing 
    ADD CONSTRAINT tb_product_ing_tb_ing_FK FOREIGN KEY 
    ( 
     tb_ing_ing_id
    ) 
    REFERENCES tb_ing 
    ( 
     ing_id
    ) 
;

ALTER TABLE tb_product_ing 
    ADD CONSTRAINT tb_product_ing_tb_product_FK FOREIGN KEY 
    ( 
     tb_product_product_id
    ) 
    REFERENCES tb_product 
    ( 
     product_id
    ) 
;



