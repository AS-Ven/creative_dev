const disgustAudio = document.getElementById("disgustAudio")

let cursorBlinking = false;
let isTyping = false;
let storyStarted = false;
let textComplete = false;
let clickCooldown = false;
let typingSpeed = 40;
let currentParagraphIndex = 0;
let autoProgressTimer = null;

let disgustSound
let typingSound
let storyContainer
let storyText
let visualEffects

const storyParagraphs = [
    "Il était une fois, dans un petit appartement du centre-ville, un homme qui vivait seul depuis des années. Sa cuisine, qu'il n'avait pas nettoyée depuis des mois, était devenue un véritable {laboratoire de microbes}.",
    "Un soir d'été particulièrement chaud, il décida enfin de s'attaquer au nettoyage. En ouvrant son réfrigérateur, une {odeur nauséabonde} le frappa de plein fouet.",
    "Au fond, dans un tupperware oublié, quelque chose de {verdâtre et visqueux} pulsait doucement.",
    "Retenant un haut-le-cœur, il saisit le récipient. Le couvercle s'ouvrit avec un {bruit de succion répugnant}, libérant un nuage de spores microscopiques.",
    "À l'intérieur, ce qui avait été autrefois des pâtes à la carbonara était désormais une masse {grouillante de moisissures} aux couleurs improbables.",
    "Il remarqua avec horreur que des {filaments blancs} s'étendaient comme des doigts délicats sur toute la surface.",
    "En y regardant de plus près, il aperçut de minuscules {créatures transparentes} qui se déplaçaient entre les colonies de champignons.",
    "L'homme sentit son estomac se retourner quand il vit que la substance avait {commencé à digérer le plastique} du récipient, créant de petits trous par lesquels s'écoulait un {liquide brunâtre et épais}.",
    "Horrifié mais fasciné, il approcha son visage pour mieux observer. La surface de la masse {frémit légèrement} comme si elle réagissait à sa présence.",
    "Une goutte de sueur tomba de son front et atterrit sur la culture. À son contact, la masse {émit un sifflement} et {commença à bouillonner}.",
    "Soudain, une bulle éclata, projetant des {particules gluantes} sur son visage. Il sentit la substance {chaude et visqueuse glisser lentement} le long de sa joue.",
    "L'odeur était si forte qu'il pouvait presque la {goûter au fond de sa gorge}.",
    "Pris de panique, il lâcha le récipient qui s'écrasa au sol. La {masse infecte} se répandit, {rampant rapidement} comme si elle était {douée d'une volonté propre}.",
    "Elle progressait vers lui, laissant derrière elle une {traînée luisante} qui semblait pulser au rythme d'un cœur invisible.",
    "Son cœur battait la chamade tandis qu'il reculait contre le mur de la cuisine. La substance semblait {s'étendre et se multiplier} au contact de l'air.",
    "Des {bulles nauséabondes éclataient} à sa surface, libérant une {brume toxique} qui emplissait la pièce.",
    "Avec horreur, il réalisa que la masse avait {atteint ses pieds} et {commençait à grimper} le long de sa jambe, laissant une sensation de {brûlure glaciale} sur sa peau.",
    "Il voulut crier, mais sa gorge était paralysée par la terreur. La substance {pulsait maintenant au rythme de son cœur} tandis qu'elle continuait son ascension inexorable.",
    "Il sentait des {millions de micro-organismes} pénétrer ses pores, s'infiltrer sous sa peau, {coloniser son corps de l'intérieur}...",
    "{QUAND SOUDAIN...}"
];

document.addEventListener('DOMContentLoaded', () => {
    storyContainer = document.querySelector('.story-container');
    storyText = document.getElementById('story-text');
    visualEffects = document.getElementById('visual-effects');
    disgustSound = document.getElementById('disgustAudio');
    typingSound = document.getElementById('typing-sound');

    if (disgustSound) disgustSound.volume = 0.4;
    if (typingSound) typingSound.volume = 0.3;

    const startButton = document.getElementById('start-story');
    if (startButton) {
        startButton.addEventListener('click', startStory);
    }

    createRandomStains();

    storyContainer.addEventListener('click', handleTextProgress);

    document.addEventListener('keydown', (event) => {
        if ((event.code === 'Space' || event.code === 'Enter') && storyStarted && !clickCooldown) {
            handleTextProgress();
            event.preventDefault();
        }
    });
});

function startStory() {
    if (storyStarted) return;
    storyStarted = true;
    document.getElementById('start-story').style.display = 'none';
    createDialogBox();
    showParagraph(0);
}

function createDialogBox() {
    const dialogBox = document.createElement('div');
    dialogBox.className = 'dialog-box';
    
    const textArea = document.createElement('div');
    textArea.className = 'dialog-text';
    textArea.id = 'dialog-text';
    
    const continueIndicator = document.createElement('div');
    continueIndicator.className = 'continue-indicator';
    continueIndicator.innerHTML = '▼';
    continueIndicator.id = 'continue-indicator';
    continueIndicator.style.display = 'none';
    
    dialogBox.appendChild(textArea);
    dialogBox.appendChild(continueIndicator);
    storyText.appendChild(dialogBox);
}

function handleTextProgress() {
    if (!storyStarted || clickCooldown) return;

    clickCooldown = true;

    if (isTyping) {
        completeCurrentText();
        
        setTimeout(() => {
            textComplete = true;
            const continueIndicator = document.getElementById('continue-indicator');
            if (continueIndicator) {
                continueIndicator.style.display = 'block';
                
                if (typeof gsap !== 'undefined') {
                    gsap.to(continueIndicator, {
                        y: "-5px", 
                        repeat: 2, 
                        yoyo: true, 
                        duration: 0.5
                    });
                }
            }
        }, 500);
    } else if (textComplete) {
        currentParagraphIndex++;
        if (currentParagraphIndex >= storyParagraphs.length) {
            triggerRickroll();
        } else {
            showParagraph(currentParagraphIndex);
        }
    }

    setTimeout(() => {
        clickCooldown = false;
    }, 200);
}

function completeCurrentText() {
    isTyping = false;
    
    const highestId = window.setTimeout(() => {}, 0);
    for (let i = 0; i < highestId; i++) {
        clearTimeout(i);
    }

    const dialogText = document.getElementById('dialog-text');
    if (!dialogText) return;

    const rawText = storyParagraphs[currentParagraphIndex];
    const processedText = processText(rawText);
    dialogText.innerHTML = processedText;
    
    const highlightElements = dialogText.querySelectorAll('.disgust-highlight');
    highlightElements.forEach(() => {
        addDisgustEffect();
    });

    const continueIndicator = document.getElementById('continue-indicator');
    if (continueIndicator) {
        continueIndicator.style.display = 'none';
    }
    
    if (autoProgressTimer) {
        clearTimeout(autoProgressTimer);
    }
    
    autoProgressTimer = setTimeout(() => {
        textComplete = true;
        if (continueIndicator) {
            continueIndicator.style.display = 'block';
            
            if (typeof gsap !== 'undefined') {
                gsap.to(continueIndicator, {
                    y: "-5px", 
                    repeat: 2, 
                    yoyo: true, 
                    duration: 0.5
                });
            }
        }
    }, 800);
}

function processText(text) {
    let processed = '';
    let inHighlight = false;
    let highlightText = '';
    
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '{') {
            inHighlight = true;
            continue;
        } else if (text[i] === '}') {
            inHighlight = false;
            processed += `<span class="disgust-highlight">${highlightText}</span>`;
            highlightText = '';
            continue;
        }
        
        if (inHighlight) {
            highlightText += text[i];
        } else {
            processed += text[i];
        }
    }
    
    return processed;
}

function showParagraph(index) {
    textComplete = false;
    isTyping = true;
    
    if (autoProgressTimer) {
        clearTimeout(autoProgressTimer);
        autoProgressTimer = null;
    }
    
    const isLastParagraph = (index === storyParagraphs.length - 1);
    if (isLastParagraph) {
        storyContainer.style.animation = 'shake 0.5s infinite';
        playDisgustSound();
    }
    
    const dialogText = document.getElementById('dialog-text');
    if (!dialogText) return;
    
    dialogText.innerHTML = '';
    
    const continueIndicator = document.getElementById('continue-indicator');
    if (continueIndicator) {
        continueIndicator.style.display = 'none';
    }
    
    const rawText = storyParagraphs[index];
    
    typeTextByChar(rawText, dialogText, 0);
}

function typeTextByChar(text, element, charIndex) {
    if (charIndex >= text.length) {
        isTyping = false;
        textComplete = true;
        
        const continueIndicator = document.getElementById('continue-indicator');
        if (continueIndicator) {
            continueIndicator.style.display = 'block';
            
            if (typeof gsap !== 'undefined') {
                gsap.to(continueIndicator, {
                    y: "-5px", 
                    repeat: 2, 
                    yoyo: true, 
                    duration: 0.5
                });
            }
        }
        return;
    }
    
    if (text[charIndex] === '{') {
        const endBraceIndex = text.indexOf('}', charIndex);
        if (endBraceIndex !== -1) {
            const highlightedText = text.substring(charIndex + 1, endBraceIndex);
            
            const span = document.createElement('span');
            span.className = 'disgust-highlight';
            span.textContent = highlightedText;
            element.appendChild(span);
            
            addDisgustEffect();
            
            playDisgustSound();
            
            setTimeout(() => typeTextByChar(text, element, endBraceIndex + 1), typingSpeed * 3);
            return;
        }
    }
    
    if (text[charIndex] === '}') {
        typeTextByChar(text, element, charIndex + 1);
        return;
    }
    
    element.innerHTML += text[charIndex];
    
    playTypingSound();
    
    setTimeout(() => typeTextByChar(text, element, charIndex + 1), typingSpeed);
}

function playDisgustSound() {
    if (!disgustSound) return;

    disgustSound.pause();
    disgustSound.currentTime = 0;

    disgustSound.play().catch(e => console.log('Erreur audio:', e));
}

function playTypingSound() {
    if (!typingSound) return;
    
    if (typingSound.paused) {
        typingSound.play().catch(e => console.log('Erreur audio:', e));
    } else {
        typingSound.currentTime = 0;
    }
}

function addDisgustEffect() {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    const stain = document.createElement('div');
    stain.className = 'stain';
    stain.style.left = `${x}%`;
    stain.style.top = `${y}%`;
    stain.style.width = `${20 + Math.random() * 50}px`;
    stain.style.height = `${20 + Math.random() * 50}px`;
    stain.style.opacity = `${0.1 + Math.random() * 0.3}`;
    stain.style.backgroundColor = `rgba(${60 + Math.random() * 40}, ${120 + Math.random() * 60}, ${40 + Math.random() * 30}, 0.2)`;
    
    document.getElementById('stains-container').appendChild(stain);
    
    if (typeof gsap !== 'undefined') {
        gsap.to(stain, {
            width: `${30 + Math.random() * 70}px`,
            height: `${30 + Math.random() * 70}px`,
            opacity: 0.05,
            duration: 2 + Math.random() * 3,
            onComplete: () => {
                if (Math.random() > 0.5) {
                    createDrip(x, y);
                }
            }
        });
        
        gsap.to(storyContainer, {
            x: (Math.random() < 0.5 ? -2 : 2),
            duration: 0.1,
            repeat: 3,
            yoyo: true,
            onComplete: () => gsap.set(storyContainer, { x: 0 })
        });
    }
}

function createDrip(x, y) {
    const drip = document.createElement('div');
    drip.className = 'drip';
    drip.style.left = `${x}%`;
    drip.style.top = `${y}%`;
    drip.style.height = '10px';
    
    document.getElementById('stains-container').appendChild(drip);
    
    if (typeof gsap !== 'undefined') {
        gsap.to(drip, {
            height: `${50 + Math.random() * 100}px`,
            top: `${y + 50 + Math.random() * 50}%`,
            opacity: 0,
            duration: 3 + Math.random() * 4,
            ease: "power1.in",
            onComplete: () => drip.remove()
        });
    }
}

function createRandomStains() {
    const stainCount = 8 + Math.floor(Math.random() * 7);
    const container = document.getElementById('stains-container');
    
    if (!container) return;
    
    for (let i = 0; i < stainCount; i++) {
        const stain = document.createElement('div');
        stain.className = 'stain';
        stain.style.left = `${Math.random() * 100}%`;
        stain.style.top = `${Math.random() * 100}%`;
        stain.style.width = `${30 + Math.random() * 70}px`;
        stain.style.height = `${30 + Math.random() * 70}px`;
        stain.style.opacity = `${0.05 + Math.random() * 0.1}`;
        stain.style.backgroundColor = `rgba(${60 + Math.random() * 40}, ${120 + Math.random() * 60}, ${40 + Math.random() * 30}, 0.1)`;
        
        container.appendChild(stain);
    }
}

function createBubble(x, y) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.left = `${x}%`;
    bubble.style.top = `${y}%`;
    bubble.style.width = `${5 + Math.random() * 15}px`;
    bubble.style.height = bubble.style.width;
    
    document.getElementById('stains-container').appendChild(bubble);
    
    if (typeof gsap !== 'undefined') {
        gsap.to(bubble, {
            y: `-${20 + Math.random() * 50}`,
            x: `${(Math.random() - 0.5) * 20}`,
            opacity: 0.7,
            duration: 1,
            ease: "power1.out",
            onComplete: () => {
                gsap.to(bubble, {
                    opacity: 0,
                    scale: 0.2,
                    duration: 2,
                    ease: "power1.in",
                    onComplete: () => bubble.remove()
                });
            }
        });
    }
}

function addDisgustEffect() {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    const stainContainer = document.getElementById('stains-container');
    if (!stainContainer) return;
    
    const stain = document.createElement('div');
    stain.className = 'stain';
    stain.style.left = `${x}%`;
    stain.style.top = `${y}%`;
    stain.style.width = `${20 + Math.random() * 50}px`;
    stain.style.height = `${20 + Math.random() * 50}px`;
    stain.style.opacity = `${0.1 + Math.random() * 0.3}`;
    stain.style.backgroundColor = `rgba(${60 + Math.random() * 40}, ${120 + Math.random() * 60}, ${40 + Math.random() * 30}, 0.2)`;
    
    stainContainer.appendChild(stain);
    
    if (typeof gsap !== 'undefined') {
        if (stain) {
            gsap.to(stain, {
                width: `${30 + Math.random() * 70}px`,
                height: `${30 + Math.random() * 70}px`,
                opacity: 0.05,
                duration: 2 + Math.random() * 3,
                onComplete: () => {
                    if (Math.random() > 0.5 && stainContainer) {
                        createDrip(x, y);
                    }
                }
            });
        }
        
        if (storyContainer) {
            gsap.to(storyContainer, {
                x: (Math.random() < 0.5 ? -2 : 2),
                duration: 0.1,
                repeat: 3,
                yoyo: true,
                onComplete: () => {
                    if (storyContainer) {
                        gsap.set(storyContainer, { x: 0 });
                    }
                }
            });
        }
    }
}

function triggerRickroll() {
    if (storyContainer) {
        storyContainer.style.animation = 'none';
    }
    
    const modal = document.createElement('div');
    modal.className = 'rickroll-modal';
    modal.style.opacity = '0';
    
    const content = document.createElement('div');
    content.className = 'rickroll-content';
    
    const title = document.createElement('h2');
    title.className = 'rickroll-title';
    title.textContent = 'TU AS ÉTÉ RICKROLLÉ!';
    content.appendChild(title);
    
    const gif = document.createElement('img');
    gif.src = 'https://media.tenor.com/x8v1oNUOmg4AAAAM/rickroll-roll.gif';
    gif.alt = 'You got rickrolled!';
    
    content.appendChild(gif);
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    gif.onload = function() {
        requestAnimationFrame(() => {
            setTimeout(() => {
                modal.style.opacity = '1';
                
                setTimeout(() => {
                    const rickrollAudio = document.getElementById('disgustAudio');
                    if (rickrollAudio) {
                        rickrollAudio.loop = false;
                        rickrollAudio.currentTime = 0;
                        rickrollAudio.volume = 0.5;
                        rickrollAudio.play().catch(e => console.log('Erreur audio:', e));
                    }
                }, 300);
                
            }, 100);
        });
    };
    
    gif.onerror = function() {
        console.error("Erreur de chargement du GIF");
        modal.style.opacity = '1';
    };
}