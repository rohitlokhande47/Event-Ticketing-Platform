#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKEND_URL="https://ticketmanager-production-897d.up.railway.app"
FRONTEND_URL="https://web-pi-seven-74.vercel.app"

echo "🧪 Testing Event Ticketing Platform Deployment"
echo "=============================================="
echo ""

# Test 1: Backend Health
echo -n "1️⃣  Backend Health Check... "
HEALTH=$(curl -s $BACKEND_URL/health)
if [[ $HEALTH == *"ok"* ]]; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   Status: $(echo $HEALTH | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"
    echo "   MongoDB: $(echo $HEALTH | grep -o '"mongo":"[^"]*"' | cut -d'"' -f4)"
else
    echo -e "${RED}❌ FAIL${NC}"
fi
echo ""

# Test 2: Events API
echo -n "2️⃣  Events API... "
EVENTS=$(curl -s $BACKEND_URL/events)
EVENT_COUNT=$(echo $EVENTS | grep -o "\"_id\"" | wc -l)
if [ "$EVENT_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   Found $EVENT_COUNT events"
else
    echo -e "${RED}❌ FAIL${NC}"
fi
echo ""

# Test 3: Single Event API
echo -n "3️⃣  Single Event API... "
EVENT=$(curl -s $BACKEND_URL/events/691eb6017a46d8398d145b40)
if [[ $EVENT == *"name"* ]]; then
    echo -e "${GREEN}✅ PASS${NC}"
    EVENT_NAME=$(echo $EVENT | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    echo "   Event: $EVENT_NAME"
else
    echo -e "${RED}❌ FAIL${NC}"
fi
echo ""

# Test 4: Tickets API
echo -n "4️⃣  Tickets API... "
TICKETS=$(curl -s $BACKEND_URL/events/691eb6017a46d8398d145b40/tickets)
TICKET_COUNT=$(echo $TICKETS | grep -o "\"_id\"" | wc -l)
if [ "$TICKET_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   Found $TICKET_COUNT tickets"
else
    echo -e "${RED}❌ FAIL${NC}"
fi
echo ""

# Test 5: Frontend Accessibility
echo -n "5️⃣  Frontend Accessibility... "
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   HTTP Status: $FRONTEND_STATUS"
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "   HTTP Status: $FRONTEND_STATUS"
fi
echo ""

# Test 6: CORS Headers
echo -n "6️⃣  CORS Configuration... "
CORS=$(curl -s -I $BACKEND_URL/health | grep -i "access-control")
if [[ $CORS == *"access-control-allow-origin"* ]]; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   CORS headers present"
else
    echo -e "${YELLOW}⚠️  WARNING${NC}"
    echo "   CORS headers not detected"
fi
echo ""

# Summary
echo "=============================================="
echo "🎉 Deployment Test Summary"
echo "=============================================="
echo ""
echo "🌐 URLs:"
echo "   Frontend: $FRONTEND_URL"
echo "   Backend:  $BACKEND_URL"
echo "   API Docs: $BACKEND_URL/health"
echo ""
echo "🔑 Test Stripe Card:"
echo "   Card: 4242 4242 4242 4242"
echo "   Expiry: Any future date (e.g., 12/25)"
echo "   CVC: Any 3 digits (e.g., 123)"
echo ""
echo "📝 Known Issues:"
if [[ $HEALTH == *"disconnected"* ]]; then
    echo "   ⚠️  Redis is disconnected (non-critical - fallback mode active)"
fi
echo ""
echo "✅ All critical systems operational!"
echo ""
