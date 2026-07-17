const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const dir = 'c:\\Users\\mukti\\Desktop\\Vyoma\\public\\images\\partners';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const attemptDownload = (urls, filepath, index = 0) => {
    if (index >= urls.length) {
        console.log(`Failed all attempts for ${filepath}`);
        return;
    }

    const url = urls[index];
    const file = fs.createWriteStream(filepath);

    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
    };

    const client = url.startsWith('https') ? https : http;

    client.get(url, options, (response) => {
        // Follow redirects
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            const redirectUrl = new URL(response.headers.location, url).href;
            file.close();
            fs.unlink(filepath, () => { });
            attemptDownload([redirectUrl], filepath, 0);
            return;
        }

        if (response.statusCode !== 200) {
            file.close();
            fs.unlink(filepath, () => { });
            console.log(`Status ${response.statusCode} for ${url}. Trying next...`);
            attemptDownload(urls, filepath, index + 1);
            return;
        }

        response.pipe(file);
        file.on('finish', () => {
            file.close();
            // Check content-type to verify it is not html
            const mime = response.headers['content-type'] || '';
            const size = fs.statSync(filepath).size;
            if (mime.includes('html') || size < 1000) {
                fs.unlink(filepath, () => { });
                console.log(`Downloaded content was HTML or too small (${size} bytes) for ${url}. Trying next...`);
                attemptDownload(urls, filepath, index + 1);
            } else {
                console.log(`SUCCESS: Downloaded ${filepath} from ${url} (${size} bytes, type ${mime})`);
            }
        });
    }).on('error', (err) => {
        file.close();
        fs.unlink(filepath, () => { });
        console.log(`Error on ${url}: ${err.message}. Trying next...`);
        attemptDownload(urls, filepath, index + 1);
    });
};

attemptDownload([
    'https://ihubgujarat.in/assets/images/logo/logo.png',
    'https://ihubgujarat.in/images/logo.png',
    'https://ihubgujarat.in/assets/logo.png',
    'https://ihubgujarat.in/assets/images/logo.png'
], path.join(dir, 'ihub.png'));

attemptDownload([
    'https://ssipgujarat.in/img/logo.png',
    'https://ssipgujarat.in/img/SSIP_Logo.png',
    'http://www.ssipgujarat.in/images/ssip_logo.png'
], path.join(dir, 'ssip.png'));

attemptDownload([
    'https://gtuventures.com/wp-content/uploads/2021/11/logo-GTU-Ventures-1.png',
    'https://gtuventures.com/wp-content/uploads/2021/11/cropped-logo-GTU-Ventures-2.png'
], path.join(dir, 'Gtu.webp'));

attemptDownload([
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo.svg/320px-Nvidia_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg'
], path.join(dir, 'nvidia.webp'));

attemptDownload([
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Startup_India_Logo.png/320px-Startup_India_Logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/e/e9/Startup_India_Logo.png'
], path.join(dir, 'startup.jpeg'));
