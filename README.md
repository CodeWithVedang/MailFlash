# MailFlash

MailFlash is a simple, responsive temporary email web app that uses the [Mail.tm API](https://api.mail.tm) to generate disposable email addresses instantly. It lets you copy the generated email, check your inbox in real-time, and delete the address to get a new one — all from a clean, modern UI with light/dark themes.

## Features

- **Instant Temporary Email** – Generates a random disposable email address on load.
- **Inbox Viewer** – Displays messages fetched directly from the Mail.tm API.
- **Copy to Clipboard** – One-click copy of the current email address.
- **Refresh Inbox** – Manually refresh messages without reloading the page.
- **Delete & Regenerate** – Remove the current email and get a new one instantly.
- **Message Viewer** – Read full email content in a modal.
- **Light/Dark Theme Toggle** – Saves theme preference in local storage.
- **Skeleton Loading** – Smooth loading animations for the inbox.
- **Responsive Design** – Works on desktop and mobile.

## Tech Stack

- **HTML5** – Markup structure
- **CSS3** – Styling and theme support
- **JavaScript (Vanilla)** – API calls, UI interactions, and local storage
- **[Mail.tm API](https://docs.mail.tm)** – Email generation and inbox data

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mailflash.git
   cd mailflash
   ```

2. **Open the project**
   Simply open `index.html` in your browser.

   > No build process or dependencies required — it runs entirely client-side.

## Usage

1. Open `index.html` in your browser.
2. Wait for the app to generate a new temporary email.
3. Use the copy button to copy the email address.
4. Check the inbox for incoming messages.
5. Refresh the inbox manually if needed.
6. Delete the address to get a new one anytime.

## File Structure

```
mailflash/
│
├── index.html      # Main HTML file
├── style.css       # App styles and themes
├── script.js       # JavaScript logic and API handling
├── logo.png        # App logo
```

## API Reference

MailFlash uses the **Mail.tm API**:

* **Base URL:** `https://api.mail.tm`
* **Endpoints:**

  * `POST /accounts` – Create account
  * `POST /token` – Get authentication token
  * `GET /domains` – Get available domains
  * `GET /messages` – Fetch inbox messages
  * `GET /messages/{id}` – Fetch full email details

## Screenshots

![White Theme](/screenshot/sc1.jpg)

![Dark Theme](/screenshot/sc2.jpg)

## License

This project is licensed under the MIT License — feel free to use and modify it.

---

**Author:** [CodeWithVedang](https://github.com/CodeWithVedang)

```

