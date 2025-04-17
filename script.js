// Terminal typing effect
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effects
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero h1');
    const heroText = document.querySelector('.hero p');
    const originalTitle = heroTitle.innerHTML;
    const originalText = heroText.innerHTML;
    
    heroTitle.innerHTML = '';
    heroText.innerHTML = '';
    
    setTimeout(() => {
        typeWriter(heroTitle, originalTitle, 100);
    }, 500);
    
    setTimeout(() => {
        typeWriter(heroText, originalText, 100);
    }, 1500);
});

// Update taskbar time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('taskbar-time').textContent = timeString;
}

// Initialize time and update every second
updateTime();
setInterval(updateTime, 1000);

// Windows 95 sound effects
const win95Sounds = {
    click: new Audio('https://www.myinstants.com/media/sounds/win95-click.mp3'),
    open: new Audio('https://www.myinstants.com/media/sounds/win95-open.mp3'),
    close: new Audio('https://www.myinstants.com/media/sounds/win95-close.mp3'),
    error: new Audio('https://www.myinstants.com/media/sounds/win95-error.mp3')
};

// Play sound with volume control
function playSound(soundName) {
    if (win95Sounds[soundName]) {
        win95Sounds[soundName].volume = 0.3;
        win95Sounds[soundName].currentTime = 0;
        win95Sounds[soundName].play().catch(e => console.log('Sound play failed:', e));
    }
}

// Window management
document.addEventListener('DOMContentLoaded', () => {
    const windows = document.querySelectorAll('.win95-window');
    const taskbarItems = document.querySelector('.taskbar-items');
    const startButton = document.querySelector('.start-button');
    const startMenu = document.querySelector('.start-menu');
    const desktop = document.querySelector('.desktop');
    let activeWindow = null;
    let zIndex = 100;
    let contextMenu = null;
    let desktopContextMenu = null;

    // Create context menu elements
    function createContextMenu() {
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        document.body.appendChild(menu);
        return menu;
    }

    function createDesktopContextMenu() {
        const menu = document.createElement('div');
        menu.className = 'desktop-context-menu';
        
        // Add menu items
        const items = [
            { icon: 'fas fa-sync-alt', text: 'Refresh', action: () => {} },
            { icon: 'fas fa-folder', text: 'New Folder', action: () => {} },
            { icon: 'fas fa-file', text: 'New Text Document', action: () => {} },
            { icon: 'fas fa-cog', text: 'Properties', action: () => {} }
        ];
        
        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'context-menu-item';
            menuItem.innerHTML = `<i class="${item.icon}"></i><span>${item.text}</span>`;
            menuItem.addEventListener('click', () => {
                item.action();
                menu.classList.remove('active');
                playSound('click');
            });
            menu.appendChild(menuItem);
        });
        
        document.body.appendChild(menu);
        return menu;
    }

    // Initialize context menus
    contextMenu = createContextMenu();
    desktopContextMenu = createDesktopContextMenu();

    // Hide all windows initially and add to taskbar
    windows.forEach(window => {
        window.style.display = 'none';
        addToTaskbar(window);
    });

    // Desktop icon click handlers
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            playSound('click');
            
            // Handle selection
            if (!e.ctrlKey) {
                document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
            }
            icon.classList.toggle('selected');
            
            const windowId = icon.getAttribute('data-window');
            if (windowId) {
                const window = document.getElementById(windowId);
                if (window) {
                    window.style.display = 'block';
                    window.style.zIndex = ++zIndex;
                    activeWindow = window;
                    setActiveWindow(window);
                    playSound('open');
                }
            }
        });

        // Add right-click context menu to icons
        icon.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            playSound('click');
            
            // Handle selection
            if (!e.ctrlKey) {
                document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
            }
            icon.classList.toggle('selected');
            
            // Position the context menu
            contextMenu.style.left = `${e.clientX}px`;
            contextMenu.style.top = `${e.clientY}px`;
            contextMenu.classList.add('active');
            
            // Add menu items dynamically based on the icon
            contextMenu.innerHTML = '';
            
            const items = [
                { icon: 'fas fa-folder-open', text: 'Open', action: () => icon.click() },
                { icon: 'fas fa-copy', text: 'Copy', action: () => {} },
                { icon: 'fas fa-cut', text: 'Cut', action: () => {} },
                { icon: 'fas fa-trash', text: 'Delete', action: () => {} },
                { icon: 'fas fa-cog', text: 'Properties', action: () => {} }
            ];
            
            items.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'context-menu-item';
                menuItem.innerHTML = `<i class="${item.icon}"></i><span>${item.text}</span>`;
                menuItem.addEventListener('click', () => {
                    item.action();
                    contextMenu.classList.remove('active');
                    playSound('click');
                });
                contextMenu.appendChild(menuItem);
            });
        });
    });

    // Desktop right-click context menu
    desktop.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        playSound('click');
        
        // Clear selection if clicking on desktop
        if (!e.target.closest('.desktop-icon')) {
            document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
        }
        
        // Position the desktop context menu
        desktopContextMenu.style.left = `${e.clientX}px`;
        desktopContextMenu.style.top = `${e.clientY}px`;
        desktopContextMenu.classList.add('active');
    });

    // Close context menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.context-menu') && !e.target.closest('.desktop-context-menu')) {
            contextMenu.classList.remove('active');
            desktopContextMenu.classList.remove('active');
        }
    });

    // Start menu toggle
    startButton.addEventListener('click', () => {
        playSound('click');
        startMenu.classList.toggle('active');
    });

    // Close start menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
            startMenu.classList.remove('active');
        }
    });

    // Window controls
    windows.forEach(window => {
        const titlebar = window.querySelector('.win95-titlebar');
        const controls = window.querySelectorAll('.win95-button');
        let isDragging = false;
        let startX, startY, initialX, initialY;

        // Make window draggable
        titlebar.addEventListener('mousedown', (e) => {
            if (e.target === titlebar || e.target.parentElement === titlebar) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialX = window.offsetLeft;
                initialY = window.offsetTop;
                window.style.zIndex = ++zIndex;
                activeWindow = window;
                setActiveWindow(window);
                playSound('click');
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                window.style.left = `${initialX + dx}px`;
                window.style.top = `${initialY + dy}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Window control buttons
        controls[0].addEventListener('click', () => {
            window.style.display = 'none';
            playSound('close');
        });

        controls[1].addEventListener('click', () => {
            window.classList.toggle('maximized');
            playSound('click');
        });

        controls[2].addEventListener('click', () => {
            window.style.display = 'none';
            playSound('close');
        });

        // Window focus
        window.addEventListener('mousedown', () => {
            window.style.zIndex = ++zIndex;
            setActiveWindow(window);
        });
    });

    // Set active window
    function setActiveWindow(window) {
        windows.forEach(w => w.classList.remove('active'));
        window.classList.add('active');
    }

    // Add window to taskbar
    function addToTaskbar(window) {
        const taskbarItem = document.createElement('div');
        taskbarItem.className = 'taskbar-item';
        taskbarItem.innerHTML = `<i class="fas fa-window-maximize"></i> ${window.querySelector('.win95-titlebar span').textContent}`;
        taskbarItem.addEventListener('click', () => {
            if (window.style.display === 'none') {
                window.style.display = 'block';
                window.style.zIndex = ++zIndex;
                setActiveWindow(window);
                playSound('open');
            } else {
                window.style.display = 'none';
                playSound('close');
            }
        });
        taskbarItems.appendChild(taskbarItem);
    }

    // Add Windows 95 boot animation
    function bootAnimation() {
        const bootScreen = document.createElement('div');
        bootScreen.style.position = 'fixed';
        bootScreen.style.top = '0';
        bootScreen.style.left = '0';
        bootScreen.style.width = '100%';
        bootScreen.style.height = '100%';
        bootScreen.style.backgroundColor = '#000080';
        bootScreen.style.display = 'flex';
        bootScreen.style.flexDirection = 'column';
        bootScreen.style.alignItems = 'center';
        bootScreen.style.justifyContent = 'center';
        bootScreen.style.zIndex = '9999';
        bootScreen.style.color = 'white';
        bootScreen.style.fontFamily = 'MS Sans Serif, sans-serif';
        
        bootScreen.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 20px;">Windows 95</div>
            <div style="font-size: 14px;">Starting up...</div>
        `;
        
        document.body.appendChild(bootScreen);
        
        setTimeout(() => {
            bootScreen.style.opacity = '0';
            bootScreen.style.transition = 'opacity 1s';
            
            setTimeout(() => {
                bootScreen.remove();
                playSound('open');
            }, 1000);
        }, 2000);
    }

    // Run boot animation
    bootAnimation();

    // Add desktop icon double-click functionality
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('dblclick', () => {
            playSound('open');
            const windowId = icon.getAttribute('data-window');
            if (windowId) {
                const window = document.getElementById(windowId);
                if (window) {
                    window.style.display = 'block';
                    window.style.zIndex = ++zIndex;
                    activeWindow = window;
                    setActiveWindow(window);
                }
            }
        });
    });

    // Add start menu item functionality
    document.querySelectorAll('.start-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            playSound('click');
            const windowId = item.getAttribute('data-window');
            if (windowId) {
                const window = document.getElementById(windowId);
                if (window) {
                    window.style.display = 'block';
                    window.style.zIndex = ++zIndex;
                    activeWindow = window;
                    setActiveWindow(window);
                    startMenu.classList.remove('active');
                }
            }
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
        return;
    }
    
    if (currentScroll > lastScroll) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add fade-in class
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('.win95-button-primary');
        submitButton.style.transform = 'scale(0.95)';
        submitButton.style.borderColor = 'var(--win95-darker) var(--win95-light) var(--win95-light) var(--win95-darker)';
        
        setTimeout(() => {
            submitButton.style.transform = 'scale(1)';
            submitButton.style.borderColor = 'var(--win95-light) var(--win95-darker) var(--win95-darker) var(--win95-light)';
            alert('Message sent successfully!');
            contactForm.reset();
        }, 200);
    });
}

// Add hover effect to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.borderColor = 'var(--win95-darker) var(--win95-light) var(--win95-light) var(--win95-darker)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.borderColor = 'var(--win95-light) var(--win95-darker) var(--win95-darker) var(--win95-light)';
    });
});

// Welcome popup functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    document.body.appendChild(overlay);
    
    // Show welcome popup after a short delay
    setTimeout(() => {
        const welcomePopup = document.getElementById('welcome-popup');
        welcomePopup.classList.add('active');
        overlay.classList.add('active');
    }, 500);
    
    // Close welcome popup when OK button is clicked
    document.getElementById('ok-welcome').addEventListener('click', function() {
        document.getElementById('welcome-popup').classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Close welcome popup when close button is clicked
    document.getElementById('close-welcome').addEventListener('click', function() {
        document.getElementById('welcome-popup').classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Close welcome popup when clicking outside
    overlay.addEventListener('click', function() {
        document.getElementById('welcome-popup').classList.remove('active');
        overlay.classList.remove('active');
    });
});

// Mobile touch optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Add touch event handling for desktop icons
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        // Prevent default touch behavior to avoid delays
        icon.addEventListener('touchstart', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        // Handle touch events for icon selection
        icon.addEventListener('touchend', function(e) {
            e.preventDefault();
            playSound('click');
            
            // Handle selection
            if (!e.ctrlKey) {
                document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
            }
            icon.classList.toggle('selected');
            
            const windowId = icon.getAttribute('data-window');
            if (windowId) {
                const window = document.getElementById(windowId);
                if (window) {
                    window.style.display = 'block';
                    window.style.zIndex = ++zIndex;
                    activeWindow = window;
                    setActiveWindow(window);
                    playSound('open');
                }
            }
        }, { passive: false });
    });
    
    // Improve touch handling for window dragging
    document.querySelectorAll('.win95-window').forEach(window => {
        const titlebar = window.querySelector('.win95-titlebar');
        
        titlebar.addEventListener('touchstart', function(e) {
            e.preventDefault();
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            initialX = window.offsetLeft;
            initialY = window.offsetTop;
            window.style.zIndex = ++zIndex;
            activeWindow = window;
            setActiveWindow(window);
            playSound('click');
        }, { passive: false });
        
        document.addEventListener('touchmove', function(e) {
            if (isDragging) {
                e.preventDefault();
                const dx = e.touches[0].clientX - startX;
                const dy = e.touches[0].clientY - startY;
                window.style.left = `${initialX + dx}px`;
                window.style.top = `${initialY + dy}px`;
            }
        }, { passive: false });
        
        document.addEventListener('touchend', function() {
            isDragging = false;
        });
    });
    
    // Improve touch handling for buttons
    document.querySelectorAll('.win95-button, .win95-button-primary').forEach(button => {
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
        }, { passive: false });
        
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1)';
            this.click();
        }, { passive: false });
    });
}); 