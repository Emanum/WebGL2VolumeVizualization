class InputHandler{
  constructor(canvas,scrollFunction){
    this.last_known_scroll_position = 0;
    this.ticking = false;

    canvas.addEventListener('scroll', function(e) {
      var scrolldiff = window.scrollY - this.last_known_scroll_position;
      this.last_known_scroll_position = window.scrollY;

      if (!this.ticking) {
        window.requestAnimationFrame(function() {
          scrollFunction(scrolldiff);
          this.ticking = false;
        });

        this.ticking = true;
      }
    });
  }
}
