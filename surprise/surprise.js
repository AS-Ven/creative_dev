const surpriseAudio = document.getElementById("surpriseAudio");
const surpriseSection = document.getElementById("surprise");
let animationPlaying = false;
let surpriseEnabled = false;
let glitchInterval;

const ELEMENT_POSITIONS = {
    bars: [
        { top: "10%", left: "-120%", width: "120%", height: "12%" },
        { top: "25%", left: "-120%", width: "150%", height: "15%" },
        { top: "45%", left: "-120%", width: "100%", height: "10%" },
        { top: "60%", left: "-120%", width: "130%", height: "18%" },
        { top: "80%", left: "-120%", width: "110%", height: "13%" },
        { top: "5%", right: "-120%", width: "80%", height: "8%" },
        { top: "20%", right: "-120%", width: "120%", height: "14%" },
        { top: "40%", right: "-120%", width: "90%", height: "12%" },
        { top: "55%", right: "-120%", width: "140%", height: "10%" },
        { top: "70%", right: "-120%", width: "100%", height: "15%" },
        { top: "35%", left: "-120%", width: "70%", height: "8%" },
        { top: "65%", right: "-120%", width: "85%", height: "9%" }
    ],
    menuBoxes: [
        { left: "5%", top: "70%", width: "25%", height: "20%" },
        { left: "35%", top: "75%", width: "30%", height: "15%" },
        { right: "5%", top: "72%", width: "25%", height: "18%" }
    ]
};

const particleManager = {
    activeEmitters: [],

    createEmitter(delay, config) {
        setTimeout(() => {
            const container = tsParticles.domItem(0);
            if (container) {
                const emitter = container.addEmitter(config);
                this.activeEmitters.push(emitter);

                setTimeout(() => {
                    this.removeEmitter(emitter);
                }, 10000);
            }
        }, delay);
    },

    removeEmitter(emitter) {
        if (emitter && emitter.destroy) {
            emitter.destroy();
        }
        this.activeEmitters = this.activeEmitters.filter(e => e !== emitter);
    },

    clearAll() {
        this.activeEmitters.forEach(emitter => {
            if (emitter && emitter.destroy) {
                emitter.destroy();
            }
        });
        this.activeEmitters = [];
    }
};

function triggerParticles(delay, config) {
    particleManager.createEmitter(delay, config);
}

const glitchPool = {
    elements: [],
    maxSize: 20,

    get() {
        let element = this.elements.find(el => !el.inUse);

        if (!element) {
            if (this.elements.length < this.maxSize) {
                const glitch = document.createElement("div");
                glitch.className = "persona-glitch";
                element = { el: glitch, inUse: false };
                this.elements.push(element);
            } else {
                element = this.elements[0];
            }
        }

        element.inUse = true;
        return element.el;
    },

    release(el) {
        const element = this.elements.find(item => item.el === el);
        if (element) element.inUse = false;
    }
};

function playPersona5Animation() {
    if (!surpriseEnabled || animationPlaying) return;
    animationPlaying = true;

    let animationTimeline = null;
    let animationStartTime = Date.now();

    document.addEventListener("visibilitychange", handleVisibilityChange);

    function handleVisibilityChange() {
        if (document.hidden) {
            if (surpriseAudio) {
                surpriseAudio.pause();
            }
            if (animationTimeline) {
                animationTimeline.pause();
            }
        } else {
            if (surpriseAudio && animationPlaying) {
                const elapsedTime = (Date.now() - animationStartTime) / 1000;
                surpriseAudio.currentTime = elapsedTime;
                surpriseAudio.play();
            }
            if (animationTimeline) {
                animationTimeline.play();
            }
        }
    }

    const container = document.querySelector(".persona-container");
    container.style.display = "block";

    const elements = {
        bars: container.querySelectorAll(".persona-bar"),
        mainText: container.querySelector(".persona-main-text"),
        subText: container.querySelector(".persona-sub-text"),
        overlay: container.querySelector(".persona-overlay"),
        mask: container.querySelector(".persona-mask"),
        chains: container.querySelectorAll(".persona-chain"),
        corners: container.querySelectorAll(".persona-corner"),
        menuBoxes: container.querySelectorAll(".persona-menu-box"),
        menuLines: container.querySelectorAll(".persona-menu-line"),
        glitches: container.querySelectorAll(".persona-glitch"),
        starBurst: container.querySelector(".persona-star-burst")
    };

    elements.bars.forEach((bar, i) => {
        gsap.set(bar, ELEMENT_POSITIONS.bars[i]);
    });

    elements.chains.forEach((chain, i) => {
        const xPos = 20 + i * 10;
        gsap.set(chain, {
            left: `${xPos}%`,
            top: "-50%",
            height: "150%",
            width: "6px",
            rotate: i % 2 === 0 ? 5 : -5,
        });
    });

    elements.menuBoxes.forEach((box, i) => {
        gsap.set(box, ELEMENT_POSITIONS.menuBoxes[i]);
    });

    elements.glitches.forEach((glitch, i) => {
        const height = 5 + Math.random() * 20;
        const yPos = Math.random() * 100;
        gsap.set(glitch, {
            top: `${yPos}%`,
            left: 0,
            width: "100%",
            height: `${height}px`,
            x: i % 2 === 0 ? "-100%" : "100%",
        });
    });

    const tl = gsap.timeline({
        onComplete: () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            particleManager.clearAll();

            setTimeout(() => {
                gsap.to(container, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        container.style.display = "none";
                        container.style.opacity = 1;
                        animationPlaying = false;
                        if (glitchInterval) clearInterval(glitchInterval);
                    },
                });
            }, 500);
        }
    });

    animationTimeline = tl;

    tl.to(elements.overlay, { opacity: 1, duration: 0.1 })
    .to(elements.overlay, { opacity: 0, duration: 0.2 })

    .to(elements.corners, { opacity: 1, duration: 0.2, stagger: 0.05 })

    .to(
        elements.subText,
        {
            opacity: 1,
            fontSize: "40px",
            duration: 0.4,
            ease: "back.out(1.7)",
        },
        "-=0.1"
    )

    .to(
        elements.glitches,
        { opacity: 0.7, x: 0, duration: 0.1, stagger: 0.03 },
        "-=0.3"
    )
    .to(elements.glitches, {
        opacity: 0,
        x: (i) => (i % 2 === 0 ? "100%" : "-100%"),
        duration: 0.2,
        stagger: 0.03,
    })

    .to(
        [elements.bars[0], elements.bars[1], elements.bars[5], elements.bars[6]],
        {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "power3.out",
        },
        "-=0.2"
    )

    .to(
        elements.chains,
        { opacity: 1, top: "0%", duration: 0.8, stagger: 0.1 },
        "-=0.6"
    )

    .to(
        elements.subText,
        { scale: 1.1, duration: 0.3, repeat: 3, yoyo: true },
        "-=0.8"
    )

    .to(
        [elements.bars[2], elements.bars[3], elements.bars[7], elements.bars[8]],
        {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
        },
        "+=0.2"
    )

    .to(
        elements.chains,
        {
            scaleY: 0.5,
            y: 100,
            rotate: (i) => (i % 2 === 0 ? "+=40" : "-=40"),
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out",
        },
        "-=0.3"
    )

    .to(
        elements.starBurst,
        {
            width: 400,
            height: 400,
            opacity: 0.8,
            duration: 0.5,
            ease: "power2.out",
        },
        "-=0.8"
    )
    .to(elements.starBurst, { opacity: 0, duration: 0.5 })

    .to(
        elements.mask,
        {
            opacity: 1,
            scale: 1,
            rotate: 720,
            duration: 0.9,
            ease: "back.out(2)",
        },
        "-=0.5"
    )

    .to(
        [elements.bars[4], elements.bars[9], elements.bars[10], elements.bars[11]],
        {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
        },
        "-=0.7"
    )

    .to(
        elements.mainText,
        {
            opacity: 1,
            fontSize: "100px",
            duration: 0.7,
            ease: "back.out(1.7)",
            onUpdate: function () {
                if (Math.random() > 0.7) {
                    elements.mainText.style.textShadow = `${
                        Math.random() * 8 - 4
                    }px ${Math.random() * 8 - 4}px 0 #e60012`;
                } else {
                    elements.mainText.style.textShadow = "4px 4px 0 #000";
                }
            },
        },
        "-=0.3"
    )
    .to(
        elements.mainText,
        { scale: 1.3, duration: 0.4, yoyo: true, repeat: 1 },
        "+=0.2"
    )

    .to(
        elements.menuBoxes,
        {
            opacity: 1,
            x: (i) => (i % 2 === 0 ? 20 : -20),
            duration: 0.8,
            stagger: 0.15,
        },
        "-=0.5"
    )

    .to(
        elements.menuLines,
        { opacity: 0.7, width: "100%", duration: 0.6, stagger: 0.1 },
        "-=0.6"
    )

    .to({}, { duration: 2.5 })

    .to(elements.glitches, { opacity: 0.7, x: 0, duration: 0.3, stagger: 0.05 })
    .to(elements.glitches, { opacity: 0, duration: 0.3 })

    .to(elements.overlay, { opacity: 0.9, duration: 0.2 }, "+=0.3")
    .to(elements.overlay, { opacity: 0, duration: 0.3 })

    .to(
        [elements.mainText, elements.subText, elements.mask],
        { opacity: 0, y: -30, duration: 0.6, stagger: 0.08 },
        "+=0.5"
    )
    .to(
        elements.menuBoxes,
        {
            opacity: 0,
            x: (i) => (i % 2 === 0 ? 50 : -50),
            duration: 0.5,
            stagger: 0.05,
        },
        "-=0.6"
    )
    .to(elements.menuLines, { opacity: 0, duration: 0.3 }, "-=0.4")
    .to(
        elements.chains,
        { opacity: 0, y: 200, duration: 0.5, stagger: 0.06 },
        "-=0.4"
    )
    .to(elements.corners, { opacity: 0, duration: 0.3, stagger: 0.05 }, "-=0.3")
    .to(
        elements.bars,
        {
            opacity: 0,
            x: (i, target) => (i < 6 ? "100%" : "-100%"),
            duration: 0.8,
            stagger: 0.04,
        },
        "-=0.5"
    );

    triggerParticles(500, {
        position: { x: 50, y: 50 },
        rate: { delay: 0, quantity: 150 },
        life: { count: 1, duration: 0.1 },
        size: { width: 100, height: 0 },
        particles: {
            color: { value: "#e60012" },
            shape: { type: "square" },
            opacity: { value: 1 },
            size: { value: { min: 3, max: 6 }, random: true },
            move: { enable: true, speed: 15, direction: "none", random: true, outMode: "out" }
        }
    });

    return tl;
}

function setupSurpriseSection() {
    surpriseEnabled = surpriseSection && surpriseSection.classList.contains("active");

    if (surpriseEnabled) {
        console.log("Surprise section is active - enabling animations");
        setupParticles();
    } else {
        console.log("Surprise section is inactive - disabling animations");
    }
}

function setupParticles() {
    const particlesEl = document.getElementById("particles-js");
    if (!particlesEl) return;

    tsParticles.load("particles-js", {
        fullScreen: { zIndex: 1 },
        particles: {
            number: { value: 0 },
            color: { value: ["#00FFFC", "#FC00FF", "#fffc00"] },
            shape: { type: ["circle", "square", "triangle", "polygon"] },
            opacity: {
                value: { min: 0, max: 1 },
                animation: { enable: true, speed: 2, startValue: "max", destroy: "min" }
            },
            size: { value: { min: 2, max: 4 } },
            links: { enable: false },
            life: { duration: { sync: true, value: 5 }, count: 1 },
            move: {
                enable: true,
                gravity: { enable: true, acceleration: 10 },
                speed: { min: 10, max: 20 },
                decay: 0.1,
                direction: "random",
                straight: false,
                outModes: { default: "destroy", top: "none" }
            },
            rotate: {
                value: { min: 0, max: 360 },
                direction: "random",
                move: true,
                animation: { enable: true, speed: 60 }
            },
            tilt: {
                direction: "random",
                enable: true,
                move: true,
                value: { min: 0, max: 360 },
                animation: { enable: true, speed: 60 }
            },
            wobble: {
                distance: 30,
                enable: true,
                move: true,
                speed: { min: -15, max: 15 }
            }
        },
        interactivity: {
            events: { onClick: { enable: true, mode: "emitter" } },
            modes: {
                emitter: {
                    life: { count: 0, duration: 0.1, delay: 0.4 },
                    rate: { delay: 0.1, quantity: 150 },
                    size: { width: 0, height: 0 }
                }
            }
        },
        emitters: {
            life: { count: 0, duration: 0.1, delay: 0.4 },
            rate: { delay: 0.1, quantity: 150 },
            size: { width: 5, height: 10 }
        }
    });
}

document.addEventListener("sectionChanged", (event) => {
    const newSection = event.detail.newSection;
    surpriseEnabled = (newSection === "surprise");
    console.log("Section changed to:", newSection, "- Surprise enabled:", surpriseEnabled);
});

surpriseSection.addEventListener("click", () => {
    if (!surpriseEnabled || animationPlaying) return;

    if (Math.floor(Math.random() * 10 + 1) === 4) {
        if (surpriseAudio) {
            surpriseAudio.pause();
            surpriseAudio.currentTime = 0;
            surpriseAudio.play();
        }

        if (glitchInterval) clearInterval(glitchInterval);
        particleManager.clearAll();

        playPersona5Animation();
    }
});

document.addEventListener("DOMContentLoaded", setupSurpriseSection);

