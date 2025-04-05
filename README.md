# Birthday Celebration Website

A beautiful birthday celebration website for Asia Naeem.

## GitHub Pages Deployment

This website is designed to be deployed on GitHub Pages. To deploy:

1. Make sure all files are in the root directory of your repository
2. Go to your repository settings
3. Scroll down to the "GitHub Pages" section
4. Select the branch you want to deploy (usually `main` or `master`)
5. Click "Save"

## Adding Birthday Wishes

To add permanent birthday wishes that will be visible to all visitors:

1. Open the `script.js` file
2. Find the `staticMessages` array near the top of the file
3. Add new message objects to this array in the following format:

```javascript
{
  sender: "Name",
  content: "Your birthday wish message",
  date: "YYYY-MM-DDTHH:MM:SS.000Z"
}
```

4. Save the file and push your changes to GitHub
5. The new messages will appear on the website after deployment

## Files Structure

- `index.html` - Main HTML file
- `style.css` - CSS styles
- `script.js` - JavaScript functionality
- `new.jpg` - CD cover image for the music player

## Customization

You can customize the website by:

- Changing images in the photo gallery
- Updating the countdown date
- Modifying the birthday message
- Adding your own music file 