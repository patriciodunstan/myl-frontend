#!/bin/sh
set -e

# Replace env vars in nginx template with actual values
export BACKEND_URL=${BACKEND_URL:-https://myl-database-production.up.railway.app}
export ADVISOR_URL=${ADVISOR_URL:-http://localhost:8000}
export PORT=${PORT:-80}

envsubst '${BACKEND_URL} ${ADVISOR_URL} ${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Starting nginx on port $PORT, proxying API to $BACKEND_URL, Advisor to $ADVISOR_URL"
exec nginx -g 'daemon off;'
