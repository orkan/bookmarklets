![logo](https://github.com/user-attachments/assets/e3e37642-64d7-42e9-99a9-44716b3c770f)

# Ping `v1.3.8`

Ping local PHP server from within bookmarklet overlay.

## Bookmarklet

```bash
javascript:(()=>{window.ork={url:%22https://orkan.github.io/bookmarklets%22,mod:%22ping%22,max:%22125px%22,end:%22http://localhost:6011/src/ping/end.php%22};const p=document.createElement(%22script%22);p.src=window.ork.url+%22/src/app/app.js%22,p.type=%22module%22,document.body.appendChild(p)})();
```
