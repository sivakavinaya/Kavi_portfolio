// Fill copyright year
    document.getElementById('year').textContent = new Date().getFullYear();

    /* === Parallax (mouse + scroll) ===
       - Layers: use data-depth attr to set movement proportion
       - Hero tilt on foreground card(s)
    */
    (function(){
      const stage = document.getElementById('parallax-stage');
      const layers = Array.from(stage.querySelectorAll('.layer'));
      const tiltElements = Array.from(document.querySelectorAll('.js-tilt'));

      // mousemove parallax for stage layers
      let stageRect = stage.getBoundingClientRect();
      function onPointerMove(e){
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - (stageRect.left + stageRect.width/2);
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - (stageRect.top + stageRect.height/2);
        const max = Math.min(stageRect.width, 900);
        layers.forEach(layer=>{
          const depth = parseFloat(layer.dataset.depth) || 0.05;
          const moveX = (x / max) * 60 * depth;
          const moveY = (y / max) * 40 * depth;
          layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
      }
      window.addEventListener('resize', ()=> stageRect = stage.getBoundingClientRect());
      stage.addEventListener('mousemove', onPointerMove);
      stage.addEventListener('touchmove', onPointerMove, {passive:true});

      // scroll-based subtle parallax
      function onScroll(){
        const scrolled = window.scrollY;
        layers.forEach(layer=>{
          const depth = parseFloat(layer.dataset.depth) || 0.05;
          const translateY = scrolled * depth * -0.06;
          layer.style.transform += ` translateY(${translateY}px)`;
        });
      }
      window.addEventListener('scroll', onScroll, {passive:true});

      // Small 'tilt' effect for cards
      function applyTilt(el, evt){
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const dx = (evt.clientX - cx) / rect.width;
        const dy = (evt.clientY - cy) / rect.height;
        const max = parseFloat(el.dataset.tiltMax) || 12;
        const rx = (dy * max) * -1;
        const ry = (dx * max);
        const tz = 20;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${tz}px)`;
        el.style.transition = "transform 0.06s linear";
      }
      function resetTilt(el){
        el.style.transform = "";
        el.style.transition = "transform 0.3s cubic-bezier(.2,.8,.2,1)";
      }

      tiltElements.forEach(el=>{
        el.addEventListener('mousemove', (e)=> applyTilt(el, e));
        el.addEventListener('mouseleave', ()=> resetTilt(el));
        // touch-friendly
        el.addEventListener('touchmove', (e)=> { applyTilt(el, e.touches[0]); }, {passive:true});
        el.addEventListener('touchend', ()=> resetTilt(el));
      });

      // Card hover accessibility: keyboard focus
      tiltElements.forEach(el=>{
        el.addEventListener('focusin', ()=> el.style.transform = 'perspective(900px) rotateX(-6deg) rotateY(6deg) translateZ(14px)');
        el.addEventListener('focusout', ()=> resetTilt(el));
      });

      // Reduce motion respect
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if(mq.matches){
        layers.forEach(layer=> layer.style.transition='none');
        tiltElements.forEach(el=> el.style.transition='none');
        stage.removeEventListener('mousemove', onPointerMove);
        stage.removeEventListener('touchmove', onPointerMove);
      }
    })();

    /* Accessibility: smooth in-page link scrolling */
    (function(){
      const links = document.querySelectorAll('a[href^="#"]');
      links.forEach(link=>{
        link.addEventListener('click', (e)=>{
          const href = link.getAttribute('href');
          if(href.length > 1){
            e.preventDefault();
            const target = document.querySelector(href);
            if(target){
              target.scrollIntoView({behavior:'smooth', block:'center'});
              target.focus({preventScroll:true});
            }
          }
        });
      });
    })();