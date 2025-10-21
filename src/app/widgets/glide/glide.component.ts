import {CommonModule} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import Glide from "@glidejs/glide";

@Component({
  selector: "app-glide",
  templateUrl: "./glide.component.html",
  styleUrls: ["./glide.component.scss"],
  imports: [CommonModule]
})
export class GlideComponent implements OnInit {
  ngOnInit() {}
  @Input() images: any[] = [];
  @Input() index: number = 0;

  glide: any = new Glide(".glide", {
    type: "slider",
    perView: 1,
    focusAt: "center",
    gap: 10
  });

  constructor() {
    const T = setTimeout(() => {
      this.glide.mount();
      this.glide.go(`=${this.index}`);
      clearTimeout(T);
    }, 100);
  }
}
