(function(){
  var d=document, root=d.documentElement;
  window.fdpReady=true;

  /* fiecare pagină nouă se deschide de sus */
  try{ if('scrollRestoration' in history) history.scrollRestoration='manual'; }catch(e){}
  function top0(){ if(!location.hash){ try{ window.scrollTo({top:0,left:0,behavior:'instant'}); }catch(e){ window.scrollTo(0,0); } } }
  top0(); d.addEventListener('DOMContentLoaded',top0); window.addEventListener('load',top0);
  window.addEventListener('pageshow',top0);

  /* apariție la derulare */
  var rv=d.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -40px 0px'});
    rv.forEach(function(el,i){ el.style.transitionDelay=((i%4)*70)+'ms'; io.observe(el); });
  } else rv.forEach(function(el){el.classList.add('in');});

  /* antet umbrit la derulare */
  var sc=function(){ root.classList.toggle('scrolled', window.scrollY>8); }; sc(); window.addEventListener('scroll',sc,{passive:true});

  /* meniu mobil */
  var t=d.querySelector('.nav-toggle');
  if(t){
    t.addEventListener('click',function(){
      var o=!root.classList.contains('nav-open');
      root.classList.toggle('nav-open',o); t.setAttribute('aria-expanded',o);
      t.setAttribute('aria-label',o?'Închide meniul':'Deschide meniul');
    });
    d.querySelectorAll('.menu a').forEach(function(a){ a.addEventListener('click',function(){ root.classList.remove('nav-open'); t.setAttribute('aria-expanded','false'); }); });
    d.addEventListener('keydown',function(e){ if(e.key==='Escape'&&root.classList.contains('nav-open')) t.click(); });
  }

  /* contact: adresele se compun în browser */
  var u='contact', h='fabricadepian.ro', p='40736674176';
  d.querySelectorAll('[data-c]').forEach(function(a){
    var k=a.getAttribute('data-c'), s=a.getAttribute('data-subject');
    if(k==='mail') a.href='mailto:'+u+'@'+h+(s?'?subject='+encodeURIComponent(s):'');
    if(k==='tel') a.href='tel:+'+p;
    if(k==='wa') a.href='https://wa.me/'+p;
  });

  /* copiere */
  d.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var l=b.textContent, ok=function(){b.classList.add('done');b.textContent='Copiat';setTimeout(function(){b.classList.remove('done');b.textContent=l;},1800);};
      if(navigator.clipboard) navigator.clipboard.writeText(b.getAttribute('data-copy')).then(ok,ok); else ok();
    });
  });

  /* vizualizator foto */
  var g=d.querySelector('.grid'), lb=d.querySelector('.lightbox');
  if(g&&lb){
    var f=[].slice.call(g.querySelectorAll('figure')), im=lb.querySelector('.lb-img'), c=lb.querySelector('.count'),
        th=lb.querySelector('.lb-thumbs'), i=0, last=null, tok=0;
    f.forEach(function(x,n){
      var b=d.createElement('button'); b.type='button'; b.setAttribute('aria-label','Fotografia '+(n+1));
      var t=d.createElement('img'); t.alt=''; t.loading='lazy'; t.src=x.querySelector('img').getAttribute('src').replace('-800.webp','-480.webp');
      t.onerror=function(){ t.onerror=null; t.src=x.querySelector('img').getAttribute('src'); };
      b.appendChild(t); b.addEventListener('click',function(){show(n);}); th.appendChild(b);
    });
    var tb=[].slice.call(th.children);
    function pre(n){ var x=f[(n+f.length)%f.length]; var p=new Image(); p.src=x.getAttribute('data-full'); }
    function show(n,first){
      i=(n+f.length)%f.length; var x=f[i], my=++tok, src=x.getAttribute('data-full');
      c.textContent=(i+1)+' / '+f.length;
      tb.forEach(function(b,k){ b.setAttribute('aria-current',k===i); });
      if(tb[i]) tb[i].scrollIntoView({block:'nearest',inline:'center',behavior:first?'auto':'smooth'});
      im.classList.add('out');
      var load=new Image(); load.onload=load.onerror=function(){
        if(my!==tok) return;
        setTimeout(function(){ im.src=src; im.alt=x.querySelector('img').alt; requestAnimationFrame(function(){ im.classList.remove('out'); }); }, first?0:160);
      }; load.src=src;
      pre(i+1); pre(i-1);
    }
    function open(n){ last=d.activeElement; lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); d.body.style.overflow='hidden'; show(n,true); lb.querySelector('.lb-close').focus(); }
    function close(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); d.body.style.overflow=''; if(last) last.focus(); }
    f.forEach(function(x,n){
      x.tabIndex=0; x.setAttribute('role','button'); x.setAttribute('aria-label','Mărește fotografia '+(n+1));
      x.addEventListener('click',function(){open(n);});
      x.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();open(n);} });
    });
    lb.querySelector('.lb-close').addEventListener('click',close);
    lb.querySelector('.lb-prev').addEventListener('click',function(){show(i-1);});
    lb.querySelector('.lb-next').addEventListener('click',function(){show(i+1);});
    lb.querySelector('.lb-stage').addEventListener('click',function(e){ if(e.target===this) close(); });
    d.addEventListener('keydown',function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key==='Escape') close(); else if(e.key==='ArrowLeft') show(i-1); else if(e.key==='ArrowRight') show(i+1);
    });
    var sx=0, sy=0; lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX; sy=e.touches[0].clientY;},{passive:true});
    lb.addEventListener('touchend',function(e){ var dx=e.changedTouches[0].clientX-sx, dy=e.changedTouches[0].clientY-sy;
      if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)) show(i+(dx<0?1:-1)); else if(dy>90&&Math.abs(dy)>Math.abs(dx)) close(); });
  }

  /* înapoi sus */
  d.querySelectorAll('.totop').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      try{ window.scrollTo({top:0,behavior:reduce?'auto':'smooth'}); }catch(x){ window.scrollTo(0,0); }
      var b=d.querySelector('.brand'); if(b) b.focus({preventScroll:true});
    });
  });

  var y=d.getElementById('an'); if(y) y.textContent=new Date().getFullYear();
})();
