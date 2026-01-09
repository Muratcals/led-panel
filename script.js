// Sayfa yüklendiğinde tam ekran yap
window.addEventListener('load', () => {
    // Tam ekran modunu etkinleştir
    const enterFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.log('Tam ekran hatası:', err);
            });
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    };

    // Kullanıcı etkileşiminden sonra tam ekran
    document.addEventListener('click', enterFullscreen, { once: true });
    document.addEventListener('touchstart', enterFullscreen, { once: true });

    // Otomatik tam ekran deneme
    setTimeout(enterFullscreen, 100);
});

// Tam ekran çıkışında tekrar gir
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
    }
});

// Double click ile tam ekran toggle
const videoSection = document.querySelector('.video-section');
if (videoSection) {
    videoSection.addEventListener('dblclick', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });
}

// F11 tuşu ile tam ekran
document.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
        e.preventDefault();
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    // ESC tuşunu engelle (tam ekrandan çıkmasın)
    if (e.key === 'Escape' && document.fullscreenElement) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
});

// Helper to get query params
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Resize ve orientation change eventleri CSS ile hallediliyor, JS müdahalesi kaldırıldı.

// Slideshow ve Video Kontrolü
window.addEventListener('load', () => {
    // Video Caching (Blob URL) & Playback Setup
    const videos = document.querySelectorAll('video');
    const playbackRate = getQueryParam('speed') || 1.0;

    videos.forEach(v => {
        v.playbackRate = parseFloat(playbackRate);

        // Find source url
        let src = v.currentSrc || v.src;
        const sourceTag = v.querySelector('source');
        if (!src && sourceTag) {
            src = sourceTag.src;
        }

        // Pre-fetch and cache if src exists
        if (src && !src.startsWith('blob:')) {
            console.log(`CACHE START: Downloading video... ${src}`); // LOG: Başlangıç

            fetch(src)
                .then(response => {
                    if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
                    return response.blob();
                })
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    console.log(`CACHE DOWNLOADED: Video data ready. Size: ${blob.size} bytes. URL: ${src}`); // LOG: İndirme tamam

                    // Safe Swap: Only swap if video is NOT playing to avoid freezing
                    if (v.paused && !v.ended) {
                        v.src = blobUrl;
                        console.log(`CACHE APPLIED (Immediate): Swapped to ${blobUrl}`); // LOG: Uygulandı
                        if (!v.closest('.video-slide')) {
                            v.play().catch(() => { });
                        }
                    } else {
                        console.log(`CACHE QUEUED: Video is playing, waiting to swap... ${src}`);
                        const onStop = () => {
                            v.src = blobUrl;
                            console.log(`CACHE APPLIED (After Playback): Swapped to ${blobUrl}`); // LOG: Sonradan Uygulandı
                            v.removeEventListener('ended', onStop);
                            v.removeEventListener('pause', onStop);
                        };
                        v.addEventListener('ended', onStop);
                        v.addEventListener('pause', onStop);
                    }
                })
                .catch(err => console.error("CACHE ERROR:", err));
        }

        if (!v.closest('.video-slide')) { // Slider dışındakileri hemen oynat (önce normal URL ile başlasın)
            v.play().catch(e => console.log("Video play error:", e));
        }
    });

    // Üst Video Section Slideshow (Video <-> Reklam Alanı)
    const topSlides = document.querySelectorAll('#topSliderContainer .top-slide');
    const topVideo = document.getElementById('localVideo');
    let currentTopSlideIndex = 0;
    let topSlideTimeout;

    function showNextTopSlide() {
        if (topSlides.length === 0) return;

        // 1. Mevcut slide'ı gizle
        const currentTopSlide = topSlides[currentTopSlideIndex];
        currentTopSlide.classList.remove('active');

        // 2. Bir sonraki indexi belirle
        currentTopSlideIndex = (currentTopSlideIndex + 1) % topSlides.length;
        const nextTopSlide = topSlides[currentTopSlideIndex];

        // 3. Yeni slide'ı göster
        nextTopSlide.classList.add('active');

        // 4. Eğer reklam sayfasına geçildiyse 15 saniye bekle
        // Eğer video sayfasına geçildiyse, video bitene kadar bekle
        if (currentTopSlideIndex === 0 && topVideo) {
            // Video sayfası - videoyu başlat ve bitene kadar bekle
            topVideo.currentTime = 0;
            topVideo.play().catch(e => console.log("Top video play error:", e));

            // Video bitince reklam sayfasına geç
            const onVideoEnd = () => {
                showNextTopSlide();
                topVideo.removeEventListener('ended', onVideoEnd);
            };
            topVideo.addEventListener('ended', onVideoEnd);
        } else {
            // Reklam sayfası - 15 saniye bekle
            topSlideTimeout = setTimeout(showNextTopSlide, 15000);
        }
    }

    // Üst slider başlatma
    if (topSlides.length > 0 && topVideo) {
        // İlk slayt video, video bitince reklam sayfasına geç
        const onFirstVideoEnd = () => {
            showNextTopSlide();
            topVideo.removeEventListener('ended', onFirstVideoEnd);
        };
        topVideo.addEventListener('ended', onFirstVideoEnd);
    }

    // Alt Slideshow Döngüsü (Fiyat Tarifesi & Videolar)
    const slides = document.querySelectorAll('#sliderContainer .slide');
    const introVideo = document.getElementById('introVideo');
    let currentSlideIndex = 0;
    let slideTimeout; // Timeout referansı

    function showNextSlide() {
        if (slides.length === 0) return;

        // 1. Mevcut slide'ı gizle
        const currentSlide = slides[currentSlideIndex];
        currentSlide.classList.remove('active');

        // Önceki slayttaki videoyu bul ve durdur
        const prevVideo = currentSlide.querySelector('video');
        if (prevVideo) {
            prevVideo.pause();
            prevVideo.currentTime = 0;
            prevVideo.onended = null; // Temizle
        }

        // 2. Bir sonraki indexi belirle
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        const nextSlide = slides[currentSlideIndex];

        // 3. Yeni slide'ı göster
        nextSlide.classList.add('active');

        // 4. Yeni slaytta video var mı?
        const nextVideo = nextSlide.querySelector('video');

        if (nextVideo) {
            // Video varsa: Video bitene kadar bekle
            nextVideo.play().catch(e => {
                console.log("Slide video play error:", e);
                // Hata olursa 5 sn sonra geç
                slideTimeout = setTimeout(showNextSlide, 5000);
            });

            nextVideo.onended = () => {
                showNextSlide();
            };
        } else {
            // Video yoksa: Fiyat tarifesi (index 0) için 30 saniye, diğerleri için 5 saniye
            const waitTime = currentSlideIndex === 0 ? 30000 : 5000;
            slideTimeout = setTimeout(showNextSlide, waitTime);
        }
    }

    // Başlatma
    if (slides.length > 0) {
        // İlk başta Content slide (index 0) aktif, 30 sn sonra video'ya geçecek
        slideTimeout = setTimeout(showNextSlide, 30000);
    }
});
