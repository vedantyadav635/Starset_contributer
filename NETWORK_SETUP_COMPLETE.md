# ✅ NETWORK SHARING - READY TO USE!

## What I Fixed

Your app was using `localhost:3000` which only works on your computer. I've updated it to use your network IP address so friends can access it.

## Your Network Setup

- **Your IP Address:** `192.168.1.5`
- **Frontend URL (for friends):** `http://192.168.1.5:5173`
- **Backend URL:** `http://192.168.1.5:3000`

## IMPORTANT: Restart Frontend Now! 🔄

The `.env` file has been updated, but you need to restart the frontend to apply changes:

### In the terminal running the frontend:
1. Press `Ctrl+C` to stop it
2. Run: `npm run dev`

## Share This URL With Your Friend

```
http://192.168.1.5:5173
```

**Requirements:**
- ✅ Your friend must be on the SAME WiFi network as you
- ✅ Both frontend and backend must be running
- ✅ Windows Firewall must allow ports 3000 and 5173 (see below)

## Quick Firewall Fix (If Needed)

If your friend can't connect, run this in PowerShell (as Administrator):

```powershell
# Allow port 3000 (backend)
New-NetFirewallRule -DisplayName "Starset Backend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Allow port 5173 (frontend)
New-NetFirewallRule -DisplayName "Starset Frontend" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
```

Or manually:
1. Search "Windows Defender Firewall" in Start menu
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → TCP → Specific ports: `3000,5173`
5. Allow the connection → Name it "Starset App"

## Testing

### Test 1: Can you access it locally?
Open your browser: `http://localhost:5173`
- Should work ✅

### Test 2: Can you access it via network IP?
Open your browser: `http://192.168.1.5:5173`
- Should work ✅

### Test 3: Can friend access backend?
From friend's browser: `http://192.168.1.5:3000/admin/tasks`
- Should show JSON with tasks ✅

### Test 4: Can friend access frontend?
From friend's browser: `http://192.168.1.5:5173`
- Should show app with tasks ✅

## Troubleshooting

### Tasks still not showing for friend?

1. **Did you restart the frontend?** (Most common issue!)
   - Stop with Ctrl+C
   - Start with `npm run dev`

2. **Is backend running?**
   - Check the other terminal
   - Should say "Backend running on port 3000"

3. **Same WiFi network?**
   - Both computers must be on the same network
   - Check WiFi name on both computers

4. **Firewall blocking?**
   - Run the PowerShell commands above
   - Or temporarily disable firewall to test

5. **Check browser console** (F12)
   - Look for errors
   - Check Network tab for failed requests

## What Changed in the Code

✅ Created `config/api.ts` - Centralized API configuration
✅ Updated `App.tsx` - Uses API config instead of hardcoded localhost
✅ Updated `TaskExecution.tsx` - Uses API config for submissions
✅ Updated `starset-backend/src/app.ts` - CORS allows network IPs
✅ Updated `.env` - Set to your network IP (192.168.1.5)

## Switching Back to Localhost Only

When you're done sharing, edit `.env`:

```bash
VITE_API_URL=http://localhost:3000
```

Then restart frontend.

## Summary

1. ✅ Code is updated
2. ✅ .env is configured with your IP
3. ⏳ **YOU NEED TO:** Restart the frontend (Ctrl+C, then `npm run dev`)
4. ⏳ **THEN SHARE:** `http://192.168.1.5:5173` with your friend
5. ⏳ **IF NEEDED:** Configure firewall

That's it! After restarting the frontend, your friend should see the tasks! 🎉

---

**For detailed instructions, see:** `NETWORK_SHARING_GUIDE.md`
