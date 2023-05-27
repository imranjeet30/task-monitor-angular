import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appSorting]'
})
export class SortingDirective {

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('click') click(eventData: Event) {

    let element   = this.elRef.nativeElement;
    let className = 'asc';

    if (element.classList.contains('asc'))
        className = 'desc';

    let allAnchors = this.elRef.nativeElement.parentElement.parentElement.getElementsByTagName('a');

    for (var i = 0; i < allAnchors.length; i++) {
        this.renderer.removeClass(allAnchors[i], 'asc');
        this.renderer.removeClass(allAnchors[i], 'desc');

        let span = allAnchors[i].getElementsByTagName('span');

        if (span.length > 0)
          allAnchors[i].removeChild(span[0]);
    }

    this.renderer.addClass(element, className);

    let span = this.renderer.createElement('span');
    this.renderer.addClass(span, 'glyphicon');

    if (className == 'asc')
      this.renderer.addClass(span, 'glyphicon-triangle-top');
    else
      this.renderer.addClass(span, 'glyphicon-triangle-bottom');

    this.renderer.appendChild(element, span);

  }

}
