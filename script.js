// Game state
let gold = 0;
let clickValue = 1;
let autoMineValue = 0;
let pickaxeLevel = 0;
let minerLevel = 0;
let wizardLevel = 0;
let dragonLevel = 0;
const escapeGoal = 1000000000; // 1 billion gold to escape
let secretKeysFound = 0;
const requiredKeys = 3;
let secretKeys = [];
// Variable para evitar clics duplicados
let isProcessingClick = false;

// Initialize encryption keys
function initSecretKeys() {
    secretKeys = [
        btoa('first_key_to_the_kingdom'),
        btoa('second_key_to_freedom'),
        btoa('third_key_to_escape')
    ];
    
    // Store encrypted flag
    localStorage.setItem('encrypted_flag', 
        btoa(btoa('flag{T3legram_Gr0up_1s_Th3_Tr3asure}')));
}

// DOM elements
const coinBalance = document.getElementById('coin-balance');
const mineBtn = document.getElementById('mine-btn');
const message = document.getElementById('message');
const mainCoin = document.getElementById('main-coin');
const pickaxeUpgrade = document.getElementById('pickaxe-upgrade');
const minerUpgrade = document.getElementById('miner-upgrade');
const wizardUpgrade = document.getElementById('wizard-upgrade');
const dragonUpgrade = document.getElementById('dragon-upgrade');
const escapeButton = document.getElementById('escape-button');

// Initialize keys on load
initSecretKeys();

// Check for console access - CTF challenge
console.log("%cCTF Challenge:", "color: red; font-size: 20px; font-weight: bold;");
console.log("%cHint: One key is hidden in the console", "color: orange; font-size: 16px;");
console.log(`%cKey 1: ${secretKeys[0]}`, "color: #333; font-size: 1px;");

// Add a hidden HTML comment with a key
document.body.insertAdjacentHTML('beforeend', `<!-- HTML Key: ${secretKeys[1]} -->`);

// Add a key in an HTTP header
document.addEventListener('DOMContentLoaded', function() {
    if (window.fetch) {
        console.log("%cHint: Check network requests for headers", "color: orange; font-size: 14px;");
    }
});

// Sound effects (create pixel sound using oscillator)
function playCollectSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(587.33, audioContext.currentTime); // D5
    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1); // A5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

function playErrorSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
    oscillator.frequency.exponentialRampToValueAtTime(165, audioContext.currentTime + 0.1); // E3
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Update display
function updateDisplay() {
    coinBalance.textContent = `Gold: ${Math.floor(gold).toLocaleString()}`;
    mineBtn.textContent = `Mine Gold [+${clickValue}]`;
    
    // Update the escape button display
    const progress = (gold / escapeGoal) * 100;
    escapeButton.textContent = `ESCAPE THE MINE (Cost: ${Math.floor(escapeGoal).toLocaleString()} Gold)`;
    
    // Update the appearance based on progress
    if (progress >= 100) {
        escapeButton.style.backgroundColor = '#ffd700';
        escapeButton.style.color = '#8b0000';
        escapeButton.textContent = 'ESCAPE NOW!';
        escapeButton.style.animation = 'pulse 0.5s infinite';
        
        // Set the third key in local storage once they reach the goal
        localStorage.setItem('third_secret_key', secretKeys[2]);
        console.log("%cHint: Check localStorage for the final key", "color: orange; font-size: 14px;");
    } else {
        // Show progress in the button
        escapeButton.innerHTML = `ESCAPE THE MINE<br>Cost: ${Math.floor(escapeGoal).toLocaleString()} Gold<br>(${progress.toFixed(6)}% complete)`;
    }
}

// Event listeners - Con corrección para evitar clics duplicados
mineBtn.addEventListener('click', function(event) {
    // Si ya estamos procesando un clic, ignorar este nuevo clic
    if (isProcessingClick) return;
    
    // Marcar que estamos procesando un clic
    isProcessingClick = true;
    
    gold += clickValue;
    playCollectSound();
    updateDisplay();
    
    // Coin animation
    mainCoin.style.animation = 'none';
    void mainCoin.offsetWidth; // Trigger reflow
    mainCoin.style.animation = 'float 2s infinite alternate ease-in-out';
    
    // Add temporary floating text
    const floatingText = document.createElement('div');
    floatingText.textContent = `+${clickValue}`;
    floatingText.style.position = 'absolute';
    floatingText.style.color = '#f8d878';
    floatingText.style.left = `${Math.random() * 50 + 25}%`;
    floatingText.style.top = '40%';
    floatingText.style.fontSize = '20px';
    floatingText.style.fontWeight = 'bold';
    floatingText.style.textShadow = '2px 2px 0 #352818';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.animation = 'float 1s forwards';
    floatingText.style.opacity = '1';
    document.querySelector('.coin-container').appendChild(floatingText);
    
    setTimeout(() => {
        floatingText.remove();
    }, 1000);
    
    // Permitir otro clic después de un pequeño retraso
    setTimeout(() => {
        isProcessingClick = false;
    }, 100);
});

// Prevenir eventos táctiles fantasma
mineBtn.addEventListener('touchstart', function(event) {
    event.preventDefault();
});

// Add debug boost for testing
mineBtn.addEventListener('dblclick', () => {
    gold += 1;
    updateDisplay();
});

pickaxeUpgrade.addEventListener('click', () => {
    const cost = 10 * Math.pow(1.5, pickaxeLevel);
    if (gold >= cost) {
        gold -= cost;
        pickaxeLevel++;
        clickValue++;
        playCollectSound();
        pickaxeUpgrade.querySelector('div:nth-child(2)').textContent = `Cost: ${Math.floor(10 * Math.pow(1.5, pickaxeLevel))}`;
        pickaxeUpgrade.querySelector('div:nth-child(3)').textContent = `+${clickValue} per click`;
        updateDisplay();
        message.textContent = "Pickaxe upgraded!";
        setTimeout(() => {
            message.textContent = "";
        }, 2000);
    } else {
        playErrorSound();
        message.textContent = "Not enough gold!";
        setTimeout(() => {
            message.textContent = "";
        }, 2000);
    }
});

minerUpgrade.addEventListener('click', () => {
    const cost = 50 * Math.pow(1.5, minerLevel);
    if (gold >= cost) {
        gold -= cost;
        minerLevel++;
        autoMineValue += 1;
        playCollectSound();
        minerUpgrade.querySelector('div:nth-child(2)').textContent = `Cost: ${Math.floor(50 * Math.pow(1.5, minerLevel))}`;
        updateDisplay();
        message.textContent = "Hired a dwarf miner!";
        setTimeout(() => {
            message.textContent = "";
        }, 2000);
    } else {
        playErrorSound();
        message.textContent = "Not enough gold!";
        setTimeout(() => {
            message.textContent = "";
        }, 2000);
    }
});

wizardUpgrade.addEventListener('click', () => {
    const cost = 200 * Math.pow(1.5, wizardLevel);
    if (gold >= cost) {
        gold -= cost;
        wizardLevel++;
        autoMineValue += 5;
        playCollectSound();
        wizardUpgrade.querySelector('div:nth-child(2)').textContent = `Cost: ${Math.floor(200 * Math.pow(1.5, wizardLevel))}`;
        updateDisplay();
        message.textContent = "Hired a wizard!";
        setTimeout(() => {
            message.textContent = "";
        }, 2000);
    } else {
        playErrorSound();
        message.textContent = "Not enough gold!";
        setTimeout(() => {
            message.textContent = "";
        }, 2000);
    }
});

dragonUpgrade.addEventListener('click', () => {
    const cost = 1000 * Math.pow(1.5, dragonLevel);
    if (gold >= cost) {
        gold -= cost;
        dragonLevel++;
        autoMineValue += 25;
        playCollectSound();
        dragonUpgrade.querySelector('div:nth-child(2)').textContent = `Cost: ${Math.floor(1000 * Math.pow(1.5, dragonLevel))}`;
        updateDisplay();
        message.textContent = "Tamed a dragon!";
        setTimeout(() => {
            message.textContent = "";
        }, 2000);
    } else {
        playErrorSound();
        message.textContent = "Not enough gold!";
        setTimeout(() => {
            message.textContent = "";
        }, 2000);
    }
});

// Escape button functionality
escapeButton.addEventListener('click', () => {
    if (gold >= escapeGoal) {
        // Player has enough gold - give them a choice
        const challengeChoice = confirm("You've collected enough gold to escape! Would you like to try the security challenge (CTF)? Click 'OK' for the challenge or 'Cancel' to simply escape.");
        
        if (challengeChoice) {
            // They want to try the CTF challenge
            checkSecretKeys();
        } else {
            // They just want to escape directly with gold
            showVictoryScreen(false);
        }
    } else {
        playErrorSound();
        message.textContent = `Need ${Math.floor(escapeGoal - gold).toLocaleString()} more gold to escape!`;
        setTimeout(() => {
            message.textContent = "";
        }, 3000);
        
        // Make the button shake to indicate it's not ready
        escapeButton.style.animation = 'none';
        void escapeButton.offsetWidth; // Trigger reflow
        escapeButton.style.animation = 'shake 0.5s';
        
        // Add shake animation if not present
        if (!document.querySelector('style#shakeAnimation')) {
            const style = document.createElement('style');
            style.id = 'shakeAnimation';
            style.textContent = `
                @keyframes shake {
                    0% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    50% { transform: translateX(10px); }
                    75% { transform: translateX(-10px); }
                    100% { transform: translateX(0); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            escapeButton.style.animation = 'pulse 2s infinite';
        }, 500);
    }
});

// Function to check if player has found all secret keys
function checkSecretKeys() {
    let foundKeys = 0;
    const keyInput = prompt("Secret Challenge: You need 3 hidden keys to unlock the flag. Enter them separated by commas (or cancel to skip):");
    
    if (!keyInput) {
        // They cancelled - just show the regular victory
        showVictoryScreen(false);
        return;
    }
    
    const keys = keyInput.split(',').map(k => k.trim());
    
    // Check each entered key against our secret keys
    keys.forEach(key => {
        if (secretKeys.includes(key)) {
            foundKeys++;
        }
    });
    
    if (foundKeys === requiredKeys) {
        showVictoryScreen(true);
    } else {
        message.textContent = `You found ${foundKeys} of ${requiredKeys} valid keys. Keep searching or escape without the flag.`;
        
        // Give them a second chance - either try again or just escape
        setTimeout(() => {
            const tryAgain = confirm(`You found ${foundKeys} of ${requiredKeys} valid keys. Try again (OK) or escape without the flag (Cancel)?`);
            if (tryAgain) {
                checkSecretKeys(); // Try again
            } else {
                showVictoryScreen(false); // Just escape
            }
        }, 1000);
    }
}

// Show the victory screen with Telegram link
function showVictoryScreen(completedChallenge = false) {
    // Get the flag if they completed the challenge
    let flagSection = '';
    if (completedChallenge) {
        // Decrypt the flag
        const encryptedFlag = localStorage.getItem('encrypted_flag');
        const flag = atob(atob(encryptedFlag));
        
        flagSection = `
            <div style="background-color: #1a1a1a; padding: 15px; border: 2px solid #ffd700; margin: 20px 0; font-family: monospace; color: #00ff00; text-align: center;">
                CTF Flag: ${flag}
            </div>
        `;
    }
    
    // Victory! - with responsive design
    document.body.innerHTML = `
        <div class="victory-screen" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background-color: #000; overflow-x: hidden; padding: 20px 10px;">
            <h1 style="color: #ffd700; font-size: min(48px, 8vw); text-shadow: 0 0 10px #ffd700; margin-bottom: 20px; font-family: 'PixelFont', monospace;">YOU ESCAPED!</h1>
            
            <div style="width: min(300px, 70vw); height: min(300px, 70vw); background-color: #ffd700; border-radius: 50%; box-shadow: 0 0 50px 30px #ffd700; animation: float 3s infinite alternate ease-in-out;"></div>
            
            <p style="color: #fff; font-size: min(24px, 5vw); max-width: min(600px, 90vw); text-align: center; margin-top: 20px; font-family: 'PixelFont', monospace;">
                ${completedChallenge ? 
                  'Congratulations! You found all the keys and escaped with ' + Math.floor(gold).toLocaleString() + ' gold coins!' : 
                  'After gathering ' + Math.floor(gold).toLocaleString() + ' gold coins, you have finally escaped the mine and achieved freedom!'}
            </p>
            
            ${flagSection}
            
            <a href="${completedChallenge ? 'https://t.me/+GASooYg6QzU2ZWNk' : 'https://chat.whatsapp.com/Cr7wOya3qJl76zgQOIo1P3'}" target="_blank" style="
                display: block;
                margin: 20px auto;
                padding: 12px 20px;
                background-color: #0088cc;
                color: #ffffff;
                font-size: min(24px, 5vw);
                text-decoration: none;
                border: 4px solid #ffffff;
                box-shadow: 0 0 10px #0088cc;
                animation: pulse 2s infinite;
                font-family: 'PixelFont', monospace;
                transition: all 0.3s;
                text-align: center;
            ">${completedChallenge ? "ACCEDE AL CLUB DE GANADORES" : "ÚNETE AL GRUPO DE ESCAPE"}</a>
            
            <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 20px; background-color: #513f25; color: #ffd700; font-size: min(20px, 5vw); border: 4px solid #ffd700; cursor: pointer; font-family: 'PixelFont', monospace;">Play Again</button>
        </div>
    `;
    
    // Add responsive CSS for the victory screen
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @media screen and (max-width: 768px) {
            .victory-screen {
                padding: 10px 5px;
            }
            
            .victory-screen a, .victory-screen button {
                width: 90%;
                max-width: 300px;
                padding: 10px;
            }
        }
    `;
    document.head.appendChild(styleElement);
    
    // Victory sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play a little victory melody
    const playNote = (freq, startTime, duration) => {
        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        osc.frequency.value = freq;
        osc.type = 'square';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
        osc.connect(gainNode);
        gainNode.connect(audioContext.destination);
        osc.start(audioContext.currentTime + startTime);
        osc.stop(audioContext.currentTime + startTime + duration);
    };
    
    // Victory melody
    playNote(523.25, 0, 0.2);     // C5
    playNote(659.25, 0.2, 0.2);   // E5
    playNote(783.99, 0.4, 0.2);   // G5
    playNote(1046.50, 0.6, 0.4);  // C6
    playNote(783.99, 1.0, 0.2);   // G5
    playNote(1046.50, 1.2, 0.8);  // C6
}

// Auto-mining
setInterval(() => {
    if (autoMineValue > 0) {
        gold += autoMineValue / 10;
        updateDisplay();
    }
}, 100);

// Initialize modal functionality
const infoButton = document.getElementById('info-button');
const ctfModal = document.getElementById('ctf-modal');
const closeModalButton = document.getElementById('close-modal');

// Open modal when info button is clicked
infoButton.addEventListener('click', () => {
    ctfModal.style.display = 'block';
});

// Close modal when X is clicked
closeModalButton.addEventListener('click', () => {
    ctfModal.style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === ctfModal) {
        ctfModal.style.display = 'none';
    }
});

// Initialize
updateDisplay();

// Add these functions to script.js

// Save game state to localStorage
function saveGame() {
    const gameState = {
        gold: gold,
        clickValue: clickValue,
        autoMineValue: autoMineValue,
        pickaxeLevel: pickaxeLevel,
        minerLevel: minerLevel,
        wizardLevel: wizardLevel,
        dragonLevel: dragonLevel,
        secretKeysFound: secretKeysFound,
        lastSaved: new Date().getTime()
    };
    
    localStorage.setItem('medievalPixelCoinSave', JSON.stringify(gameState));
    console.log("Game saved!");
}

// Load game state from localStorage
function loadGame() {
    const savedGame = localStorage.getItem('medievalPixelCoinSave');
    
    if (savedGame) {
        try {
            const gameState = JSON.parse(savedGame);
            
            // Restore game state
            gold = gameState.gold || 0;
            clickValue = gameState.clickValue || 1;
            autoMineValue = gameState.autoMineValue || 0;
            pickaxeLevel = gameState.pickaxeLevel || 0;
            minerLevel = gameState.minerLevel || 0;
            wizardLevel = gameState.wizardLevel || 0;
            dragonLevel = gameState.dragonLevel || 0;
            secretKeysFound = gameState.secretKeysFound || 0;
            
            // Update display and upgrade costs
            updateDisplay();
            updateUpgradeCosts();
            
            // Show a welcome back message
            const timeSinceLastPlay = new Date().getTime() - (gameState.lastSaved || 0);
            const minutesAway = Math.floor(timeSinceLastPlay / (1000 * 60));
            
            if (minutesAway > 0) {
                message.textContent = `Welcome back! You were gone for ${minutesAway} minutes.`;
                setTimeout(() => {
                    message.textContent = "";
                }, 4000);
            }
            
            console.log("Game loaded successfully!");
            return true;
        } catch (error) {
            console.error("Error loading saved game:", error);
            return false;
        }
    }
    return false;
}

// Update upgrade costs function
function updateUpgradeCosts() {
    pickaxeUpgrade.querySelector('div:nth-child(2)').textContent = `Cost: ${Math.floor(10 * Math.pow(1.5, pickaxeLevel))}`;
    pickaxeUpgrade.querySelector('div:nth-child(3)').textContent = `+${clickValue} per click`;
    
    minerUpgrade.querySelector('div:nth-child(2)').textContent = `Cost: ${Math.floor(50 * Math.pow(1.5, minerLevel))}`;
    wizardUpgrade.querySelector('div:nth-child(2)').textContent = `Cost: ${Math.floor(200 * Math.pow(1.5, wizardLevel))}`;
    dragonUpgrade.querySelector('div:nth-child(2)').textContent = `Cost: ${Math.floor(1000 * Math.pow(1.5, dragonLevel))}`;
}

// Add a save feature every minute
setInterval(saveGame, 60000);

// Save game on page unload
window.addEventListener('beforeunload', saveGame);

// Load game on page load (add this to the bottom of the file, just before the updateDisplay() call)
document.addEventListener('DOMContentLoaded', function() {
    // Try to load the game after the intro modal is closed
    document.getElementById('intro-modal').addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            setTimeout(loadGame, 100);
        }
    });
    
    // Add reset button to game interface
    const resetButton = document.createElement('button');
    resetButton.className = 'btn';
    resetButton.style.fontSize = '14px';
    resetButton.style.padding = '6px 12px';
    resetButton.style.margin = '10px auto';
    resetButton.style.display = 'block';
    resetButton.textContent = 'Reset Progress';
    
    resetButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
            localStorage.removeItem('medievalPixelCoinSave');
            location.reload();
        }
    });
    
    document.querySelector('footer').insertAdjacentElement('beforebegin', resetButton);
});