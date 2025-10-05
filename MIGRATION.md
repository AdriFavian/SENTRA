# MongoDB to PostgreSQL Migration Guide

This guide will help you migrate your SENTRA application from MongoDB to PostgreSQL.

## Prerequisites

1. **PostgreSQL Installation**: Make sure PostgreSQL is installed on your system
   - Download from: https://www.postgresql.org/download/
   - Or use a cloud service like AWS RDS, Google Cloud SQL, or Heroku Postgres

2. **Database Setup**: Create a new PostgreSQL database for your application
   ```sql
   CREATE DATABASE SENTRA;
   CREATE USER SENTRA_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE SENTRA TO SENTRA_user;
   ```

## Migration Steps

### 1. Update Environment Variables

Update your `.env.local` file with PostgreSQL connection details:

```bash
# PostgreSQL connection string
DATABASE_URL=postgresql://username:password@localhost:5432/SENTRA

# Alternative connection parameters (if not using DATABASE_URL):
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=SENTRA
# DB_USER=username
# DB_PASSWORD=password
```

### 2. Install Dependencies

The migration script has already updated your `package.json` to use PostgreSQL instead of MongoDB:

```bash
npm install
```

### 3. Run Migration Script

Execute the migration script to set up your PostgreSQL tables:

```bash
node scripts/migrate-to-postgres.js
```

This script will:
- Create the `cctvs` and `accidents` tables
- Set up proper indexes and constraints
- Add triggers for automatic timestamp updates
- Insert sample data if tables are empty

### 4. Data Migration (if you have existing MongoDB data)

If you have existing data in MongoDB that you want to migrate:

1. **Export MongoDB data**:
   ```bash
   mongoexport --db SENTRA --collection cctvs --out cctvs.json
   mongoexport --db SENTRA --collection accidents --out accidents.json
   ```

2. **Create a custom import script** or manually insert the data into PostgreSQL tables

### 5. Test Your Application

Start your application and test the API endpoints:

```bash
npm run dev
```

Test these endpoints:
- `GET /api/cctvs` - List all CCTVs
- `POST /api/cctvs` - Create a new CCTV
- `GET /api/accidents` - List all accidents  
- `POST /api/accidents` - Create a new accident

## Key Changes Made

### Database Connection
- Replaced `mongoose` with `pg` (PostgreSQL client)
- Updated connection logic in `utils/connectDB.js`

### Models
- Converted Mongoose schemas to PostgreSQL table structures
- Updated models to use raw SQL queries instead of Mongoose methods
- Maintained the same API interface for compatibility

### API Routes
- Updated all API routes to work with the new PostgreSQL models
- Added proper error handling
- Maintained the same response format

### Schema Mapping

| MongoDB | PostgreSQL |
|---------|------------|
| `_id` (ObjectId) | `id` (SERIAL PRIMARY KEY) |
| `createdAt` | `created_at` |
| `updatedAt` | `updated_at` |
| Embedded objects | Separate columns |
| References | Foreign keys |

## Troubleshooting

### Connection Issues
- Verify PostgreSQL is running
- Check connection string format
- Ensure database and user exist
- Verify firewall/network settings

### Query Errors
- Check table names and column names
- Verify data types match
- Ensure foreign key constraints are satisfied

### Performance
- Add indexes for frequently queried columns
- Consider connection pooling for production

## Production Considerations

1. **Environment Variables**: Use secure environment variable management
2. **Connection Pooling**: The current setup uses connection pooling via `pg.Pool`
3. **Migrations**: Consider using a migration tool like `node-pg-migrate` for future schema changes
4. **Backup**: Set up regular database backups
5. **Monitoring**: Implement database monitoring and logging

## Rollback Plan

If you need to rollback to MongoDB:
1. Restore your original code from version control
2. Restore your MongoDB data from backups
3. Update environment variables back to MongoDB settings

## Support

If you encounter issues during migration:
1. Check the application logs
2. Verify database connections
3. Test individual API endpoints
4. Review the PostgreSQL logs for detailed error messages