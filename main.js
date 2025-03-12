document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a");
    // Utiliser querySelector avec une vérification
    let activeSection = document.querySelector(".emotion.active");
    
    // S'assurer qu'il y a une section active par défaut
    if (!activeSection) {
        // Prendre la première section comme fallback si aucune n'est active
        const firstSection = document.querySelector(".emotion");
        if (firstSection) {
            firstSection.classList.add("active");
            activeSection = firstSection;
        }
    }

    function dispatchSectionChangeEvent(newSectionId) {
        // Vérifier si activeSection existe avant d'accéder à ses propriétés
        const previousId = activeSection ? activeSection.id : "none";
        
        const event = new CustomEvent("sectionChanged", {
            detail: {
                previousSection: previousId,
                newSection: newSectionId,
            },
        });
        document.dispatchEvent(event);
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Vérifier si l'attribut data-emotion existe
            const targetId = link.getAttribute("data-emotion");
            if (!targetId) return;
            
            const targetSection = document.getElementById(targetId);
            
            // Ne continuer que si la section cible existe et est différente
            if (targetSection && targetSection !== activeSection) {
                // Animation de sortie pour la section active (avec vérification)
                if (activeSection && typeof gsap !== 'undefined') {
                    gsap.to(activeSection, {
                        opacity: 0,
                        rotateY: 90,
                        scale: 0.8,
                        duration: 0.5,
                    });
                }

                // Animation d'entrée pour la nouvelle section
                if (typeof gsap !== 'undefined') {
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
                }

                // Gestion des classes (avec vérification)
                if (activeSection) {
                    activeSection.classList.remove("active");
                }
                
                targetSection.classList.add("active");

                // Déclencher l'événement de changement de section
                dispatchSectionChangeEvent(targetId);

                // Mettre à jour la section active
                activeSection = targetSection;
            }
        });
    });
});