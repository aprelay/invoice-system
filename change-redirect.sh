#!/bin/bash

# Change Redirect URL Script
# Usage: ./change-redirect.sh "https://your-new-url.com/page.html"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔧 Change Redirect URL Tool${NC}"
echo "=================================="
echo ""

# Check if URL provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: No URL provided${NC}"
    echo ""
    echo "Usage: ./change-redirect.sh \"https://your-site.com/page.html\""
    echo ""
    echo "Examples:"
    echo "  ./change-redirect.sh \"https://google.com/search\""
    echo "  ./change-redirect.sh \"https://mysite.com/success.html\""
    echo "  ./change-redirect.sh \"https://crm.com/lead?email=EMAIL\""
    echo ""
    exit 1
fi

NEW_URL="$1"

echo -e "${YELLOW}📝 Current redirect URL:${NC}"
grep -n "const finalURL =" /home/user/webapp/public/Inv.html | tail -1

echo ""
echo -e "${YELLOW}🔄 New redirect URL:${NC}"
echo "$NEW_URL"
echo ""

# Ask for confirmation
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Cancelled${NC}"
    exit 1
fi

# Backup current file
cp /home/user/webapp/public/Inv.html /home/user/webapp/public/Inv.html.backup
echo -e "${GREEN}✅ Backup created: Inv.html.backup${NC}"

# Check if URL should include email parameter
if [[ "$NEW_URL" == *"EMAIL"* ]]; then
    # User wants to include email parameter
    NEW_LINE="            const finalURL = '${NEW_URL/EMAIL/\' + encodeURIComponent(email) + \'}';
    
    echo -e "${YELLOW}📧 Email parameter detected - will pass email in URL${NC}"
else
    # Simple URL without email
    NEW_LINE="            const finalURL = '$NEW_URL';"
    
    echo -e "${YELLOW}📄 Simple URL - no email parameter${NC}"
fi

# Replace the line
sed -i "317s|.*|$NEW_LINE|" /home/user/webapp/public/Inv.html

echo -e "${GREEN}✅ File updated${NC}"
echo ""

# Show the change
echo -e "${YELLOW}📝 New line 317:${NC}"
sed -n '317p' /home/user/webapp/public/Inv.html

echo ""
echo -e "${YELLOW}🚀 Deploy to production?${NC}"
read -p "Deploy now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd /home/user/webapp
    git add public/Inv.html
    git commit -m "Changed redirect URL to $NEW_URL"
    git push origin main
    
    echo ""
    echo -e "${GREEN}✅ Deployed! Changes will be live in 2-3 minutes${NC}"
    echo ""
    echo -e "${YELLOW}Test with:${NC}"
    echo "  curl https://site.cam/Inv.html | grep finalURL"
else
    echo -e "${YELLOW}⏸️  Changes saved locally but not deployed${NC}"
    echo ""
    echo -e "${YELLOW}To deploy later:${NC}"
    echo "  cd /home/user/webapp"
    echo "  git add public/Inv.html"
    echo "  git commit -m 'Updated redirect URL'"
    echo "  git push origin main"
fi

echo ""
echo -e "${GREEN}✅ Done!${NC}"
