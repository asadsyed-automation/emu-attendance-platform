// Lightweight micro confetti animation helper without external canvas dependency issues
export function triggerCelebrationConfetti() {
  const count = 40;
  const colors = ['#7a1f1f', '#1c5c34', '#c5a059', '#10b981', '#f59e0b', '#3b82f6'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'celebration-particle';
    el.style.position = 'fixed';
    el.style.left = `${Math.random() * 80 + 10}vw`;
    el.style.top = '10vh';
    el.style.width = `${Math.random() * 8 + 6}px`;
    el.style.height = `${Math.random() * 8 + 6}px`;
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    el.style.zIndex = '9999';
    el.style.pointerEvents = 'none';
    el.style.transition = 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
    el.style.transform = `translate3d(0, 0, 0) rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(el);

    const destX = (Math.random() - 0.5) * 300;
    const destY = Math.random() * 350 + 200;
    const destRot = Math.random() * 720;

    requestAnimationFrame(() => {
      el.style.transform = `translate3d(${destX}px, ${destY}px, 0) rotate(${destRot}deg)`;
      el.style.opacity = '0';
    });

    setTimeout(() => {
      if (document.body.contains(el)) {
        document.body.removeChild(el);
      }
    }, 1300);
  }
}
