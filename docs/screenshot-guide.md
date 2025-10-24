# Screenshot Guide for README

## Quick Screenshot Checklist

### 1. Dashboard Overview
- [ ] Open `http://localhost:3000` in your browser
- [ ] Login to the application
- [ ] Navigate to the main dashboard
- [ ] Take a full-page screenshot
- [ ] Save as `docs/dashboard-overview.png`
- [ ] Resize to 800px width

### 2. Login Page
- [ ] Open `http://localhost:3000` in incognito/private mode
- [ ] Take screenshot of the Keycloak login page
- [ ] Save as `docs/login-page.png`
- [ ] Resize to 600px width

### 3. Recognition Creation
- [ ] On the dashboard, click "Create Recognition" button
- [ ] Take screenshot of the modal/form
- [ ] Save as `docs/recognition-creation.png`
- [ ] Resize to 600px width

### 4. User Profile
- [ ] Navigate to user profile page
- [ ] Take screenshot showing profile info and image upload
- [ ] Save as `docs/user-profile.png`
- [ ] Resize to 600px width

### 5. Mobile View
- [ ] Open browser developer tools (F12)
- [ ] Switch to mobile view (iPhone/Android)
- [ ] Take screenshot of mobile dashboard
- [ ] Save as `docs/mobile-view.png`
- [ ] Resize to 300px width

## Browser Developer Tools for Mobile Screenshots

1. **Chrome/Edge:**
   - Press F12
   - Click device toggle icon (📱)
   - Select iPhone 12 Pro or similar
   - Take screenshot

2. **Firefox:**
   - Press F12
   - Click responsive design mode
   - Select mobile device
   - Take screenshot

## Image Optimization

### Recommended Tools:
- **Online:** TinyPNG, Squoosh
- **Desktop:** ImageOptim (Mac), RIOT (Windows)
- **Command Line:** ImageMagick

### Optimization Commands:
```bash
# Resize and optimize PNG
magick input.png -resize 800x -quality 85 output.png

# Resize and optimize GIF
magick input.gif -resize 600x -quality 85 output.gif
```

## Quick Start Commands

```bash
# Start the development server
npm run dev

# Open in browser
start http://localhost:3000  # Windows
open http://localhost:3000   # Mac
```

## Pro Tips

1. **Consistent Styling:**
   - Use the same browser for all screenshots
   - Keep browser zoom at 100%
   - Use consistent window size

2. **Quality:**
   - Ensure good contrast and lighting
   - Remove any personal data
   - Use high resolution

3. **Organization:**
   - Name files descriptively
   - Keep consistent naming convention
   - Organize in the `docs/` folder

4. **Testing:**
   - Test that images load in README
   - Check on different devices
   - Verify image quality
