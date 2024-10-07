// Global Variables
let openWindows = [];

function openWindow(windowId, position = {}) {
  const windowElement = document.getElementById(windowId);
  windowElement.style.display = 'flex';
  
  if (position.left !== undefined && position.top !== undefined) {
    windowElement.style.left = position.left + 'px';
    windowElement.style.top = position.top + 'px';
  } else {
    windowElement.style.left = '100px';
    windowElement.style.top = '100px';
  }

  if (windowId === 'cvWindow') {
    windowElement.style.width = '80%';
    windowElement.style.maxWidth = '1200px';
  }

  bringToFront(windowElement);
  if (windowId === 'musicWindow') {
    setTimeout(() => {
      init();
      animate();
    }, 100);
  }
  if (windowId !== 'welcomeWindow') {
    addToTaskbar(windowId);
  }

  if (!openWindows.includes(windowId)) {
    openWindows.push(windowId);
  }
}

function initAudioVisualizer() {
  if (typeof init === 'function') {
    init();
    animate();
  }
}

function closeWindow(windowId) {
  document.getElementById(windowId).style.display = 'none';
  removeFromTaskbar(windowId);
  openWindows = openWindows.filter(id => id !== windowId);
}

function bringToFront(element) {
  const highestZIndex = Math.max(
    ...Array.from(document.querySelectorAll('.window'))
      .map(el => parseInt(window.getComputedStyle(el).zIndex) || 0),
    10
  );
  element.style.zIndex = highestZIndex + 1;
}

function addToTaskbar(windowId) {
  const taskbarWindows = document.getElementById('taskbar-windows');
  if (!document.getElementById(`taskbar-${windowId}`)) {
    const tab = document.createElement('div');
    tab.className = 'taskbar-tab';
    tab.id = `taskbar-${windowId}`;
    tab.onclick = () => toggleWindow(windowId);
    tab.innerHTML = `<img src="icons/window-icon.png" alt=""> ${windowId.replace('Window', '')}`;
    taskbarWindows.appendChild(tab);
  }
}

function removeFromTaskbar(windowId) {
  const tab = document.getElementById(`taskbar-${windowId}`);
  if (tab) tab.remove();
}

function toggleWindow(windowId) {
  const windowElement = document.getElementById(windowId);
  if (windowElement.style.display === 'none' || windowElement.style.display === '') {
    openWindow(windowId);
  } else {
    windowElement.style.display = 'none';
  }
}

function showProjectDetails(project) {
  const projectName = document.getElementById('projectName');
  const projectDescription = document.getElementById('projectDescription');
  const projectLink = document.getElementById('projectLink');

  const projects = {
    aidj: {
      name: 'AIDJ',
      description: 'AI DJ that curates parties using real-time video analysis',
      link: 'https://devpost.com/software/aidj'
    },
    datamask: {
      name: 'DataMask',
      description: 'context-aware data anonymization layer for LLMs',
      link: 'https://devpost.com/software/datamask'
    },
    nevalone: {
      name: 'NevAlone',
      description: 'AI companion for seniors facing loneliness, grief, and dementia',
      link: 'https://devpost.com/software/navalone'
    },
    paperping: {
      name: 'PaperPing',
      description: 'real-time alerts on new research papers tailored to your needs',
      link: 'https://devpost.com/software/paperping'
    }
  };

  const selectedProject = projects[project];
  
  projectName.textContent = selectedProject.name;
  projectDescription.textContent = selectedProject.description;
  projectLink.href = selectedProject.link;
}

function closeClippy() {
  document.getElementById('clippy').style.display = 'none';
}
function downloadCV() {
  const link = document.createElement('a');
  link.href = 'resume.pdf';
  link.download = 'Anna_Sims_Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function showMobileSection(section) {
  const content = document.getElementById('mobileContent');
  switch (section) {
    case 'aboutMobile':
      content.innerHTML = 
      '<h2>About Me</h2><p>Welcome, my name is Anna! When it comes to my day job I love all things data and machine learning, but on the weekends I enjoy exploring HCI and the more creative side of technology. I have a solid foundation in machine learning and data engineering from the University of Michigan, I have navigated roles as diverse as Design Engineer, Trading Analyst, and XR Dev and Lab Manager. My research work spans from analyzing carbon emissions in underdeveloped countries to studying the impact of deep learning in computational finance and exoplanet characterization. </p><p>Throughout 2023, I travelled across the country every two weeks to participate in hackathons. These hackathons were not just competitions; they were my classroom, keeping me abreast of cutting-edge tools, technologies, and opportunities in tech.</p><p> I\'ve set my sights on upskilling and earning better credentials in 2024, aiming to enhance my credibility and create a solid foundation for turning ambitious plans into successful outcomes. Whether you\'re a fellow tech enthusiast, potential collaborator, or just passing through, I\'m glad you\'re here. Let\'s connect and explore how we can make a difference, together.</p>';
      break;
    case 'projectsMobile':
      content.innerHTML = '<h2>Projects</h2><p>Project descriptions go here.</p>';
      break;
    case 'blogMobile':
      content.innerHTML = '<h2>Blog</h2><p>Blog posts go here.</p>';
      break;
    case 'cvMobile':
      content.innerHTML = '<h2>My CV</h2><p>Your resume content here.</p><a href="your-cv.pdf" download>Download My CV</a>';
      break;
    case 'musicMobile':
      content.innerHTML = '<h2>My Favorite Songs</h2><iframe src="https://open.spotify.com/embed/playlist/your-playlist-id" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
      break;
    case 'connectMobile':
      content.innerHTML = '<h2>Let\'s Connect</h2><p>Connect with me on social media:</p><ul><li><a href="https://www.linkedin.com/in/yourprofile" target="_blank">LinkedIn</a></li><li><a href="https://github.com/yourprofile" target="_blank">GitHub</a></li><li><a href="mailto:youremail@example.com">Email: youremail@example.com</a></li></ul>';
      break;
    default:
      content.innerHTML = '';
  }
}

function openProject(windowId) {
  const windowWidth = Math.min(window.innerWidth * 0.8, 800);
  const windowHeight = Math.min(window.innerHeight * 0.8, 600);
  const leftPosition = (window.innerWidth - windowWidth) / 2;
  const topPosition = (window.innerHeight - windowHeight) / 2;
  openWindow(windowId, { left: leftPosition, top: topPosition });
}

window.onload = function() {
  const windowWidth = 600;
  const windowHeight = 400;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const leftPosition = (screenWidth - windowWidth) / 2;
  const topPosition = (screenHeight - windowHeight) / 2 - 20;

  openWindow('welcomeWindow', { left: leftPosition, top: topPosition });

  updateClock();
  setInterval(updateClock, 1000);
};

function toggleStartMenu() {
  const startMenu = document.getElementById('start-menu');
  if (startMenu.style.display === 'none' || startMenu.style.display === '') {
    startMenu.style.display = 'block';
  } else {
    startMenu.style.display = 'none';
  }
}

function updateClock() {
  const clock = document.getElementById('clock');
  const now = new Date();
  clock.textContent = now.toLocaleTimeString();
}

function adjustVolume(value) {
  alert(`Volume set to ${value}% (This is a mock function)`);
}

function changeBackground(image) {
  document.body.style.backgroundImage = `url('${image}')`;
}

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let currentWindow = null;

document.addEventListener('mousedown', function(e) {
  if (e.target.closest('.window-header')) {
    isDragging = true;
    currentWindow = e.target.closest('.window');
    bringToFront(currentWindow);
    dragOffsetX = e.clientX - currentWindow.offsetLeft;
    dragOffsetY = e.clientY - currentWindow.offsetTop;
  }
});

document.addEventListener('mousemove', function(e) {
  if (isDragging && currentWindow) {
    currentWindow.style.left = (e.clientX - dragOffsetX) + 'px';
    currentWindow.style.top = (e.clientY - dragOffsetY) + 'px';
  }
});

document.addEventListener('mouseup', function() {
  isDragging = false;
  currentWindow = null;
});