# PostgreSQL Data at Rest Encryption Using LUKS + Docker Compose (Loopback File Method + Auto Mount)

This guide sets up a loopback file with LUKS encryption for PostgreSQL Docker containers,
includes how to mount a subdirectory to avoid initdb issues, and how to automate encryption and decryption.

---

## Step 1: Create and Mount the Encrypted Volume

### 1.1 Create a 10GB encrypted image file

```bash
fallocate -l 10G /opt/pgdata_encrypted.img
```

### 1.2 Associate it with a loop device

```bash
sudo losetup -fP /opt/pgdata_encrypted.img
losetup -a  # Check the assigned device, e.g., /dev/loop0
```

### 1.3 Set up LUKS encryption

```bash
sudo cryptsetup luksFormat /dev/loop0
sudo cryptsetup open /dev/loop0 encrypted_pgdata
```

Password: xyzfxsd124!

### 1.4 Format and mount the unlocked volume

```bash
sudo mkfs.ext4 /dev/mapper/encrypted_pgdata
sudo mkdir -p /mnt/pgdata
sudo mount /dev/mapper/encrypted_pgdata /mnt/pgdata
```

### 1.5 Create a clean subdirectory for PostgreSQL

```bash
sudo mkdir /mnt/pgdata/pgdata
sudo chown -R $USER:$USER /mnt/pgdata/pgdata
```

---

## Step 2: Update docker-compose.yml

Update the volumes section of your PostgreSQL service:

```yaml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypass
      POSTGRES_DB: mydb
    volumes:
      - /mnt/pgdata/pgdata:/var/lib/postgresql/data  # <- UPDATE THIS LINE
```

---

## Step 3: Run Your Encrypted PostgreSQL Container

### 3.1 Bring down existing containers

```bash
docker-compose down -v
```

### 3.2 Start the new container with encrypted volume

```bash
docker-compose up -d
```

---

## Step 4: Locking the Volume (Encrypt on Shutdown)

### 4.1 Stop Docker containers and unmount

```bash
docker-compose down
sudo umount /mnt/pgdata
sudo cryptsetup close encrypted_pgdata
sudo losetup -d /dev/loop0
```

This secures the volume — it will now require a passphrase to access again.

---

## Step 5: Unlock and Mount on Boot

You can manually remount it on boot or automate with a script/systemd unit.

### Manual steps after boot:

```bash
sudo losetup -fP /opt/pgdata_encrypted.img
sudo cryptsetup open /dev/loop0 encrypted_pgdata
sudo mount /dev/mapper/encrypted_pgdata /mnt/pgdata
```

Then restart your services:

```bash
docker-compose up -d
```

---

## Automation: Automate the Unlock with a Script (Prompt for passphrase)

Create a helper script `/usr/local/bin/mount_pgdata.sh`:

```bash
#!/bin/bash
LOOPDEV=$(losetup -fP --show /opt/pgdata_encrypted.img)
cryptsetup open "$LOOPDEV" encrypted_pgdata
mount /dev/mapper/encrypted_pgdata /mnt/pgdata
```

Make it executable:

```bash
chmod +x /usr/local/bin/mount_pgdata.sh
```

Then run it manually after reboot or integrate into a systemd service if needed.

---

## Done!

PostgreSQL now runs fully encrypted at rest via a mounted loopback file using LUKS.
You can manually or automatically encrypt/decrypt during system shutdown and boot.
