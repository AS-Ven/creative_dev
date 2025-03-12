let confusionEnabled = false;
let animationTimers = [];
let textIntervalId = null;

const confusion_canvas = document.getElementById("confusion_canvas");
const ctx = confusion_canvas.getContext("2d");
const confusion_canvas_size = 280;

const randomPosition = () => {
    return Math.round(Math.random() * confusion_canvas_size);
};

const randomColor = () => {
    color = [`AliceBlue`, `AntiqueWhite`, `Aqua`, `Aquamarine`, `Azure`, `Beige`, `Bisque`, `Black`, `BlanchedAlmond`, `Blue`, `BlueViolet`, `Brown`, `BurlyWood`, `CadetBlue`, `Chartreuse`, `Chocolate`, `Coral`, `CornflowerBlue`, `Cornsilk`, `Crimson`, `Cyan`, `DarkBlue`, `DarkCyan`, `DarkGoldenRod`, `DarkGray`, `DarkGrey`, `DarkGreen`, `DarkKhaki`, `DarkMagenta`, `DarkOliveGreen`, `Darkorange`, `DarkOrchid`, `DarkRed`, `DarkSalmon`, `DarkSeaGreen`, `DarkSlateBlue`, `DarkSlateGray`, `DarkSlateGrey`, `DarkTurquoise`, `DarkViolet`, `DeepPink`, `DeepSkyBlue`, `DimGray`, `DimGrey`, `DodgerBlue`, `FireBrick`, `FloralWhite`, `ForestGreen`, `Fuchsia`, `Gainsboro`, `GhostWhite`, `Gold`, `GoldenRod`, `Gray`, `Grey`, `Green`, `GreenYellow`, `HoneyDew`, `HotPink`, `IndianRed`, `Indigo`, `Ivory`, `Khaki`, `Lavender`, `LavenderBlush`, `LawnGreen`, `LemonChiffon`, `LightBlue`, `LightCoral`, `LightCyan`, `LightGoldenRodYellow`, `LightGray`, `LightGrey`, `LightGreen`, `LightPink`, `LightSalmon`, `LightSeaGreen`, `LightSkyBlue`, `LightSlateGray`, `LightSlateGrey`, `LightSteelBlue`, `LightYellow`, `Lime`, `LimeGreen`, `Linen`, `Magenta`, `Maroon`, `MediumAquaMarine`, `MediumBlue`, `MediumOrchid`, `MediumPurple`, `MediumSeaGreen`, `MediumSlateBlue`, `MediumSpringGreen`, `MediumTurquoise`, `MediumVioletRed`, `MidnightBlue`, `MintCream`, `MistyRose`, `Moccasin`, `NavajoWhite`, `Navy`, `OldLace`, `Olive`, `OliveDrab`, `Orange`, `OrangeRed`, `Orchid`, `PaleGoldenRod`, `PaleGreen`, `PaleTurquoise`, `PaleVioletRed`, `PapayaWhip`, `PeachPuff`, `Peru`, `Pink`, `Plum`, `PowderBlue`, `Purple`, `Red`, `RosyBrown`, `RoyalBlue`, `SaddleBrown`, `Salmon`, `SandyBrown`, `SeaGreen`, `SeaShell`, `Sienna`, `Silver`, `SkyBlue`, `SlateBlue`, `SlateGray`, `SlateGrey`, `Snow`, `SpringGreen`, `SteelBlue`, `Tan`, `Teal`, `Thistle`, `Tomato`, `Turquoise`, `Violet`, `Wheat`, `White`, `WhiteSmoke`, `Yellow`, `YellowGreen`];
    return color[Math.floor(Math.random() * color.length)];
};

const randomSize = () => {
    return Math.round(Math.random() * (confusion_canvas_size / 2.5));
};

const drawCube = (color, size) => {
    if (!confusionEnabled) return;
    ctx.fillStyle = color;
    let x = randomPosition();
    let y = randomPosition() / 2;
    for (let i = 0; i < 1; i += 0.1) {
        const timerId = setTimeout(() => {
            if (confusionEnabled) {
                ctx.globalAlpha = i;
                ctx.fillRect(x, y, size, size);
            }
        }, 1000 * i);
        animationTimers.push(timerId);
    }
};

const drawCircle = (color, size) => {
    if (!confusionEnabled) return;
    ctx.fillStyle = color;
    let x = randomPosition();
    let y = randomPosition() / 2;
    for (let i = 0; i < 1; i += 0.1) {
        const timerId = setTimeout(() => {
            if (confusionEnabled) {
                ctx.globalAlpha = i;
                ctx.beginPath();
                ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
                ctx.fill();
            }
        }, 1000 * i);
        animationTimers.push(timerId);
    }
};

const drawTriangle = (color, size) => {
    if (!confusionEnabled) return;
    ctx.fillStyle = color;
    let x = randomPosition();
    let y = randomPosition() / 2;
    for (let i = 0; i < 1; i += 0.1) {
        const timerId = setTimeout(() => {
            if (confusionEnabled) {
                ctx.globalAlpha = i;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x + size / 2, y - Math.round(Math.sqrt((size * size) - ((size / 2) * (size / 2)))));
                ctx.lineTo(x, y);
                ctx.fill();
            }
        }, 1000 * i);
        animationTimers.push(timerId);
    }
};

const drawThings = () => {
    if (!confusionEnabled) return;
    geo = Math.floor(Math.random() * 3);

    switch (geo) {
        case 0:
            drawCube(randomColor(), randomSize());
            break;
        case 1:
            drawCircle(randomColor(), randomSize());
            break;
        case 2:
            drawTriangle(randomColor(), randomSize());
            break;
        default:
            break;
    }
};

const paragraph = document.getElementById("confusion_text");
let text = paragraph.textContent;
let originalText = text;
let characters = text.split("");
let originalCharacters = [...characters];

const randomChar = () => {
    let array = "abcd efgh ijkl mopq rstu vwxy z,?'".split("");
    return array[Math.floor(Math.random() * array.length)];
};

function scrambleText() {
    if (!confusionEnabled) return;
    characters[Math.floor(Math.random() * characters.length)] = randomChar();
    text = characters.join("");
    paragraph.innerHTML = text;
}

function startConfusionEffects() {
    ctx.clearRect(0, 0, confusion_canvas.width, confusion_canvas.height);

    characters = [...originalCharacters];
    text = originalText;
    paragraph.innerHTML = text;

    for (let i = 1; i < 100; i++) {
        const timerId = setTimeout(() => {
            if (confusionEnabled) drawThings();
        }, 1050 * i);
        animationTimers.push(timerId);
    }

    paragraph.addEventListener("mouseover", scrambleText);

    textIntervalId = setInterval(() => {
        if (confusionEnabled) scrambleText();
    }, 2000);
}

function stopConfusionEffects() {
    animationTimers.forEach(timerId => clearTimeout(timerId));
    animationTimers = [];

    if (textIntervalId) {
        clearInterval(textIntervalId);
        textIntervalId = null;
    }

    paragraph.removeEventListener("mouseover", scrambleText);

    characters = [...originalCharacters];
    text = originalText;
    paragraph.innerHTML = text;
}

document.addEventListener("sectionChanged", (event) => {
    const newSection = event.detail.newSection;
    const wasEnabled = confusionEnabled;

    confusionEnabled = (newSection === "confusion");
    console.log("Section changed to:", newSection, "- Confusion enabled:", confusionEnabled);

    if (confusionEnabled && !wasEnabled) {
        startConfusionEffects();
    } else if (!confusionEnabled && wasEnabled) {
        stopConfusionEffects();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const currentSection = window.location.hash.substring(1) || "default";
    confusionEnabled = (currentSection === "confusion");

    if (confusionEnabled) {
        startConfusionEffects();
    }
});