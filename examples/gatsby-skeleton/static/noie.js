var isIE = /*@cc_on!@*/false || !!document.documentMode;

if (window.location.pathname !== '/noie.html' && isIE) {
    window.location = 'noie.html'; //URL to redirect to
}