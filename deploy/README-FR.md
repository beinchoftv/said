# StockJomla - Guide de déploiement cPanel (Français)

## Contenu de l'archive
Le fichier `stockjomla-cpanel.zip` contient la **version de production** prête à être déployée sur un hébergement cPanel. Aucun Node.js, npm ou outil n'est nécessaire sur l'hébergement : ce sont des fichiers statiques (HTML/CSS/JS).

---

## 🚀 Étapes de déploiement sur cPanel

### Étape 1 : Gestionnaire de fichiers
1. Connectez-vous à votre cPanel.
2. Dans la section **Fichiers**, cliquez sur **Gestionnaire de fichiers**.
3. Ouvrez le dossier `public_html` (ou le sous-dossier de votre sous-domaine).

### Étape 2 : Téléverser et extraire
1. Cliquez sur **Téléverser**.
2. Uploadez `stockjomla-cpanel.zip` dans `public_html`.
3. Une fois terminé, faites un clic droit sur le fichier .zip → **Extraire**.
4. Vérifiez que `index.html` se trouve directement dans `public_html/` (pas dans un sous-dossier).

### Étape 3 : Fichier .htaccess (déjà inclus)
- Le fichier `.htaccess` est inclus : il redirige toutes les routes vers `index.html` (obligatoire pour React Router), active la compression gzip et le cache des assets.
- Fonctionne sur la plupart des hébergeurs marocains (Apache / LiteSpeed).

### Étape 4 : Accéder au site
Ouvrez votre domaine : la page d'accueil de StockJomla s'affiche.

---

## 🔑 Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Fournisseur (démo avec produits) | `demo@stockjomla.ma` | `demo123` |
| Super Admin | `admin@stockjomla.ma` | `admin123` |

> 💡 Cette version stocke les données dans le `localStorage` du navigateur. Pour une base de données réelle et l'API WhatsApp Business, un backend (Node.js / Laravel) est nécessaire — cette version frontend est complète pour la démo.

---

## 💬 WhatsApp
L'application utilise les liens officiels `wa.me/<numero>` qui fonctionnent sans clé API. Quand un client clique sur « Envoyer la commande via WhatsApp », WhatsApp Web ou l'app s'ouvre avec le message pré-rempli.

---

## 🛠️ Pour modifier le code source
Une deuxième archive `stockjomla-source.zip` contient l'intégralité du code React :
```bash
npm install
npm run dev      # serveur de dev
npm run build    # build de production dans dist/
```
Puis uploadez le contenu de `dist/` + `.htaccess` vers `public_html`.
