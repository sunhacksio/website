// Timeline and countdown functionality
// Global maps for performance
let timelineMap = {};
let allEvents = [];

document.addEventListener("DOMContentLoaded", function() {
    fetch('assets/runofshow.csv')
        .then(response => response.text())
        .then(data => {
            const events = parseCSV(data);
            const processedEvents = processEvents(events);
            allEvents = processedEvents;
            displayTimeline(processedEvents);
            // initial single tick: sets countdown and starts live updates
            startClock();
                // debounced resize to avoid layout thrash on mobile orientation change
                let resizeTimer = null;
                window.addEventListener('resize', () => {
                    if (resizeTimer) clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(() => {
                        // on resize, re-render details if needed or recalc layout
                        // (we keep rendering light — only reposition sticky detail)
                        const details = document.getElementById('timeline-details');
                        if (details && details.querySelector('.detail-card') && details.querySelector('.detail-card .detail-title')) {
                            // no-op placeholder for future recalculations
                        }
                    }, 200);
                });
        });
});

        // Ensure there's an ARIA live region for announcements
        function ensureLiveRegion() {
            let live = document.getElementById('timeline-live');
            if (!live) {
                live = document.createElement('div');
                live.id = 'timeline-live';
                live.setAttribute('aria-live', 'polite');
                live.setAttribute('aria-atomic', 'true');
                live.style.position = 'absolute';
                live.style.left = '-9999px';
                live.style.width = '1px';
                live.style.height = '1px';
                document.body.appendChild(live);
            }
            return live;
        }

function parseCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const rows = lines.slice(1).map(line => {
        const values = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.replace(/"/g, '').trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.replace(/"/g, '').trim());
        return values;
    });
    return rows.map(row => {
        const obj = {};
        headers.forEach((h, i) => obj[h] = row[i] || '');
        return obj;
    });
}

function processEvents(events) {
    return events.map(event => {
        const dateStr = event.Date; // e.g., "Saturday 9/27/25"
        const dateMatch = dateStr.match(/(\d+)\/(\d+)\/(\d+)/);
        if (!dateMatch) return null;
        const month = parseInt(dateMatch[1]);
        const day = parseInt(dateMatch[2]);
        const year = 2000 + parseInt(dateMatch[3]); // 25 -> 2025
        const startTime = parseTime(event['Start Time']);
        const stopTime = event['End Time'] ? parseTime(event['End Time']) : null;
        
        const startDate = new Date(year, month - 1, day, startTime.hours, startTime.minutes);
        const stopDate = stopTime ? new Date(year, month - 1, day, stopTime.hours, stopTime.minutes) : null;
        
        return {
            ...event,
            startDate,
            stopDate,
            description: event.Event,
            location: event.Location,
            category: event.Category
        };
    }).filter(e => e);
}

function parseTime(timeStr) {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return null;
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
}

function slugify(s) {
        if (!s) return '';
        return s.toString().toLowerCase().trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');
}

function displayCountdown(events) {
    const firstEvent = events[0];
    if (!firstEvent) return;
    const countdownEl = document.getElementById('countdown');
    updateCountdown(countdownEl, firstEvent.startDate, firstEvent);
}

function updateCountdown(el, targetDate, event) {
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
        el.textContent = 'Event has started!';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    el.textContent = `Countdown to ${event.description}: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function displayTimeline(events) {
    const timelineEl = document.getElementById('timeline');
    timelineEl.innerHTML = '';
    
    const groupedEvents = events.reduce((acc, event) => {
        const date = event.Date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
    }, {});
    
    Object.keys(groupedEvents).forEach(date => {
        const headerEl = document.createElement('header');
        headerEl.className = 'timeline-header';
        headerEl.innerHTML = `<span class="tag is-medium" style="background-color: #1a1a3e; color: white;">${date}</span>`;
        timelineEl.appendChild(headerEl);
        
        groupedEvents[date].forEach((event, index) => {
            const eventEl = document.createElement('div');
            eventEl.className = 'timeline-item';
            // store an id to map DOM items back to events for live tracking
            eventEl.dataset.uid = `${date}__${index}`;
                        const catText = event.category || event.Category || '';
                        const catSlug = slugify(catText);
                        eventEl.innerHTML = `
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <p class="heading">${event.startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ${event.stopDate ? ' - ' + event.stopDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</p>
                    <h4 style="margin-bottom: 0.5rem; color: #1a1a3e;">${event.description}</h4>
                    <p style="color: #666; font-size: 0.9rem;">Location: ${event.location}</p>
                                                            <div class="meta-row">
                                                                <span class="category tag ${catSlug ? 'category-' + catSlug : ''}">${catText}</span>
                                                            </div>
                </div>
            `;
            timelineEl.appendChild(eventEl);
            // attach the uid back to the event to use in live tracking
            event._uid = eventEl.dataset.uid;
            // store DOM reference for quick access
            timelineMap[event._uid] = eventEl;
            // make items interactive: click or Enter/Space to show details
            eventEl.tabIndex = 0;
            eventEl.setAttribute('role', 'button');
            eventEl.addEventListener('click', () => showDetails(event));
            eventEl.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    showDetails(event);
                }
            });
        });
    });
    // inject icons for category badges
    injectCategoryIcons();
}

// Add inline SVG icons for known categories (simple shapes)
function injectCategoryIcons() {
    const mapping = {
        'food': '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 3v6" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 3v6" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 12h18" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="12" width="18" height="7" rx="2" fill="#f6a623"/></svg>',
        'judging': '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="3" fill="#7b61ff"/><path d="M4 20c2-4 6-6 8-6s6 2 8 6" stroke="#7b61ff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'main-stage': '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="18" height="12" rx="2" fill="#1a1a3e"/><path d="M8 12h8" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg>',
        'checkpoint': '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="#3bb6a1"/><path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };
    document.querySelectorAll('.category.tag').forEach(el => {
        if (el.querySelector('svg')) return; // already injected
        const classes = el.className.split(/\s+/);
        const catClass = classes.find(c => c.indexOf('category-') === 0);
        if (catClass) {
            const slug = catClass.replace('category-', '');
            const svg = mapping[slug];
            if (svg) {
                el.innerHTML = svg + el.innerHTML;
            }
        }
    });
}

function showDetails(event) {
    const details = document.getElementById('timeline-details');
    if (!details) return;
    const stop = event.stopDate ? ` - ${event.stopDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}` : '';
        // Build card element so we can apply an entrance animation class
        const card = document.createElement('div');
        card.className = 'detail-card';
        card.innerHTML = `
            <h3 class="detail-title">${event.description}</h3>
            <p class="detail-body"><strong>When:</strong> ${event.startDate.toLocaleDateString()} ${event.startDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}${stop}</p>
            <p class="detail-body"><strong>Location:</strong> ${event.location || 'TBD'}</p>
            <p class="detail-body"><strong>Category:</strong> ${event.category || event.Category || ''}</p>
        `;
        // Replace existing content and animate
        details.innerHTML = '';
        details.appendChild(card);
        // Force a reflow then add class to trigger CSS animation
        requestAnimationFrame(() => {
            card.classList.add('show');
        });
}

function startClock() {
    // Single interval for countdown + live highlighting
    const countdownEl = document.getElementById('countdown');
    let prevUid = null;

    const tick = () => {
        const now = new Date();
        // Next upcoming event for countdown
        const nextEvent = allEvents.find(e => now < e.startDate) || allEvents[0];
        if (nextEvent) updateCountdown(countdownEl, nextEvent.startDate, nextEvent);

        // Current event highlighting
        const currentEvent = allEvents.find(event => now >= event.startDate && (!event.stopDate || now <= event.stopDate));
        if (currentEvent) {
            if (prevUid && prevUid !== currentEvent._uid) {
                const prevEl = timelineMap[prevUid];
                if (prevEl) prevEl.classList.remove('current');
            }
            const curEl = timelineMap[currentEvent._uid];
            if (curEl && !curEl.classList.contains('current')) curEl.classList.add('current');
            prevUid = currentEvent._uid;
            // automatically show details when event becomes current
            showDetails(currentEvent);
            // announce to screen readers
            const live = ensureLiveRegion();
            try {
                live.textContent = `Now: ${currentEvent.description} starting at ${currentEvent.startDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
            } catch (e) { }
            countdownEl.textContent = `Current Event: ${currentEvent.description}`;
        } else {
            if (prevUid) {
                const prevEl = timelineMap[prevUid];
                if (prevEl) prevEl.classList.remove('current');
                prevUid = null;
            }
        }
    };

    // run immediately, then every second
    tick();
    if (startClock._interval) clearInterval(startClock._interval);
    startClock._interval = setInterval(tick, 1000);
}