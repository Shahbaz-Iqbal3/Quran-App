// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = 'https://peaceful-salmiakki-320517.netlify.app/para2_cropped.pdf';

// Loaded via <script> tag, cre  ate shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

var pdfDoc = null,
     pageNum = 1,
     pageRendering = false,
     pageNumPending = null,
     scale = 0.8    ,
     outputScale = window.devicePixelRatio || 1,
canvas = document.getElementById('the-canvas'),
     ctx = canvas.getContext('2d');

     /**
      * Get page info from document, resize canvas accordingly, and render page.
      * @param num Page number.
     */
    function renderPage(num) {
         pageRendering = true;
         // Using promise to fetch the page
         pdfDoc.getPage(num).then(function (page) {
          var desiredWidth = document.querySelector(".pdf-render").clientWidth;
          var viewport = page.getViewport({ scale: 1, });
          var scale = desiredWidth / viewport.width;
          var viewport = page.getViewport({ scale: scale, });  


         
          canvas.width = Math.floor(viewport.width * outputScale);
          canvas.height = Math.floor(viewport.height * outputScale);
          canvas.style.width = Math.floor(viewport.width) + "px";
          canvas.style.height = Math.floor(viewport.height) + "px";


          var transform = outputScale !== 1
               ? [outputScale, 0, 0, outputScale, 0, 0]
               : null;

          var renderContext = {
               canvasContext: ctx,
               transform: transform,
               viewport: viewport
          };

          // Render PDF page into canvas context

          var renderTask = page.render(renderContext);

          // Wait for rendering to finish
          renderTask.promise.then(function () {
               pageRendering = false;
               if (pageNumPending !== null) {
                    // New page rendering is pending
                    renderPage(pageNumPending);
                    pageNumPending = null;
               }
          });
     });

     // Update page counters
     document.getElementById('page_num').textContent = num;
}

window.addEventListener("resize", (e)=>{
     console.log(innerHeight);
     renderPage(pageNum)

});

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
     if (pageRendering) {
          pageNumPending = num;
     } else {
          renderPage(num);
     }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
     if (pageNum <= 1) {
          return;
     }
     pageNum--;
     queueRenderPage(pageNum);
}
document.getElementById('prev').addEventListener('click', onPrevPage);

/**
 * Displays next page.
 */
function onNextPage() {
     if (pageNum >= pdfDoc.numPages) {
          return;
     }
     pageNum++;
     queueRenderPage(pageNum);
}
document.getElementById('next').addEventListener('click', onNextPage);

/**
 * Asynchronously downloads PDF.
 */
pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
     pdfDoc = pdfDoc_;
     document.getElementById('page_count').textContent = pdfDoc.numPages;

     // Initial/first page rendering
     renderPage(pageNum);
});
