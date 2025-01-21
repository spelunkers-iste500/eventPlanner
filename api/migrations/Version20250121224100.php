<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250121224100 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE flight (flightID VARCHAR(10) NOT NULL, flight_number VARCHAR(20) NOT NULL, event_id INT NOT NULL, departure_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, arrival_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, departure_location VARCHAR(55) NOT NULL, arrival_location VARCHAR(55) NOT NULL, airline VARCHAR(55) NOT NULL, flight_tracker VARCHAR(255) DEFAULT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(flightID))');
        $this->addSql('DROP TABLE flights');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE TABLE flights (flightid VARCHAR(10) NOT NULL, flight_number VARCHAR(20) NOT NULL, event_id INT NOT NULL, departure_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, arrival_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, departure_location VARCHAR(55) NOT NULL, arrival_location VARCHAR(55) NOT NULL, airline VARCHAR(55) NOT NULL, flight_tracker VARCHAR(255) DEFAULT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(flightid))');
        $this->addSql('DROP TABLE flight');
    }
}
