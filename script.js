document.addEventListener('DOMContentLoaded', () => {
    // Initialize birthday date (April 4th)
    const birthdayDate = new Date(2025, 3, 4);
    
    // DOM Elements Cache with null checks
    const elements = {
      // Audio player elements
      playButton: document.getElementById('play-button'),
      pauseButton: document.getElementById('pause-button'),
      timeSlider: document.getElementById('time-slider'),
      currentTimeDisplay: document.getElementById('current-time'),
      totalTimeDisplay: document.getElementById('total-time'),
      cdImage: document.getElementById('cd-image'),
      
      // Countdown elements
      countdownContainer: document.getElementById('countdown-container'),
      countdownTitle: document.getElementById('countdown-title'),
      celebrationContainer: document.getElementById('celebration-container'),
      
      // Animation container
      animationContainer: document.getElementById('animation-container'),
      
      // Message board elements
      messageForm: document.getElementById('message-form'),
      senderName: document.getElementById('sender-name'),
      messageText: document.getElementById('message'),
      messagesContainer: document.getElementById('messages-container'),
      emptyMessageContainer: document.getElementById('empty-message-container'),
      
      // Photo gallery
      photoGallery: document.getElementById('photo-gallery')
    };
    
    // Audio setup with error handling and lazy loading
    let audioElement;
    const initAudio = () => {
      try {
        audioElement = new Audio('Apna Bana Le.m4a');
        audioElement.preload = 'metadata';
        audioElement.loop = true;
        
        audioElement.addEventListener('error', (e) => {
          console.error('Error loading audio:', e); 
        });
        
        return true;
      } catch (error) {
        console.error('Error creating audio element:', error);
        return false;
      }
    };
    
    // Format time with memoization
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      minute: 'numeric',
      second: '2-digit'
    });
    
    const formatTime = (seconds) => {
      if (isNaN(seconds)) return "0:00";
      const date = new Date(seconds * 1000);
      return timeFormatter.format(date);
    };
    
    // Update time display with debouncing
    let timeUpdateTimeout;
    const updateTimeDisplay = () => {
      if (!audioElement || !elements.currentTimeDisplay || !elements.totalTimeDisplay || !elements.timeSlider) return;
      
      if (!isNaN(audioElement.duration)) {
        clearTimeout(timeUpdateTimeout);
        timeUpdateTimeout = setTimeout(() => {
          elements.currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
          elements.totalTimeDisplay.textContent = formatTime(audioElement.duration);
          elements.timeSlider.max = audioElement.duration;
          elements.timeSlider.value = audioElement.currentTime;
        }, 100);
      }
    };
    
    // CD rotation animation
    let rotationDegree = 0;
    let animationFrameId = null;
    let lastTimestamp = 0;
    const ROTATION_SPEED = 0.02; // degrees per millisecond
    
    const startRotation = () => {
      if (!elements.cdImage) return;
      
      const animate = (timestamp) => {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime = timestamp - lastTimestamp;
        
        rotationDegree += ROTATION_SPEED * deltaTime;
        elements.cdImage.style.transform = `rotate(${rotationDegree}deg)`;
        
        lastTimestamp = timestamp;
        animationFrameId = requestAnimationFrame(animate);
      };
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    const stopRotation = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      lastTimestamp = 0;
    };
    
    // Initialize audio player with event delegation
    const initAudioPlayer = () => {
      if (!audioElement) return;
      
      const handleTimeSlider = (e) => {
        if (e.target === elements.timeSlider) {
          audioElement.currentTime = e.target.value;
        }
      };
      
      document.addEventListener('input', handleTimeSlider);
      
      audioElement.addEventListener('timeupdate', updateTimeDisplay);
      audioElement.addEventListener('loadedmetadata', () => {
        if (elements.totalTimeDisplay && elements.timeSlider) {
          elements.totalTimeDisplay.textContent = formatTime(audioElement.duration);
          elements.timeSlider.max = audioElement.duration;
        }
      });
      
      if (elements.playButton) {
        elements.playButton.addEventListener('click', () => {
          audioElement.play().catch(e => console.error('Error playing audio:', e));
          elements.playButton.style.display = 'none';
          elements.pauseButton.style.display = 'flex';
          startRotation();
        });
      }
      
      if (elements.pauseButton) {
        elements.pauseButton.addEventListener('click', () => {
          audioElement.pause();
          elements.pauseButton.style.display = 'none';
          elements.playButton.style.display = 'flex';
          stopRotation();
        });
      }
    };
    
    // Countdown functionality with performance optimizations
    let countdownInterval;
    const updateCountdown = () => {
      if (!elements.countdownContainer || !elements.countdownTitle) return;
      
      const now = new Date();
      const difference = birthdayDate - now;
      
      if (difference > 0) {
        const timeUnits = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
        
        const formattedDate = birthdayDate.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
        
        elements.countdownTitle.textContent = `Countdown to ${formattedDate}`;
        
        elements.countdownContainer.innerHTML = Object.entries(timeUnits)
          .map(([unit, value]) => `
            <div class="countdown-box">
              <span>${String(value).padStart(2, '0')}</span>
              <span>${unit.toUpperCase()}</span>
            </div>
          `).join('');
      } else {
        if (elements.countdownContainer) {
          elements.countdownContainer.style.display = 'none';
        }
        
        if (elements.celebrationContainer) {
          elements.celebrationContainer.style.display = 'flex';
        }
        
        if (elements.countdownTitle) {
          elements.countdownTitle.style.display = 'none';
        }
        
        startCelebration();
        stopCountdown();
      }
    };
    
    const startCountdown = () => {
      updateCountdown();
      countdownInterval = setInterval(updateCountdown, 1000);
    };
    
    const stopCountdown = () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
    };
    
    // Celebration Animations with performance optimizations
    const startCelebration = () => {
      requestAnimationFrame(() => {
        createBalloons();
        createGlitter();
      });
    };
    
    const createBalloons = () => {
      if (!elements.animationContainer) return;
      
      const balloonColors = [
        '#F8C8DC', '#D8BFD8', '#B76E79',
        '#FFB6C1', '#DDA0DD', '#FF69B4'
      ];
      
      const fragment = document.createDocumentFragment();
      
      for (let i = 0; i < 20; i++) {
        const delay = Math.random() * 5;
        const xPos = Math.random() * 100 - 50;
        
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.cssText = `
          --delay: ${delay}s;
          --x-pos: ${xPos}vw;
          background-color: ${balloonColors[Math.floor(Math.random() * balloonColors.length)]};
        `;
        
        const balloonInner = document.createElement('div');
        balloonInner.className = 'balloon-inner';
        
        const balloonString = document.createElement('div');
        balloonString.className = 'balloon-string';
        
        balloonInner.appendChild(balloonString);
        balloon.appendChild(balloonInner);
        fragment.appendChild(balloon);
        
        setTimeout(() => {
          if (balloon && balloon.parentNode) {
            balloon.parentNode.removeChild(balloon);
          }
        }, 15000 + delay * 1000);
      }
      
      elements.animationContainer.appendChild(fragment);
    };
    
    const createGlitter = () => {
      if (!elements.animationContainer) return;
      
      const colors = [
        '#FFC0CB', '#FFD700', '#E6E6FA',
        '#B76E79', '#FFB6C1', '#DDA0DD'
      ];
      
      const fragment = document.createDocumentFragment();
      
      for (let i = 0; i < 100; i++) {
        const delay = Math.random() * 5;
        const size = Math.random() * 10 + 5;
        const xPos = Math.random() * 100;
        const yPos = Math.random() * 100;
        
        const glitter = document.createElement('div');
        glitter.className = 'glitter';
        glitter.style.cssText = `
          --delay: ${delay}s;
          --size: ${size}px;
          --x-pos: ${xPos}vw;
          --y-pos: ${yPos}vh;
          background-color: ${colors[Math.floor(Math.random() * colors.length)]};
        `;
        
        fragment.appendChild(glitter);
        
        setTimeout(() => {
          if (glitter && glitter.parentNode) {
            glitter.parentNode.removeChild(glitter);
          }
        }, 10000 + delay * 1000);
      }
      
      elements.animationContainer.appendChild(fragment);
    };
    
    // Message Board Functionality
    const initMessageBoard = () => {
      const messageForm = document.getElementById('message-form');
      const messagesContainer = document.getElementById('messages-container');
      const emptyMessageContainer = document.getElementById('empty-message-container');
      
      // Static messages array - these will be visible to all visitors
      // This is the only place you need to edit to add permanent messages
      const staticMessages = [
        {
          sender: "Haroon Khalid",
          content: "Happy Birthday Mairi Sohni jan! 🎂✨",
          date: "2024-04-04T00:12:00.000Z"
        },
        {
          sender: "Your Love",
          content: "You make my world complete. Happy Birthday, my Guzellim! ❤️",
          date: "2024-04-04T00:00:00.000Z"
        },
        {
          sender: "It's Me",
          content: "Wishing you joy, love, and all the happiness you deserve on your special day! 🎉",
          date: "2024-04-04T00:00:00.000Z"
        }
      ];
      
      const displayMessages = () => {
        try {
          // Use static messages instead of localStorage
          const messages = staticMessages;
          
          if (!messages || messages.length === 0) {
            if (messagesContainer) messagesContainer.style.display = 'none';
            if (emptyMessageContainer) emptyMessageContainer.style.display = 'block';
            return;
          }
          
          if (messagesContainer) messagesContainer.style.display = 'block';
          if (emptyMessageContainer) emptyMessageContainer.style.display = 'none';
          
          if (messagesContainer) {
            messagesContainer.innerHTML = messages
              .map(msg => `
                <div class="message-item">
                  <div class="message-header">
                    <span class="message-sender">${msg.sender}</span>
                    <span class="message-date">${new Date(msg.date).toLocaleDateString()}</span>
                  </div>
                  <div class="message-text">${msg.content}</div>
                </div>
              `)
              .join('');
          }
        } catch (error) {
          console.error("Error displaying messages:", error);
          if (messagesContainer) messagesContainer.style.display = 'none';
          if (emptyMessageContainer) emptyMessageContainer.style.display = 'block';
        }
      };
      
      // Modify the form submission to add messages to the static array
      if (messageForm) {
        messageForm.addEventListener('submit', (e) => {
          e.preventDefault();
          
          try {
            const senderName = document.getElementById('sender-name').value.trim();
            const messageContent = document.getElementById('message').value.trim();
            
            if (!senderName || !messageContent) return;
            
            // Add the new message to the static array
            staticMessages.push({
              sender: senderName,
              content: messageContent,
              date: new Date().toISOString()
            });
            
            // Update the display
            displayMessages();
            
            // Reset the form
            messageForm.reset();
            
            // Show a thank you message
            alert("Thank you for your birthday wish! It will be visible to all visitors during this session.");
          } catch (error) {
            console.error("Error submitting message:", error);
            alert("There was an error submitting your message. Please try again.");
          }
        });
      }
      
      // Initialize the display
      displayMessages();
    };
    
    // Photo Gallery with lazy loading
    const initPhotoGallery = () => {
      if (!elements.photoGallery) return;
      
      const photos = [
        {
          url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf",
          caption: "The day of expression Mencentiemu Oa"
        },
        {
          url: "https://th.bing.com/th/id/OIP.3VWHX8JVTvWET4B3IykuWQHaFi?rs=1&pid=ImgDetMain",
          caption: "Evenings together under Chinaberry(Dhareek) Tree"
        },
        {
          url: "https://th.bing.com/th/id/OIP.GPHD93gV0BpwOnoMO32PgQHaJ-?rs=1&pid=ImgDetMain",
          caption: "That midnight walk Oa"
        },
        {
          url: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f",
          caption: "Oa Wo IceCream Oa"
        },
        {
          url: "https://th.bing.com/th/id/OIP.yiHnLLxVQDdeDebTV6MJXwHaHa?rs=1&pid=ImgDetMain",
          caption: "Oa kuch yad aya kia Oa"
        }
      ];
      
      const fragment = document.createDocumentFragment();
      
      photos.forEach(photo => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
          <div class="gallery-image-container">
            <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                 data-src="${photo.url}" 
                 alt="${photo.caption}" 
                 class="gallery-image"
                 loading="lazy">
          </div>
          <div class="gallery-caption">
            <p>${photo.caption}</p>
          </div>
        `;
        fragment.appendChild(galleryItem);
      });
      
      elements.photoGallery.appendChild(fragment);
      
      // Lazy loading implementation
      const lazyLoad = () => {
        const images = document.querySelectorAll('.gallery-image[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          });
        });
        
        images.forEach(img => imageObserver.observe(img));
      };
      
      lazyLoad();
    };
    
    // Initialize all components
    const init = () => {
      if (initAudio()) {
        initAudioPlayer();
      }
      startCountdown();
      initMessageBoard();
      initPhotoGallery();
    };
    
    // Start the application
    init();
  });
