
export function mapExpiresAt(account) {
    const expires_at = parseInt(account.expires_at);
    return {
        ...account,
        expires_at,
    };
}
export default function PostgresAdapter(client) {
    return {
        async createVerificationToken(verificationToken) {
            const { identifier, expires, token } = verificationToken;
            const sql = `
        INSERT INTO verification_token ( identifier, expires, token ) 
        VALUES ($1, $2, $3)
        `;
            await client.query(sql, [identifier, expires, token]);
            return verificationToken;
        },
        async useVerificationToken({ identifier, token, }) {
            const sql = `delete from verification_token
      where identifier = $1 and token = $2
      RETURNING identifier, expires, token `;
            const result = await client.query(sql, [identifier, token]);
            return result.rowCount !== 0 ? result.rows[0] : null;
        },
        async createUser(user) {
            const { name, email, emailVerified, image } = user;
            const sql = `
        INSERT INTO users (name, email, "emailVerified", image) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, name, email, "emailVerified", image`;
            const result = await client.query(sql, [
                name,
                email,
                emailVerified,
                image,
            ]);
            return result.rows[0];
        },
        async getUser(id) {
            const sql = `select * from users where id = $1`;
            try {
                const result = await client.query(sql, [id]);
                return result.rowCount === 0 ? null : result.rows[0];
            }
            catch {
                return null;
            }
        },
        async getUserByEmail(email) {
            const sql = `select * from users where email = $1`;
            const result = await client.query(sql, [email]);
            return result.rowCount !== 0 ? result.rows[0] : null;
        },
        async getUserByAccount({ providerAccountId, provider, }) {
            const sql = `
          select u.* from users u join accounts a on u.id = a."userId"
          where 
          a.provider = $1 
          and 
          a."providerAccountId" = $2`;
            const result = await client.query(sql, [provider, providerAccountId]);
            return result.rowCount !== 0 ? result.rows[0] : null;
        },
        async updateUser(user) {
            const fetchSql = `select * from users where id = $1`;
            const query1 = await client.query(fetchSql, [user.id]);
            const oldUser = query1.rows[0];
            const newUser = {
                ...oldUser,
                ...user,
            };
            const { id, name, email, emailVerified, image } = newUser;
            const updateSql = `
        UPDATE users set
        name = $2, email = $3, "emailVerified" = $4, image = $5
        where id = $1
        RETURNING name, id, email, "emailVerified", image
      `;
            const query2 = await client.query(updateSql, [
                id,
                name,
                email,
                emailVerified,
                image,
            ]);
            return query2.rows[0];
        },
        async linkAccount(account) {
            const sql = `
      insert into accounts 
      (
        "userId", 
        provider, 
        type, 
        "providerAccountId", 
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type
      )
      values ($1, $2, $3, $4, $5, to_timestamp($6), $7, $8, $9, $10, $11)
      returning
        id,
        "userId", 
        provider, 
        type, 
        "providerAccountId", 
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type
      `;
            const params = [
                account.userId,
                account.provider,
                account.type,
                account.providerAccountId,
                account.access_token,
                account.expires_at,
                account.refresh_token,
                account.id_token,
                account.scope,
                account.session_state,
                account.token_type,
            ];
            const result = await client.query(sql, params);
            return mapExpiresAt(result.rows[0]);
        },
        async createSession({ sessionToken, userId, expires }) {
            if (userId === undefined) {
                throw Error(`userId is undef in createSession`);
            }
            const sql = `insert into sessions ("userId", expires, "sessionToken")
      values ($1, $2, $3)
      RETURNING id, "sessionToken", "userId", expires`;
            const result = await client.query(sql, [userId, expires, sessionToken]);
            return result.rows[0];
        },
        async getSessionAndUser(sessionToken) {
            if (sessionToken === undefined) {
                return null;
            }
            const result1 = await client.query(`select * from sessions where "sessionToken" = $1`, [sessionToken]);
            if (result1.rowCount === 0) {
                return null;
            }
            const session = result1.rows[0];
            const result2 = await client.query("select * from users where id = $1", [
                session.userId,
            ]);
            if (result2.rowCount === 0) {
                return null;
            }
            const user = result2.rows[0];
            return {
                session,
                user,
            };
        },
        async updateSession(session) {
            const { sessionToken } = session;
            const result1 = await client.query(`select * from sessions where "sessionToken" = $1`, [sessionToken]);
            if (result1.rowCount === 0) {
                return null;
            }
            const originalSession = result1.rows[0];
            const newSession = {
                ...originalSession,
                ...session,
            };
            const sql = `
        UPDATE sessions set
        expires = $2
        where "sessionToken" = $1
        `;
            const result = await client.query(sql, [
                newSession.sessionToken,
                newSession.expires,
            ]);
            return result.rows[0];
        },
        async deleteSession(sessionToken) {
            const sql = `delete from sessions where "sessionToken" = $1`;
            await client.query(sql, [sessionToken]);
        },
        async unlinkAccount(partialAccount) {
            const { provider, providerAccountId } = partialAccount;
            const sql = `delete from accounts where "providerAccountId" = $1 and provider = $2`;
            await client.query(sql, [providerAccountId, provider]);
        },
        async deleteUser(userId) {
            await client.query(`delete from users where id = $1`, [userId]);
            await client.query(`delete from sessions where "userId" = $1`, [userId]);
            await client.query(`delete from accounts where "userId" = $1`, [userId]);
        },
    };
}
