<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250121223541 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE budget_change_management DROP CONSTRAINT fk_ca185bd5fec1d74a');
        $this->addSql('DROP INDEX idx_ca185bd5fec1d74a');
        $this->addSql('ALTER TABLE budget_change_management DROP budgetid');
        $this->addSql('ALTER TABLE event DROP CONSTRAINT fk_3bae0aa7fec1d74a');
        $this->addSql('DROP INDEX idx_3bae0aa7fec1d74a');
        $this->addSql('ALTER TABLE event DROP budgetid');
        $this->addSql('ALTER TABLE event_organization DROP CONSTRAINT fk_2cfd698f10409ba4');
        $this->addSql('DROP INDEX idx_2cfd698f10409ba4');
        $this->addSql('ALTER TABLE role_permission DROP CONSTRAINT fk_6f7df8865b3a2578');
        $this->addSql('ALTER TABLE role_permission DROP CONSTRAINT fk_6f7df88683acdd40');
        $this->addSql('DROP INDEX idx_6f7df8865b3a2578');
        $this->addSql('DROP INDEX idx_6f7df88683acdd40');
        $this->addSql('ALTER TABLE role_permission DROP CONSTRAINT role_permission_pkey');
        $this->addSql('ALTER TABLE role_permission ADD role_id INT NOT NULL');
        $this->addSql('ALTER TABLE role_permission ADD permission_id INT NOT NULL');
        $this->addSql('ALTER TABLE role_permission DROP roleid');
        $this->addSql('ALTER TABLE role_permission DROP permissionid');
        $this->addSql('ALTER TABLE role_permission ADD PRIMARY KEY (role_id, permission_id)');
        $this->addSql('ALTER TABLE user_role DROP CONSTRAINT fk_2de8c6a35fd86d04');
        $this->addSql('ALTER TABLE user_role DROP CONSTRAINT fk_2de8c6a383acdd40');
        $this->addSql('DROP INDEX idx_2de8c6a383acdd40');
        $this->addSql('DROP INDEX idx_2de8c6a35fd86d04');
        $this->addSql('ALTER TABLE user_role DROP CONSTRAINT user_role_pkey');
        $this->addSql('ALTER TABLE user_role ADD user_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_role ADD role_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_role DROP userid');
        $this->addSql('ALTER TABLE user_role DROP roleid');
        $this->addSql('ALTER TABLE user_role ADD PRIMARY KEY (user_id, role_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE budget_change_management ADD budgetid INT NOT NULL');
        $this->addSql('ALTER TABLE budget_change_management ADD CONSTRAINT fk_ca185bd5fec1d74a FOREIGN KEY (budgetid) REFERENCES budget (budgetid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_ca185bd5fec1d74a ON budget_change_management (budgetid)');
        $this->addSql('ALTER TABLE event ADD budgetid INT NOT NULL');
        $this->addSql('ALTER TABLE event ADD CONSTRAINT fk_3bae0aa7fec1d74a FOREIGN KEY (budgetid) REFERENCES budget (budgetid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_3bae0aa7fec1d74a ON event (budgetid)');
        $this->addSql('ALTER TABLE event_organization ADD CONSTRAINT fk_2cfd698f10409ba4 FOREIGN KEY (eventid) REFERENCES event (eventid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_2cfd698f10409ba4 ON event_organization (eventid)');
        $this->addSql('DROP INDEX role_permission_pkey');
        $this->addSql('ALTER TABLE role_permission ADD roleid INT NOT NULL');
        $this->addSql('ALTER TABLE role_permission ADD permissionid INT NOT NULL');
        $this->addSql('ALTER TABLE role_permission DROP role_id');
        $this->addSql('ALTER TABLE role_permission DROP permission_id');
        $this->addSql('ALTER TABLE role_permission ADD CONSTRAINT fk_6f7df8865b3a2578 FOREIGN KEY (permissionid) REFERENCES permission (permissionid) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE role_permission ADD CONSTRAINT fk_6f7df88683acdd40 FOREIGN KEY (roleid) REFERENCES roles (roleid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_6f7df8865b3a2578 ON role_permission (permissionid)');
        $this->addSql('CREATE INDEX idx_6f7df88683acdd40 ON role_permission (roleid)');
        $this->addSql('ALTER TABLE role_permission ADD PRIMARY KEY (roleid, permissionid)');
        $this->addSql('DROP INDEX user_role_pkey');
        $this->addSql('ALTER TABLE user_role ADD userid INT NOT NULL');
        $this->addSql('ALTER TABLE user_role ADD roleid INT NOT NULL');
        $this->addSql('ALTER TABLE user_role DROP user_id');
        $this->addSql('ALTER TABLE user_role DROP role_id');
        $this->addSql('ALTER TABLE user_role ADD CONSTRAINT fk_2de8c6a35fd86d04 FOREIGN KEY (userid) REFERENCES users (userid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_role ADD CONSTRAINT fk_2de8c6a383acdd40 FOREIGN KEY (roleid) REFERENCES roles (roleid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_2de8c6a383acdd40 ON user_role (roleid)');
        $this->addSql('CREATE INDEX idx_2de8c6a35fd86d04 ON user_role (userid)');
        $this->addSql('ALTER TABLE user_role ADD PRIMARY KEY (userid, roleid)');
    }
}
