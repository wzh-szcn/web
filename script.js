// Carousel functionality
class Carousel {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        this.slides = document.querySelectorAll('.carousel-slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.querySelectorAll('.indicator');
        
        this.currentIndex = 0;
        this.slideCount = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        // Button events
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Indicator events
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Touch/Swipe support
        this.setupTouchEvents();
        
        // Auto-play
        this.startAutoPlay();
        
        // Pause on hover
        const container = document.querySelector('.carousel-container');
        container.addEventListener('mouseenter', () => this.stopAutoPlay());
        container.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
    
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        const threshold = 50;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }, { passive: true });
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
        this.updateCarousel();
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slideCount;
        this.updateCarousel();
    }
    
    updateCarousel() {
        // Update track position
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Navbar scroll effect
class Navbar {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScroll = 0;
        
        if (this.navbar) {
            this.init();
        }
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        if (!this.navbar) return;
        
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            this.navbar.style.background = 'rgba(15, 15, 26, 0.98)';
            this.navbar.style.padding = '1rem 2rem';
        } else {
            this.navbar.style.background = 'linear-gradient(180deg, rgba(15, 15, 26, 0.95) 0%, rgba(15, 15, 26, 0) 100%)';
            this.navbar.style.padding = '1.5rem 2rem';
        }
        
        this.lastScroll = currentScroll;
    }
}

// Smooth scroll for navigation links
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offset = 80; // Navbar height
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Intersection Observer for animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections
        document.querySelectorAll('.section-header, .team-links, .figure-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Aliyun DataV GeoJSON API base URL
const GEO_DATAV_URL = 'https://geo.datav.aliyun.com/areas_v3/bound';

// AMap (Gaode Map) - City Indicators
class CityMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.activeInfoWindow = null;
        this.activeCityIndex = null;
        this.activePolygon = null; // 当前高亮的城市边界
        this.geoJSONCache = {}; // 缓存已加载的GeoJSON
        this.isLockedByClick = false; // 点击选中后锁定，悬停不切换
        this.cities = [
            {
                name: 'Beijing',
                nameCn: '北京',
                fullName: '北京市',
                adcode: '110000',
                lng: 116.4074,
                lat: 39.9042,
                indicators: {
                    bypass: 85.2,
                    nnhi: 3.8,
                    distance: 12.5
                }
            },
            {
                name: 'Chengdu',
                nameCn: '成都',
                fullName: '成都市',
                adcode: '510100',
                lng: 104.0665,
                lat: 30.5728,
                indicators: {
                    bypass: 78.3,
                    nnhi: 3.2,
                    distance: 9.8
                }
            },
            {
                name: 'Guangzhou',
                nameCn: '广州',
                fullName: '广州市',
                adcode: '440100',
                lng: 113.2644,
                lat: 23.1291,
                indicators: {
                    bypass: 81.5,
                    nnhi: 3.6,
                    distance: 10.8
                }
            },
            {
                name: 'Haidong',
                nameCn: '海东',
                fullName: '海东市',
                adcode: '630200',
                lng: 102.1038,
                lat: 36.5029,
                indicators: {
                    bypass: 72.1,
                    nnhi: 2.5,
                    distance: 6.2
                }
            },
            {
                name: "Pu'er",
                nameCn: '普洱',
                fullName: '普洱市',
                adcode: '530800',
                lng: 100.9725,
                lat: 22.7774,
                indicators: {
                    bypass: 68.5,
                    nnhi: 2.1,
                    distance: 5.8
                }
            },
            {
                name: 'Qiqihar',
                nameCn: '齐齐哈尔',
                fullName: '齐齐哈尔市',
                adcode: '230200',
                lng: 123.9535,
                lat: 47.3481,
                indicators: {
                    bypass: 70.2,
                    nnhi: 2.3,
                    distance: 6.5
                }
            },
            {
                name: 'Shigatse',
                nameCn: '日喀则',
                fullName: '日喀则市',
                adcode: '540200',
                lng: 88.8811,
                lat: 29.2670,
                indicators: {
                    bypass: 65.8,
                    nnhi: 1.9,
                    distance: 4.5
                }
            },
            {
                name: 'Shanghai',
                nameCn: '上海',
                fullName: '上海市',
                adcode: '310000',
                lng: 121.4737,
                lat: 31.2304,
                indicators: {
                    bypass: 82.7,
                    nnhi: 3.5,
                    distance: 11.2
                }
            },
            {
                name: 'Shenzhen',
                nameCn: '深圳',
                fullName: '深圳市',
                adcode: '440300',
                lng: 114.0579,
                lat: 22.5431,
                indicators: {
                    bypass: 79.8,
                    nnhi: 3.4,
                    distance: 10.3
                }
            },
            {
                name: 'Turpan',
                nameCn: '吐鲁番',
                fullName: '吐鲁番市',
                adcode: '650400',
                lng: 89.1841,
                lat: 42.9476,
                indicators: {
                    bypass: 67.3,
                    nnhi: 2.0,
                    distance: 5.2
                }
            },
            {
                name: 'Wuhan',
                nameCn: '武汉',
                fullName: '武汉市',
                adcode: '420100',
                lng: 114.3054,
                lat: 30.5931,
                indicators: {
                    bypass: 76.5,
                    nnhi: 3.0,
                    distance: 8.5
                }
            }
        ];
        this.maxValues = {
            bypass: Math.max(...this.cities.map(c => c.indicators.bypass)),
            nnhi: Math.max(...this.cities.map(c => c.indicators.nnhi)),
            distance: Math.max(...this.cities.map(c => c.indicators.distance))
        };
        this.init();
    }

    init() {
        // Setup legend interaction immediately (always show city list)
        this.setupLegendInteraction();
        
        // Check if AMap API is loaded
        if (typeof AMap === 'undefined') {
            console.warn('AMap API not loaded. Please check your API key.');
            this.showFallback();
            return;
        }

        this.createMap();
    }

    createMap() {
        // Create map with dark style
        this.map = new AMap.Map('baidu-map', {
            zoom: 4.2,
            center: [107, 37],
            mapStyle: 'amap://styles/dark',
            viewMode: '2D',
            showLabel: true,
            features: ['bg', 'road', 'building', 'point'],
            lang: 'en',
            zoomEnable: false,
            dragEnable: false,
            scrollZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
            keyboardZoom: false
        });

        // Add city markers after map is ready
        this.map.on('complete', () => {
            this.addCityMarkers();
            this.addConnectionLines();
        });
    }

    createInfoContent(city, index) {
        const bypassPercent = (city.indicators.bypass / this.maxValues.bypass * 100).toFixed(0);
        const nnhiPercent = (city.indicators.nnhi / this.maxValues.nnhi * 100).toFixed(0);
        const distancePercent = (city.indicators.distance / this.maxValues.distance * 100).toFixed(0);

        return `
            <div class="info-window-custom">
                <div class="info-header">
                    <span class="city-name">${city.name}</span>
                    <button class="info-close" onclick="window.cityMap.closeInfoWindow()">×</button>
                </div>
                <div class="info-body">
                    <div class="indicator-item">
                        <div class="indicator-row">
                            <span class="indicator-name">Bypass Rate</span>
                            <span class="indicator-value">${city.indicators.bypass}%</span>
                        </div>
                        <div class="indicator-bar">
                            <div class="bar-fill" style="width: ${bypassPercent}%; background: linear-gradient(90deg, #e94560, #ff6b6b);"></div>
                        </div>
                    </div>
                    <div class="indicator-item">
                        <div class="indicator-row">
                            <span class="indicator-name">NNHI</span>
                            <span class="indicator-value">${city.indicators.nnhi}</span>
                        </div>
                        <div class="indicator-bar">
                            <div class="bar-fill" style="width: ${nnhiPercent}%; background: linear-gradient(90deg, #4a90d9, #6bb3ff);"></div>
                        </div>
                    </div>
                    <div class="indicator-item">
                        <div class="indicator-row">
                            <span class="indicator-name">Extra Travel Distance</span>
                            <span class="indicator-value">${city.indicators.distance} km</span>
                        </div>
                        <div class="indicator-bar">
                            <div class="bar-fill" style="width: ${distancePercent}%; background: linear-gradient(90deg, #50c878, #7de89d);"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    addCityMarkers() {
        this.cities.forEach((city, index) => {
            // Create custom marker content
            const markerContent = document.createElement('div');
            markerContent.className = 'custom-marker';
            markerContent.innerHTML = `
                <div class="marker-pulse"></div>
                <div class="marker-dot"></div>
                <div class="marker-label">${city.name}</div>
            `;

            // Create marker
            const marker = new AMap.Marker({
                position: [city.lng, city.lat],
                content: markerContent,
                offset: new AMap.Pixel(-20, -20),
                zIndex: 100 + index
            });

            // Create info window
            // Qiqihar (index 5) is at the top-right of the map, offset info window to bottom-right
            const infoOffset = index === 5 ? new AMap.Pixel(140, 60) : new AMap.Pixel(0, -40);
            const infoWindow = new AMap.InfoWindow({
                content: this.createInfoContent(city, index),
                offset: infoOffset,
                isCustom: true,
                autoMove: false
            });

            // Hover to show info - improved interaction
            let hoverTimer = null;
            
            marker.on('mouseover', () => {
                hoverTimer = setTimeout(() => {
                    this.showCityInfo(index);
                }, 150);
                markerContent.classList.add('marker-active');
                marker.setzIndex(200);
            });

            marker.on('mouseout', () => {
                if (hoverTimer) clearTimeout(hoverTimer);
                markerContent.classList.remove('marker-active');
                marker.setzIndex(100 + index);
            });

            // Click to focus and zoom
            marker.on('click', () => {
                this.focusCity(index);
            });

            marker.infoWindow = infoWindow;
            marker.content = markerContent;
            this.markers.push(marker);
            this.map.add(marker);
        });
    }

    showCityInfo(index) {
        // Check if marker exists
        if (!this.markers[index]) {
            console.warn('Marker not ready for index:', index);
            return;
        }
        
        // Close previous info window
        if (this.activeInfoWindow) {
            this.activeInfoWindow.close();
        }
        
        // Remove previous active state
        this.markers.forEach((m, i) => {
            if (m.content) m.content.classList.remove('marker-selected');
        });

        // Show new info window (autoMove: false prevents map movement)
        const marker = this.markers[index];
        marker.infoWindow.open(this.map, marker.getPosition());
        marker.content.classList.add('marker-selected');
        
        this.activeInfoWindow = marker.infoWindow;
        this.activeCityIndex = index;

        // Update legend selection
        this.updateLegendSelection(index);
        
        // Draw city boundary
        this.drawCityBoundary(index);
    }

    async focusCity(index) {
        const city = this.cities[index];
        await this.showCityInfoWithFitView(index);
    }

    async showCityInfoWithFitView(index) {
        // Check if marker exists
        if (!this.markers[index]) {
            console.warn('Marker not ready for index:', index);
            return;
        }
        
        this.isLockedByClick = true; // Lock selection after click
        
        // Close previous info window
        if (this.activeInfoWindow) {
            this.activeInfoWindow.close();
        }
        
        // Remove previous active state
        this.markers.forEach((m, i) => {
            if (m.content) m.content.classList.remove('marker-selected');
        });

        // Show new info window (autoMove: false prevents map movement)
        const marker = this.markers[index];
        marker.infoWindow.open(this.map, marker.getPosition());
        marker.content.classList.add('marker-selected');
        
        this.activeInfoWindow = marker.infoWindow;
        this.activeCityIndex = index;

        // Update legend selection
        this.updateLegendSelection(index);
        
        // Draw city boundary without fitView
        await this.drawCityBoundary(index, false);
    }

    closeInfoWindow() {
        if (this.activeInfoWindow) {
            this.activeInfoWindow.close();
            this.activeInfoWindow = null;
        }
        this.markers.forEach(m => {
            if (m.content) m.content.classList.remove('marker-selected');
        });
        this.activeCityIndex = null;
        this.updateLegendSelection(null);
        this.isLockedByClick = false; // Unlock when closing
        
        // Clear city boundary
        this.clearCityBoundary();
    }

    async drawCityBoundary(index, fitView = false) {
        const city = this.cities[index];
        console.log('drawCityBoundary called for:', city.nameCn);
        
        // Clear previous boundary
        this.clearCityBoundary();
        
        // Check cache first
        let geoJsonData = this.geoJSONCache[city.adcode];
        
        if (!geoJsonData && city.adcode) {
            // Load GeoJSON from Aliyun DataV API
            try {
                const url = `${GEO_DATAV_URL}/${city.adcode}.json`;
                const response = await fetch(url);
                if (response.ok) {
                    geoJsonData = await response.json();
                    this.geoJSONCache[city.adcode] = geoJsonData; // Cache it
                    console.log('GeoJSON loaded for:', city.nameCn);
                }
            } catch (error) {
                console.warn('Failed to load GeoJSON for', city.nameCn, error);
            }
        }
        
        if (geoJsonData) {
            // Draw GeoJSON boundary
            const polygons = [];
            geoJsonData.features.forEach(feature => {
                if (feature.geometry.type === 'Polygon') {
                    const polygon = new AMap.Polygon({
                        path: feature.geometry.coordinates[0].map(coord => [coord[0], coord[1]]),
                        strokeColor: '#e94560',
                        strokeWeight: 2,
                        strokeOpacity: 0.8,
                        fillColor: '#e94560',
                        fillOpacity: 0.15,
                        zIndex: 10
                    });
                    polygons.push(polygon);
                    this.map.add(polygon);
                } else if (feature.geometry.type === 'MultiPolygon') {
                    feature.geometry.coordinates.forEach(rings => {
                        const polygon = new AMap.Polygon({
                            path: rings[0].map(coord => [coord[0], coord[1]]),
                            strokeColor: '#e94560',
                            strokeWeight: 2,
                            strokeOpacity: 0.8,
                            fillColor: '#e94560',
                            fillOpacity: 0.15,
                            zIndex: 10
                        });
                        polygons.push(polygon);
                        this.map.add(polygon);
                    });
                }
            });
            this.activePolygon = polygons;
            
            // Auto fit view to show all polygons evenly (only when fitView=true)
            if (fitView && polygons.length > 0) {
                this.map.setFitView(polygons, false, [50, 50, 50, 50]);
            }
        } else {
            // Fallback to circle if no GeoJSON data (default radius 0.5 degrees)
            const radius = 0.5;
            const radiusInMeters = radius * 111000;
            
            const circle = new AMap.Circle({
                center: [city.lng, city.lat],
                radius: radiusInMeters,
                strokeColor: '#e94560',
                strokeWeight: 2,
                strokeOpacity: 0.8,
                fillColor: '#e94560',
                fillOpacity: 0.15,
                zIndex: 10
            });
            
            this.map.add(circle);
            this.activePolygon = [circle];
        }
    }

    clearCityBoundary() {
        if (this.activePolygon && this.activePolygon.length > 0) {
            this.activePolygon.forEach(polygon => {
                this.map.remove(polygon);
            });
            this.activePolygon = null;
        }
    }

    setupLegendInteraction() {
        // Create city buttons in legend
        const legend = document.querySelector('.map-legend');
        if (!legend) return;

        const citiesContainer = document.createElement('div');
        citiesContainer.className = 'legend-cities';
        citiesContainer.innerHTML = '<h4>Cities</h4>';
        
        const citiesList = document.createElement('div');
        citiesList.className = 'cities-list';
        
        this.cities.forEach((city, index) => {
            const cityBtn = document.createElement('button');
            cityBtn.className = 'city-btn';
            cityBtn.innerHTML = `
                <span class="city-dot"></span>
                <span class="city-name-legend">${city.name}</span>
            `;
            cityBtn.addEventListener('click', () => {
                // Only trigger if markers are ready
                if (this.markers.length > 0) {
                    this.isLockedByClick = true; // Lock selection after click
                    this.focusCity(index);
                }
            });
            cityBtn.addEventListener('mouseenter', () => {
                // Only trigger if markers are ready and not locked by click
                if (this.markers.length > 0 && this.activeCityIndex !== index && !this.isLockedByClick) {
                    this.showCityInfo(index);
                }
            });
            citiesList.appendChild(cityBtn);
        });
        
        citiesContainer.appendChild(citiesList);
        legend.appendChild(citiesContainer);
    }

    updateLegendSelection(index) {
        const cityBtns = document.querySelectorAll('.city-btn');
        cityBtns.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
    }

    addConnectionLines() {
        // Add subtle connection lines between cities for visual effect
        const path = [];
        this.cities.forEach(city => {
            path.push([city.lng, city.lat]);
        });

        // Create dashed line connecting all cities
        const polyline = new AMap.Polyline({
            path: path,
            strokeColor: '#e94560',
            strokeWeight: 1,
            strokeOpacity: 0.3,
            strokeStyle: 'dashed',
            strokeDasharray: [10, 10],
            zIndex: 50
        });

        this.map.add(polyline);
    }

    showFallback() {
        const mapContainer = document.getElementById('baidu-map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #fff; text-align: center; padding: 2rem;">
                    <div>
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" style="margin-bottom: 1rem; opacity: 0.5;">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <p style="margin-bottom: 1rem; font-size: 1.1rem;">Map requires AMap API key</p>
                        <p style="font-size: 0.85rem; opacity: 0.7;">Please replace YOUR_AMAP_KEY in index.html with your API key.</p>
                        <p style="font-size: 0.85rem; margin-top: 0.5rem; opacity: 0.7;">Get your key at: <a href="https://console.amap.com/" target="_blank" style="color: #e94560;">console.amap.com</a></p>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
    new Navbar();
    new SmoothScroll();
    new ScrollAnimations();
    window.cityMap = new CityMap();

    console.log('Website initialized successfully');
});
