let currentMode = 'single'; // 'single' or 'range'

// Switch between single date and date range mode
function switchMode(mode) {
    currentMode = mode;
    
    // Update toggle buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide appropriate mode content
    document.getElementById('singleMode').style.display = mode === 'single' ? 'block' : 'none';
    document.getElementById('rangeMode').style.display = mode === 'range' ? 'block' : 'none';
    
    // Clear result
    const resultDiv = document.getElementById('result');
    resultDiv.classList.remove('active');
    resultDiv.innerHTML = `
        <div class="placeholder-text">
            <span class="placeholder-icon">⏳</span>
            <p>Your age will appear here</p>
        </div>
    `;
}

// Main calculate function
function calculateAge() {
    const resultDiv = document.getElementById('result');
    
    if (currentMode === 'single') {
        calculateSingleDateAge();
    } else {
        calculateDateRangeAge();
    }
    
    // Smooth scroll to result
    setTimeout(() => {
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

// Calculate age from single date to today
function calculateSingleDateAge() {
    const dobInput = document.getElementById('singleDob');
    const resultDiv = document.getElementById('result');
    
    if (!dobInput.value) {
        showError('Please select your date of birth! 🗓️', dobInput);
        return;
    }
    
    const dob = new Date(dobInput.value);
    const today = new Date();
    
    if (dob > today) {
        showError('Date of birth cannot be in the future! 🚀', dobInput);
        return;
    }
    
    const ageData = calculateDateDifference(dob, today);
    displaySingleResult(ageData, dob, today);
}

// Calculate age between two dates
function calculateDateRangeAge() {
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');
    const resultDiv = document.getElementById('result');
    
    if (!startInput.value) {
        showError('Please select start date! 📅', startInput);
        return;
    }
    
    if (!endInput.value) {
        showError('Please select end date! 📅', endInput);
        return;
    }
    
    const startDate = new Date(startInput.value);
    const endDate = new Date(endInput.value);
    
    if (startDate > endDate) {
        showError('Start date must be before end date! ⚠️', startInput);
        return;
    }
    
    const ageData = calculateDateDifference(startDate, endDate);
    displayRangeResult(ageData, startDate, endDate);
}

// Core calculation function
function calculateDateDifference(startDate, endDate) {
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();
    
    // Adjust if end date hasn't reached start date's month/day
    if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
    }
    
    // Adjust days if negative
    if (days < 0) {
        const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        days += lastMonth.getDate();
        months--;
    }
    
    // Adjust months if negative
    if (months < 0) {
        months += 12;
        years--;
    }
    
    // Calculate total
    const totalMonths = (years * 12) + months;
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    
    return {
        years,
        months,
        days,
        totalMonths,
        totalDays,
        totalWeeks,
        remainingDays
    };
}

// Display single date result
function displaySingleResult(ageData, dob, today) {
    const resultDiv = document.getElementById('result');
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bornDay = daysOfWeek[dob.getDay()];
    
    // Calculate next birthday
    const nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBirthday < today) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const daysToBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    
    resultDiv.classList.remove('active');
    void resultDiv.offsetWidth;
    resultDiv.classList.add('active');
    
    resultDiv.innerHTML = `
        <div class="result-text">
            <div class="result-line">Your Current Age</div>
            <span class="age-highlight">${ageData.years}</span> Years &nbsp;
            <span class="age-highlight">${ageData.months}</span> Months &nbsp;
            <span class="age-highlight">${ageData.days}</span> Days
            
            <div class="divider"></div>
            
            <div class="extra-info">
                <div>📅 Born on <strong>${bornDay}</strong></div>
                <div>📊 Total: <strong>${ageData.totalMonths}</strong> months | <strong>${ageData.totalDays}</strong> days</div>
                <div>📆 <strong>${ageData.totalWeeks}</strong> weeks & <strong>${ageData.remainingDays}</strong> days</div>
                <div>🎂 Next birthday in <strong>${daysToBirthday}</strong> days</div>
            </div>
        </div>
    `;
    
    createConfetti();
}

// Display date range result
function displayRangeResult(ageData, startDate, endDate) {
    const resultDiv = document.getElementById('result');
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const startDay = daysOfWeek[startDate.getDay()];
    const endDay = daysOfWeek[endDate.getDay()];
    
    resultDiv.classList.remove('active');
    void resultDiv.offsetWidth;
    resultDiv.classList.add('active');
    
    resultDiv.innerHTML = `
        <div class="result-text">
            <div class="result-line">Time Between Dates</div>
            <span class="age-highlight">${ageData.years}</span> Years &nbsp;
            <span class="age-highlight">${ageData.months}</span> Months &nbsp;
            <span class="age-highlight">${ageData.days}</span> Days
            
            <div class="divider"></div>
            
            <div class="extra-info">
                <div>📊 Total: <strong>${ageData.totalMonths}</strong> months | <strong>${ageData.totalDays}</strong> days</div>
                <div>📆 <strong>${ageData.totalWeeks}</strong> weeks & <strong>${ageData.remainingDays}</strong> days</div>
                <div>📅 ${startDate.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})} (${startDay})</div>
                <div>➡ ${endDate.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})} (${endDay})</div>
            </div>
        </div>
    `;
}

// Show error message
function showError(message, inputElement) {
    const resultDiv = document.getElementById('result');
    resultDiv.classList.remove('active');
    resultDiv.innerHTML = `
        <div class="result-text" style="color: #ff6b6b;">
            ${message}
        </div>
    `;
    
    if (inputElement) {
        shakeElement(inputElement);
    }
}

// Shake animation for errors
function shakeElement(element) {
    element.parentElement.style.animation = 'none';
    element.parentElement.offsetHeight;
    element.parentElement.style.animation = 'shake 0.5s ease';
}

// Confetti effect
function createConfetti() {
    const colors = ['#ff6b6b', '#ee5a24', '#feca57', '#54a0ff', '#5f27cd', '#00d2d3'];
    const confettiCount = 25;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: ${6 + Math.random() * 8}px;
                height: ${6 + Math.random() * 8}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: confettiFall ${1.5 + Math.random() * 2.5}s ease-in forwards;
                z-index: 1000;
                pointer-events: none;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 40);
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Enter key support for both modes
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateAge();
    }
});