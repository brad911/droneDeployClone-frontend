// ColorPickerControl.js
export class ColorPickerControl {
  constructor(optionsOrFn) {
    // flexible: accept a function or an options object
    if (typeof optionsOrFn === 'function') {
      this.onChange = optionsOrFn;
      this.initial = '#3bb2d0';
      this.colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    } else {
      const {
        onChange,
        initial = '#3bb2d0',
        colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
      } = optionsOrFn || {};
      this.onChange = onChange;
      this.initial = initial;
      this.colors = colors;
    }
    this._map = null;
    this._container = null;
    this._palette = null;
    this._isOpen = false;
    this._color = this.initial;
  }

  onAdd(map) {
    this._map = map;

    // ctrl group wrapper so it looks like native toolbar
    const group = document.createElement('div');
    group.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    group.style.position = 'relative';

    // button
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mapboxgl-ctrl-icon';
    btn.setAttribute('aria-label', 'Color');
    btn.style.position = 'relative';
    btn.style.width = '30px';
    btn.style.height = '30px';
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';

    // little color dot inside the button (centered)
    const dot = document.createElement('span');
    dot.style.width = '14px';
    dot.style.height = '14px';
    dot.style.borderRadius = '50%';
    dot.style.background = this._color;
    dot.style.boxShadow = '0 0 0 1px rgba(0,0,0,0.2) inset';
    btn.appendChild(dot);
    this._dot = dot;

    // palette (vertical, opens to the LEFT of the button)
    const palette = document.createElement('div');
    palette.style.position = 'absolute';
    palette.style.top = '0';
    palette.style.right = '100%'; // to the left of the button
    palette.style.marginRight = '8px';
    palette.style.display = 'none';
    palette.style.flexDirection = 'column';
    palette.style.gap = '6px';
    palette.style.padding = '8px';
    palette.style.background = '#fff';
    palette.style.border = '1px solid rgba(0,0,0,0.15)';
    palette.style.borderRadius = '8px';
    palette.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
    palette.style.zIndex = '2';

    this.colors.forEach((c) => {
      const sw = document.createElement('button');
      sw.type = 'button';
      sw.style.width = '22px';
      sw.style.height = '22px';
      sw.style.borderRadius = '50%';
      sw.style.border = '1px solid rgba(0,0,0,0.2)';
      sw.style.background = c;
      sw.style.cursor = 'pointer';
      sw.title = c;

      sw.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._selectColor(c);
      });

      // Prevent map interactions when clicking inside the palette
      ['mousedown', 'mouseup', 'dblclick', 'touchstart', 'touchend'].forEach(
        (evt) =>
          sw.addEventListener(evt, (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
          }),
      );

      palette.appendChild(sw);
    });

    // toggle palette
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._isOpen = !this._isOpen;
      palette.style.display = this._isOpen ? 'flex' : 'none';
    });

    // prevent map from eating palette clicks
    ['mousedown', 'mouseup', 'dblclick', 'touchstart', 'touchend'].forEach(
      (evt) =>
        palette.addEventListener(evt, (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
        }),
    );

    // close on outside click
    this._outsideClick = (ev) => {
      if (!group.contains(ev.target)) {
        this._isOpen = false;
        palette.style.display = 'none';
      }
    };
    document.addEventListener('click', this._outsideClick);

    group.appendChild(btn);
    group.appendChild(palette);

    this._container = group;
    this._palette = palette;
    return group;
  }

  onRemove() {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    document.removeEventListener('click', this._outsideClick);
    this._map = null;
  }

  _selectColor(color) {
    this._color = color;
    // update toolbar icon dot
    if (this._dot) this._dot.style.background = color;
    // fire callback
    if (typeof this.onChange === 'function') {
      try {
        this.onChange(color);
        // optional debug
        // console.log('ColorPickerControl -> onChange fired with:', color);
      } catch (e) {
        console.error('ColorPicker onChange error:', e);
      }
    }
    // close the palette
    this._isOpen = false;
    if (this._palette) this._palette.style.display = 'none';
  }
}

export default ColorPickerControl;
