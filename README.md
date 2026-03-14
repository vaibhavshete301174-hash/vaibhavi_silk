# Vaibhavi Silk Website

Your complete saree shop website — ready for GitHub Pages (free hosting).

---

## Files in this folder

```
saree-store/
├── index.html      ← Main website
├── style.css       ← All styling
├── script.js       ← Filters, order forms, WhatsApp
├── images/         ← Put your saree photos here
│   ├── saree1.jpg
│   ├── saree2.jpg
│   └── ...
└── README.md       ← This guide
```

---

## Step 1 — Add your saree photos

Create an `images/` folder and name your photos:
- `saree1.jpg` → Kanjivaram Silk
- `saree2.jpg` → Cotton Daily Wear
- `saree3.jpg` → Banarasi Georgette
- `saree4.jpg` → Floral Printed
- `saree5.jpg` → Sequin Party Wear
- `saree6.jpg` → Chanderi Silk

Photos should be portrait shape (taller than wide). JPG or PNG, any size.

---

## Step 2 — Update your details in script.js

Open `script.js` and change these 4 lines at the top:

```js
const CONFIG = {
  whatsappNumber: '918830354532',   // ← Your WhatsApp with 91 prefix
  upiId:          'vaibhavishete2788k@kotak', // ← Your UPI ID
  shopName:       'Priya Sarees',    // ← Your shop name
  ownerPhone:     '8830354532',      // ← Your phone number
};
```

Also update the WhatsApp link in `index.html` — search for `wa.me/919999999999` and replace with your number.

---

## Step 3 — Put it on GitHub Pages (Free Hosting)

### A. Create a GitHub account
Go to https://github.com and sign up (free).

### B. Create a new repository
1. Click the **+** button → **New repository**
2. Name it: `priya-sarees` (or anything you like)
3. Set it to **Public**
4. Click **Create repository**

### C. Upload your files
1. Click **Upload files**
2. Drag and drop ALL your files: `index.html`, `style.css`, `script.js`, and the `images/` folder
3. Click **Commit changes**

### D. Enable GitHub Pages
1. Go to your repository → **Settings** tab
2. In the left menu, click **Pages**
3. Under **Branch**, select `main` → Click **Save**
4. Wait 1–2 minutes
5. Your website will be live at:
   **https://YOUR-USERNAME.github.io/priya-sarees**

That's it! Your website is live. No payment needed.

---

## Later: Add a custom domain (e.g. priyasarees.in)

1. Buy a domain from GoDaddy, Namecheap, or BigRock (~₹700–900/year for .in)
2. In GitHub Pages settings, enter your custom domain
3. At your domain registrar, add a CNAME record pointing to `YOUR-USERNAME.github.io`
4. Wait a few hours — your domain will work

---

## How orders reach you

When a customer clicks **Submit Order**, the website:
1. Opens WhatsApp with a pre-filled message containing all order details
2. Customer just taps **Send** in WhatsApp
3. You receive the order on WhatsApp on your phone

For the "Order this saree" buttons (from product cards):
- The saree name, price, and type are automatically included
- Customer just fills name, phone, quantity, and payment screenshot
- You receive the full order details on WhatsApp

---

## Adding more sarees

Open `index.html` and find the product cards section.
Copy one product card block and change:
- `data-category` → silk / cotton / banarasi / printed / party
- `src="images/sareeN.jpg"` → your photo filename
- Card name, description, price
- The `onclick` in the order button — update name, price, image, type

---

## Questions?

Ask Claude for help with any changes!
