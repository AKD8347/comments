const textarea = document.getElementById('mainMSG');

textarea.addEventListener('keydown', resize);

function resize() {
    const el = this;
    const symbols = el.value.length;
    const count = document.getElementById('count');
    count.innerText = symbols + '/1000';
    el.style.cssText = 'height: 60px;';
    el.style.cssText = 'height:' + (el.scrollHeight) + 'px';
}
