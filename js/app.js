document.querySelector(".container").addEventListener('click', ()=>{
     topBar = document.querySelector('.topbar')
     if (topBar.style.top === '-60px') {
          topBar.style.top = 0
     }else{
          topBar.style.top = '-60px'
     }
     
})