# Files Identified for Cleanup

## Test Files (Development/Testing Only)
- `src/app/test-cart/page.js` - Test cart functionality
- `src/app/payment-test/page.js` - Payment testing page
- `src/app/cart-test/page.js` - Cart testing page
- `src/app/complete-test/page.js` - Complete test page
- `src/app/debug-cart/page.js` - Debug cart page
- `src/app/api/test-auth/route.js` - Authentication testing API
- `src/app/api/test-order/route.js` - Order testing API
- `src/app/api/db-auth-test/route.js` - Database auth testing
- `src/app/api/auth-test/route.js` - Auth testing API
- `src/app/api/debug/route.js` - Debug API endpoint
- `test-payment-flow.js` - Root level test file

## Duplicate/Backup Files (_new suffix)
- `src/lib/mongodb_new.js` - Duplicate MongoDB connection
- `src/app/layout_new.js` - Duplicate layout file
- `src/app/checkout/page_new.js` - Duplicate checkout page
- `src/app/api/products/route_new.js` - Duplicate products API
- `src/app/api/payment/verify/route_new.js` - Duplicate payment verify API

## Seed/Development Data Files
- `src/app/api/seed-orders/route.js` - Development seed data
- `src/app/api/seed/route.js` - General seed data
- `scripts/seed.js` - Seed script

## Other Development Files
- `TOAST_USAGE_EXAMPLES.js` - Documentation/example file
- `start-dev.bat` - Development batch script

## Build Cache (Safe to Delete)
- `.next/cache/webpack/*/index.pack.gz.old` - Old webpack cache files

**Total Files to Remove: ~20+ files**

These files are safe to delete as they are:
1. Testing/debugging utilities
2. Duplicate versions of existing files
3. Development seed data
4. Documentation examples
5. Old cache files
