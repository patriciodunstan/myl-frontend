#!/bin/sh
set -e

# Replace ${BACKEND_URL} and $PORT in nginx template with actual env vars
export BACKEND_URL=${BACKEND_URL:-https://myl-database-production.up.railway.app}
export PORT=${PORT:-80}

envsubst '${BACKEND_URL} ${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Starting nginx on port $PORT, proxying API to $BACKEND_URL"
exec nginx -g 'daemon off;'
