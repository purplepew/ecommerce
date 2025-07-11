# Vercel Deployment Debug Checklist

## Environment Variables
Make sure these are set in your Vercel project settings:

### Required Environment Variables:
1. `DATABASE_URL` - Your PostgreSQL connection string
2. `NEXT_PUBLIC_BASE_URL` - Your Vercel deployment URL (e.g., https://your-app.vercel.app)
3. `JWT_ACCESS_TOKEN_SECRET` - Secret for JWT access tokens
4. `JWT_REFRESH_TOKEN_SECRET` - Secret for JWT refresh tokens
5. `GOOGLE_CLIENT_ID` - Google OAuth client ID
6. `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
7. `GOOGLE_REDIRECT_URI` - Google OAuth redirect URI (should be your Vercel URL + /api/google/callback)

## Database Setup
1. Ensure your PostgreSQL database is accessible from Vercel
2. Run migrations: `npx prisma db push` or `npx prisma migrate deploy`
3. Verify database connection in Vercel logs

## Build Configuration
1. Check that `postinstall` script runs: `prisma generate`
2. Verify Prisma client is generated correctly
3. Ensure all dependencies are installed

## Debugging Steps

### 1. Check Vercel Function Logs
- Go to your Vercel dashboard
- Navigate to Functions tab
- Check for any errors in `/api/graphql` function

### 2. Test Database Connection
- Add console logs to verify DATABASE_URL is set
- Check if Prisma can connect to database
- Verify database schema matches your local setup

### 3. Test API Endpoint
- Use the debug component to test `/api/graphql` directly
- Check network tab in browser dev tools
- Verify CORS settings if needed

### 4. Check RTK Query Configuration
- Verify baseUrl is set correctly
- Check if requests are being made
- Look for error responses

## Common Issues and Solutions

### Issue: Empty RTK Responses
**Possible Causes:**
- Missing or incorrect `NEXT_PUBLIC_BASE_URL`
- Database connection issues
- GraphQL query errors
- CORS issues

**Solutions:**
1. Set `NEXT_PUBLIC_BASE_URL` to your Vercel URL
2. Check database connection logs
3. Add error handling to GraphQL resolvers
4. Verify CORS configuration

### Issue: Database Connection Errors
**Possible Causes:**
- Missing `DATABASE_URL` environment variable
- Database not accessible from Vercel
- Wrong database URL format

**Solutions:**
1. Verify `DATABASE_URL` is set in Vercel
2. Check database accessibility
3. Use connection pooling if needed

### Issue: Build Failures
**Possible Causes:**
- Missing dependencies
- Prisma generation issues
- TypeScript errors

**Solutions:**
1. Check build logs in Vercel
2. Ensure `postinstall` script runs
3. Fix any TypeScript errors

## Testing Commands

### Local Testing
```bash
# Test database connection
npx prisma db push

# Test build
npm run build

# Test production build locally
npm run start
```

### Vercel Testing
1. Deploy to Vercel
2. Check function logs
3. Use debug component to test API
4. Monitor network requests

## Monitoring
- Set up Vercel Analytics
- Monitor function execution times
- Check error rates
- Set up alerts for failures

## Next Steps
1. Deploy these changes to Vercel
2. Check the debug component output
3. Review Vercel function logs
4. Test API endpoints directly
5. Verify environment variables are set correctly 