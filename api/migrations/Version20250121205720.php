<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250121205720 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE users_eventid_seq CASCADE');
        $this->addSql('ALTER TABLE users DROP CONSTRAINT fk_1483a5e9fec1d74a');
        $this->addSql('DROP TABLE users');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SEQUENCE users_eventid_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE users (eventid INT NOT NULL, budgetid INT NOT NULL, event_title VARCHAR(55) NOT NULL, start_date_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, end_date_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, location VARCHAR(55) NOT NULL, max_attendees INT NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(eventid))');
        $this->addSql('CREATE INDEX idx_1483a5e9fec1d74a ON users (budgetid)');
        $this->addSql('ALTER TABLE users ADD CONSTRAINT fk_1483a5e9fec1d74a FOREIGN KEY (budgetid) REFERENCES budget (budgetid) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
