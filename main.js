document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a");
    let activeSection = document.querySelector(".emotion.active");

    function dispatchSectionChangeEvent(newSectionId) {
        const event = new CustomEvent("sectionChanged", {
            detail: {
                previousSection: activeSection.id,
                newSection: newSectionId,
            },
        });
        document.dispatchEvent(event);
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-emotion");
            const targetSection = document.getElementById(targetId);

            if (targetSection !== activeSection) {
                gsap.to(activeSection, {
                    opacity: 0,
                    rotateY: 90,
                    scale: 0.8,
                    duration: 0.5,
                });

                gsap.fromTo(
                    targetSection,
                    { opacity: 0, rotateY: -90, scale: 0.8 },
                    {
                        opacity: 1,
                        rotateY: 0,
                        scale: 1,
                        duration: 0.5,
                        delay: 0.5,
                    }
                );

                activeSection.classList.remove("active");
                targetSection.classList.add("active");

                dispatchSectionChangeEvent(targetId);

                activeSection = targetSection;
            }
        });
    });
});
