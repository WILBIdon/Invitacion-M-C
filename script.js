document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // ELEMENTOS DOM
    // ==========================================
    const coverScreen = document.getElementById('cover-screen');
    const videoScreen = document.getElementById('video-screen');
    const introVideo = document.getElementById('intro-video');
    const skipVideoBtn = document.getElementById('skip-video-btn');
    const mainContainer = document.getElementById('main-container');
    const audioBtn = document.getElementById('audio-toggle');
    const bgMusic = document.getElementById('bg-music');

    let isAudioPlaying = false;
    let isVideoFinished = false;

    // ==========================================
    // 1. CLIC EN IMAGEN INICIAL (COVER SCREEN)
    // ==========================================
    if (coverScreen) {
        coverScreen.addEventListener('click', () => {
            // A) Iniciar Música desde el primer toque
            if (bgMusic) {
                bgMusic.volume = 0.4;
                bgMusic.play().then(() => {
                    isAudioPlaying = true;
                    if (audioBtn) {
                        audioBtn.classList.remove('hidden');
                        audioBtn.classList.add('playing');
                        audioBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                    }
                }).catch(err => {
                    console.log("Audio autoplay prevented or waiting for interaction", err);
                });
            }

            // B) Transición: Ocultar portada y mostrar video intro
            coverScreen.classList.add('fade-out');
            setTimeout(() => {
                coverScreen.style.display = 'none';
            }, 600);

            // C) Mostrar y reproducir video
            if (videoScreen && introVideo) {
                videoScreen.classList.remove('hidden');
                introVideo.play().catch(err => {
                    console.log("Video error or blocked, proceeding directly to invitation", err);
                    finishVideoAndShowInvitation();
                });
            } else {
                finishVideoAndShowInvitation();
            }
        });
    }

    // ==========================================
    // 2. CONTROL Y FINALIZACIÓN DEL VIDEO INTRO
    // ==========================================

    // Al terminar el video automáticamente
    if (introVideo) {
        introVideo.addEventListener('ended', () => {
            finishVideoAndShowInvitation();
        });
    }

    // Botón Omitir / Entrar a la Invitación
    if (skipVideoBtn) {
        skipVideoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (introVideo) {
                introVideo.pause();
            }
            finishVideoAndShowInvitation();
        });
    }

    function finishVideoAndShowInvitation() {
        if (isVideoFinished) return;
        isVideoFinished = true;

        if (videoScreen) {
            videoScreen.classList.add('fade-out');
            setTimeout(() => {
                videoScreen.style.display = 'none';
            }, 600);
        }

        // Revelar tarjeta principal de invitación
        if (mainContainer) {
            mainContainer.classList.remove('hidden');
        }

        if (audioBtn) {
            audioBtn.classList.remove('hidden');
        }
    }

    // ==========================================
    // 3. REPRODUCTOR DE AUDIO FLOTANTE
    // ==========================================
    if (audioBtn && bgMusic) {
        audioBtn.addEventListener('click', () => {
            if (isAudioPlaying) {
                bgMusic.pause();
                audioBtn.classList.remove('playing');
                audioBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
            } else {
                bgMusic.volume = 0.4;
                bgMusic.play().catch(() => {});
                audioBtn.classList.add('playing');
                audioBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            }
            isAudioPlaying = !isAudioPlaying;
        });
    }

    // ==========================================
    // 4. POPUPS / MODALES
    // ==========================================
    const popupButtons = document.querySelectorAll('.btn-popup');
    const modals = document.querySelectorAll('.modal-overlay');

    // Abrir modal al hacer clic en botón
    popupButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Cerrar modal con botón X
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    // Cerrar modal al hacer clic fuera de la tarjeta
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });

    function closeModal(modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // ==========================================
    // 5. FORMULARIO RSVP → WHATSAPP
    // ==========================================
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('guest-name').value.trim();
            const attendance = document.querySelector('input[name="attendance"]:checked').value;
            const guestsCount = document.getElementById('guests-count').value;
            const message = document.getElementById('guest-message').value.trim();

            if (!name) {
                alert('Por favor ingresa tu nombre.');
                return;
            }

            // Construir mensaje de WhatsApp
            let whatsappMsg = `🕊️ *CONFIRMACIÓN PRIMERA COMUNIÓN*\n`;
            whatsappMsg += `*Miguel Angel Sosa Tobón*\n\n`;
            whatsappMsg += `👤 *Nombre:* ${name}\n`;
            whatsappMsg += `✅ *Asistencia:* ${attendance}\n`;
            whatsappMsg += `👥 *Asistentes:* ${guestsCount}\n`;
            if (message) {
                whatsappMsg += `💬 *Mensaje:* ${message}\n`;
            }
            whatsappMsg += `\n🙏 _Enviado desde la invitación digital_`;

            // Número de WhatsApp (puedes actualizarlo con el número deseado)
            const phoneNumber = '573187357836';
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMsg)}`;

            // Mostrar mensaje de éxito
            rsvpForm.style.display = 'none';
            const successMsg = document.getElementById('rsvp-success');
            if (successMsg) {
                successMsg.classList.remove('hidden');
            }

            // Abrir WhatsApp después de un instante
            setTimeout(() => {
                window.open(whatsappURL, '_blank');
            }, 600);
        });
    }

    // ==========================================
    // 6. COMPARTIR INVITACIÓN (WEB SHARE API)
    // ==========================================
    const btnShare = document.getElementById('btn-share');
    if (btnShare) {
        btnShare.addEventListener('click', async () => {
            const shareData = {
                title: 'Primera Comunión - Miguel Angel',
                text: 'Te invito a celebrar mi Primera Comunión. ¡Acompáñanos en este día tan especial!',
                url: window.location.href
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.log('Error al compartir o cancelado', err);
                }
            } else {
                // Fallback si no soporta Web Share API (ej. PC)
                navigator.clipboard.writeText(window.location.href).then(() => {
                    const span = btnShare.querySelector('span');
                    const originalText = span.innerText;
                    span.innerText = '¡Enlace Copiado!';
                    setTimeout(() => {
                        span.innerText = originalText;
                    }, 2500);
                });
            }
        });
    }

});
