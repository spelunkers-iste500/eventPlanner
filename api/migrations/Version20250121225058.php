<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250121225058 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE budget_change_management ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE budget_change_management ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE event ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE event ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE event_change_management ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE event_change_management ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE event_organization ADD last_modified TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE event_organization ADD created_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE event_organization DROP field1');
        $this->addSql('ALTER TABLE event_organization DROP field2');
        $this->addSql('ALTER TABLE flight ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE flight ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE flight_change_management ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE flight_change_management ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE organization ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE organization ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE permission RENAME COLUMN creation_date TO created_date');
        $this->addSql('ALTER TABLE role_permission ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE role_permission ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE user_flight ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE user_flight ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE user_organization ALTER last_modified DROP NOT NULL');
        $this->addSql('ALTER TABLE user_organization ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE user_role ALTER created_date DROP NOT NULL');
        $this->addSql('ALTER TABLE user_role ALTER last_modified DROP NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE user_flight ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE user_flight ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE organization ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE organization ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE event ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE event ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE flight ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE flight ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE user_role ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE user_role ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE event_organization ADD field1 TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE event_organization ADD field2 TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE event_organization DROP last_modified');
        $this->addSql('ALTER TABLE event_organization DROP created_date');
        $this->addSql('ALTER TABLE flight_change_management ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE flight_change_management ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE permission RENAME COLUMN created_date TO creation_date');
        $this->addSql('ALTER TABLE role_permission ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE role_permission ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE budget_change_management ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE budget_change_management ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE user_organization ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE user_organization ALTER created_date SET NOT NULL');
        $this->addSql('ALTER TABLE event_change_management ALTER last_modified SET NOT NULL');
        $this->addSql('ALTER TABLE event_change_management ALTER created_date SET NOT NULL');
    }
}
