# Network Sharing Guide - Starset Contributor

## Problem Solved ✅
Tasks now appear when you share your app over the network with friends!

## What Was Fixed

Previously, the app was hardcoded to use `localhost:3000`, which only works on your own computer. Now it uses a configurable API URL that can work over your local network.

## How to Share Your App on Network

### Step 1: Find Your Computer's IP Address

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (WiFi or Ethernet).
Example: `192.168.1.100`

**On Mac/Linux:**
```bash
ifconfig
```
or
```bash
ip addr show
```

### Step 2: Update the .env File

Edit `.env` in the root folder and change:

```bash
# FROM:
VITE_API_URL=http://localhost:3000

# TO (use YOUR IP address):
VITE_API_URL=http://192.168.1.100:3000
```

**Important:** Replace `192.168.1.100` with YOUR actual IP address!

### Step 3: Restart the Frontend

The frontend needs to restart to pick up the new environment variable:

1. Stop the frontend (Ctrl+C in the terminal running `npm run dev`)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 4: Share the Network URL

Now share this URL with your friend:
```
http://YOUR_IP_ADDRESS:5173
```

Example: `http://192.168.1.100:5173`

**Important:** 
- Your friend must be on the SAME WiFi network as you
- Both frontend (port 5173) and backend (port 3000) must be running
- Make sure Windows Firewall allows these ports (see below)

## Firewall Configuration (Windows)

If your friend can't connect, you may need to allow the ports through Windows Firewall:

1. **Open Windows Defender Firewall**
   - Press Win+R, type `wf.msc`, press Enter

2. **Create Inbound Rules**
   - Click "Inbound Rules" → "New Rule"
   - Select "Port" → Next
   - Select "TCP" → Specific local ports: `3000,5173`
   - Allow the connection → Next
   - Check all profiles (Domain, Private, Public) → Next
   - Name: "Starset App Ports" → Finish

## Testing Network Access

### Test Backend (from friend's computer):
Open browser and go to:
```
http://YOUR_IP:3000/admin/tasks
```
You should see JSON data with tasks.

### Test Frontend (from friend's computer):
Open browser and go to:
```
http://YOUR_IP:5173
```
You should see the Starset app, and tasks should load!

## Switching Back to Localhost

When you're done sharing and want to use it locally only:

1. Edit `.env`:
   ```bash
   VITE_API_URL=http://localhost:3000
   ```

2. Restart frontend:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Tasks still not appearing on friend's computer

**Check 1: Is the backend running?**
```bash
# In starset-backend folder
npm run dev
```
Should show: "Backend running on port 3000"

**Check 2: Can friend access backend directly?**
From friend's browser, visit:
```
http://YOUR_IP:3000/admin/tasks
```
If this works but app doesn't, the issue is with frontend config.

**Check 3: Did you restart the frontend after changing .env?**
The frontend must be restarted to pick up new environment variables.

**Check 4: Is the IP address correct?**
- Make sure you used YOUR computer's IP, not your friend's
- Make sure both computers are on the same WiFi network
- Try pinging your IP from friend's computer:
  ```bash
  ping YOUR_IP_ADDRESS
  ```

**Check 5: Firewall blocking?**
- Temporarily disable Windows Firewall to test
- If it works, add firewall rules (see above)

### "CORS error" in browser console

This shouldn't happen with the new CORS configuration, but if it does:
- Make sure backend is running the latest code
- Check that the origin matches the pattern in `app.ts`
- Restart the backend server

### Friend can access frontend but not backend

- Check if backend is running: `npm run dev` in starset-backend folder
- Check firewall settings for port 3000
- Verify backend is listening on all interfaces (0.0.0.0), not just localhost

## Network Architecture

```
Your Computer (192.168.1.100)
├── Frontend (Port 5173) ← Friend accesses this
└── Backend (Port 3000)  ← Frontend calls this

Friend's Computer (192.168.1.105)
└── Browser → http://192.168.1.100:5173
              ↓
              Frontend loads
              ↓
              Calls: http://192.168.1.100:3000/admin/tasks
              ↓
              Tasks appear! ✅
```

## Security Note

⚠️ **Important:** This setup is for LOCAL NETWORK ONLY (same WiFi).

- Don't expose these ports to the internet
- Only share with trusted friends on your network
- For production deployment, use proper hosting services

## Quick Reference

| What | Your Computer | Friend's Computer |
|------|--------------|-------------------|
| Frontend URL | http://localhost:5173 | http://YOUR_IP:5173 |
| Backend URL | http://localhost:3000 | http://YOUR_IP:3000 |
| .env Setting | VITE_API_URL=http://YOUR_IP:3000 | (same .env) |

## Summary

1. ✅ Find your IP address (`ipconfig`)
2. ✅ Update `.env` with `VITE_API_URL=http://YOUR_IP:3000`
3. ✅ Restart frontend (`npm run dev`)
4. ✅ Share `http://YOUR_IP:5173` with friend
5. ✅ Both must be on same WiFi
6. ✅ Configure firewall if needed

That's it! Your friend should now see the tasks! 🎉
