# 📺 DaddyLive M3U Builder

A clean, self-hosted web app that lets you build and customize your own M3U playlists using links from DaddyLive mirrors — all with a beautiful interface and no shady third-party apps. Designed for educational use, metadata testing, and IPTV hobbyists.

---

## 🌟 Why This Exists

If you've ever wanted to:
- Watch live sports with minimal fuss
- Create your **own playlist** that works in VLC, IPTV apps, or Stremio
- Control channel metadata (names, logos, EPGs)
- Avoid sketchy apps, fake links, or paywalls

…then this tool is for you. No streaming, no hosting—just **clean M3U generation** based on publicly available info.

---

## 💡 What It Does

- 🔗 Paste a DaddyLive URL (like `https://daddylivehd.sx/stream/espn.php`)
- 🧠 Extracts the underlying stream logic (educational only!)
- 🧾 Lets you edit:
  - Channel name
  - `tvg-id` (for EPG)
  - Logo URL
  - Backup streams
- ✅ Exports a ready-to-use `.m3u` file
- ✨ Works 100% in your browser (self-hosted, no backend unless you want a proxy)

---

## 🖥️ Tech Stack

| Tool       | Purpose                         |
|------------|----------------------------------|
| Next.js    | React-based frontend             |
| TailwindCSS| Clean, responsive UI styling     |
| Axios      | Fetch and parse external URLs    |
| Cheerio    | HTML parsing (like jQuery in Node) |
| Vercel     | 1-click deploy to the web        |

---

## 🚀 Depoly [Coming soon]


---

🛡️ Disclaimer

This project does not host or stream any media. It does not bypass any protection or DRM. It only formats user-input URLs into .m3u format for testing and education.
Use responsibly. Always follow your local laws and copyright regulations.


——

❤️ Support & Feedback

Made with love by a curious dev who wanted to make IPTV just a little more user-friendly.
If you found this useful, star the repo ⭐, open issues 🐛, or suggest features 🧠.
