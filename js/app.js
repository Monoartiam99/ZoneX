// Small UI scripts: mobile nav toggle and Join modal
document.addEventListener('DOMContentLoaded', function(){
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');
  if(navToggle && mainNav){
    navToggle.addEventListener('click', function(){
      mainNav.classList.toggle('show');
    });
  }

  var openJoin = document.getElementById('open-join');
  var joinModal = document.getElementById('join-modal');
  var closeJoin = document.getElementById('close-join');
  if(openJoin && joinModal){
    openJoin.addEventListener('click', function(){
      joinModal.setAttribute('aria-hidden','false');
    });
  }
  if(closeJoin && joinModal){
    closeJoin.addEventListener('click', function(){
      joinModal.setAttribute('aria-hidden','true');
    });
  }
  // close modal when clicking outside
  if(joinModal){
    joinModal.addEventListener('click', function(e){
      if(e.target === joinModal){
        joinModal.setAttribute('aria-hidden','true');
      }
    });
  }
});
