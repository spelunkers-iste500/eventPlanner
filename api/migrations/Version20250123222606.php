<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250123222606 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_role DROP CONSTRAINT fk_2de8c6a35fd86d04');
        $this->addSql('ALTER TABLE user_role DROP CONSTRAINT fk_2de8c6a383acdd40');
        $this->addSql('DROP SEQUENCE user_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE permission_permission_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE author_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE book_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE genre_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE review_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE role_roleid_seq CASCADE');
        $this->addSql('DROP SEQUENCE user_userid_seq CASCADE');
        $this->addSql('CREATE SEQUENCE account_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE roles_roleID_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE session_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE users_userID_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE account (id INT NOT NULL, user_id INT NOT NULL, type VARCHAR(255) NOT NULL, provider VARCHAR(255) NOT NULL, provider_account_id VARCHAR(255) NOT NULL, refresh_token VARCHAR(255) DEFAULT NULL, access_token VARCHAR(255) DEFAULT NULL, expires_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, id_token VARCHAR(255) DEFAULT NULL, scope VARCHAR(255) DEFAULT NULL, session_state VARCHAR(255) DEFAULT NULL, token_type VARCHAR(255) DEFAULT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE flight (flightID VARCHAR(10) NOT NULL, flight_number VARCHAR(20) NOT NULL, event_id INT NOT NULL, departure_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, arrival_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, departure_location VARCHAR(55) NOT NULL, arrival_location VARCHAR(55) NOT NULL, airline VARCHAR(55) NOT NULL, flight_tracker VARCHAR(255) DEFAULT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(flightID))');
        $this->addSql('CREATE TABLE role_permissions (last_modified TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, roleID INT NOT NULL, permissionID INT NOT NULL, PRIMARY KEY(roleID, permissionID))');
        $this->addSql('CREATE INDEX IDX_1FBA94E683ACDD40 ON role_permissions (roleID)');
        $this->addSql('CREATE INDEX IDX_1FBA94E65B3A2578 ON role_permissions (permissionID)');
        $this->addSql('CREATE TABLE roles (roleID INT NOT NULL, name VARCHAR(255) DEFAULT NULL, description TEXT DEFAULT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, creation_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(roleID))');
        $this->addSql('CREATE TABLE session (id INT NOT NULL, user_id INT NOT NULL, expires TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, session_token VARCHAR(255) NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, creation_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE users (userID INT NOT NULL, first_name VARCHAR(55) NOT NULL, last_name VARCHAR(55) NOT NULL, email VARCHAR(55) NOT NULL, email_verified TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, image VARCHAR(55) DEFAULT NULL, password VARCHAR(255) NOT NULL, vip BOOLEAN NOT NULL, account_enabled BOOLEAN NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(userID))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1483A5E9E7927C74 ON users (email)');
        $this->addSql('CREATE TABLE verification_token (identifier TEXT NOT NULL, token TEXT NOT NULL, expires TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, creation_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(identifier, token))');
        $this->addSql('ALTER TABLE role_permissions ADD CONSTRAINT FK_1FBA94E683ACDD40 FOREIGN KEY (roleID) REFERENCES roles (roleID) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE role_permissions ADD CONSTRAINT FK_1FBA94E65B3A2578 FOREIGN KEY (permissionID) REFERENCES permission (permissionID) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE book DROP CONSTRAINT fk_cbe5a331f675f31b');
        $this->addSql('ALTER TABLE review DROP CONSTRAINT fk_794381c616a2b381');
        $this->addSql('ALTER TABLE role_permission DROP CONSTRAINT fk_6f7df88683acdd40');
        $this->addSql('ALTER TABLE role_permission DROP CONSTRAINT fk_6f7df8865b3a2578');
        $this->addSql('DROP TABLE book');
        $this->addSql('DROP TABLE review');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('DROP TABLE flights');
        $this->addSql('DROP TABLE role_permission');
        $this->addSql('DROP TABLE author');
        $this->addSql('DROP TABLE genre');
        $this->addSql('DROP TABLE role');
        $this->addSql('ALTER TABLE budget_change_management DROP CONSTRAINT fk_ca185bd5fec1d74a');
        $this->addSql('DROP INDEX idx_ca185bd5fec1d74a');
        $this->addSql('ALTER TABLE budget_change_management DROP budgetid');
        $this->addSql('ALTER TABLE budget_change_management ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE budget_change_management ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE event DROP CONSTRAINT fk_3bae0aa7fec1d74a');
        $this->addSql('DROP INDEX idx_3bae0aa7fec1d74a');
        $this->addSql('ALTER TABLE event DROP budgetid');
        $this->addSql('ALTER TABLE event ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE event ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE event_change_management ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE event_change_management ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE event_organization DROP CONSTRAINT fk_2cfd698f10409ba4');
        $this->addSql('DROP INDEX idx_2cfd698f10409ba4');
        $this->addSql('ALTER TABLE event_organization ADD last_modified TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE event_organization ADD created_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE event_organization DROP field1');
        $this->addSql('ALTER TABLE event_organization DROP field2');
        $this->addSql('ALTER TABLE flight_change_management ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE flight_change_management ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE organization ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE organization ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE permission RENAME COLUMN creation_date TO created_date');
        $this->addSql('ALTER TABLE user_flight ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE user_flight ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE user_organization ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE user_organization ALTER created_date DROP NOT NULL');
        $this->addSql('DROP INDEX idx_2de8c6a383acdd40');
        $this->addSql('DROP INDEX idx_2de8c6a35fd86d04');
        $this->addSql('ALTER TABLE user_role DROP CONSTRAINT user_role_pkey');
        $this->addSql('ALTER TABLE user_role ADD user_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_role ADD role_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_role DROP userid');
        $this->addSql('ALTER TABLE user_role DROP roleid');
        $this->addSql('ALTER TABLE user_role ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE user_role ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE user_role ADD PRIMARY KEY (user_id, role_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE account_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE roles_roleID_seq CASCADE');
        $this->addSql('DROP SEQUENCE session_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE users_userID_seq CASCADE');
        $this->addSql('CREATE SEQUENCE user_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE permission_permission_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE author_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE book_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE genre_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE review_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE role_roleid_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE user_userid_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE book (id INT NOT NULL, author_id INT DEFAULT NULL, isbn VARCHAR(255) DEFAULT NULL, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, publication_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX idx_cbe5a331f675f31b ON book (author_id)');
        $this->addSql('COMMENT ON COLUMN book.publication_date IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE review (id INT NOT NULL, book_id INT DEFAULT NULL, rating SMALLINT NOT NULL, body TEXT NOT NULL, author VARCHAR(255) NOT NULL, publication_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX idx_794381c616a2b381 ON review (book_id)');
        $this->addSql('COMMENT ON COLUMN review.publication_date IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE "user" (userid INT NOT NULL, first_name VARCHAR(55) NOT NULL, last_name VARCHAR(55) NOT NULL, email VARCHAR(55) NOT NULL, password VARCHAR(255) NOT NULL, vip BOOLEAN NOT NULL, account_enabled BOOLEAN NOT NULL, mfa_token_key VARCHAR(255) DEFAULT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(userid))');
        $this->addSql('CREATE UNIQUE INDEX uniq_8d93d649e7927c74 ON "user" (email)');
        $this->addSql('CREATE TABLE flights (flightid VARCHAR(10) NOT NULL, flight_number VARCHAR(20) NOT NULL, event_id INT NOT NULL, departure_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, arrival_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, departure_location VARCHAR(55) NOT NULL, arrival_location VARCHAR(55) NOT NULL, airline VARCHAR(55) NOT NULL, flight_tracker VARCHAR(255) DEFAULT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(flightid))');
        $this->addSql('CREATE TABLE role_permission (roleid INT NOT NULL, permissionid INT NOT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(roleid, permissionid))');
        $this->addSql('CREATE INDEX idx_6f7df8865b3a2578 ON role_permission (permissionid)');
        $this->addSql('CREATE INDEX idx_6f7df88683acdd40 ON role_permission (roleid)');
        $this->addSql('CREATE TABLE author (id INT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE genre (id INT NOT NULL, description VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE role (roleid INT NOT NULL, name VARCHAR(255) DEFAULT NULL, description TEXT DEFAULT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, creation_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(roleid))');
        $this->addSql('ALTER TABLE book ADD CONSTRAINT fk_cbe5a331f675f31b FOREIGN KEY (author_id) REFERENCES author (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT fk_794381c616a2b381 FOREIGN KEY (book_id) REFERENCES book (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE role_permission ADD CONSTRAINT fk_6f7df88683acdd40 FOREIGN KEY (roleid) REFERENCES role (roleid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE role_permission ADD CONSTRAINT fk_6f7df8865b3a2578 FOREIGN KEY (permissionid) REFERENCES permission (permissionid) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE role_permissions DROP CONSTRAINT FK_1FBA94E683ACDD40');
        $this->addSql('ALTER TABLE role_permissions DROP CONSTRAINT FK_1FBA94E65B3A2578');
        $this->addSql('DROP TABLE account');
        $this->addSql('DROP TABLE flight');
        $this->addSql('DROP TABLE role_permissions');
        $this->addSql('DROP TABLE roles');
        $this->addSql('DROP TABLE session');
        $this->addSql('DROP TABLE users');
        $this->addSql('DROP TABLE verification_token');
        $this->addSql('ALTER TABLE organization ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE organization ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE event_organization ADD field1 TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE event_organization ADD field2 TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE event_organization DROP last_modified');
        $this->addSql('ALTER TABLE event_organization DROP created_date');
        $this->addSql('ALTER TABLE event_organization ADD CONSTRAINT fk_2cfd698f10409ba4 FOREIGN KEY (eventid) REFERENCES event (eventid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_2cfd698f10409ba4 ON event_organization (eventid)');
        $this->addSql('ALTER TABLE budget_change_management ADD budgetid INT NOT NULL');
        $this->addSql('ALTER TABLE budget_change_management ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE budget_change_management ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE budget_change_management ADD CONSTRAINT fk_ca185bd5fec1d74a FOREIGN KEY (budgetid) REFERENCES budget (budgetid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_ca185bd5fec1d74a ON budget_change_management (budgetid)');
        $this->addSql('ALTER TABLE permission RENAME COLUMN created_date TO creation_date');
        $this->addSql('ALTER TABLE user_flight ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE user_flight ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE user_organization ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE user_organization ALTER created_date SET NOT NULL');
        $this->addSql('DROP INDEX user_role_pkey');
        $this->addSql('ALTER TABLE user_role ADD userid INT NOT NULL');
        $this->addSql('ALTER TABLE user_role ADD roleid INT NOT NULL');
        $this->addSql('ALTER TABLE user_role DROP user_id');
        $this->addSql('ALTER TABLE user_role DROP role_id');
        $this->addSql('ALTER TABLE user_role ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE user_role ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE user_role ADD CONSTRAINT fk_2de8c6a35fd86d04 FOREIGN KEY (userid) REFERENCES "user" (userid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_role ADD CONSTRAINT fk_2de8c6a383acdd40 FOREIGN KEY (roleid) REFERENCES role (roleid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_2de8c6a383acdd40 ON user_role (roleid)');
        $this->addSql('CREATE INDEX idx_2de8c6a35fd86d04 ON user_role (userid)');
        $this->addSql('ALTER TABLE user_role ADD PRIMARY KEY (userid, roleid)');
        $this->addSql('ALTER TABLE event_change_management ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE event_change_management ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE flight_change_management ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE flight_change_management ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE event ADD budgetid INT NOT NULL');
        $this->addSql('ALTER TABLE event ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE event ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE event ADD CONSTRAINT fk_3bae0aa7fec1d74a FOREIGN KEY (budgetid) REFERENCES budget (budgetid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_3bae0aa7fec1d74a ON event (budgetid)');
    }
}
