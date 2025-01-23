<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250121173513 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE user_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE permission_permission_id_seq CASCADE');
        $this->addSql('CREATE SEQUENCE budget_budgetID_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE budget_change_management_changeID_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE event_eventID_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE event_change_management_changeID_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE flight_change_management_changeID_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE organization_orgID_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE permission_permissionID_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE role_roleID_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE user_userID_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE user_flight_user_flight_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE budget (budgetID INT NOT NULL, financial_planner_id INT NOT NULL, total NUMERIC(10, 2) NOT NULL, spent_budget NUMERIC(10, 2) NOT NULL, vip_budget NUMERIC(10, 2) NOT NULL, reg_budget NUMERIC(10, 2) NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(budgetID))');
        $this->addSql('CREATE TABLE budget_change_management (changeID INT NOT NULL, budget_id INT NOT NULL, version_num VARCHAR(55) NOT NULL, active BOOLEAN NOT NULL, description VARCHAR(255) NOT NULL, before_changes JSON NOT NULL, after_changes JSON NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(changeID))');
        $this->addSql('CREATE TABLE event (eventID INT NOT NULL, event_title VARCHAR(55) NOT NULL, start_date_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, end_date_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, location VARCHAR(55) NOT NULL, max_attendees INT NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, budgetID INT NOT NULL, PRIMARY KEY(eventID))');
        $this->addSql('CREATE INDEX IDX_3BAE0AA7FEC1D74A ON event (budgetID)');
        $this->addSql('CREATE TABLE event_change_management (changeID INT NOT NULL, event_id INT NOT NULL, version_num VARCHAR(55) NOT NULL, active BOOLEAN NOT NULL, description VARCHAR(255) NOT NULL, before_changes JSON NOT NULL, after_changes JSON NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(changeID))');
        $this->addSql('CREATE TABLE event_organization (org_id INT NOT NULL, eventID INT NOT NULL, field1 TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, field2 TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(eventID, org_id))');
        $this->addSql('CREATE TABLE flight_change_management (changeID INT NOT NULL, flight_id INT NOT NULL, version_num VARCHAR(55) NOT NULL, active BOOLEAN NOT NULL, description VARCHAR(255) NOT NULL, before_changes JSON NOT NULL, after_changes JSON NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(changeID))');
        $this->addSql('CREATE TABLE flights (flightID VARCHAR(10) NOT NULL, flight_number VARCHAR(20) NOT NULL, event_id INT NOT NULL, departure_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, arrival_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, departure_location VARCHAR(55) NOT NULL, arrival_location VARCHAR(55) NOT NULL, airline VARCHAR(55) NOT NULL, flight_tracker VARCHAR(255) DEFAULT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(flightID))');
        $this->addSql('CREATE TABLE organization (orgID INT NOT NULL, name VARCHAR(55) NOT NULL, description VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, primary_email VARCHAR(55) NOT NULL, secondary_email VARCHAR(55) NOT NULL, industry VARCHAR(55) NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(orgID))');
        $this->addSql('CREATE TABLE role (roleID INT NOT NULL, name VARCHAR(255) DEFAULT NULL, description TEXT DEFAULT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, creation_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(roleID))');
        $this->addSql('CREATE TABLE role_permission (created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, roleID INT NOT NULL, permissionID INT NOT NULL, PRIMARY KEY(roleID, permissionID))');
        $this->addSql('CREATE INDEX IDX_6F7DF88683ACDD40 ON role_permission (roleID)');
        $this->addSql('CREATE INDEX IDX_6F7DF8865B3A2578 ON role_permission (permissionID)');
        $this->addSql('CREATE TABLE user_flight (user_flight_id INT NOT NULL, user_id INT NOT NULL, flight_number VARCHAR(20) NOT NULL, seat_number VARCHAR(10) NOT NULL, cost NUMERIC(10, 2) NOT NULL, tsa_pre_check_number VARCHAR(55) NOT NULL, frequent_flyer_number VARCHAR(55) NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(user_flight_id))');
        $this->addSql('CREATE TABLE user_organization (user_id INT NOT NULL, org_id INT NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(user_id, org_id))');
        $this->addSql('CREATE TABLE user_role (created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, userID INT NOT NULL, roleID INT NOT NULL, PRIMARY KEY(userID, roleID))');
        $this->addSql('CREATE INDEX IDX_2DE8C6A35FD86D04 ON user_role (userID)');
        $this->addSql('CREATE INDEX IDX_2DE8C6A383ACDD40 ON user_role (roleID)');
        $this->addSql('ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA7FEC1D74A FOREIGN KEY (budgetID) REFERENCES budget (budgetID) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE role_permission ADD CONSTRAINT FK_6F7DF88683ACDD40 FOREIGN KEY (roleID) REFERENCES role (roleID) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE role_permission ADD CONSTRAINT FK_6F7DF8865B3A2578 FOREIGN KEY (permissionID) REFERENCES permission (permissionID) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_role ADD CONSTRAINT FK_2DE8C6A35FD86D04 FOREIGN KEY (userID) REFERENCES "user" (userID) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_role ADD CONSTRAINT FK_2DE8C6A383ACDD40 FOREIGN KEY (roleID) REFERENCES role (roleID) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE permission DROP CONSTRAINT permission_pkey');
        $this->addSql('ALTER TABLE permission RENAME COLUMN permission_id TO permissionID');
        $this->addSql('ALTER TABLE permission RENAME COLUMN permission_name TO name');
        $this->addSql('ALTER TABLE permission RENAME COLUMN created_date TO creation_date');
        $this->addSql('ALTER TABLE permission ADD PRIMARY KEY (permissionID)');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT "user_pkey"');
        $this->addSql('ALTER TABLE "user" ADD first_name VARCHAR(55) NOT NULL');
        $this->addSql('ALTER TABLE "user" ADD last_name VARCHAR(55) NOT NULL');
        $this->addSql('ALTER TABLE "user" ADD vip BOOLEAN NOT NULL');
        $this->addSql('ALTER TABLE "user" ADD account_enabled BOOLEAN NOT NULL');
        $this->addSql('ALTER TABLE "user" ADD mfa_token_key VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE "user" ADD created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE "user" DROP roles');
        $this->addSql('ALTER TABLE "user" ALTER email TYPE VARCHAR(55)');
        $this->addSql('ALTER TABLE "user" RENAME COLUMN id TO userID');
        $this->addSql('ALTER TABLE "user" ADD PRIMARY KEY (userID)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE budget_budgetID_seq CASCADE');
        $this->addSql('DROP SEQUENCE budget_change_management_changeID_seq CASCADE');
        $this->addSql('DROP SEQUENCE event_eventID_seq CASCADE');
        $this->addSql('DROP SEQUENCE event_change_management_changeID_seq CASCADE');
        $this->addSql('DROP SEQUENCE flight_change_management_changeID_seq CASCADE');
        $this->addSql('DROP SEQUENCE organization_orgID_seq CASCADE');
        $this->addSql('DROP SEQUENCE permission_permissionID_seq CASCADE');
        $this->addSql('DROP SEQUENCE role_roleID_seq CASCADE');
        $this->addSql('DROP SEQUENCE user_userID_seq CASCADE');
        $this->addSql('DROP SEQUENCE user_flight_user_flight_id_seq CASCADE');
        $this->addSql('CREATE SEQUENCE user_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE permission_permission_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('ALTER TABLE event DROP CONSTRAINT FK_3BAE0AA7FEC1D74A');
        $this->addSql('ALTER TABLE role_permission DROP CONSTRAINT FK_6F7DF88683ACDD40');
        $this->addSql('ALTER TABLE role_permission DROP CONSTRAINT FK_6F7DF8865B3A2578');
        $this->addSql('ALTER TABLE user_role DROP CONSTRAINT FK_2DE8C6A35FD86D04');
        $this->addSql('ALTER TABLE user_role DROP CONSTRAINT FK_2DE8C6A383ACDD40');
        $this->addSql('DROP TABLE budget');
        $this->addSql('DROP TABLE budget_change_management');
        $this->addSql('DROP TABLE event');
        $this->addSql('DROP TABLE event_change_management');
        $this->addSql('DROP TABLE event_organization');
        $this->addSql('DROP TABLE flight_change_management');
        $this->addSql('DROP TABLE flights');
        $this->addSql('DROP TABLE organization');
        $this->addSql('DROP TABLE role');
        $this->addSql('DROP TABLE role_permission');
        $this->addSql('DROP TABLE user_flight');
        $this->addSql('DROP TABLE user_organization');
        $this->addSql('DROP TABLE user_role');
        $this->addSql('DROP INDEX permission_pkey');
        $this->addSql('ALTER TABLE permission RENAME COLUMN permissionID TO permission_id');
        $this->addSql('ALTER TABLE permission RENAME COLUMN name TO permission_name');
        $this->addSql('ALTER TABLE permission RENAME COLUMN creation_date TO created_date');
        $this->addSql('ALTER TABLE permission ADD PRIMARY KEY (permission_id)');
        $this->addSql('DROP INDEX user_pkey');
        $this->addSql('ALTER TABLE "user" ADD roles JSON NOT NULL');
        $this->addSql('ALTER TABLE "user" DROP first_name');
        $this->addSql('ALTER TABLE "user" DROP last_name');
        $this->addSql('ALTER TABLE "user" DROP vip');
        $this->addSql('ALTER TABLE "user" DROP account_enabled');
        $this->addSql('ALTER TABLE "user" DROP mfa_token_key');
        $this->addSql('ALTER TABLE "user" DROP last_modified');
        $this->addSql('ALTER TABLE "user" DROP created_date');
        $this->addSql('ALTER TABLE "user" ALTER email TYPE VARCHAR(180)');
        $this->addSql('ALTER TABLE "user" RENAME COLUMN userID TO id');
        $this->addSql('ALTER TABLE "user" ADD PRIMARY KEY (id)');
    }
}
