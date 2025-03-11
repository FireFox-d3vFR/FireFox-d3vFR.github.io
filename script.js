const download = document.querySelector(".download");
const dark = document.querySelector(".dark");
const light = document.querySelector(".light");
const qrContainer = document.querySelector("#qr-code");
const qrText = document.querySelector(".qr-text");
const shareBtn = document.querySelector(".share-btn");
const sizes = document.querySelector(".sizes");

// Ecouteurs d'évenements pour les éléments du DOM
dark.addEventListener("input", handleDarkColor);
light.addEventListener("input", handleLightColor);
qrText.addEventListener("input", handleQRText);
sizes.addEventListener("change", handleSize);
shareBtn.addEventListener("click", handleShare);

const defaultUrl = "https://youtu.be/u5Ho1trvlro";
let colorLight = "#fff",
    colorDark = "#000",
    text = defaultUrl,
    size = 400;

// Fonction de gestion de la couleur foncée
function handleDarkColor(e) {
    colorDark = e.target.value;
    generateQRCode();
}

// Fonction de gestion de la couleur claire
function handleLightColor(e) {
    colorLight = e.target.value;
    generateQRCode();
}

// Fonction de gestion du texte du QR Code
function handleQRText(e) {
    const value = e.target.value;
    text = value;
    if (!value) {
        text = defaultUrl;
    }
    generateQRCode();
}

// Génération du QR Code
async function generateQRCode() {
    qrContainer.innerHTML = "";
    new QRCode("qr-code", {
        text,
        height: size,
        width: size,
        colorLight,
        colorDark,
    });
    download.href = await resolveDataUrl();
}

// Gestion du partage du QR Code
async function handleShare() {
    setTimeout(async () => {
        try {
            const base64url = await resolveDataUrl();
            const blob = await (await fetch(base64url)).blob();
            const file = new File([blob], "QRCode.png", {
                type: blob.type,
            });
            await navigator.share({
                files: [file],
                title: text,
            });
        } catch (error) {
            alert("Your browser doesn't support sharing.");
        }
    }, 100);
}

// Gestion de la taille du QR Code
function handleSize(e) {
    size = e.target.value;
    generateQRCode();
}

// Résolution de l'URL des données de l'image
function resolveDataUrl() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const img = document.querySelector("#qr-code img");
            if (img.currentSrc) {
                resolve(img.currentSrc);
                return;
            }
            const canvas = document.querySelector("canvas");
            resolve(canvas.toDataURL());
        }, 50);
    });
}

// Génération initiale du QR Code
generateQRCode();